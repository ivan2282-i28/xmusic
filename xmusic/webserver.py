# server/webserver.py
from flask import Flask, request, jsonify, send_from_directory
import os
import shutil
import time
import random
import sqlite3
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash, generate_password_hash
import jwt
from functools import wraps
import joblib
import librosa
import numpy as np
from datetime import datetime, timedelta
import secrets

# admin_api should be implemented in server/api/admin.py
# make sure it's present in your project
from .api.admin import admin_api

def webserver(app, db, dirs, model=None):
    """
    Attach routes to app using db (database instance) and dirs dict with folders.
    If `model` provided (joblib or similar), it's used in /api/determine-genre.
    """

    # --------------------
    # Helpers / decorators
    # --------------------
    def auth_required(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = request.headers.get('Authorization')
            if not token or not token.startswith('Bearer '):
                return jsonify({'message': 'Token is missing or invalid!'}), 401

            try:
                token = token.split()[1]
                data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
                conn = db.get_db_connection()
                cursor = conn.cursor()
                cursor.execute("SELECT * FROM users WHERE id = ? AND username = ?", (data.get("id"), data.get("username")))
                user_exists = cursor.fetchone()
                conn.close()

                if not user_exists:
                    return jsonify({'message': 'Token is invalid'}), 401

                request.current_user = user_exists
            except jwt.ExpiredSignatureError:
                return jsonify({'message': 'Token has expired!'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'message': 'Token is invalid!'}), 401
            except Exception as e:
                return jsonify({'message': f'Authentication error: {str(e)}'}), 401

            return f(*args, **kwargs)
        return decorated

    def role_required(roles: list):
        def decorator(f):
            @wraps(f)
            def decorated_function(*args, **kwargs):
                if not request.current_user["role"] in roles:
                    return jsonify({'message': 'Invalid role'}), 403
                return f(*args, **kwargs)
            return decorated_function
        return decorator

    # Attach admin sub-API (expected in server/api/admin.py)
    try:
        admin_api(app, db, auth_required, role_required, dirs)
    except Exception:
        # If admin_api is missing, continue — routes will fail later if referenced.
        pass

    # --------------------
    # Static file serving
    # --------------------
    @app.route('/')
    def serve_index():
        return send_from_directory(dirs["INDEX_DIR"], 'index.html')

    @app.route('/<path:filename>')
    def serve_static(filename):
        return send_from_directory(dirs["INDEX_DIR"], filename)

    @app.route('/music/<path:filename>')
    def serve_music(filename):
        return send_from_directory(dirs["MUSIC_DIR"], filename)

    @app.route('/fon/<path:filename>')
    def serve_fon(filename):
        return send_from_directory(dirs["FON_DIR"], filename)

    @app.route('/video/<path:filename>')
    def serve_video(filename):
        return send_from_directory(dirs["VIDEO_DIR"], filename)

    @app.route('/temp_uploads/<path:filename>')
    def serve_temp_uploads(filename):
        return send_from_directory(dirs["TEMP_UPLOAD_DIR"], filename)

    # --------------------
    # Auth: register / login / refresh / logout
    # --------------------
    @app.route('/api/register', methods=['POST'])
    def register():
        data = request.json or {}
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'message': 'Username and password are required.'}), 400

        hashed_password = generate_password_hash(password)

        conn = db.get_db_connection()
        try:
            conn.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_password))
            conn.commit()
            return jsonify({'message': 'Registration successful!'}), 201
        except sqlite3.IntegrityError:
            return jsonify({'message': 'A user with that name already exists.'}), 400
        finally:
            conn.close()

    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.json or {}
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'message': 'Username and password are required.'}), 400

        conn = db.get_db_connection()
        user = conn.execute("SELECT id, username, role, password FROM users WHERE username = ?", (username,)).fetchone()

        if user and check_password_hash(user['password'], password):
            user_data = {
                "id": user["id"],
                "username": user["username"],
                "role": user["role"]
            }
            token_payload = {"username": user["username"], "id": user["id"]}
            # access token short/medium lived; adjust as needed
            exp_ts = int((datetime.utcnow() + timedelta(days=7)).timestamp())
            token_payload["exp"] = exp_ts
            token = jwt.encode(token_payload, app.config["SECRET_KEY"], algorithm="HS256")

            # create & persist refresh token (random)
            refresh_token = secrets.token_urlsafe(48)
            try:
                conn.execute("UPDATE users SET refresh_token = ? WHERE id = ?", (refresh_token, user["id"]))
                conn.commit()
            except Exception as e:
                app.logger.exception("Failed to persist refresh token: %s", e)

            conn.close()
            return jsonify({'message': 'Login successful!', 'user': user_data, 'token': token, 'refreshToken': refresh_token})
        else:
            conn.close()
            return jsonify({'message': 'Invalid login or password.'}), 401

    @app.route('/api/refresh', methods=['POST'])
    def refresh_token():
        data = request.json or {}
        refresh = data.get('refreshToken')
        if not refresh:
            return jsonify({'message': 'Refresh token required'}), 400

        conn = db.get_db_connection()
        user = conn.execute("SELECT id, username FROM users WHERE refresh_token = ?", (refresh,)).fetchone()
        if not user:
            conn.close()
            return jsonify({'message': 'Invalid refresh token'}), 401

        token_payload = {"username": user["username"], "id": user["id"]}
        exp_ts = int((datetime.utcnow() + timedelta(days=7)).timestamp())
        token_payload["exp"] = exp_ts
        token = jwt.encode(token_payload, app.config["SECRET_KEY"], algorithm="HS256")

        conn.close()
        return jsonify({'token': token})

    @app.route('/api/logout', methods=['POST'])
    @auth_required
    def logout():
        # clear refresh token for current user
        uid = request.current_user["id"]
        conn = db.get_db_connection()
        try:
            conn.execute("UPDATE users SET refresh_token = NULL WHERE id = ?", (uid,))
            conn.commit()
        finally:
            conn.close()
        return jsonify({'message': 'Logged out'}), 200

    # --------------------
    # Favorites
    # --------------------
    @app.route('/api/favorites', methods=['GET'])
    @auth_required
    def get_favorites():
        conn = db.get_db_connection()
        favorites = conn.execute("SELECT media_file FROM favorites WHERE user_id = ?", (request.current_user["id"],)).fetchall()
        conn.close()
        favorite_files = [row['media_file'] for row in favorites]
        return jsonify(favorite_files)

    @app.route('/api/favorites', methods=['POST', 'DELETE'])
    @auth_required
    def favorites():
        data = request.json or {}
        user_id = data.get('userId') or request.current_user["id"]
        media_file = data.get('mediaFile') or data.get('media_file')
        conn = db.get_db_connection()
        if request.method == 'POST':
            try:
                conn.execute("INSERT OR IGNORE INTO favorites (user_id, media_file) VALUES (?, ?)", (user_id, media_file))
                conn.commit()
                return jsonify({'message': 'Added to favorites.'})
            finally:
                conn.close()
        elif request.method == 'DELETE':
            try:
                conn.execute("DELETE FROM favorites WHERE user_id = ? AND media_file = ?", (user_id, media_file))
                conn.commit()
                return jsonify({'message': 'Removed from favorites.'})
            finally:
                conn.close()

    # --------------------
    # Tracks listing / best / search / single track ops
    # --------------------
    @app.route('/api/tracks')
    def get_tracks():
        conn = db.get_db_connection()
        category_id = request.args.get('categoryId')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 30, type=int)
        offset = (page - 1) * per_page

        query = ("SELECT t.id, t.title, t.file_name as file, t.cover_name as cover, t.type, t.plays, "
                 "t.genre, u.username as creator_name, t.artist, t.category_id FROM tracks t LEFT JOIN users u ON t.creator_id = u.id")
        params = []

        if category_id and category_id.isdigit():
            query += " WHERE t.category_id = ?"
            params.append(category_id)

        query += " ORDER BY t.id DESC LIMIT ? OFFSET ?"
        params.extend([per_page, offset])

        tracks = conn.execute(query, params).fetchall()
        conn.close()
        return jsonify([dict(row) for row in tracks])

    @app.route('/api/tracks/best')
    def get_best_tracks():
        conn = db.get_db_connection()
        tracks = conn.execute(
            "SELECT t.id, t.title, t.file_name as file, t.cover_name as cover, t.type, t.plays, t.genre, "
            "u.username as creator_name, t.artist, t.category_id FROM tracks t LEFT JOIN users u ON t.creator_id = u.id "
            "ORDER BY RANDOM() LIMIT 10"
        ).fetchall()
        conn.close()
        return jsonify([dict(row) for row in tracks])

    @app.route('/api/tracks/<int:track_id>', methods=['DELETE'])
    @auth_required
    @role_required(['admin'])
    def delete_track(track_id):
        conn = db.get_db_connection()
        track = conn.execute("SELECT file_name, cover_name, type FROM tracks WHERE id = ?", (track_id,)).fetchone()
        if not track:
            conn.close()
            return jsonify({'message': 'Track not found.'}), 404

        try:
            media_dir = dirs["MUSIC_DIR"] if track['type'] == 'audio' else dirs["VIDEO_DIR"]
            try:
                os.unlink(os.path.join(media_dir, track['file_name']))
            except FileNotFoundError:
                pass
            try:
                os.unlink(os.path.join(dirs["FON_DIR"], track['cover_name']))
            except FileNotFoundError:
                pass

            conn.execute("DELETE FROM tracks WHERE id = ?", (track_id,))
            conn.commit()
            return jsonify({'message': 'Track deleted.'})
        except Exception as e:
            app.logger.exception("Error deleting track files: %s", e)
            return jsonify({'message': 'Error deleting files.'}), 500
        finally:
            conn.close()

    # --------------------
    # Creator endpoints
    # --------------------
    @app.route('/api/creator/my-tracks/<int:user_id>')
    @auth_required
    @role_required(['creator','admin'])
    def get_creator_tracks(user_id):
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 30, type=int)
        offset = (page - 1) * per_page

        conn = db.get_db_connection()
        query = ("SELECT id, title, file_name as file, cover_name as cover, type, creator_id, "
                 "(SELECT username FROM users WHERE id = tracks.creator_id) as creator_name FROM tracks "
                 "WHERE creator_id = ? ORDER BY id DESC LIMIT ? OFFSET ?")
        tracks = conn.execute(query, (user_id, per_page, offset)).fetchall()
        conn.close()
        return jsonify([dict(row) for row in tracks])

    @app.route('/api/creator/my-tracks/<int:track_id>', methods=['DELETE'])
    @auth_required
    @role_required(['creator','admin'])
    def delete_creator_track(track_id):
        data = request.json or {}
        user_id = data.get('userId')
        user_role = data.get('userRole')
        conn = db.get_db_connection()
        track = conn.execute("SELECT file_name, cover_name, type, creator_id FROM tracks WHERE id = ?", (track_id,)).fetchone()
        if not track:
            conn.close()
            return jsonify({'message': 'Track not found.'}), 404

        if track['creator_id'] != user_id and user_role != 'admin':
            conn.close()
            return jsonify({'message': 'Insufficient permissions.'}), 403

        try:
            media_dir = dirs["MUSIC_DIR"] if track['type'] == 'audio' else dirs["VIDEO_DIR"]
            try:
                os.unlink(os.path.join(media_dir, track['file_name']))
            except FileNotFoundError:
                pass
            try:
                os.unlink(os.path.join(dirs["FON_DIR"], track['cover_name']))
            except FileNotFoundError:
                pass

            conn.execute("DELETE FROM tracks WHERE id = ?", (track_id,))
            conn.commit()
            return jsonify({'message': 'Track deleted.'})
        except Exception as e:
            app.logger.exception("Error deleting creator track: %s", e)
            return jsonify({'message': 'Error deleting files.'}), 500
        finally:
            conn.close()

    @app.route('/api/creator/stats/<int:user_id>')
    @auth_required
    @role_required(['creator','admin'])
    def creator_stats(user_id):
        conn = db.get_db_connection()
        total_plays = conn.execute("SELECT SUM(t.plays) FROM tracks t WHERE t.creator_id = ?", (user_id,)).fetchone()[0] or 0

        two_weeks_ago = int(time.time()) - 14 * 86400
        daily_plays = conn.execute(
            "SELECT strftime('%Y-%m-%d', datetime(timestamp, 'unixepoch')) as date, COUNT(*) as count "
            "FROM plays WHERE track_id IN (SELECT id FROM tracks WHERE creator_id = ?) AND timestamp >= ? GROUP BY date ORDER BY date",
            (user_id, two_weeks_ago)
        ).fetchall()

        track_stats = conn.execute("SELECT id, title, plays FROM tracks WHERE creator_id = ? ORDER BY plays DESC LIMIT 5", (user_id,)).fetchall()
        conn.close()

        return jsonify({
            'totalPlays': total_plays,
            'dailyPlays': [dict(row) for row in daily_plays],
            'trackStats': [dict(row) for row in track_stats]
        })

    # --------------------
    # Moderation / upload for creators
    # --------------------
    @app.route('/api/moderation/upload', methods=['POST'])
    @auth_required
    @role_required(['creator','admin'])
    def moderation_upload():
        if 'coverFile' not in request.files or ('audioFile' not in request.files and 'videoFile' not in request.files):
            return jsonify({'message': 'Not all files provided.'}), 400

        cover_file = request.files['coverFile']
        media_file = request.files.get('audioFile') or request.files.get('videoFile')
        title = request.form.get('title')
        upload_type = request.form.get('uploadType')
        user_id = request.form.get('userId')
        genre = request.form.get('genre') or None
        artist = request.form.get('artist') or None
        category_id = request.form.get('categoryId') or None

        if not all([cover_file, media_file, title, upload_type, user_id]):
            return jsonify({'message': 'Insufficient data.'}), 400

        unique_id = str(int(time.time() * 1000))
        media_filename = f"{unique_id}{os.path.splitext(media_file.filename)[1]}"
        cover_filename = f"{unique_id}_cover{os.path.splitext(cover_file.filename)[1]}"

        media_file.save(os.path.join(dirs["TEMP_UPLOAD_DIR"], media_filename))
        cover_file.save(os.path.join(dirs["TEMP_UPLOAD_DIR"], cover_filename))

        conn = db.get_db_connection()
        try:
            conn.execute(
                "INSERT INTO track_moderation (user_id, file_name, cover_name, title, type, genre, artist, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (user_id, media_filename, cover_filename, title, upload_type, genre, artist, category_id)
            )
            conn.commit()
            return jsonify({'message': 'Track sent for moderation. Await approval.'}), 201
        except Exception as e:
            app.logger.exception("Error inserting moderation record: %s", e)
            return jsonify({'message': 'Error sending track for moderation.'}), 500
        finally:
            conn.close()

    # --------------------
    # Search / Xrecomen / playback update / genre detection
    # --------------------
    @app.route('/api/search')
    def search_tracks():
        query = request.args.get('q', '')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 30, type=int)
        offset = (page - 1) * per_page

        if not query:
            return jsonify([])

        search_term = f"%{query}%"
        conn = db.get_db_connection()

        sql_query = """
            SELECT t.id, t.title, t.file_name as file, t.cover_name as cover, 
                   t.type, t.plays, t.genre, u.username as creator_name, t.artist, t.category_id 
            FROM tracks t 
            LEFT JOIN users u ON t.creator_id = u.id
            WHERE t.title LIKE ? OR t.artist LIKE ? OR u.username LIKE ?
            ORDER BY t.plays DESC 
            LIMIT ? OFFSET ?
        """
        params = [search_term, search_term, search_term, per_page, offset]

        tracks = conn.execute(sql_query, params).fetchall()
        conn.close()

        return jsonify([dict(row) for row in tracks])

    @app.route('/api/update-playback', methods=['POST'])
    @auth_required
    def update_playback():
        data = request.json or {}
        user_id = data.get('userId')
        track_id = data.get('trackId')
        current_time = data.get('currentTime')
        duration = data.get('duration')
        timestamp = int(time.time())

        conn = db.get_db_connection()
        try:
            conn.execute("INSERT INTO plays (user_id, track_id, timestamp, listened_duration) VALUES (?, ?, ?, ?)", (user_id, track_id, timestamp, current_time))
            conn.execute("UPDATE tracks SET plays = plays + 1, duration = ? WHERE id = ?", (duration, track_id))
            conn.commit()
            return jsonify({'message': 'Playback data updated.'})
        except Exception as e:
            app.logger.exception("Error updating playback: %s", e)
            return jsonify({'message': 'Error updating playback data.'}), 500
        finally:
            conn.close()

    @app.route('/api/xrecomen/<int:user_id>')
    @auth_required
    def get_xrecomen(user_id):
        conn = db.get_db_connection()

        user_favorites = conn.execute("SELECT media_file FROM favorites WHERE user_id = ?", (user_id,)).fetchall()
        favorite_media_files = [row['media_file'] for row in user_favorites]

        you_like_tracks = []
        favorite_track_ids = []
        if favorite_media_files:
            placeholder = ','.join('?' for _ in favorite_media_files)
            you_like_tracks_data = conn.execute(
                f"SELECT id, title, file_name as file, cover_name as cover, type, artist, creator_id, (SELECT username FROM users WHERE id = tracks.creator_id) as creator_name "
                f"FROM tracks WHERE file_name IN ({placeholder}) ORDER BY RANDOM() LIMIT 5", tuple(favorite_media_files)
            ).fetchall()
            you_like_tracks = [dict(row) for row in you_like_tracks_data]
            favorite_track_ids = [row['id'] for row in you_like_tracks_data]

        frequently_played = conn.execute("SELECT track_id FROM plays WHERE user_id = ? GROUP BY track_id HAVING COUNT(track_id) > 5", (user_id,)).fetchall()
        frequent_track_ids = [row['track_id'] for row in frequently_played]

        exclude_ids = list(set(favorite_track_ids + frequent_track_ids))

        xrecomen_track = None

        base_query = ("SELECT id, title, file_name as file, cover_name as cover, type, artist, creator_id, "
                      "(SELECT username FROM users WHERE id = tracks.creator_id) as creator_name FROM tracks")
        params = []

        if exclude_ids:
            placeholders = ','.join('?' for _ in exclude_ids)
            where_clause = f" WHERE id NOT IN ({placeholders})"
            params.extend(exclude_ids)
        else:
            where_clause = ""

        final_query = base_query + where_clause + " ORDER BY RANDOM() LIMIT 6"

        you_may_like_tracks_data = conn.execute(final_query, params).fetchall()
        you_may_like_tracks = [dict(row) for row in you_may_like_tracks_data]

        if you_may_like_tracks:
            xrecomen_track = random.choice(you_may_like_tracks)
            you_may_like_tracks = [t for t in you_may_like_tracks if t['id'] != xrecomen_track['id']]

        favorite_collections = conn.execute(
            "SELECT c.id, c.name, COUNT(t.id) as track_count FROM categories c JOIN tracks t ON c.id = t.category_id "
            "JOIN plays p ON t.id = p.track_id WHERE p.user_id = ? GROUP BY c.id ORDER BY track_count DESC LIMIT 6", (user_id,)
        ).fetchall()
        favorite_collections = [dict(row) for row in favorite_collections]

        conn.close()

        return jsonify({
            'xrecomenTrack': xrecomen_track,
            'youLike': you_like_tracks,
            'youMayLike': you_may_like_tracks,
            'favoriteCollections': favorite_collections
        })

    @app.route('/api/genres')
    def get_genres():
        # Keep for backwards compatibility
        GENRES = ['блюз', 'джаз', 'диско', 'инди', 'кантри', 'метал', 'поп', 'регги', 'рок', 'рэп', 'соул', 'техно', 'трэп', 'фонк', 'хаус', 'Хип-хоп', 'электронная', 'эмбиент']
        return jsonify(GENRES)

    # --------------------
    # Genre detection (AI) - optional if model provided
    # --------------------
    def extract_features(file_path):
        y, sr = librosa.load(file_path, mono=True, duration=30)
        S = np.abs(librosa.stft(y))
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
        chroma = librosa.feature.chroma_stft(S=S, sr=sr)
        mel = librosa.feature.melspectrogram(y=y, sr=sr)
        features = np.concatenate((
            np.mean(mfcc, axis=1),
            np.mean(chroma, axis=1),
            np.mean(mel, axis=1)
        ))
        return features.reshape(1, -1)

    @app.route('/api/determine-genre', methods=['POST'])
    @auth_required
    @role_required(['creator','admin'])
    def determine_genre():
        if 'file' not in request.files:
            return jsonify({'message': 'No file'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'message': 'No file selected'}), 400

        if model is None:
            return jsonify({'message': 'AI model is not available.'}), 503

        try:
            temp_path = os.path.join(dirs["TEMP_UPLOAD_DIR"], secure_filename(file.filename))
            file.save(temp_path)

            features = extract_features(temp_path)
            predicted_genre_index = model.predict(features)[0]
            # ensure GENRES matches model mapping
            GENRES = ['блюз', 'джаз', 'диско', 'инди', 'кантри', 'метал', 'поп', 'регги', 'рок', 'рэп', 'соул', 'техно', 'трэп', 'фонк', 'хаус', 'Хип-хоп', 'электронная', 'эмбиент']
            predicted_genre = GENRES[predicted_genre_index] if 0 <= predicted_genre_index < len(GENRES) else "unknown"

            os.remove(temp_path)

            return jsonify({'genre': predicted_genre})
        except Exception as e:
            app.logger.exception("Error determining genre: %s", e)
            return jsonify({'message': 'Error determining genre.'}), 500

    # end of webserver()
from flask import Flask, request, jsonify, send_from_directory
import os
import shutil
import time
import random
from werkzeug.utils import secure_filename
import jwt
from functools import wraps
import joblib  # Использовать joblib вместо pickle для совместимости
import librosa
import numpy as np

from .api.admin import admin_api

def webserver(app,db,dirs):

     

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
                cursor.execute("SELECT * FROM users WHERE id = ? AND username = ?", (data["id"], data["username"]))
                user_exists = cursor.fetchone()
                conn.close()

                if not user_exists:
                    return jsonify({'message': 'Token is invalid'}), 401
                
                request.current_user = user_exists
            except jwt.ExpiredSignatureError:
                return jsonify({'message': 'Token has expired!'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'message': 'Token is invalid!'}), 401
            
            return f(*args, **kwargs)
        return decorated


    def role_required(roless: list):
        def decorator(f):
            @wraps(f)
            def decorated_function(*args, **kwargs):
                if not request.current_user["role"] in roless:
                    return jsonify({'message': 'Invalid role'}), 403
                return f(*args, **kwargs)
            return decorated_function
        return decorator

    admin_api(app,db,auth_required,role_required,dirs)   

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

    @app.route('/api/register', methods=['POST'])
    def register():
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        conn = db.get_db_connection()
        try:
            conn.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
            conn.commit()
            return jsonify({'message': 'Регистрация прошла успешно!'}), 201
        except db.sqlite3.IntegrityError:
            return jsonify({'message': 'Пользователь с таким именем уже существует.'}), 400
        finally:
            conn.close()

    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.json
        username = data.get('username')
        password = data.get('password')

        conn = db.get_db_connection()
        user = conn.execute("SELECT id, username, role, password FROM users WHERE username = ? AND password = ?", (username, password)).fetchone()
        conn.close()
        if user:
            sanuser = {"username":user["username"],"id":user["id"]}
            tokend = jwt.encode(sanuser,app.config["SECRET_KEY"],"HS256")
            return jsonify({'message': 'Вход выполнен!', 'user': dict(user), 'token':tokend})
        else:
            return jsonify({'message': 'Неверный логин или пароль.'}), 401

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
        data = request.json
        user_id = data.get('userId')
        media_file = data.get('mediaFile')
        conn = db.get_db_connection()
        if request.method == 'POST':
            try:
                conn.execute("INSERT OR IGNORE INTO favorites (user_id, media_file) VALUES (?, ?)", (user_id, media_file))
                conn.commit()
                return jsonify({'message': 'Добавлено в избранное.'})
            finally:
                conn.close()
        elif request.method == 'DELETE':
            try:
                conn.execute("DELETE FROM favorites WHERE user_id = ? AND media_file = ?", (user_id, media_file))
                conn.commit()
                return jsonify({'message': 'Удалено из избранного.'})
            finally:
                conn.close()

    @app.route('/api/tracks')
    def get_tracks():
        conn = db.get_db_connection()
        category_id = request.args.get('categoryId')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 30, type=int)
        offset = (page - 1) * per_page
        
        query = "SELECT t.id, t.title, t.file_name as file, t.cover_name as cover, t.type, t.plays, t.genre, u.username as creator_name, t.artist, t.category_id FROM tracks t LEFT JOIN users u ON t.creator_id = u.id"
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
        tracks = conn.execute("SELECT t.id, t.title, t.file_name as file, t.cover_name as cover, t.type, t.plays, t.genre, u.username as creator_name, t.artist, t.category_id FROM tracks t LEFT JOIN users u ON t.creator_id = u.id ORDER BY t.plays DESC LIMIT 10").fetchall()
        conn.close()
        return jsonify([dict(row) for row in tracks])


    @auth_required
    @role_required(['admin','creator'])
    @app.route('/api/rename', methods=['POST'])
    def rename_track():
        data = request.json
        track_id = data.get('trackId')
        new_title = data.get('newTitle')

        conn = db.get_db_connection()
        track_info = conn.execute("SELECT file_name, cover_name, type FROM tracks WHERE id = ?", (track_id,)).fetchone()
        conn.close()
        if not track_info:
            return jsonify({'message': 'Трек не найден.'}), 404

        old_file_name = track_info['file_name']
        old_cover_name = track_info['cover_name']
        track_type = track_info['type']
        
        if not new_title or not new_title.strip():
            return jsonify({'message': 'Название не может быть пустым'}), 400
        
        sanitized_new_title = secure_filename(new_title.strip())

        try:
            main_dir = dirs["MUSIC_DIR"] if track_type == 'audio' else dirs["VIDEO_DIR"]
            
            new_file_path = os.path.join(main_dir, sanitized_new_title + os.path.splitext(old_file_name)[1])
            os.rename(os.path.join(main_dir, old_file_name), new_file_path)

            new_cover_path = os.path.join(dirs["FON_DIR"], sanitized_new_title + os.path.splitext(old_cover_name)[1])
            os.rename(os.path.join(dirs["FON_DIR"], old_cover_name), new_cover_path)
            
            conn = db.get_db_connection()
            conn.execute("UPDATE tracks SET title = ?, file_name = ?, cover_name = ? WHERE id = ?",
                        (new_title, os.path.basename(new_file_path), os.path.basename(new_cover_path), track_id))
            conn.commit()
            conn.close()

            return jsonify({'message': 'Переименовано успешно'})
        except FileNotFoundError:
            return jsonify({'message': 'Файл не найден.'}), 404
        except Exception as e:
            print(e)
            return jsonify({'message': 'Ошибка при переименовании.'}), 500
        finally:
            conn.close()

    @app.route('/api/tracks/<int:track_id>', methods=['DELETE'])
    @auth_required
    @role_required(['admin'])
    def delete_track(track_id):
        conn = db.get_db_connection()
        track = conn.execute("SELECT file_name, cover_name, type FROM tracks WHERE id = ?", (track_id,)).fetchone()
        if not track:
            conn.close()
            return jsonify({'message': 'Трек не найден.'}), 404
        
        try:
            media_dir = dirs["MUSIC_DIR"] if track['type'] == 'audio' else dirs["VIDEO_DIR"]
            os.unlink(os.path.join(media_dir, track['file_name']))
            os.unlink(os.path.join(dirs["FON_DIR"], track['cover_name']))
            
            conn.execute("DELETE FROM tracks WHERE id = ?", (track_id,))
            conn.commit()
            return jsonify({'message': 'Трек удален.'})
        except Exception as e:
            print(e)
            return jsonify({'message': 'Ошибка при удалении файлов.'}), 500
        finally:
            conn.close()

    @auth_required
    @role_required(['user'])
    @app.route('/api/apply-for-creator', methods=['POST'])
    def apply_for_creator():
        data = request.json
        user_id = data.get('userId')
        full_name = data.get('fullName')
        phone_number = data.get('phoneNumber')
        email = data.get('email')
        conn = db.get_db_connection()
        try:
            conn.execute("INSERT INTO creator_applications (user_id, full_name, phone_number, email) VALUES (?, ?, ?, ?)",
                        (user_id, full_name, phone_number, email))
            conn.commit()
            return jsonify({'message': 'Заявка успешно отправлена. Ожидайте ответа.'}), 201
        except Exception as e:
            print(e)
            return jsonify({'message': 'Ошибка при подаче заявки.'}), 500
        finally:
            conn.close()


    @app.route('/api/moderation/upload', methods=['POST'])
    @auth_required
    @role_required(['creator','admin'])
    def moderation_upload():
        if 'coverFile' not in request.files or ('audioFile' not in request.files and 'videoFile' not in request.files):
            return jsonify({'message': 'Не все файлы предоставлены.'}), 400

        cover_file = request.files['coverFile']
        media_file = request.files.get('audioFile') or request.files.get('videoFile')
        title = request.form.get('title')
        upload_type = request.form.get('uploadType')
        user_id = request.form.get('userId')
        genre = request.form.get('genre') or None
        artist = request.form.get('artist') or None
        category_id = request.form.get('categoryId') or None

        if not all([cover_file, media_file, title, upload_type, user_id]):
            return jsonify({'message': 'Недостаточно данных.'}), 400

        unique_id = str(int(time.time() * 1000))
        media_filename = f"{unique_id}{os.path.splitext(media_file.filename)[1]}"
        cover_filename = f"{unique_id}_cover{os.path.splitext(cover_file.filename)[1]}"

        media_file.save(os.path.join(dirs["TEMP_UPLOAD_DIR"], media_filename))
        cover_file.save(os.path.join(dirs["TEMP_UPLOAD_DIR"], cover_filename))

        conn = db.get_db_connection()
        try:
            conn.execute("INSERT INTO track_moderation (user_id, file_name, cover_name, title, type, genre, artist, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                        (user_id, media_filename, cover_filename, title, upload_type, genre, artist, category_id))
            conn.commit()
            return jsonify({'message': 'Трек отправлен на модерацию. Ожидайте одобрения.'}), 201
        except Exception as e:
            print(e)
            return jsonify({'message': 'Ошибка при отправке трека на модерацию.'}), 500
        finally:
            conn.close()


    @app.route('/api/creator/my-tracks/<int:user_id>')
    @auth_required
    @role_required(['creator','admin'])
    def get_creator_tracks(user_id):
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 30, type=int)
        offset = (page - 1) * per_page

        conn = db.get_db_connection()
        query = "SELECT id, title, file_name as file, cover_name as cover, type, creator_id, (SELECT username FROM users WHERE id = tracks.creator_id) as creator_name FROM tracks WHERE creator_id = ? ORDER BY id DESC LIMIT ? OFFSET ?"
        tracks = conn.execute(query, (user_id, per_page, offset)).fetchall()
        conn.close()
        return jsonify([dict(row) for row in tracks])

    @app.route('/api/creator/my-tracks/<int:track_id>', methods=['DELETE'])
    @auth_required
    @role_required(['creator','admin'])
    def delete_creator_track(track_id):
        data = request.json
        user_id = data.get('userId')
        user_role = data.get('userRole')
        conn = db.get_db_connection()
        track = conn.execute("SELECT file_name, cover_name, type, creator_id FROM tracks WHERE id = ?", (track_id,)).fetchone()
        if not track:
            conn.close()
            return jsonify({'message': 'Трек не найден.'}), 404
        
        if track['creator_id'] != user_id and user_role != 'admin':
            conn.close()
            return jsonify({'message': 'Недостаточно прав.'}), 403

        try:
            media_dir = dirs["MUSIC_DIR"] if track['type'] == 'audio' else dirs["VIDEO_DIR"]
            os.unlink(os.path.join(media_dir, track['file_name']))
            os.unlink(os.path.join(dirs["FON_DIR"], track['cover_name']))
            
            conn.execute("DELETE FROM tracks WHERE id = ?", (track_id,))
            conn.commit()
            return jsonify({'message': 'Трек удален.'})
        except Exception as e:
            print(e)
            return jsonify({'message': 'Ошибка при удалении файлов.'}), 500
        finally:
            conn.close()

    @app.route('/api/creator/stats/<int:user_id>')
    @auth_required
    @role_required(['creator','admin'])
    def creator_stats(user_id):
        conn = db.get_db_connection()
        total_plays = conn.execute("SELECT SUM(t.plays) FROM tracks t WHERE t.creator_id = ?", (user_id,)).fetchone()[0] or 0

        two_weeks_ago = int(time.time()) - 14 * 86400
        daily_plays = conn.execute("SELECT strftime('%Y-%m-%d', datetime(timestamp, 'unixepoch')) as date, COUNT(*) as count FROM plays WHERE track_id IN (SELECT id FROM tracks WHERE creator_id = ?) AND timestamp >= ? GROUP BY date ORDER BY date", (user_id, two_weeks_ago)).fetchall()
        
        track_stats = conn.execute("SELECT id, title, plays FROM tracks WHERE creator_id = ? ORDER BY plays DESC LIMIT 5", (user_id,)).fetchall()

        conn.close()
        
        return jsonify({
            'totalPlays': total_plays,
            'dailyPlays': [dict(row) for row in daily_plays],
            'trackStats': [dict(row) for row in track_stats]
        })


    @app.route('/api/genres')
    def get_genres():
        return jsonify(GENRES)

    @app.route('/api/categories')
    def get_categories():
        conn = db.get_db_connection()
        categories = conn.execute("SELECT * FROM categories").fetchall()
        conn.close()
        return jsonify([dict(row) for row in categories])


    @app.route('/api/creator/my-categories/<int:user_id>')
    @auth_required
    @role_required(['creator','admin'])
    def get_creator_categories(user_id):
        conn = db.get_db_connection()
        categories = conn.execute("SELECT c.id, c.name FROM categories c JOIN category_users cu ON c.id = cu.category_id WHERE cu.user_id = ?", (user_id,)).fetchall()
        conn.close()
        return jsonify([dict(row) for row in categories])


    @app.route('/api/update-playback', methods=['POST'])
    @auth_required
    def update_playback():
        data = request.json
        user_id = data.get('userId')
        track_id = data.get('trackId')
        current_time = data.get('currentTime')
        duration = data.get('duration')
        timestamp = int(time.time())
        
        conn = db.get_db_connection()
        try:
            conn.execute("INSERT INTO plays (user_id, track_id, timestamp, listened_duration) VALUES (?, ?, ?, ?)", (user_id, track_id, timestamp, current_time))
            conn.execute("UPDATE tracks SET plays = plays + 1, duration = ? WHERE id = ?", (duration, track_id,))
            
            conn.commit()
            return jsonify({'message': 'Данные о воспроизведении обновлены.'})
        except Exception as e:
            print(e)
            return jsonify({'message': 'Ошибка при обновлении данных о воспроизведении.'}), 500
        finally:
            conn.close()

    @app.route('/api/xrecomen/<int:user_id>')
    @auth_required
    def get_xrecomen(user_id):
        conn = db.get_db_connection()
        
        # Получаем список избранных треков пользователя
        user_favorites = conn.execute("SELECT media_file FROM favorites WHERE user_id = ?", (user_id,)).fetchall()
        favorite_media_files = [row['media_file'] for row in user_favorites]
        
        # Формируем список "Вам нравятся" на основе избранного
        you_like_tracks = []
        if favorite_media_files:
            placeholder = ','.join('?' for _ in favorite_media_files)
            you_like_tracks = conn.execute(f"SELECT id, title, file_name as file, cover_name as cover, type, artist, creator_id, (SELECT username FROM users WHERE id = tracks.creator_id) as creator_name FROM tracks WHERE file_name IN ({placeholder}) ORDER BY RANDOM() LIMIT 5", favorite_media_files).fetchall()
            you_like_tracks = [dict(row) for row in you_like_tracks]

        xrecomen_track = None
        you_may_like_tracks = []
        
        # Формируем список "Вам могут понравиться" из случайных треков
        you_may_like_query = "SELECT id, title, file_name as file, cover_name as cover, type, artist, creator_id, (SELECT username FROM users WHERE id = tracks.creator_id) as creator_name FROM tracks"
        you_may_like_tracks = conn.execute(you_may_like_query + " ORDER BY RANDOM() LIMIT 6").fetchall()
        you_may_like_tracks = [dict(row) for row in you_may_like_tracks]
        
        if you_may_like_tracks:
            xrecomen_track = random.choice(you_may_like_tracks)
            you_may_like_tracks = [t for t in you_may_like_tracks if t['id'] != xrecomen_track['id']]

        # Формирование "Любимых подборок"
        favorite_collections = conn.execute("SELECT c.id, c.name, COUNT(t.id) as track_count FROM categories c JOIN tracks t ON c.id = t.category_id JOIN plays p ON t.id = p.track_id WHERE p.user_id = ? GROUP BY c.id ORDER BY track_count DESC LIMIT 6", (user_id,)).fetchall()
        favorite_collections = [dict(row) for row in favorite_collections]
        
        conn.close()
        
        return jsonify({
            'xrecomenTrack': xrecomen_track,
            'youLike': you_like_tracks,
            'youMayLike': you_may_like_tracks,
            'favoriteCollections': favorite_collections
        })

    @app.route('/api/determine-genre', methods=['POST'])
    @auth_required
    @role_required(['creator','admin'])
    def determine_genre():
        if 'file' not in request.files:
            return jsonify({'message': 'Нет файла'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'message': 'Не выбран файл'}), 400

        if not model:
            return jsonify({'message': 'Модель ИИ недоступна.'}), 503

        try:
            temp_path = os.path.join(dirs["TEMP_UPLOAD_DIR"], secure_filename(file.filename))
            file.save(temp_path)
            
            features = extract_features(temp_path)
            predicted_genre_index = model.predict(features)[0]
            predicted_genre = GENRES[predicted_genre_index]
            
            os.remove(temp_path)
            
            return jsonify({'genre': predicted_genre})
        except Exception as e:
            print(f"Error during genre determination: {e}")
            return jsonify({'message': 'Ошибка при определении жанра.'}), 500
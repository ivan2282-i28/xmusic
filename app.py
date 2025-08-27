from flask import Flask, request, jsonify, send_from_directory, g
import sqlite3
import os
import shutil
import time
import random
from werkzeug.utils import secure_filename
from flask_cors import CORS
import jwt
from functools import wraps
from dotenv import load_dotenv
import hashlib
from datetime import datetime, timedelta
import threading
from werkzeug.security import generate_password_hash, check_password_hash
from pydantic import BaseModel, ValidationError
from typing import List, Optional

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'default_secret_key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=7)

# Настройка директорий
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MUSIC_DIR = os.path.join(BASE_DIR, 'music')
FON_DIR = os.path.join(BASE_DIR, 'fon')
VIDEO_DIR = os.path.join(BASE_DIR, 'video')
TEMP_UPLOAD_DIR = os.path.join(BASE_DIR, 'temp_uploads')
INDEX_DIR = os.path.join(BASE_DIR, 'index')

# Создание директорий, если они не существуют
for directory in [MUSIC_DIR, FON_DIR, VIDEO_DIR, TEMP_UPLOAD_DIR, INDEX_DIR]:
    if not os.path.exists(directory):
        os.makedirs(directory)

# Настройка базы данных
DB_PATH = os.path.join(BASE_DIR, 'database.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user',
            is_creator INTEGER DEFAULT 0,
            applied_for_creator INTEGER DEFAULT 0
        )
    """)
    c.execute("""
        CREATE TABLE IF NOT EXISTS genres (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )
    """)
    c.execute("""
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )
    """)
    c.execute("""
        CREATE TABLE IF NOT EXISTS category_creators (
            category_id INTEGER,
            creator_id INTEGER,
            PRIMARY KEY (category_id, creator_id),
            FOREIGN KEY (category_id) REFERENCES categories (id),
            FOREIGN KEY (creator_id) REFERENCES users (id)
        )
    """)
    c.execute("""
        CREATE TABLE IF NOT EXISTS tracks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            file TEXT NOT NULL UNIQUE,
            cover TEXT NOT NULL,
            type TEXT NOT NULL,
            creator_id INTEGER,
            genre_id INTEGER,
            category_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_moderated INTEGER DEFAULT 0,
            moderation_status TEXT DEFAULT 'pending',
            artist TEXT,
            FOREIGN KEY (creator_id) REFERENCES users (id),
            FOREIGN KEY (genre_id) REFERENCES genres (id),
            FOREIGN KEY (category_id) REFERENCES categories (id)
        )
    """)
    c.execute("""
        CREATE TABLE IF NOT EXISTS favorites (
            user_id INTEGER,
            track_id INTEGER,
            PRIMARY KEY (user_id, track_id),
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (track_id) REFERENCES tracks (id)
        )
    """)
    c.execute("""
        CREATE TABLE IF NOT EXISTS plays (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            track_id INTEGER,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (track_id) REFERENCES tracks (id)
        )
    """)
    c.execute("""
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE,
            full_name TEXT NOT NULL,
            phone_number TEXT NOT NULL,
            email TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    c.execute("""
        CREATE TABLE IF NOT EXISTS recommendations (
            user_id INTEGER UNIQUE,
            track_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (track_id) REFERENCES tracks (id)
        )
    """)
    conn.commit()
    conn.close()

# Заполнение базы данных начальными данными
def seed_db():
    conn = get_db_connection()
    c = conn.cursor()
    # Добавление жанров
    genres = ['Поп', 'Рок', 'Джаз', 'Электроника', 'Классика', 'Фонк', 'Хип-хоп']
    for genre in genres:
        c.execute("INSERT OR IGNORE INTO genres (name) VALUES (?)", (genre,))
    # Добавление категорий
    categories = ['Популярные', 'Для вас', 'Возможно вам понравится']
    for category in categories:
        c.execute("INSERT OR IGNORE INTO categories (name) VALUES (?)", (category,))
    conn.commit()
    conn.close()

class Track(BaseModel):
    title: str
    file: str
    cover: str
    type: str
    creator_id: int
    genre_id: int
    category_id: Optional[int]
    artist: Optional[str] = None

class User(BaseModel):
    username: str
    password: str
    role: str = 'user'

class Login(BaseModel):
    username: str
    password: str

class CreatorApplication(BaseModel):
    userId: int
    fullName: str
    phoneNumber: str
    email: str

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def get_track_info_with_creator(track_id):
    conn = get_db_connection()
    track = conn.execute("SELECT t.*, u.username as creator_name FROM tracks t JOIN users u ON t.creator_id = u.id WHERE t.id = ?", (track_id,)).fetchone()
    conn.close()
    return dict(track) if track else None

def is_blacklisted(jti):
    return jti in BLACKLIST

# Декоратор для проверки токена и роли пользователя
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'message': 'Token is missing or invalid!'}), 401
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            g.current_user = data['user_id']
            g.current_role = data['role']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid Token!'}), 401
        return f(*args, **kwargs)
    return decorated

def roles_required(roles: List[str]):
    def decorator(f):
        @wraps(f)
        @token_required
        def decorated_function(*args, **kwargs):
            if g.current_role not in roles:
                return jsonify({'message': 'Access denied: Insufficient permissions.'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

BLACKLIST = set()
refresh_tokens = {}

def generate_tokens(user_id, role, username):
    access_token_payload = {
        'user_id': user_id,
        'role': role,
        'username': username,
        'exp': datetime.utcnow() + app.config['JWT_ACCESS_TOKEN_EXPIRES']
    }
    refresh_token_payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + app.config['JWT_REFRESH_TOKEN_EXPIRES']
    }
    access_token = jwt.encode(access_token_payload, app.config['SECRET_KEY'], algorithm='HS256')
    refresh_token = jwt.encode(refresh_token_payload, app.config['SECRET_KEY'], algorithm='HS256')
    
    refresh_tokens[user_id] = refresh_token
    
    return access_token, refresh_token

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'message': 'Username and password are required!'}), 400

        conn = get_db_connection()
        user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
        if user:
            conn.close()
            return jsonify({'message': 'User already exists!'}), 409
        
        hashed_password = generate_password_hash(password)
        conn.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_password))
        conn.commit()
        
        user_id = conn.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone()[0]
        conn.close()
        
        access_token, refresh_token = generate_tokens(user_id, 'user', username)
        
        return jsonify({
            'message': 'User registered successfully!',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {'id': user_id, 'username': username, 'role': 'user'}
        }), 201
    except Exception as e:
        return jsonify({'message': 'An error occurred during registration', 'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'message': 'Username and password are required!'}), 400
        
        conn = get_db_connection()
        user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
        conn.close()
        
        if not user or not check_password_hash(user['password'], password):
            return jsonify({'message': 'Invalid username or password!'}), 401
            
        access_token, refresh_token = generate_tokens(user['id'], user['role'], user['username'])
        
        return jsonify({
            'message': 'Login successful!',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {'id': user['id'], 'username': user['username'], 'role': user['role']}
        })
    except Exception as e:
        return jsonify({'message': 'An error occurred during login', 'error': str(e)}), 500

@app.route('/api/auth_refresh', methods=['POST'])
def refresh_token():
    data = request.json
    refresh_token = data.get('refresh_token')
    if not refresh_token:
        return jsonify({'message': 'Refresh token is missing!'}), 400
    try:
        payload = jwt.decode(refresh_token, app.config['SECRET_KEY'], algorithms=["HS256"])
        user_id = payload.get('user_id')
        
        if refresh_tokens.get(user_id) != refresh_token:
            return jsonify({'message': 'Invalid refresh token'}), 401
            
        conn = get_db_connection()
        user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        conn.close()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        new_access_token, new_refresh_token = generate_tokens(user['id'], user['role'], user['username'])
        
        return jsonify({
            'access_token': new_access_token,
            'refresh_token': new_refresh_token
        })
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Refresh token has expired!'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid refresh token!'}), 401

@app.route('/api/logout', methods=['POST'])
@token_required
def logout():
    data = request.json
    user_id = data.get('user_id')
    if user_id in refresh_tokens:
        del refresh_tokens[user_id]
    return jsonify({'message': 'Logout successful!'}), 200

@app.route('/api/tracks', methods=['GET'])
@token_required
def get_tracks():
    conn = get_db_connection()
    category_id = request.args.get('categoryId')
    genre_id = request.args.get('genreId')
    query = "SELECT t.*, u.username as creator_name, g.name as genre_name, c.name as category_name FROM tracks t JOIN users u ON t.creator_id = u.id JOIN genres g ON t.genre_id = g.id LEFT JOIN categories c ON t.category_id = c.id WHERE t.is_moderated = 1"
    params = []
    
    if category_id:
        query += " AND t.category_id = ?"
        params.append(category_id)
    if genre_id:
        query += " AND t.genre_id = ?"
        params.append(genre_id)
        
    tracks = conn.execute(query, params).fetchall()
    conn.close()
    
    tracks_list = [dict(row) for row in tracks]
    return jsonify(tracks_list)

@app.route('/api/genres', methods=['GET'])
@token_required
def get_genres():
    conn = get_db_connection()
    genres = conn.execute("SELECT * FROM genres").fetchall()
    conn.close()
    return jsonify([dict(g) for g in genres])

@app.route('/api/categories', methods=['GET'])
@token_required
def get_categories():
    conn = get_db_connection()
    categories = conn.execute("SELECT c.id, c.name FROM categories c").fetchall()
    conn.close()
    return jsonify([dict(c) for c in categories])

@app.route('/api/favorites', methods=['GET'])
@token_required
def get_favorites():
    user_id = g.current_user
    conn = get_db_connection()
    favorites = conn.execute("SELECT t.file FROM favorites f JOIN tracks t ON f.track_id = t.id WHERE f.user_id = ?", (user_id,)).fetchall()
    conn.close()
    return jsonify([f['file'] for f in favorites])

@app.route('/api/favorites/add', methods=['POST'])
@roles_required(['user', 'creator', 'admin'])
def add_favorite():
    data = request.json
    track_id = data.get('track_id')
    user_id = g.current_user

    if not track_id:
        return jsonify({'message': 'Track ID is required'}), 400
        
    conn = get_db_connection()
    try:
        conn.execute("INSERT INTO favorites (user_id, track_id) VALUES (?, ?)", (user_id, track_id))
        conn.commit()
        return jsonify({'message': 'Track added to favorites'}), 200
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Track is already in favorites'}), 409
    finally:
        conn.close()

@app.route('/api/favorites/remove', methods=['POST'])
@roles_required(['user', 'creator', 'admin'])
def remove_favorite():
    data = request.json
    track_id = data.get('track_id')
    user_id = g.current_user

    if not track_id:
        return jsonify({'message': 'Track ID is required'}), 400
        
    conn = get_db_connection()
    conn.execute("DELETE FROM favorites WHERE user_id = ? AND track_id = ?", (user_id, track_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Track removed from favorites'}), 200

@app.route('/api/update-playback', methods=['POST'])
@roles_required(['user', 'creator', 'admin'])
def update_playback():
    user_id = g.current_user
    data = request.json
    track_id = data.get('trackId')
    
    if not track_id:
        return jsonify({'message': 'Track ID is required'}), 400
    
    conn = get_db_connection()
    conn.execute("INSERT INTO plays (user_id, track_id) VALUES (?, ?)", (user_id, track_id))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Playback updated'}), 200

@app.route('/api/xrecomen/<int:user_id>', methods=['GET'])
@token_required
def get_xrecomen(user_id):
    conn = get_db_connection()
    
    # Рекомендации на основе часто прослушиваемых треков
    you_like_query = """
        SELECT t.id, t.title, t.artist, t.file, t.cover, t.type, u.username as creator_name, COUNT(p.track_id) as play_count
        FROM plays p
        JOIN tracks t ON p.track_id = t.id
        JOIN users u ON t.creator_id = u.id
        WHERE p.user_id = ? AND t.is_moderated = 1
        GROUP BY t.id
        ORDER BY play_count DESC
        LIMIT 6
    """
    you_like_tracks = conn.execute(you_like_query, (user_id,)).fetchall()
    you_like_tracks = [dict(row) for row in you_like_tracks]

    # Рекомендации на основе жанров
    played_genre_ids = conn.execute("SELECT DISTINCT t.genre_id FROM plays p JOIN tracks t ON p.track_id = t.id WHERE p.user_id = ?", (user_id,)).fetchall()
    played_genre_ids = [row['genre_id'] for row in played_genre_ids]
    you_may_like_tracks = []
    if played_genre_ids:
        you_may_like_query = f"""
            SELECT t.*, u.username as creator_name
            FROM tracks t
            JOIN users u ON t.creator_id = u.id
            WHERE t.is_moderated = 1 AND t.genre_id IN ({','.join(['?'] * len(played_genre_ids))})
            ORDER BY RANDOM()
            LIMIT 6
        """
        you_may_like_tracks = conn.execute(you_may_like_query, played_genre_ids).fetchall()
        you_may_like_tracks = [dict(row) for row in you_may_like_tracks]

    xrecomen_track = None
    if you_may_like_tracks:
        xrecomen_track = random.choice(you_may_like_tracks)

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

@app.route('/api/apply_for_creator', methods=['POST'])
@roles_required(['user'])
def apply_for_creator():
    try:
        data = request.json
        application = CreatorApplication(**data)
        
        conn = get_db_connection()
        conn.execute("INSERT INTO applications (user_id, full_name, phone_number, email) VALUES (?, ?, ?, ?)",
                     (application.userId, application.fullName, application.phoneNumber, application.email))
        conn.execute("UPDATE users SET applied_for_creator = 1 WHERE id = ?", (application.userId,))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Заявка отправлена успешно. Ожидайте рассмотрения.'}), 201
    except ValidationError as e:
        return jsonify({'message': 'Неверные данные в заявке.', 'errors': e.errors()}), 400
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Вы уже подавали заявку.'}), 409
    except Exception as e:
        return jsonify({'message': 'Ошибка при подаче заявки.', 'error': str(e)}), 500

@app.route('/api/creator/upload', methods=['POST'])
@roles_required(['creator', 'admin'])
def upload_track():
    try:
        if 'file' not in request.files or 'cover' not in request.files:
            return jsonify({'message': 'File and cover are required'}), 400
        
        track_file = request.files['file']
        cover_file = request.files['cover']
        
        if track_file.filename == '' or cover_file.filename == '':
            return jsonify({'message': 'No selected file or cover'}), 400
        
        title = request.form.get('title')
        genre_id = request.form.get('genre_id')
        category_id = request.form.get('category_id')
        track_type = request.form.get('type')
        artist = request.form.get('artist')
        creator_id = g.current_user
        
        if not all([title, genre_id, track_type]):
            return jsonify({'message': 'Missing required fields'}), 400

        track_ext = track_file.filename.rsplit('.', 1)[1].lower()
        cover_ext = cover_file.filename.rsplit('.', 1)[1].lower()
        
        track_filename = secure_filename(f"{int(time.time())}_{random.randint(1000, 9999)}.{track_ext}")
        cover_filename = secure_filename(f"{int(time.time())}_{random.randint(1000, 9999)}.{cover_ext}")
        
        track_path = os.path.join(TEMP_UPLOAD_DIR, track_filename)
        cover_path = os.path.join(TEMP_UPLOAD_DIR, cover_filename)
        
        track_file.save(track_path)
        cover_file.save(cover_path)
        
        conn = get_db_connection()
        conn.execute("INSERT INTO tracks (title, file, cover, type, creator_id, genre_id, category_id, is_moderated, moderation_status, artist) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 'pending', ?)",
                     (title, track_filename, cover_filename, track_type, creator_id, genre_id, category_id, artist))
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Файл загружен и ожидает модерации.'}), 201
    except Exception as e:
        return jsonify({'message': 'Ошибка при загрузке файла', 'error': str(e)}), 500

@app.route('/api/creator/my-tracks/<int:user_id>', methods=['GET'])
@roles_required(['creator', 'admin'])
def get_my_tracks(user_id):
    conn = get_db_connection()
    tracks = conn.execute("SELECT t.*, u.username as creator_name FROM tracks t JOIN users u ON t.creator_id = u.id WHERE t.creator_id = ?", (user_id,)).fetchall()
    conn.close()
    return jsonify([dict(t) for t in tracks])

@app.route('/api/creator/tracks/delete/<int:track_id>', methods=['DELETE'])
@roles_required(['creator', 'admin'])
def delete_my_track(track_id):
    creator_id = g.current_user
    conn = get_db_connection()
    track = conn.execute("SELECT * FROM tracks WHERE id = ? AND creator_id = ?", (track_id, creator_id)).fetchone()
    
    if not track:
        conn.close()
        return jsonify({'message': 'Track not found or you do not have permission'}), 404
        
    try:
        if track['is_moderated'] == 1:
            os.remove(os.path.join(MUSIC_DIR if track['type'] == 'audio' else VIDEO_DIR, track['file']))
            os.remove(os.path.join(FON_DIR, track['cover']))
        else:
            os.remove(os.path.join(TEMP_UPLOAD_DIR, track['file']))
            os.remove(os.path.join(TEMP_UPLOAD_DIR, track['cover']))
            
        conn.execute("DELETE FROM tracks WHERE id = ?", (track_id,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Track deleted successfully'}), 200
    except OSError as e:
        conn.close()
        return jsonify({'message': 'Error deleting files', 'error': str(e)}), 500

@app.route('/api/creator/stats/<int:user_id>', methods=['GET'])
@roles_required(['creator', 'admin'])
def get_creator_stats(user_id):
    conn = get_db_connection()
    total_plays = conn.execute("SELECT COUNT(*) FROM plays p JOIN tracks t ON p.track_id = t.id WHERE t.creator_id = ?", (user_id,)).fetchone()[0]
    
    daily_plays = conn.execute("SELECT DATE(timestamp) as date, COUNT(*) as count FROM plays p JOIN tracks t ON p.track_id = t.id WHERE t.creator_id = ? GROUP BY date ORDER BY date", (user_id,)).fetchall()
    
    track_stats = conn.execute("SELECT t.title, COUNT(p.track_id) as plays FROM plays p JOIN tracks t ON p.track_id = t.id WHERE t.creator_id = ? GROUP BY t.title ORDER BY plays DESC", (user_id,)).fetchall()
    
    conn.close()
    
    return jsonify({
        'totalPlays': total_plays,
        'dailyPlays': [dict(row) for row in daily_plays],
        'trackStats': [dict(row) for row in track_stats]
    })

@app.route('/api/creator/my-categories/<int:user_id>', methods=['GET'])
@roles_required(['creator', 'admin'])
def get_my_categories(user_id):
    conn = get_db_connection()
    categories = conn.execute("SELECT c.* FROM categories c JOIN category_creators cc ON c.id = cc.category_id WHERE cc.creator_id = ?", (user_id,)).fetchall()
    conn.close()
    return jsonify([dict(cat) for cat in categories])

@app.route('/api/admin/applications', methods=['GET'])
@roles_required(['admin'])
def get_applications():
    conn = get_db_connection()
    applications = conn.execute("SELECT a.*, u.username FROM applications a JOIN users u ON a.user_id = u.id WHERE a.status = 'pending'").fetchall()
    conn.close()
    return jsonify([dict(app) for app in applications])

@app.route('/api/admin/applications/approve/<int:user_id>', methods=['POST'])
@roles_required(['admin'])
def approve_application(user_id):
    conn = get_db_connection()
    conn.execute("UPDATE users SET role = 'creator' WHERE id = ?", (user_id,))
    conn.execute("UPDATE applications SET status = 'approved' WHERE user_id = ?", (user_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Заявка одобрена. Пользователь теперь Креатор.'}), 200

@app.route('/api/admin/applications/reject/<int:user_id>', methods=['POST'])
@roles_required(['admin'])
def reject_application(user_id):
    conn = get_db_connection()
    conn.execute("UPDATE users SET applied_for_creator = 0 WHERE id = ?", (user_id,))
    conn.execute("UPDATE applications SET status = 'rejected' WHERE user_id = ?", (user_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Заявка отклонена.'}), 200

@app.route('/api/admin/users', methods=['GET'])
@roles_required(['admin'])
def get_users():
    conn = get_db_connection()
    users = conn.execute("SELECT id, username, role FROM users").fetchall()
    conn.close()
    return jsonify([dict(user) for user in users])
    
@app.route('/api/admin/users/search', methods=['GET'])
@roles_required(['admin'])
def search_users():
    search_term = request.args.get('term', '')
    if len(search_term) < 2:
        return jsonify([])
    
    conn = get_db_connection()
    users = conn.execute("SELECT id, username FROM users WHERE username LIKE ?", (f'%{search_term}%',)).fetchall()
    conn.close()
    return jsonify([dict(user) for user in users])

@app.route('/api/admin/users/role/<int:user_id>', methods=['POST'])
@roles_required(['admin'])
def change_user_role(user_id):
    data = request.json
    new_role = data.get('role')
    if new_role not in ['user', 'creator', 'admin']:
        return jsonify({'message': 'Invalid role'}), 400
    
    conn = get_db_connection()
    conn.execute("UPDATE users SET role = ? WHERE id = ?", (new_role, user_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'User role updated successfully'}), 200

@app.route('/api/admin/users/delete/<int:user_id>', methods=['POST'])
@roles_required(['admin'])
def delete_user(user_id):
    conn = get_db_connection()
    conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'User deleted successfully'}), 200

@app.route('/api/admin/moderation', methods=['GET'])
@roles_required(['admin'])
def get_moderation_tracks():
    conn = get_db_connection()
    tracks = conn.execute("SELECT t.*, u.username, g.name as genre_name FROM tracks t JOIN users u ON t.creator_id = u.id JOIN genres g ON t.genre_id = g.id WHERE t.is_moderated = 0 AND t.moderation_status = 'pending'").fetchall()
    conn.close()
    return jsonify([dict(t) for t in tracks])

@app.route('/api/admin/moderation/approve/<int:track_id>', methods=['POST'])
@roles_required(['admin'])
def approve_track(track_id):
    data = request.json
    genre_id = data.get('genre_id')
    conn = get_db_connection()
    
    track = conn.execute("SELECT * FROM tracks WHERE id = ? AND is_moderated = 0", (track_id,)).fetchone()
    if not track:
        conn.close()
        return jsonify({'message': 'Track not found or already moderated'}), 404

    try:
        if track['type'] == 'audio':
            shutil.move(os.path.join(TEMP_UPLOAD_DIR, track['file']), os.path.join(MUSIC_DIR, track['file']))
            shutil.move(os.path.join(TEMP_UPLOAD_DIR, track['cover']), os.path.join(FON_DIR, track['cover']))
        else:
            shutil.move(os.path.join(TEMP_UPLOAD_DIR, track['file']), os.path.join(VIDEO_DIR, track['file']))
            shutil.move(os.path.join(TEMP_UPLOAD_DIR, track['cover']), os.path.join(FON_DIR, track['cover']))
            
        conn.execute("UPDATE tracks SET is_moderated = 1, moderation_status = 'approved', genre_id = ? WHERE id = ?", (genre_id, track_id))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Track approved and moved to public'}), 200
    except Exception as e:
        conn.close()
        return jsonify({'message': 'Error approving track', 'error': str(e)}), 500

@app.route('/api/admin/moderation/reject/<int:track_id>', methods=['POST'])
@roles_required(['admin'])
def reject_track(track_id):
    conn = get_db_connection()
    track = conn.execute("SELECT * FROM tracks WHERE id = ? AND is_moderated = 0", (track_id,)).fetchone()
    
    if not track:
        conn.close()
        return jsonify({'message': 'Track not found or already moderated'}), 404
        
    try:
        os.remove(os.path.join(TEMP_UPLOAD_DIR, track['file']))
        os.remove(os.path.join(TEMP_UPLOAD_DIR, track['cover']))
        conn.execute("DELETE FROM tracks WHERE id = ?", (track_id,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Track rejected and deleted'}), 200
    except OSError as e:
        conn.close()
        return jsonify({'message': 'Error rejecting track', 'error': str(e)}), 500

@app.route('/api/admin/stats', methods=['GET'])
@roles_required(['admin'])
def get_admin_stats():
    conn = get_db_connection()
    total_users = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    total_tracks = conn.execute("SELECT COUNT(*) FROM tracks WHERE is_moderated = 1").fetchone()[0]
    total_plays = conn.execute("SELECT COUNT(*) FROM plays").fetchone()[0]
    conn.close()
    return jsonify({
        'total_users': total_users,
        'total_tracks': total_tracks,
        'total_plays': total_plays
    })

@app.route('/api/admin/tracks/delete/<int:track_id>', methods=['DELETE'])
@roles_required(['admin'])
def admin_delete_track(track_id):
    conn = get_db_connection()
    track = conn.execute("SELECT * FROM tracks WHERE id = ?", (track_id,)).fetchone()
    
    if not track:
        conn.close()
        return jsonify({'message': 'Track not found'}), 404
        
    try:
        if track['is_moderated'] == 1:
            os.remove(os.path.join(MUSIC_DIR if track['type'] == 'audio' else VIDEO_DIR, track['file']))
            os.remove(os.path.join(FON_DIR, track['cover']))
        else:
            os.remove(os.path.join(TEMP_UPLOAD_DIR, track['file']))
            os.remove(os.path.join(TEMP_UPLOAD_DIR, track['cover']))
            
        conn.execute("DELETE FROM tracks WHERE id = ?", (track_id,))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Track deleted successfully'}), 200
    except OSError as e:
        conn.close()
        return jsonify({'message': 'Error deleting files', 'error': str(e)}), 500

@app.route('/api/admin/tracks/rename/<int:track_id>', methods=['PUT'])
@roles_required(['admin'])
def admin_rename_track(track_id):
    data = request.json
    new_title = data.get('newTitle')
    if not new_title:
        return jsonify({'message': 'New title is required'}), 400
        
    conn = get_db_connection()
    conn.execute("UPDATE tracks SET title = ? WHERE id = ?", (new_title, track_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Track renamed successfully'}), 200

@app.route('/api/admin/categories', methods=['GET'])
@roles_required(['admin'])
def admin_get_categories():
    conn = get_db_connection()
    categories = conn.execute("SELECT c.id, c.name, COUNT(t.id) as track_count FROM categories c LEFT JOIN tracks t ON c.id = t.category_id GROUP BY c.id").fetchall()
    conn.close()
    return jsonify([dict(cat) for cat in categories])

@app.route('/api/admin/categories/create', methods=['POST'])
@roles_required(['admin'])
def admin_create_category():
    data = request.json
    name = data.get('name')
    user_ids = data.get('user_ids', [])
    
    if not name:
        return jsonify({'message': 'Category name is required'}), 400
    
    conn = get_db_connection()
    try:
        conn.execute("INSERT INTO categories (name) VALUES (?)", (name,))
        category_id = conn.execute("SELECT id FROM categories WHERE name = ?", (name,)).fetchone()[0]
        
        for user_id in user_ids:
            conn.execute("INSERT OR IGNORE INTO category_creators (category_id, creator_id) VALUES (?, ?)", (category_id, user_id))
            
        conn.commit()
        conn.close()
        return jsonify({'message': 'Category created successfully'}), 201
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'message': 'Category with this name already exists'}), 409
    
@app.route('/api/admin/categories/edit/<int:category_id>', methods=['PUT'])
@roles_required(['admin'])
def admin_edit_category(category_id):
    data = request.json
    name = data.get('name')
    user_ids = data.get('user_ids', [])
    
    conn = get_db_connection()
    conn.execute("UPDATE categories SET name = ? WHERE id = ?", (name, category_id))
    conn.execute("DELETE FROM category_creators WHERE category_id = ?", (category_id,))
    
    for user_id in user_ids:
        conn.execute("INSERT OR IGNORE INTO category_creators (category_id, creator_id) VALUES (?, ?)", (category_id, user_id))
        
    conn.commit()
    conn.close()
    return jsonify({'message': 'Category updated successfully'}), 200
    
@app.route('/api/admin/categories/delete/<int:category_id>', methods=['DELETE'])
@roles_required(['admin'])
def admin_delete_category(category_id):
    conn = get_db_connection()
    conn.execute("DELETE FROM category_creators WHERE category_id = ?", (category_id,))
    conn.execute("DELETE FROM categories WHERE id = ?", (category_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Category deleted successfully'}), 200

@app.route('/api/admin/categories/<int:category_id>/users', methods=['GET'])
@roles_required(['admin'])
def admin_get_category_users(category_id):
    conn = get_db_connection()
    users = conn.execute("SELECT u.id, u.username FROM users u JOIN category_creators cc ON u.id = cc.creator_id WHERE cc.category_id = ?", (category_id,)).fetchall()
    conn.close()
    return jsonify([dict(user) for user in users])

@app.route('/music/<filename>')
def serve_music(filename):
    return send_from_directory(MUSIC_DIR, filename)

@app.route('/fon/<filename>')
def serve_fon(filename):
    return send_from_directory(FON_DIR, filename)

@app.route('/video/<filename>')
def serve_video(filename):
    return send_from_directory(VIDEO_DIR, filename)

@app.route('/temp_uploads/<filename>')
@roles_required(['admin'])
def serve_temp_uploads(filename):
    return send_from_directory(TEMP_UPLOAD_DIR, filename)

@app.route('/')
def serve_index():
    return send_from_directory(BASE_DIR, 'index.html')

if __name__ == '__main__':
    init_db()
    seed_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
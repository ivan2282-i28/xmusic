from flask import Flask, request, jsonify, send_from_directory
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
import requests # Добавляем импорт requests

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
# Загружаем секретный ключ reCAPTCHA из .env файла
RECAPTCHA_SECRET_KEY = os.getenv('RECAPTCHA_SECRET_KEY')

# Настройка директорий
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MUSIC_DIR = os.path.join(BASE_DIR, 'music')
FON_DIR = os.path.join(BASE_DIR, 'fon')
VIDEO_DIR = os.path.join(BASE_DIR, 'video')
TEMP_UPLOAD_DIR = os.path.join(BASE_DIR, 'temp_uploads')
INDEX_DIR = os.path.join(BASE_DIR, 'index')
# Создание директорий, если они не существуют
for directory in [MUSIC_DIR, FON_DIR, VIDEO_DIR, TEMP_UPLOAD_DIR]:
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
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user'
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS favorites (
            user_id INTEGER,
            media_file TEXT NOT NULL,
            PRIMARY KEY (user_id, media_file),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS creator_applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            full_name TEXT NOT NULL,
            phone_number TEXT NOT NULL,
            email TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS genres (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS category_users (
            category_id INTEGER,
            user_id INTEGER,
            PRIMARY KEY (category_id, user_id),
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS track_moderation (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            file_name TEXT NOT NULL,
            cover_name TEXT NOT NULL,
            title TEXT NOT NULL,
            type TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            genre_id INTEGER,
            artist TEXT,
            category_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE SET NULL,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS tracks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            file_name TEXT NOT NULL,
            cover_name TEXT NOT NULL,
            type TEXT NOT NULL,
            creator_id INTEGER NOT NULL,
            genre_id INTEGER,
            artist TEXT,
            category_id INTEGER,
            plays INTEGER DEFAULT 0,
            duration REAL,
            FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE SET NULL,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
        )
    ''')
    # Добавление столбца 'duration' для уже существующей таблицы
    c.execute("PRAGMA table_info(tracks)")
    columns = [column[1] for column in c.fetchall()]
    if 'duration' not in columns:
        c.execute("ALTER TABLE tracks ADD COLUMN duration REAL")
    c.execute('''
        CREATE TABLE IF NOT EXISTS plays (
            user_id INTEGER NOT NULL,
            track_id INTEGER NOT NULL,
            timestamp INTEGER NOT NULL,
            listened_duration REAL,
            PRIMARY KEY (user_id, track_id, timestamp),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS user_preferences (
            user_id INTEGER UNIQUE NOT NULL,
            liked_genres TEXT,
            liked_artists TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')

    # Добавление админа, если его нет
    c.execute("SELECT * FROM users WHERE username = 'root'")
    if c.fetchone() is None:
        c.execute("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ('root', 'defaultpassword', 'admin'))

    # Добавление стандартных жанров
    genres = ['Общее','Рок', 'Метал', 'Фонк', 'Поп', 'Электронная', 'Хип-хоп', 'Джаз', 'Классика', 'Эмбиент', 'Инди', 'Рэп', 'Трэп', 'Ритм-н-блюз', 'Соул', 'Кантри', 'Регги', 'Блюз', 'Диско', 'Техно', 'Хаус']
    for genre in genres:
        c.execute("INSERT OR IGNORE INTO genres (name) VALUES (?)", (genre,))
    
    # Добавление стандартных категорий
    categories = []
    for category in categories:
        c.execute("INSERT OR IGNORE INTO categories (name) VALUES (?)", (category,))
    
    conn.commit()
    conn.close()

# Инициализация базы данных при запуске
init_db()

# Защита путей
app.config['UPLOAD_FOLDER'] = {
    'music': MUSIC_DIR,
    'fon': FON_DIR,
    'video': VIDEO_DIR,
    'temp_uploads': TEMP_UPLOAD_DIR
}

def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or not token.startswith('Bearer '):
            return jsonify({'message': 'Token is missing or invalid!'}), 401
        
        try:
            token = token.split()[1]  # Remove 'Bearer ' prefix
            # Decode and verify the token
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            # You can add the decoded data to the request context if needed
            

            conn = get_db_connection()
            cursor = conn.cursor()
            # Query for the specific user ID and username
            cursor.execute("SELECT * FROM users WHERE id = ? AND username = ?", (data["id"], data["username"]))
            user_exists = cursor.fetchone()
            conn.close()


            if not user_exists:
                return jsonify({'message': 'Token is invalid'}), 401
            if data["passphrase"] != f"{hashlib.sha256(user_exists['password'].encode('utf-8')).hexdigest()}edf6":
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

# ---- Добавлена функция для проверки reCAPTCHA v3 ----
def verify_recaptcha(recaptcha_token):
    """Проверяет reCAPTCHA токен с помощью сервиса Google."""
    payload = {
        'secret': RECAPTCHA_SECRET_KEY,
        'response': recaptcha_token
    }
    response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=payload)
    result = response.json()
    # Возвращаем True, если проверка успешна, и оценка больше 0.5 (стандартная для v3)
    return result.get('success', False) and result.get('score', 0) > 0.5

# ---- Маршруты для статических файлов ----
@app.route('/')
def serve_index():
    return send_from_directory(INDEX_DIR, 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(INDEX_DIR, filename)

@app.route('/music/<path:filename>')
def serve_music(filename):
    return send_from_directory(MUSIC_DIR, filename)

@app.route('/fon/<path:filename>')
def serve_fon(filename):
    return send_from_directory(FON_DIR, filename)

@app.route('/video/<path:filename>')
def serve_video(filename):
    return send_from_directory(VIDEO_DIR, filename)

@app.route('/temp_uploads/<path:filename>')
def serve_temp_uploads(filename):
    return send_from_directory(TEMP_UPLOAD_DIR, filename)

# ---- Маршрут для регистрации ----
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    recaptcha_token = data.get('recaptcha_token')

    # Проверяем reCAPTCHA токен
    if not recaptcha_token or not verify_recaptcha(recaptcha_token):
        return jsonify({'message': 'Проверка reCAPTCHA не пройдена.'}), 400

    conn = get_db_connection()
    try:
        conn.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
        conn.commit()
        return jsonify({'message': 'Регистрация прошла успешно!'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Пользователь с таким именем уже существует.'}), 400
    finally:
        conn.close()

# ---- Маршрут для входа ----
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    recaptcha_token = data.get('recaptcha_token')

    # Проверяем reCAPTCHA токен
    if not recaptcha_token or not verify_recaptcha(recaptcha_token):
        return jsonify({'message': 'Проверка reCAPTCHA не пройдена.'}), 400

    conn = get_db_connection()
    user = conn.execute("SELECT id, username, role FROM users WHERE username = ? AND password = ?", (username, password)).fetchone()
    conn.close()
    if user:
        sanuser = {"username":user["username"],"id":user["id"],"passphrase":f"{hashlib.sha256(password.encode('utf-8')).hexdigest()}edf6"}
        tokend = jwt.encode(sanuser,app.config["SECRET_KEY"],"HS256")
        return jsonify({'message': 'Вход выполнен!', 'user': dict(user), 'token':tokend, 'refresh':f"d{hashlib.sha256(password.encode('utf-8')).hexdigest()}c34f"})
    else:
        return jsonify({'message': 'Неверный логин или пароль.'}), 401

# ---- Остальные маршруты (без изменений) ----
@app.route('/api/favorites', methods=['GET'])
@auth_required
def get_favorites():
    conn = get_db_connection()
    favorites = conn.execute("SELECT media_file FROM favorites WHERE user_id = ?", (request.current_user["id"],)).fetchall()
    conn.close()
    favorite_files = [row['media_file'] for row in favorites]
    return jsonify(favorite_files)

@app.route('/api/favorites', methods=['POST', 'DELETE'])
def favorites():
    data = request.json
    user_id = data.get('userId')
    media_file = data.get('mediaFile')
    conn = get_db_connection()
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
    conn = get_db_connection()
    genre_id = request.args.get('genreId')
    category_id = request.args.get('categoryId')

    query = "SELECT t.id, t.title, t.file_name as file, t.cover_name as cover, t.type, t.plays, g.name as genre, u.username as creator_name, t.artist, t.category_id FROM tracks t LEFT JOIN genres g ON t.genre_id = g.id LEFT JOIN users u ON t.creator_id = u.id"
    params = []

    if genre_id:
        query += " WHERE t.genre_id = ?"
        params.append(genre_id)
    elif category_id:
        query += " WHERE t.category_id = ?"
        params.append(category_id)
    
    tracks = conn.execute(query, params).fetchall()
    conn.close()
    return jsonify([dict(row) for row in tracks])

@auth_required
@role_required(['admin','creator'])
@app.route('/api/rename', methods=['POST'])
def rename_track():
    data = request.json
    track_id = data.get('trackId')
    new_title = data.get('newTitle')

    conn = get_db_connection()
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
        main_dir = MUSIC_DIR if track_type == 'audio' else VIDEO_DIR
        
        new_file_path = os.path.join(main_dir, sanitized_new_title + os.path.splitext(old_file_name)[1])
        os.rename(os.path.join(main_dir, old_file_name), new_file_path)

        new_cover_path = os.path.join(FON_DIR, sanitized_new_title + os.path.splitext(old_cover_name)[1])
        os.rename(os.path.join(FON_DIR, old_cover_name), new_cover_path)
        
        conn = get_db_connection()
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
def delete_track(track_id):
    conn = get_db_connection()
    track = conn.execute("SELECT file_name, cover_name, type FROM tracks WHERE id = ?", (track_id,)).fetchone()
    if not track:
        conn.close()
        return jsonify({'message': 'Трек не найден.'}), 404
    
    try:
        media_dir = MUSIC_DIR if track['type'] == 'audio' else VIDEO_DIR
        os.unlink(os.path.join(media_dir, track['file_name']))
        os.unlink(os.path.join(FON_DIR, track['cover_name']))
        
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
    conn = get_db_connection()
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

@app.route('/api/admin/applications')
@auth_required
@role_required(['admin'])
def admin_applications():
    conn = get_db_connection()
    applications = conn.execute("SELECT a.id, a.full_name, a.phone_number, a.email, a.status, u.username, a.user_id FROM creator_applications a JOIN users u ON a.user_id = u.id WHERE a.status = 'pending'").fetchall()
    conn.close()
    return jsonify([dict(row) for row in applications])

@app.route('/api/admin/approve-application', methods=['POST'])
@auth_required
@role_required(['admin'])
def approve_application():
    data = request.json
    user_id = data.get('userId')
    conn = get_db_connection()
    try:
        conn.execute("UPDATE users SET role = 'creator' WHERE id = ?", (user_id,))
        conn.execute("DELETE FROM creator_applications WHERE user_id = ?", (user_id,))
        conn.commit()
        return jsonify({'message': 'Заявка одобрена, пользователь стал креатором.'})
    except Exception as e:
        print(e)
        return jsonify({'message': 'Ошибка при одобрении заявки.'}), 500
    finally:
        conn.close()

@app.route('/api/admin/reject-application', methods=['POST'])
@auth_required
@role_required(['admin'])
def reject_application():
    data = request.json
    app_id = data.get('appId')
    conn = get_db_connection()
    try:
        conn.execute("DELETE FROM creator_applications WHERE id = ?", (app_id,))
        conn.commit()
        return jsonify({'message': 'Заявка отклонена.'})
    except Exception as e:
        print(e)
        return jsonify({'message': 'Ошибка при отклонении заявки.'}), 500
    finally:
        conn.close()

@app.route('/api/admin/users')
@auth_required
@role_required(['admin'])
def admin_users():
    conn = get_db_connection()
    users = conn.execute("SELECT id, username, role FROM users").fetchall()
    conn.close()
    return jsonify([dict(row) for row in users])

@app.route('/api/admin/update-role', methods=['POST'])
@auth_required
@role_required(['admin'])
def update_role():
    data = request.json
    user_id = data.get('userId')
    role = data.get('role')
    conn = get_db_connection()
    try:
        conn.execute("UPDATE users SET role = ? WHERE id = ?", (role, user_id))
        conn.commit()
        return jsonify({'message': 'Роль обновлена успешно.'})
    except Exception as e:
        print(e)
        return jsonify({'message': 'Ошибка при обновлении роли.'}), 500
    finally:
        conn.close()

@app.route('/api/admin/change-password', methods=['POST'])
@auth_required
@role_required(['admin'])
def change_password():
    data = request.json
    user_id = data.get('userId')
    new_password = data.get('newPassword')
    conn = get_db_connection()
    try:
        conn.execute("UPDATE users SET password = ? WHERE id = ?", (new_password, user_id))
        conn.commit()
        return jsonify({'message': 'Пароль успешно изменен.'})
    except Exception as e:
        print(e)
        return jsonify({'message': 'Ошибка при смене пароля.'}), 500
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
    genre_id = request.form.get('genreId')
    artist = request.form.get('artist') or None
    category_id = request.form.get('categoryId') or None

    if not all([cover_file, media_file, title, upload_type, user_id]):
        return jsonify({'message': 'Недостаточно данных.'}), 400

    unique_id = str(int(time.time() * 1000))
    media_filename = f"{unique_id}{os.path.splitext(media_file.filename)[1]}"
    cover_filename = f"{unique_id}_cover{os.path.splitext(cover_file.filename)[1]}"

    media_file.save(os.path.join(TEMP_UPLOAD_DIR, media_filename))
    cover_file.save(os.path.join(TEMP_UPLOAD_DIR, cover_filename))

    conn = get_db_connection()
    try:
        conn.execute("INSERT INTO track_moderation (user_id, file_name, cover_name, title, type, genre_id, artist, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                     (user_id, media_filename, cover_filename, title, upload_type, genre_id, artist, category_id))
        conn.commit()
        return jsonify({'message': 'Трек отправлен на модерацию. Ожидайте одобрения.'}), 201
    except Exception as e:
        print(e)
        return jsonify({'message': 'Ошибка при отправке трека на модерацию.'}), 500
    finally:
        conn.close()

@app.route('/api/admin/moderation-tracks')
@auth_required
@role_required(['admin'])
def admin_moderation_tracks():
    conn = get_db_connection()
    tracks = conn.execute("SELECT m.id, m.file_name, m.cover_name, m.title, m.type, u.username, m.user_id, m.artist, m.genre_id, g.name as genre_name, m.category_id FROM track_moderation m JOIN users u ON m.user_id = u.id LEFT JOIN genres g ON m.genre_id = g.id WHERE m.status = 'pending'").fetchall()
    conn.close()
    return jsonify([dict(row) for row in tracks])

@app.route('/api/admin/approve-track', methods=['POST'])
@auth_required
@role_required(['admin'])
def approve_track():
    data = request.json
    track_id = data.get('trackId')
    file_name = data.get('fileName')
    cover_name = data.get('coverName')
    title = data.get('title')
    track_type = data.get('type')
    creator_id = data.get('creatorId')
    genre_id = data.get('genreId')
    artist = data.get('artist')
    category_id = data.get('categoryId')

    sanitized_title = secure_filename(title.strip())
    media_dir = MUSIC_DIR if track_type == 'audio' else VIDEO_DIR

    conn = None # Добавлена инициализация conn
    try:
        unique_id = str(int(time.time() * 1000))
        file_ext = os.path.splitext(file_name)[1]
        new_file_name = f"{unique_id}{file_ext}"
        cover_ext = os.path.splitext(cover_name)[1]
        new_cover_name = f"{unique_id}{cover_ext}"

        shutil.move(os.path.join(TEMP_UPLOAD_DIR, file_name), os.path.join(media_dir, new_file_name))
        shutil.move(os.path.join(TEMP_UPLOAD_DIR, cover_name), os.path.join(FON_DIR, new_cover_name))

        conn = get_db_connection()
        conn.execute("INSERT INTO tracks (title, file_name, cover_name, type, creator_id, genre_id, artist, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                     (title, new_file_name, new_cover_name, track_type, creator_id, genre_id, artist, category_id))
        conn.execute("DELETE FROM track_moderation WHERE id = ?", (track_id,))
        conn.commit()
        return jsonify({'message': 'Трек одобрен и добавлен в медиатеку.'})
    except Exception as e:
        print(e)
        return jsonify({'message': 'Ошибка при перемещении файлов.'}), 500
    finally:
        if conn: # Добавлена проверка на существование conn
            conn.close()

@app.route('/api/admin/reject-track/<int:track_id>', methods=['DELETE'])
@auth_required
@role_required(['admin'])
def reject_track(track_id):
    conn = get_db_connection()
    track = conn.execute("SELECT file_name, cover_name FROM track_moderation WHERE id = ?", (track_id,)).fetchone()
    if not track:
        conn.close()
        return jsonify({'message': 'Трек не найден.'}), 404
    
    try:
        os.unlink(os.path.join(TEMP_UPLOAD_DIR, track['file_name']))
        os.unlink(os.path.join(TEMP_UPLOAD_DIR, track['cover_name']))
        
        conn.execute("DELETE FROM track_moderation WHERE id = ?", (track_id,))
        conn.commit()
        return jsonify({'message': 'Трек отклонен и удален.'})
    except Exception as e:
        print(e)
        return jsonify({'message': 'Ошибка при удалении файлов.'}), 500
    finally:
        conn.close()

@app.route('/api/admin/stats')
@auth_required
@role_required(['admin'])
def admin_stats():
    conn = get_db_connection()
    user_count = conn.execute("SELECT COUNT(*) as userCount FROM users").fetchone()['userCount']
    track_count = conn.execute("SELECT COUNT(*) as trackCount FROM tracks").fetchone()['trackCount']
    conn.close()
    return jsonify({'userCount': user_count, 'trackCount': track_count})

@app.route('/api/admin/delete-user/<int:user_id>', methods=['DELETE'])
@auth_required
@role_required(['admin'])
def delete_user(user_id):
    conn = get_db_connection()
    try:
        conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
        conn.commit()
        return jsonify({'message': 'Пользователь удален.'})
    except Exception as e:
        print(e)
        return jsonify({'message': 'Ошибка при удалении пользователя.'}), 500
    finally:
        conn.close()

@app.route('/api/creator/my-tracks/<int:user_id>')
@auth_required
@role_required(['creator','admin'])
def get_creator_tracks(user_id):
    conn = get_db_connection()
    tracks = conn.execute("SELECT id, title, file_name as file, cover_name as cover, type, creator_id, (SELECT username FROM users WHERE id = tracks.creator_id) as creator_name FROM tracks WHERE creator_id = ?", (user_id,)).fetchall()
    conn.close()
    return jsonify([dict(row) for row in tracks])

@app.route('/api/creator/my-tracks/<int:track_id>', methods=['DELETE'])
@auth_required
@role_required(['creator','admin'])
def delete_creator_track(track_id):
    data = request.json
    user_id = data.get('userId')
    user_role = data.get('userRole')
    conn = get_db_connection()
    track = conn.execute("SELECT file_name, cover_name, type, creator_id FROM tracks WHERE id = ?", (track_id,)).fetchone()
    if not track:
        conn.close()
        return jsonify({'message': 'Трек не найден.'}), 404
    
    if track['creator_id'] != user_id and user_role != 'admin':
        conn.close()
        return jsonify({'message': 'Недостаточно прав.'}), 403

    try:
        media_dir = MUSIC_DIR if track['type'] == 'audio' else VIDEO_DIR
        os.unlink(os.path.join(media_dir, track['file_name']))
        os.unlink(os.path.join(FON_DIR, track['cover_name']))
        
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
    conn = get_db_connection()
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
    conn = get_db_connection()
    genres = conn.execute("SELECT * FROM genres").fetchall()
    conn.close()
    return jsonify([dict(row) for row in genres])

@app.route('/api/categories')
def get_categories():
    conn = get_db_connection()
    categories = conn.execute("SELECT * FROM categories").fetchall()
    conn.close()
    return jsonify([dict(row) for row in categories])


@app.route('/api/creator/my-categories/<int:user_id>')
@auth_required
@role_required(['creator','admin'])
def get_creator_categories(user_id):
    conn = get_db_connection()
    # Возвращаем категории, привязанные к пользователю
    categories = conn.execute("SELECT c.id, c.name FROM categories c JOIN category_users cu ON c.id = cu.category_id WHERE cu.user_id = ?", (user_id,)).fetchall()
    conn.close()
    return jsonify([dict(row) for row in categories])

@app.route('/api/admin/categories', methods=['GET', 'POST'])
@auth_required
@role_required(['admin'])
def manage_categories():
    if request.method == 'GET':
        conn = get_db_connection()
        categories = conn.execute("SELECT * FROM categories").fetchall()
        conn.close()
        return jsonify([dict(row) for row in categories])
    elif request.method == 'POST':
        data = request.json
        name = data.get('name')
        allowed_users = data.get('allowedUsers')
        conn = get_db_connection()
        try:
            conn.execute("INSERT INTO categories (name) VALUES (?)", (name,))
            category_id = conn.execute("SELECT id FROM categories WHERE name = ?", (name,)).fetchone()['id']
            for user_id in allowed_users:
                conn.execute("INSERT INTO category_users (category_id, user_id) VALUES (?, ?)", (category_id, user_id))
            conn.commit()
            return jsonify({'message': 'Категория успешно создана.'})
        except sqlite3.IntegrityError:
            return jsonify({'message': 'Категория с таким именем уже существует.'}), 400
        except Exception as e:
            print(e)
            return jsonify({'message': 'Ошибка при создании категории.'}), 500
        finally:
            conn.close()

@app.route('/api/admin/categories/<int:category_id>', methods=['PUT', 'DELETE'])
@auth_required
@role_required(['admin'])
def manage_category(category_id):
    conn = get_db_connection()
    if request.method == 'PUT':
        data = request.json
        name = data.get('name')
        allowed_users = data.get('allowedUsers')
        try:
            conn.execute("UPDATE categories SET name = ? WHERE id = ?", (name, category_id))
            conn.execute("DELETE FROM category_users WHERE category_id = ?", (category_id,))
            for user_id in allowed_users:
                conn.execute("INSERT INTO category_users (category_id, user_id) VALUES (?, ?)", (category_id, user_id))
            conn.commit()
            return jsonify({'message': 'Категория успешно обновлена.'})
        except Exception as e:
            print(e)
            return jsonify({'message': 'Ошибка при обновлении категории.'}), 500
        finally:
            conn.close()
    elif request.method == 'DELETE':
        try:
            conn.execute("DELETE FROM categories WHERE id = ?", (category_id,))
            conn.commit()
            return jsonify({'message': 'Категория успешно удалена.'})
        except Exception as e:
            print(e)
            return jsonify({'message': 'Ошибка при удалении категории.'}), 500
        finally:
            conn.close()


@app.route('/api/admin/categories/users', methods=['GET'])
@auth_required
@role_required(['creator','admin'])
def get_users_for_categories():
    query = request.args.get('q', '')
    conn = get_db_connection()
    # Возвращаем всех пользователей, а не только креаторов
    users = conn.execute("SELECT id, username, role FROM users WHERE username LIKE ? LIMIT 10", ('%' + query + '%',)).fetchall()
    conn.close()
    return jsonify([dict(user) for user in users])

@app.route('/api/admin/categories/users-in-category/<int:category_id>', methods=['GET'])
@auth_required
@role_required(['creator','admin'])
def get_users_in_category(category_id):
    conn = get_db_connection()
    users = conn.execute("SELECT u.id, u.username FROM users u JOIN category_users cu ON u.id = cu.user_id WHERE cu.category_id = ?", (category_id,)).fetchall()
    conn.close()
    return jsonify([dict(user) for user in users])

@app.route('/api/update-playback', methods=['POST'])
def update_playback():
    data = request.json
    user_id = data.get('userId')
    track_id = data.get('trackId')
    current_time = data.get('currentTime')
    duration = data.get('duration')
    timestamp = int(time.time())
    
    conn = get_db_connection()
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
def get_xrecomen(user_id):
    conn = get_db_connection()
    
    # Получаем список избранных треков пользователя
    user_favorites = conn.execute("SELECT media_file FROM favorites WHERE user_id = ?", (user_id,)).fetchall()
    favorite_media_files = [row['media_file'] for row in user_favorites]
    
    # Формируем список "Вам нравятся" на основе избранного
    you_like_tracks = []
    if favorite_media_files:
        placeholder = ','.join('?' for _ in favorite_media_files)
        you_like_tracks = conn.execute(f"SELECT id, title, file_name as file, cover_name as cover, type, artist, creator_id, (SELECT username FROM users WHERE id = tracks.creator_id) as creator_name FROM tracks WHERE file_name IN ({placeholder}) ORDER BY RANDOM() LIMIT 5", favorite_media_files).fetchall()
        you_like_tracks = [dict(row) for row in you_like_tracks]

    # Определяем предпочтения на основе последних прослушиваний (если нет избранного)
    user_played_tracks = conn.execute("SELECT p.listened_duration, t.duration, t.genre_id, t.artist, t.id FROM plays p JOIN tracks t ON p.track_id = t.id WHERE p.user_id = ? ORDER BY p.timestamp DESC LIMIT 20", (user_id,)).fetchall()
    
    played_track_ids = [t['id'] for t in user_played_tracks]
    
    # Если нет избранных треков, берем случайные из общей медиатеки
    if not you_like_tracks:
        you_like_tracks = conn.execute("SELECT id, title, file_name as file, cover_name as cover, type, artist, creator_id, (SELECT username FROM users WHERE id = tracks.creator_id) as creator_name FROM tracks ORDER BY RANDOM() LIMIT 5").fetchall()
        you_like_tracks = [dict(row) for row in you_like_tracks]

    xrecomen_track = None
    you_may_like_tracks = []

    # Формируем список "Вам могут понравиться" из случайных треков
    you_may_like_query = "SELECT id, title, file_name as file, cover_name as cover, type, artist, creator_id, (SELECT username FROM users WHERE id = tracks.creator_id) as creator_name FROM tracks"
    if played_track_ids:
        you_may_like_query += f" WHERE id NOT IN ({','.join(['?'] * len(played_track_ids))})"
    you_may_like_tracks = conn.execute(you_may_like_query + " ORDER BY RANDOM() LIMIT 6", played_track_ids).fetchall()
    you_may_like_tracks = [dict(row) for row in you_may_like_tracks]
    
    if you_may_like_tracks:
        xrecomen_track = random.choice(you_may_like_tracks)
        # Удаляем трек из списка, чтобы избежать дублирования
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

@app.route('/api/auth_refresh')
def auth_refresh():
    #f"d{hashlib.sha256(user["password"].encode("utf-8")).hexdigest()}c34f"
    return jsonify({'message':"NOT INPLEMENTED -Server"}), 418

if __name__ == '__main__':
    app.run(port=3000, debug=True)
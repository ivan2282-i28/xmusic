from flask import Flask, request, jsonify, send_from_directory
import sqlite3
import os
import shutil
import time
from werkzeug.utils import secure_filename
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Настройка директорий
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MUSIC_DIR = os.path.join(BASE_DIR, 'music')
FON_DIR = os.path.join(BASE_DIR, 'fon')
VIDEO_DIR = os.path.join(BASE_DIR, 'video')
TEMP_UPLOAD_DIR = os.path.join(BASE_DIR, 'temp_uploads')

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
            FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE SET NULL,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS plays (
            user_id INTEGER NOT NULL,
            track_id INTEGER NOT NULL,
            timestamp INTEGER NOT NULL,
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
    c.execute("SELECT * FROM users WHERE username = 'DomRU'")
    if c.fetchone() is None:
        c.execute("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ('DomRU', '12345', 'admin'))

    # Добавление стандартных жанров
    genres = ['Рок', 'Метал', 'Фонк', 'Поп', 'Электронная', 'Хип-хоп']
    for genre in genres:
        c.execute("INSERT OR IGNORE INTO genres (name) VALUES (?)", (genre,))
    
    # Добавление стандартных категорий
    categories = ['Общие', 'Популярные', 'Для вас', 'Возможно вам понравится']
    for category in categories:
        c.execute("INSERT OR IGNORE INTO categories (name) VALUES (?)", (category,))

    # Добавление тестовых треков
    c.execute("SELECT COUNT(*) FROM tracks")
    if c.fetchone()[0] == 0:
        test_tracks = [
            ('Five Nights at Freddy\'s Song', 'fnaf.mp3', 'fnaf_cover.jpg', 'audio', 1, 1, 'The Living Tombstone', 1),
            ('Bad Apple!!', 'bad_apple.mp4', 'bad_apple_cover.jpg', 'video', 1, 5, 'Alstroemeria Records', 1),
            ('Darth Revan Theme', 'revan.mp3', 'revan_cover.jpg', 'audio', 1, 2, 'Star Wars Music', 1),
            ('Phonk Test Track', 'phonk.mp3', 'phonk_cover.jpg', 'audio', 1, 3, 'Phonk Artist', 1),
            ('Test Pop Song', 'pop.mp3', 'pop_cover.jpg', 'audio', 1, 4, 'Pop Star', 1),
            ('Space Funk', 'space_funk.mp3', 'space_funk_cover.jpg', 'audio', 1, 5, 'Cosmic Beats', 1),
            ('Shadows', 'shadows.mp3', 'shadows_cover.jpg', 'audio', 1, 2, 'Dark Metal Band', 1),
        ]
        c.executemany("INSERT INTO tracks (title, file_name, cover_name, type, creator_id, genre_id, artist, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", test_tracks)
    
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

@app.route('/')
def serve_index():
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory(BASE_DIR, filename)

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

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    conn = get_db_connection()
    try:
        conn.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
        conn.commit()
        return jsonify({'message': 'Регистрация прошла успешно!'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Пользователь с таким именем уже существует.'}), 400
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    conn = get_db_connection()
    user = conn.execute("SELECT id, username, role FROM users WHERE username = ? AND password = ?", (username, password)).fetchone()
    conn.close()
    if user:
        return jsonify({'message': 'Вход выполнен!', 'user': dict(user)})
    else:
        return jsonify({'message': 'Неверный логин или пароль.'}), 401

@app.route('/api/favorites/<int:user_id>')
def get_favorites(user_id):
    conn = get_db_connection()
    favorites = conn.execute("SELECT media_file FROM favorites WHERE user_id = ?", (user_id,)).fetchall()
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
    tracks = conn.execute("SELECT t.id, t.title, t.file_name as file, t.cover_name as cover, t.type, t.plays, g.name as genre, u.username as creator_name, t.artist FROM tracks t LEFT JOIN genres g ON t.genre_id = g.id LEFT JOIN users u ON t.creator_id = u.id").fetchall()
    conn.close()
    return jsonify([dict(row) for row in tracks])

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
def admin_applications():
    conn = get_db_connection()
    applications = conn.execute("SELECT a.id, a.full_name, a.phone_number, a.email, a.status, u.username, a.user_id FROM creator_applications a JOIN users u ON a.user_id = u.id WHERE a.status = 'pending'").fetchall()
    conn.close()
    return jsonify([dict(row) for row in applications])

@app.route('/api/admin/approve-application', methods=['POST'])
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
def admin_users():
    conn = get_db_connection()
    users = conn.execute("SELECT id, username, role FROM users").fetchall()
    conn.close()
    return jsonify([dict(row) for row in users])

@app.route('/api/admin/update-role', methods=['POST'])
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
def admin_moderation_tracks():
    conn = get_db_connection()
    tracks = conn.execute("SELECT m.id, m.file_name, m.cover_name, m.title, m.type, u.username, m.user_id, m.artist, m.genre_id, g.name as genre_name FROM track_moderation m JOIN users u ON m.user_id = u.id LEFT JOIN genres g ON m.genre_id = g.id WHERE m.status = 'pending'").fetchall()
    conn.close()
    return jsonify([dict(row) for row in tracks])

@app.route('/api/admin/approve-track', methods=['POST'])
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

    try:
        file_ext = os.path.splitext(file_name)[1]
        new_file_name = f"{sanitized_title}{file_ext}"
        cover_ext = os.path.splitext(cover_name)[1]
        new_cover_name = f"{sanitized_title}{cover_ext}"

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
        conn.close()

@app.route('/api/admin/reject-track/<int:track_id>', methods=['DELETE'])
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
def admin_stats():
    conn = get_db_connection()
    user_count = conn.execute("SELECT COUNT(*) as userCount FROM users").fetchone()['userCount']
    track_count = conn.execute("SELECT COUNT(*) as trackCount FROM tracks").fetchone()['trackCount']
    conn.close()
    return jsonify({'userCount': user_count, 'trackCount': track_count})

@app.route('/api/admin/delete-user/<int:user_id>', methods=['DELETE'])
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
def get_creator_tracks(user_id):
    conn = get_db_connection()
    tracks = conn.execute("SELECT id, title, file_name as file, cover_name as cover, type FROM tracks WHERE creator_id = ?", (user_id,)).fetchall()
    conn.close()
    return jsonify([dict(row) for row in tracks])

@app.route('/api/creator/my-tracks/<int:track_id>', methods=['DELETE'])
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
def creator_stats(user_id):
    conn = get_db_connection()
    track_count = conn.execute("SELECT COUNT(*) as trackCount FROM tracks WHERE creator_id = ?", (user_id,)).fetchone()['trackCount']
    conn.close()
    return jsonify({'trackCount': track_count})

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
def get_creator_categories(user_id):
    conn = get_db_connection()
    categories = conn.execute("SELECT c.id, c.name FROM categories c JOIN category_users cu ON c.id = cu.category_id WHERE cu.user_id = ? OR c.name = 'Общие'", (user_id,)).fetchall()
    conn.close()
    return jsonify([dict(row) for row in categories])

@app.route('/api/admin/categories', methods=['POST'])
def create_category():
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

@app.route('/api/update-plays', methods=['POST'])
def update_plays():
    data = request.json
    user_id = data.get('userId')
    track_id = data.get('trackId')
    timestamp = int(time.time())

    conn = get_db_connection()
    try:
        # Проверка на лимит прослушиваний (не более 5 раз в день)
        start_of_day = timestamp - (timestamp % 86400)
        play_count_today = conn.execute("SELECT COUNT(*) FROM plays WHERE user_id = ? AND track_id = ? AND timestamp >= ?", (user_id, track_id, start_of_day)).fetchone()[0]
        
        if play_count_today < 5:
            conn.execute("INSERT INTO plays (user_id, track_id, timestamp) VALUES (?, ?, ?)", (user_id, track_id, timestamp))
            conn.execute("UPDATE tracks SET plays = plays + 1 WHERE id = ?", (track_id,))
            conn.commit()
            return jsonify({'message': 'Счетчик прослушиваний обновлен.'})
        else:
            return jsonify({'message': 'Достигнут лимит прослушиваний на сегодня.'}), 429
    except Exception as e:
        print(e)
        return jsonify({'message': 'Ошибка при обновлении счетчика.'}), 500
    finally:
        conn.close()

@app.route('/api/creator/analytics/<int:user_id>')
def creator_analytics(user_id):
    conn = get_db_connection()
    # Общее количество прослушиваний
    total_plays = conn.execute("SELECT SUM(t.plays) FROM tracks t WHERE t.creator_id = ?", (user_id,)).fetchone()[0] or 0

    # Прослушивания за последние 14 дней
    two_weeks_ago = int(time.time()) - 14 * 86400
    daily_plays = conn.execute("SELECT strftime('%Y-%m-%d', datetime(timestamp, 'unixepoch')) as date, COUNT(*) as count FROM plays WHERE track_id IN (SELECT id FROM tracks WHERE creator_id = ?) AND timestamp >= ? GROUP BY date ORDER BY date", (user_id, two_weeks_ago)).fetchall()
    
    # Статистика по трекам
    track_stats = conn.execute("SELECT id, title, plays FROM tracks WHERE creator_id = ? ORDER BY plays DESC", (user_id,)).fetchall()

    conn.close()
    
    return jsonify({
        'totalPlays': total_plays,
        'dailyPlays': [dict(row) for row in daily_plays],
        'trackStats': [dict(row) for row in track_stats]
    })

@app.route('/api/xrecomen/<int:user_id>')
def get_xrecomen(user_id):
    conn = get_db_connection()
    
    # Алгоритм рекомендаций
    # 1. Любимые жанры и исполнители (на основе истории прослушиваний)
    user_played_tracks = conn.execute("SELECT t.genre_id, t.artist, t.title FROM plays p JOIN tracks t ON p.track_id = t.id WHERE p.user_id = ? GROUP BY t.id ORDER BY COUNT(*) DESC LIMIT 20", (user_id,)).fetchall()
    
    preferred_genres = [t['genre_id'] for t in user_played_tracks if t['genre_id']]
    preferred_artists = [t['artist'] for t in user_played_tracks if t['artist']]
    
    recomended_tracks = []
    
    if user_played_tracks:
        # Рекомендации "Вам нравятся" (похожие по жанру и названию)
        liked_tracks = conn.execute("SELECT t.id, t.title, t.file_name as file, t.cover_name as cover, t.type, t.artist FROM tracks t WHERE (t.genre_id IN ({}) OR t.artist IN ({}) OR t.title LIKE '%Fnaf version%') AND t.id NOT IN (SELECT track_id FROM plays WHERE user_id = ?) ORDER BY RANDOM() LIMIT 6".format(
            ','.join(['?'] * len(preferred_genres)),
            ','.join(['?'] * len(preferred_artists))
        ), preferred_genres + preferred_artists + [user_id]).fetchall()
        recomended_tracks.extend([dict(row) for row in liked_tracks])

    # Если рекомендаций нет или их мало, добавим случайные
    if len(recomended_tracks) < 6:
        all_tracks = conn.execute("SELECT t.id, t.title, t.file_name as file, t.cover_name as cover, t.type, t.artist FROM tracks t ORDER BY RANDOM() LIMIT 6").fetchall()
        recomended_tracks = [dict(row) for row in all_tracks]

    # Любимые подборки (популярные категории, в которых пользователь слушал треки)
    favorite_collections = conn.execute("SELECT c.id, c.name, COUNT(t.id) as track_count FROM categories c JOIN tracks t ON c.id = t.category_id JOIN plays p ON t.id = p.track_id WHERE p.user_id = ? GROUP BY c.id ORDER BY track_count DESC LIMIT 6", (user_id,)).fetchall()

    conn.close()
    return jsonify({
        'xrecomenTrack': recomended_tracks[0] if recomended_tracks else None,
        'youLike': recomended_tracks[1:7] if len(recomended_tracks) > 1 else [],
        'youMayLike': [], # Этот блок пока пустой, мы реализуем его позже
        'favoriteCollections': [dict(row) for row in favorite_collections]
    })

if __name__ == '__main__':
    app.run(port=3000, debug=True)
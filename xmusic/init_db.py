# init_db.py
import sqlite3
import os
from werkzeug.security import generate_password_hash
from dotenv import load_dotenv

# Загружаем переменные окружения (например, для пароля root)
load_dotenv()

BASE_DIR = os.path.abspath(os.path.curdir)
DB_PATH = os.path.join(BASE_DIR, 'database.db')

def init_db():
    """Функция для инициализации и миграции базы данных."""
    print("Connecting to the database...")
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    print("Database connected. Creating tables if they don't exist...")

    # --- Создание таблиц ---
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            refresh_token TEXT
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
            genre TEXT,
            artist TEXT,
            category_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
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
            genre TEXT,
            artist TEXT,
            category_id INTEGER,
            plays INTEGER DEFAULT 0,
            duration REAL,
            FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
        )
    ''')

    c.execute("PRAGMA table_info(tracks)")
    columns = [column[1] for column in c.fetchall()]
    if 'duration' not in columns:
        try:
            c.execute("ALTER TABLE tracks ADD COLUMN duration REAL")
            print("Added 'duration' column to 'tracks' table.")
        except Exception:
            pass

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
    c.execute('''
        CREATE TABLE IF NOT EXISTS password_change_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            admin_user_id INTEGER NOT NULL,
            admin_username TEXT NOT NULL,
            target_user_id INTEGER NOT NULL,
            target_username TEXT NOT NULL,
            ip_address TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE SET NULL,
            FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL
        )
    ''')
    print("Tables created successfully.")

    # --- Миграция паролей и создание root ---
    print("Starting password migration...")
    users_to_migrate = c.execute("SELECT id, password FROM users WHERE password NOT LIKE 'pbkdf2:%'").fetchall()
    if not users_to_migrate:
        print("No passwords to migrate.")
    else:
        for user in users_to_migrate:
            hashed_password = generate_password_hash(user['password'])
            c.execute("UPDATE users SET password = ? WHERE id = ?", (hashed_password, user['id']))
            print(f"Migrated password for user ID: {user['id']}")

    root_password_env = os.getenv('ROOT_PASSWORD')
    if root_password_env:
        hashed_admin_password = generate_password_hash(root_password_env)
        c.execute("SELECT id FROM users WHERE username = 'root'")
        admin_user = c.fetchone()
        if admin_user:
            c.execute("UPDATE users SET password = ?, role = 'admin' WHERE username = 'root'", (hashed_admin_password,))
            print("Password for user 'root' was updated from environment variable.")
        else:
            c.execute("INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
                      ('root', hashed_admin_password, 'admin'))
            print("User 'root' created with password from environment variable.")
    else:
        print("ROOT_PASSWORD not set — skipping automatic root creation/update.")

    conn.commit()
    conn.close()
    print("Database initialization and migration finished successfully.")

if __name__ == '__main__':
    init_db()
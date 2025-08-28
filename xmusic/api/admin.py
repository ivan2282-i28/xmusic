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

def admin_api(app,db,auth_required,role_required,dirs):

    @app.route('/api/admin/applications')
    @auth_required
    @role_required(['admin'])
    def admin_applications():
        conn = db.get_db_connection()
        applications = conn.execute("SELECT a.id, a.full_name, a.phone_number, a.email, a.status, u.username, a.user_id FROM creator_applications a JOIN users u ON a.user_id = u.id WHERE a.status = 'pending'").fetchall()
        conn.close()
        return jsonify([dict(row) for row in applications])

    @app.route('/api/admin/approve-application', methods=['POST'])
    @auth_required
    @role_required(['admin'])
    def approve_application():
        data = request.json
        user_id = data.get('userId')
        conn = db.get_db_connection()
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
        conn = db.get_db_connection()
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
        conn = db.get_db_connection()
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
        conn = db.get_db_connection()
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
        conn = db.get_db_connection()
        try:
            conn.execute("UPDATE users SET password = ? WHERE id = ?", (new_password, user_id))
            conn.commit()
            return jsonify({'message': 'Пароль успешно изменен.'})
        except Exception as e:
            print(e)
            return jsonify({'message': 'Ошибка при смене пароля.'}), 500
        finally:
            conn.close()
    
    @app.route('/api/admin/moderation-tracks')
    @auth_required
    @role_required(['admin'])
    def admin_moderation_tracks():
        conn = db.get_db_connection()
        tracks = conn.execute("SELECT m.id, m.file_name, m.cover_name, m.title, m.type, u.username, m.user_id, m.artist, m.genre, m.category_id FROM track_moderation m JOIN users u ON m.user_id = u.id WHERE m.status = 'pending'").fetchall()
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
        genre = data.get('genre')
        artist = data.get('artist')
        category_id = data.get('categoryId')

        sanitized_title = secure_filename(title.strip())
        media_dir = dirs["MUSIC_DIR"] if track_type == 'audio' else dirs["VIDEO_DIR"]

        conn = None
        try:
            unique_id = str(int(time.time() * 1000))
            file_ext = os.path.splitext(file_name)[1]
            new_file_name = f"{unique_id}{file_ext}"
            cover_ext = os.path.splitext(cover_name)[1]
            new_cover_name = f"{unique_id}{cover_ext}"

            shutil.move(os.path.join(dirs["TEMP_UPLOAD_DIR"], file_name), os.path.join(media_dir, new_file_name))
            shutil.move(os.path.join(dirs["TEMP_UPLOAD_DIR"], cover_name), os.path.join(dirs["FON_DIR"], new_cover_name))

            conn = db.get_db_connection()
            conn.execute("INSERT INTO tracks (title, file_name, cover_name, type, creator_id, genre, artist, category_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                        (title, new_file_name, new_cover_name, track_type, creator_id, genre, artist, category_id))
            conn.execute("DELETE FROM track_moderation WHERE id = ?", (track_id,))
            conn.commit()
            return jsonify({'message': 'Трек одобрен и добавлен в медиатеку.'})
        except Exception as e:
            print(e)
            return jsonify({'message': 'Ошибка при перемещении файлов.'}), 500
        finally:
            if conn:
                conn.close()

    @app.route('/api/admin/reject-track/<int:track_id>', methods=['DELETE'])
    @auth_required
    @role_required(['admin'])
    def reject_track(track_id):
        conn = db.get_db_connection()
        track = conn.execute("SELECT file_name, cover_name FROM track_moderation WHERE id = ?", (track_id,)).fetchone()
        if not track:
            conn.close()
            return jsonify({'message': 'Трек не найден.'}), 404
        
        try:
            os.unlink(os.path.join(dirs["TEMP_UPLOAD_DIR"], track['file_name']))
            os.unlink(os.path.join(dirs["TEMP_UPLOAD_DIR"], track['cover_name']))
            
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
        conn = db.get_db_connection()
        user_count = conn.execute("SELECT COUNT(*) as userCount FROM users").fetchone()['userCount']
        track_count = conn.execute("SELECT COUNT(*) as trackCount FROM tracks").fetchone()['trackCount']
        conn.close()
        return jsonify({'userCount': user_count, 'trackCount': track_count})

    @app.route('/api/admin/delete-user/<int:user_id>', methods=['DELETE'])
    @auth_required
    @role_required(['admin'])
    def delete_user(user_id):
        conn = db.get_db_connection()
        try:
            conn.execute("DELETE FROM users WHERE id = ?", (user_id,))
            conn.commit()
            return jsonify({'message': 'Пользователь удален.'})
        except Exception as e:
            print(e)
            return jsonify({'message': 'Ошибка при удалении пользователя.'}), 500
        finally:
            conn.close()

    @app.route('/api/admin/categories', methods=['GET', 'POST'])
    @auth_required
    @role_required(['admin'])
    def manage_categories():
        if request.method == 'GET':
            conn = db.get_db_connection()
            categories = conn.execute("SELECT * FROM categories").fetchall()
            conn.close()
            return jsonify([dict(row) for row in categories])
        elif request.method == 'POST':
            data = request.json
            name = data.get('name')
            allowed_users = data.get('allowedUsers')
            conn = db.get_db_connection()
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
        conn = db.get_db_connection()
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
        conn = db.get_db_connection()
        users = conn.execute("SELECT id, username, role FROM users WHERE username LIKE ? LIMIT 10", ('%' + query + '%',)).fetchall()
        conn.close()
        return jsonify([dict(user) for user in users])

    @app.route('/api/admin/categories/users-in-category/<int:category_id>', methods=['GET'])
    @auth_required
    @role_required(['creator','admin'])
    def get_users_in_category(category_id):
        conn = db.get_db_connection()
        users = conn.execute("SELECT u.id, u.username FROM users u JOIN category_users cu ON u.id = cu.user_id WHERE cu.category_id = ?", (category_id,)).fetchall()
        conn.close()
        return jsonify([dict(user) for user in users])
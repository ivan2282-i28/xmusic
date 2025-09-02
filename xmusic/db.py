# db.py
import sqlite3
import os
# Import functions for hashing from werkzeug - ОСТАВЛЯЕМ, ТАК КАК ЭТО МОЖЕТ ИСПОЛЬЗОВАТЬСЯ В ДРУГИХ МЕСТАХ
from werkzeug.security import generate_password_hash

class database():
    def __init__(self, db_path):
        """
        Конструктор теперь только сохраняет путь к базе данных.
        Инициализация и миграция выполняются отдельно через скрипт init_db.py.
        """
        self.db_path = db_path
        # self.init_db()  <-- УДАЛЯЕМ ЭТУ СТРОКУ

    def get_db_connection(self):
        """Этот метод остается без изменений."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    # ВЕСЬ МЕТОД init_db() НИЖЕ МОЖНО ПОЛНОСТЬЮ УДАЛИТЬ ИЗ ЭТОГО ФАЙЛА
    # def init_db(self):
    #     ...
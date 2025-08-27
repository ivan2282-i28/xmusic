from flask import Flask, request, jsonify, send_from_directory
from .db import database
import os
from flask_cors import CORS
from dotenv import load_dotenv
import joblib
import librosa
import numpy as np
from .webserver import webserver

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

# Настройка директорий

BASE_DIR = os.path.abspath(os.path.curdir)

dirs = {
    "BASE_DIR" : os.path.abspath(os.path.curdir),
    "MUSIC_DIR" : os.path.join(BASE_DIR, 'music'),
    "FON_DIR" : os.path.join(BASE_DIR, 'fon'),
    "VIDEO_DIR" : os.path.join(BASE_DIR, 'video'),
    "TEMP_UPLOAD_DIR" : os.path.join(BASE_DIR, 'temp_uploads'),
    "INDEX_DIR" : os.path.join(BASE_DIR, 'index'),
    "MODEL_PATH" : os.path.join(BASE_DIR, 'music_genre_model.pkl'),
}

# Создание директорий, если они не существуют
for directory in dirs.items():
    directory = directory[1]
    if not os.path.exists(directory):
        os.makedirs(directory)

# Загрузка модели ИИ
try:
    with open(dirs["MODEL_PATH"], 'rb') as model_file:
        model = joblib.load(model_file)  # Заменено pickle на joblib
except FileNotFoundError:
    model = None
    print(f"Model file not found at {dirs["MODEL_PATH"]}. AI genre detection will not be available.")
except Exception as e:
    model = None
    print(f"Failed to load the model: {e}. AI genre detection will not be available.")


# Определение списка жанров
GENRES = ['блюз', 'джас', 'диско', 'инди', 'кантри', 'метал', 'поп', 'регги', 'рок', 'рэп', 'соул', 'техно', 'трэп', 'фонк', 'хаус', 'Хип-хоп', 'электронная', 'эмбиент']


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


# Настройка базы данных
db = database(os.path.join(BASE_DIR, 'database.db'))

# Защита путей
app.config['UPLOAD_FOLDER'] = {
    'music': dirs["MUSIC_DIR"],
    'fon': dirs["FON_DIR"],
    'video': dirs["VIDEO_DIR"],
    'temp_uploads': dirs["TEMP_UPLOAD_DIR"]
}

webserver(app,db,dirs)

if __name__ == '__main__':
    app.run()
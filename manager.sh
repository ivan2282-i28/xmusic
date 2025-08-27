#!/bin/bash

SCRIPT_DIR=$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")
cd "$SCRIPT_DIR"
ls
if [ ! -d "./.venv" ]; then
    python3.13 -m venv .venv
fi

source ./.venv/bin/activate

echo "installing requirements"
pip install -r requirements.txt

echo "running program"
rm app.log
gunicorn -w 4 -b 0.0.0.0:3000 xmusic:app --error-logfile app.log
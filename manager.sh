#/bin/bash

SCRIPT_DIR=$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")
cd "$SCRIPT_DIR"

if [ ! -d "./.venv" ]; then
    python3.11 -m venv .venv
fi

source ./.venv/bin/activate

pip install -r requirements.txt

python ./app.py
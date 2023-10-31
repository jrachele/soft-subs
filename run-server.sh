#!/usr/bin/env bash
python -m venv .env/
source .env/bin/activate
pip install -r requirements.txt
export FLASK_APP=server/server.py
flask run
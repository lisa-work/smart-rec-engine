import os
from http import HTTPStatus
from pathlib import Path

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS
from supabase import create_client

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env", override=True)

SUPABASE_URL = os.getenv("SUPABASE_URL", "") or os.getenv("VITE_SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "") or os.getenv("VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY", "")

app = Flask(__name__)
CORS(app)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None


@app.get("/api/health")
def health_check():
    return jsonify({"status": "ok", "service": "flask-backend"}), HTTPStatus.OK


@app.get("/api/supabase/health")
def supabase_health_check():
    if not supabase:
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "Missing SUPABASE_URL or SUPABASE_KEY in backend/.env",
                }
            ),
            HTTPStatus.INTERNAL_SERVER_ERROR,
        )

    rest_endpoint = f"{SUPABASE_URL.rstrip('/')}/rest/v1/"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
    }

    try:
        response = requests.get(rest_endpoint, headers=headers, timeout=10)
        return (
            jsonify(
                {
                    "status": "ok" if response.ok else "error",
                    "supabase_status_code": response.status_code,
                    "project_url": SUPABASE_URL,
                }
            ),
            HTTPStatus.OK if response.ok else HTTPStatus.BAD_GATEWAY,
        )
    except requests.RequestException as exc:
        return (
            jsonify(
                {
                    "status": "error",
                    "message": "Failed to reach Supabase REST endpoint",
                    "details": str(exc),
                }
            ),
            HTTPStatus.BAD_GATEWAY,
        )


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "0") == "1"
    app.run(host="0.0.0.0", port=port, debug=debug)

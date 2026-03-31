import os
from http import HTTPStatus
from pathlib import Path

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client

# =========================
# Setup
# =========================
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env", override=True)

SUPABASE_URL = os.getenv("SUPABASE_URL", "") or os.getenv("VITE_SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "") or os.getenv("VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY", "")

OMDB_API_KEY = os.getenv("OMDB_API_KEY", "")

app = Flask(__name__)
CORS(app)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

# Simple in-memory cache
movie_cache = {}

# =========================
# Helpers
# =========================
def error_response(message, code=400, error_code="GENERIC_ERROR"):
    return jsonify({
        "success": False,
        "error": {
            "code": error_code,
            "message": message
        }
    }), code

# =========================
# Health
# =========================
@app.get("/api/health")
def health_check():
    return jsonify({"status": "ok"}), HTTPStatus.OK

@app.get("/api/supabase/health")
def supabase_health_check():
    if not supabase:
        return jsonify({"status": "error", "message": "Supabase not configured"}), 500
    try:
        res = supabase.table("movies").select("imdb_id").limit(1).execute()
        return jsonify({"status": "ok", "data": res.data})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# =========================
# MOVIES (OMDb + Supabase)
# =========================

@app.get("/api/movies/search")
def search_movies():
    query = request.args.get("q", "")
    page = request.args.get("page", 1)
    if not query:
        return error_response("Missing search query", 400, "MISSING_QUERY")

    url = f"http://www.omdbapi.com/?s={query}&page={page}&apikey={OMDB_API_KEY}"

    try:
        res = requests.get(url).json()
        # HANDLE OMDb ERRORS
        if res.get("Response") == "False":
            error_msg = res.get("Error", "Unknown error")
            if "limit" in error_msg.lower():
                return error_response("OMDb request limit reached", 429, "RATE_LIMIT")
            return error_response(error_msg, 400, "OMDB_ERROR")
        # SUCCESS RESPONSE
        return jsonify({"success": True, "data": res})

    except Exception as e:
        return error_response(str(e), 500, "SERVER_ERROR")


@app.get("/api/movies/<imdb_id>")
def get_movie(imdb_id):

    # 1. Cache check
    if imdb_id in movie_cache:
        return jsonify(movie_cache[imdb_id])

    # 2. DB check
    if supabase:
        existing = supabase.table("movies").select("*").eq("imdb_id", imdb_id).execute()
        if existing.data:
            movie_cache[imdb_id] = existing.data[0]
            return jsonify(existing.data[0])

    # 3. Fetch from OMDb
    url = f"http://www.omdbapi.com/?i={imdb_id}&apikey={OMDB_API_KEY}"
    data = requests.get(url).json()
    if data.get("Response") == "False":
        return error_response("Movie not found", 404, "NOT_FOUND")

    movie = {
        "imdb_id": data.get("imdbID"),
        "title": data.get("Title"),
        "year": int(data.get("Year")) if data.get("Year", "").isdigit() else None,
        "rated": data.get("Rated"),
        "runtime": data.get("Runtime"),
        "genre": data.get("Genre"),
        "director": data.get("Director"),
        "actors": data.get("Actors"),
        "plot": data.get("Plot"),
        "language": data.get("Language"),
        "poster": data.get("Poster"),
        "metascore": int(data.get("Metascore")) if data.get("Metascore") not in ("N/A", None) else None,
        "imdb_rating": float(data.get("imdbRating")) if data.get("imdbRating") not in ("N/A", None) else None,
        "ratings": data.get("Ratings"),
    }
    # Save to DB
    if supabase:
        supabase.table("movies").upsert(movie).execute()
    # Cache it
    movie_cache[imdb_id] = movie
    return jsonify({
        "success": True,
        "data": movie
    })


# =========================
# RATINGS (CRUD)
# =========================

@app.post("/api/ratings")
def create_rating():
    if not supabase:
        return error_response("Database not configured", 500)
        
    data = request.json
    if not data:
        return error_response("Missing body")

    movie_id = data.get("movie_id")
    rating = data.get("rating")
    user_id = data.get("user_id", "demo-user")  # placeholder


    if not movie_id or rating is None:
        return error_response("Missing movie_id or rating")
    if not isinstance(rating, (int, float)) or not (0 <= rating <= 5):
        return error_response("Rating must be between 0 and 5")

    record = {
        "movie_id": movie_id,
        "rating": rating,
        "user_id": user_id
    }
    res = supabase.table("ratings").insert(record).execute()
    return jsonify(res.data), 201


@app.get("/api/ratings")
def get_ratings():
    if not supabase:
        return error_response("Database not configured", 500)

    user_id = request.args.get("user_id", "demo-user")
    res = supabase.table("ratings").select("*").eq("user_id", user_id).execute()
    return jsonify(res.data)


@app.put("/api/ratings/<int:rating_id>")
def update_rating(rating_id):
    if not supabase:
        return error_response("Database not configured", 500)
    data = request.json
    rating = data.get("rating")

    if rating is None:
        return error_response("Missing rating")
    if not isinstance(rating, (int, float)) or not (0 <= rating <= 5):
        return error_response("Rating must be between 0 and 5")

    res = supabase.table("ratings").update({"rating": rating}).eq("id", rating_id).execute()
    return jsonify(res.data)


@app.delete("/api/ratings/<int:rating_id>")
def delete_rating(rating_id):
    if not supabase:
        return error_response("Database not configured", 500)
        
    res = supabase.table("ratings").delete().eq("id", rating_id).execute()
    return jsonify({"deleted": True})


# =========================
# RECOMMENDATIONS
# =========================

@app.get("/api/recommendations")
def recommendations():
    if not supabase:
        return error_response("Database not configured", 500)

    user_id = request.args.get("user_id", "demo-user")
    ratings_res = supabase.table("ratings").select("*").eq("user_id", user_id).execute()
    ratings = ratings_res.data
    if not ratings:
        return jsonify([])

    # Find liked movies (rating >= 4)
    liked = [r for r in ratings if r["rating"] >= 4]
    if not liked:
        return jsonify([])

    # Get their genres
    genres = []
    for r in liked:
        movie = supabase.table("movies").select("*").eq("imdb_id", r["movie_id"]).execute().data
        if movie:
            genres.extend((movie[0].get("genre") or "").split(", "))
    genre_count = {}
    for g in genres:
        genre_count[g] = genre_count.get(g, 0) + 1

    # Get candidate movies
    movies = supabase.table("movies").select("*").limit(100).execute().data

    # Exclude already rated
    rated_ids = {r["movie_id"] for r in ratings}

    candidates = [m for m in movies if m["imdb_id"] not in rated_ids]

    # Score
    def score(movie):
        score = 0
        for g in (movie.get("genre") or "").split(", "):
            score += genre_count.get(g, 0)
        score += (movie.get("imdb_rating") or 0) * 0.5
        return score

    ranked = sorted(candidates, key=score, reverse=True)
    return jsonify(ranked[:5])


# =========================
# RUN
# =========================
@app.errorhandler(Exception)
def handle_exception(e):
    print("Server Error:", str(e))
    return jsonify({
        "success": False,
        "error": {
            "code": "SERVER_ERROR",
            "message": str(e)
        }
    }), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "0") == "1"
    app.run(host="0.0.0.0", port=port, debug=debug)
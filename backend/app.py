import os
import time
from pathlib import Path

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client
from jose import jwt

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

# =========================
# Cache System with TTL
# =========================
class CacheManager:
    """Cache manager with TTL (time-to-live) support"""
    def __init__(self):
        self.cache = {}
        self.ttl = {}
    
    def get(self, key, default_ttl=3600):
        """Get a cached value if it exists and hasn't expired (default 1 hour TTL)"""
        if key not in self.cache:
            return None
        expiry = self.ttl.get(key, float('inf'))
        if time.time() > expiry:
            self.delete(key)
            return None
        return self.cache[key]
    
    def set(self, key, value, ttl=3600):
        """Set a cached value with TTL (in seconds)"""
        self.cache[key] = value
        self.ttl[key] = time.time() + ttl
    
    def delete(self, key):
        """Delete a cached value"""
        self.cache.pop(key, None)
        self.ttl.pop(key, None)
    
    def clear(self):
        """Clear entire cache"""
        self.cache.clear()
        self.ttl.clear()
    
    def set_ttl(self, key, ttl):
        """Update TTL for an existing key"""
        if key in self.cache:
            self.ttl[key] = time.time() + ttl

movie_cache = CacheManager()

# =========================
# Helpers
# =========================
def error_response(message, code=400, error_code="GENERIC_ERROR", details=None):
    """Standardized error response format"""
    response = {
        "success": False,
        "error": {
            "code": error_code,
            "message": message
        }
    }
    if details:
        response["error"]["details"] = details
    return jsonify(response), code

def success_response(data, code=200):
    """Standardized success response format"""
    return jsonify({
        "success": True,
        "data": data
    }), code

# =========================
# Health
# =========================
@app.get("/api/health")
def health_check():
    return success_response({"status": "ok"})

@app.get("/api/supabase/health")
def supabase_health_check():
    if not supabase:
        return error_response(
            "Supabase not configured",
            500,
            "SUPABASE_NOT_CONFIGURED"
        )
    try:
        res = supabase.table("movies").select("imdb_id").limit(1).execute()
        return success_response({"status": "ok", "data": res.data})
    except Exception as e:
        return error_response(
            "Supabase health check failed",
            500,
            "SUPABASE_ERROR",
            details=str(e)
        )

# =========================
# JWT Stuff
# =========================

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

def get_user_id_from_request():
    auth_header = request.headers.get("Authorization", None)

    if not auth_header:
        return None

    try:
        token = auth_header.split(" ")[1]
        user = supabase.auth.get_user(token)
        if user and user.user:
            return user.user.id

        return None

    except Exception as e:
        print("Auth error:", e)
        return None

# =========================
# MOVIES (OMDb + Supabase)
# =========================

@app.get("/api/movies/search")
def search_movies():
    try:
        query = request.args.get("q", "").strip()
        page = request.args.get("page", 1)
        
        if not query:
            return error_response(
                "Search query is required",
                400,
                "MISSING_QUERY"
            )

        url = f"http://www.omdbapi.com/?s={query}&page={page}&apikey={OMDB_API_KEY}"

        try:
            res = requests.get(url, timeout=10).json()
        except requests.Timeout:
            return error_response(
                "OMDb API request timed out",
                504,
                "OMDB_TIMEOUT"
            )
        except requests.RequestException as req_err:
            return error_response(
                "Failed to connect to OMDb API",
                502,
                "OMDB_CONNECTION_ERROR",
                details=str(req_err)
            )

        # Handle OMDb errors
        if res.get("Response") == "False":
            error_msg = res.get("Error", "Unknown error")
            if "limit" in error_msg.lower():
                return error_response(
                    "OMDb request limit reached",
                    429,
                    "RATE_LIMIT"
                )
            return error_response(
                f"OMDb API error: {error_msg}",
                400,
                "OMDB_ERROR"
            )
        
        return success_response(res)
    
    except Exception as e:
        return error_response(
            "Unexpected error during search",
            500,
            "SERVER_ERROR",
            details=str(e)
        )


@app.get("/api/movies/<imdb_id>")
def get_movie(imdb_id):
    try:
        # 1. Cache check (1 hour TTL for movies)
        cached = movie_cache.get(imdb_id)
        if cached:
            return success_response(cached)

        # 2. DB check
        if supabase:
            try:
                existing = supabase.table("movies").select("*").eq("imdb_id", imdb_id).execute()
                if existing.data:
                    movie_cache.set(imdb_id, existing.data[0], ttl=3600)
                    return success_response(existing.data[0])
            except Exception as db_err:
                return error_response(
                    "Database query failed",
                    500,
                    "DATABASE_ERROR",
                    details=str(db_err)
                )

        # 3. Fetch from OMDb
        try:
            url = f"http://www.omdbapi.com/?i={imdb_id}&apikey={OMDB_API_KEY}"
            data = requests.get(url, timeout=10).json()
        except requests.Timeout:
            return error_response(
                "OMDb API request timed out",
                504,
                "OMDB_TIMEOUT"
            )
        except requests.RequestException as req_err:
            return error_response(
                "Failed to fetch from OMDb",
                502,
                "OMDB_CONNECTION_ERROR",
                details=str(req_err)
            )
        
        if data.get("Response") == "False":
            error_msg = data.get("Error", "Unknown error")
            if "limit" in error_msg.lower():
                return error_response(
                    "OMDb request limit reached",
                    429,
                    "RATE_LIMIT"
                )
            return error_response(
                f"Movie not found: {error_msg}",
                404,
                "OMDB_NOT_FOUND"
            )

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
            try:
                supabase.table("movies").upsert(movie).execute()
            except Exception as db_err:
                # Log but don't fail the response
                print(f"Warning: Failed to save movie to DB: {db_err}")
        
        # Cache it (1 hour TTL)
        movie_cache.set(imdb_id, movie, ttl=3600)
        return success_response(movie)
    
    except Exception as e:
        return error_response(
            f"Unexpected error while fetching movie",
            500,
            "SERVER_ERROR",
            details=str(e)
        )


# =========================
# RATINGS (CRUD)
# =========================

@app.post("/api/ratings")
def create_rating():
    try:
        if not supabase:
            return error_response(
                "Database not configured",
                500,
                "DATABASE_NOT_CONFIGURED"
            )
            
        data = request.json
        if not data:
            return error_response(
                "Request body is required",
                400,
                "MISSING_BODY"
            )

        movie_id = data.get("movie_id")
        rating = data.get("rating")
        user_id = get_user_id_from_request()
        if not user_id:
            return error_response("Unauthorized", 401, "UNAUTHORIZED")

        if not movie_id:
            return error_response(
                "movie_id is required",
                400,
                "MISSING_FIELD",
                details={"field": "movie_id"}
            )
        
        if rating is None:
            return error_response(
                "rating is required",
                400,
                "MISSING_FIELD",
                details={"field": "rating"}
            )
        
        if not isinstance(rating, (int, float)) or not (0 <= rating <= 5):
            return error_response(
                "Rating must be a number between 0 and 5",
                400,
                "INVALID_RATING"
            )

        record = {
            "movie_id": movie_id,
            "rating": rating,
            "user_id": user_id
        }
        res = supabase.table("ratings").insert(record).execute()
        return success_response(res.data, 201)
    except Exception as e:
        return error_response(
            "Failed to create rating",
            500,
            "SERVER_ERROR",
            details=str(e)
        )


@app.get("/api/ratings")
def get_ratings():
    try:
        if not supabase:
            return error_response(
                "Database not configured",
                500,
                "DATABASE_NOT_CONFIGURED"
            )

        user_id = get_user_id_from_request()
        if not user_id:
            return error_response("Unauthorized", 401, "UNAUTHORIZED")
        
        res = supabase.table("ratings").select("*").eq("user_id", user_id).execute()
        return success_response(res.data)
    except Exception as e:
        return error_response(
            "Failed to fetch ratings",
            500,
            "SERVER_ERROR",
            details=str(e)
        )


@app.put("/api/ratings/<int:rating_id>")
def update_rating(rating_id):
    try:
        if not supabase:
            return error_response(
                "Database not configured",
                500,
                "DATABASE_NOT_CONFIGURED"
            )
        
        user_id = get_user_id_from_request()
        if not user_id:
            return error_response("Unauthorized", 401, "UNAUTHORIZED")
        
        data = request.json
        if not data:
            return error_response(
                "Request body is required",
                400,
                "MISSING_BODY"
            )
        
        rating = data.get("rating")

        if rating is None:
            return error_response(
                "rating is required",
                400,
                "MISSING_FIELD",
                details={"field": "rating"}
            )
        
        if not isinstance(rating, (int, float)) or not (0 <= rating <= 5):
            return error_response(
                "Rating must be a number between 0 and 5",
                400,
                "INVALID_RATING"
            )
        
        res = supabase.table("ratings") \
            .update({"rating": rating}) \
            .eq("id", rating_id) \
            .eq("user_id", user_id) \
            .execute()
        if not res.data:
            return error_response(
                f"Rating with id {rating_id} not found",
                404,
                "NOT_FOUND"
            )
        return success_response(res.data)
    except Exception as e:
        return error_response(
            "Failed to update rating",
            500,
            "SERVER_ERROR",
            details=str(e)
        )


@app.delete("/api/ratings/<int:rating_id>")
def delete_rating(rating_id):
    try:
        if not supabase:
            return error_response(
                "Database not configured",
                500,
                "DATABASE_NOT_CONFIGURED"
            )
            
        user_id = get_user_id_from_request()
        if not user_id:
            return error_response("Unauthorized", 401, "UNAUTHORIZED")
        
        res = supabase.table("ratings") \
            .delete() \
            .eq("id", rating_id) \
            .eq("user_id", user_id) \
            .execute()
        
        return success_response({"deleted": True})
    except Exception as e:
        return error_response(
            "Failed to delete rating",
            500,
            "SERVER_ERROR",
            details=str(e)
        )


# =========================
# RECOMMENDATIONS
# =========================

@app.get("/api/recommendations")
def recommendations():
    try:
        if not supabase:
            return error_response(
                "Database not configured",
                500,
                "DATABASE_NOT_CONFIGURED"
            )

        user_id = get_user_id_from_request()
        if not user_id:
            return error_response("Unauthorized", 401, "UNAUTHORIZED")
        
        try:
            ratings_res = supabase.table("ratings").select("*").eq("user_id", user_id).execute()
            ratings = ratings_res.data
        except Exception as db_err:
            return error_response(
                "Failed to fetch user ratings",
                500,
                "DATABASE_ERROR",
                details=str(db_err)
            )
        
        if not ratings:
            return success_response([])

        # Find liked movies (rating >= 4)
        liked = [r for r in ratings if r["rating"] >= 4]
        if not liked:
            return success_response([])

        # Get their genres
        genres = []
        for r in liked:
            try:
                movie_res = supabase.table("movies").select("*").eq("imdb_id", r["movie_id"]).execute()
                if movie_res.data:
                    genres.extend((movie_res.data[0].get("genre") or "").split(", "))
            except Exception as db_err:
                # Log but continue
                print(f"Warning: Failed to fetch movie {r['movie_id']}: {db_err}")
                continue
        
        genre_count = {}
        for g in genres:
            genre_count[g] = genre_count.get(g, 0) + 1

        # Get candidate movies
        try:
            movies = supabase.table("movies").select("*").limit(100).execute().data
        except Exception as db_err:
            return error_response(
                "Failed to fetch candidates",
                500,
                "DATABASE_ERROR",
                details=str(db_err)
            )

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
        return success_response(ranked[:5])
    
    except Exception as e:
        return error_response(
            "Failed to get recommendations",
            500,
            "SERVER_ERROR",
            details=str(e)
        )


# =========================
# Cache Management
# =========================
@app.delete("/api/cache")
def clear_cache():
    """Clear all cached movies"""
    try:
        movie_cache.clear()
        return success_response({"message": "Cache cleared"})
    except Exception as e:
        return error_response(
            "Failed to clear cache",
            500,
            "SERVER_ERROR",
            details=str(e)
        )

@app.delete("/api/cache/<imdb_id>")
def clear_cache_for_movie(imdb_id):
    """Clear cache for a specific movie"""
    try:
        movie_cache.delete(imdb_id)
        return success_response({"message": f"Cache cleared for {imdb_id}"})
    except Exception as e:
        return error_response(
            "Failed to clear cache entry",
            500,
            "SERVER_ERROR",
            details=str(e)
        )

# =========================
# Error Handler
# =========================
@app.errorhandler(Exception)
def handle_exception(e):
    print("Server Error:", str(e))
    return error_response(
        "Unexpected server error",
        500,
        "SERVER_ERROR",
        details=str(e)
    )

if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "0") == "1"
    app.run(host="0.0.0.0", port=port, debug=debug)
# smart-rec-engine

React (Vite) frontend with a Flask backend connected to Supabase.

## Project structure

- `smart-engine/`: React + Vite frontend
- `backend/`: Flask API and Supabase integration

## Backend setup (Flask + Supabase)

1. Create and activate a Python virtual environment.
2. Install Python dependencies:

```bash
pip install -r backend/requirements.txt
```

3-1. Confirm `backend/.env` contains your Supabase settings:

```env
FLASK_ENV=development
FLASK_DEBUG=1
PORT=5000
SUPABASE_URL=your_supabase_key
SUPABASE_KEY=your_key_here

OMDB_API_URL=your_omdb_url_here
# Wont be used in the code itself, but it's there for reference
OMDB_API_KEY=your_omdb_key_here
```

3-2. Confirm `smart-engine/.env` contains your Supabase settings:

```env
VITE_SUPABASE_URL=your_supabase_key
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your__pub_default_key_here
```

4. Run Flask:

```bash
python backend/app.py
```

Available endpoints:

- `GET /api/health`
- `GET /api/supabase/health`

## Frontend setup

Install frontend deps (if needed):

```bash
cd smart-engine
npm install

npm install @vitejs/plugin-react
```

Run Vite dev server:

```bash
npm run dev
```

The frontend uses a Vite proxy so `/api/*` is forwarded to `http://127.0.0.1:5000`.

## Optional root scripts

From repository root:

- `npm run dev` (starts frontend dev server)
- `npm run frontend:dev`
- `npm run frontend:build`
- `npm run backend:dev`

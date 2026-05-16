# Online Banking — Trainee FullStack Project

Crypto landing page with live WebSocket prices and Google OAuth2 (no server-side user sessions).

## Live demo

| Service  | URL |
|----------|-----|
| Frontend | _Deploy to Vercel and paste URL here_ |
| Backend  | _Deploy to Railway and paste URL here_ |

Health check: `GET {BACKEND_URL}/health` → `{"status":"ok"}`

## Tech stack

- **Frontend:** Vite, TypeScript, vanilla CSS/JS (no UI frameworks)
- **Backend:** Python, FastAPI, Authlib (Google OAuth2)
- **Crypto prices:** Binance public WebSocket API
- **Deploy:** Vercel (frontend) + Railway (backend)

## Project structure

```
online-banking/
├── frontend/          # Vite SPA
├── backend/           # FastAPI OAuth API
├── docs/              # Design tokens (Figma audit)
└── README.md
```

## Prerequisites

- Node.js 20+
- Python 3.12+
- Google Cloud OAuth 2.0 credentials (Web application)
- `HP.mp4` from the task archive → `frontend/public/video/HP.mp4`

## Local development

### 1. Google OAuth setup

1. Open [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials.
2. Create **OAuth 2.0 Client ID** (Web application).
3. Add **Authorized redirect URIs:**
   - `http://localhost:8000/auth/google/callback`
4. Add **Authorized JavaScript origins:**
   - `http://localhost:5173`

### 2. Backend

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env with GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

uvicorn app.main:app --reload --port 8000
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:8000

npm run dev
```

Open http://localhost:5173

### 4. Hero video

Unpack `HP.mp4.zip` from the task materials and copy the file to:

```
frontend/public/video/HP.mp4
```

Without this file the hero still works (gradient overlay); video autoplay requires the MP4.

## Environment variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `FRONTEND_URL` | Frontend origin, e.g. `http://localhost:5173` |
| `BACKEND_URL` | Backend origin, e.g. `http://localhost:8000` |
| `SESSION_SECRET` | Optional; random string for OAuth state cookie |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend URL, e.g. `http://localhost:8000` |

## Deploy

### Frontend (Vercel)

1. Import the GitHub repo in [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Add env: `VITE_API_URL=https://your-api.up.railway.app`
4. Deploy.

### Backend (Railway)

1. New project → Deploy from GitHub repo.
2. Set **Root Directory** to `backend` (uses `Dockerfile`).
3. Add env vars from `backend/.env.example` with production URLs:
   - `FRONTEND_URL=https://your-app.vercel.app`
   - `BACKEND_URL=https://your-api.up.railway.app`
4. In Google Console, add production redirect URI:
   - `https://your-api.up.railway.app/auth/google/callback`

## OAuth flow (no user sessions)

1. User clicks **Sign in with Google** → redirect to `{API}/auth/google`.
2. Google consent → callback `{API}/auth/google/callback`.
3. Backend reads profile and redirects to `{FRONTEND}/?auth=ok&name=...&email=...&picture=...`.
4. Frontend stores user in `sessionStorage` (client only) and shows profile in header.
5. No user data is persisted on the server.

## Scripts

| Command | Location | Description |
|---------|----------|-------------|
| `npm run dev` | frontend | Dev server :5173 |
| `npm run build` | frontend | Production build |
| `uvicorn app.main:app --reload` | backend | API server :8000 |

## License

Trainee test assignment — MIT or as required by employer.

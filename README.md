# Online Banking

Adaptive landing page for a trainee FullStack task.

- Frontend: Vite + TypeScript + CSS, no frontend frameworks.
- Backend: Python + FastAPI for Google OAuth2.
- Crypto prices: Binance public WebSocket.

## Live Demo

Add production links before submitting the task:

| Service | URL |
| --- | --- |
| Frontend | `https://your-frontend-url` |
| Backend health | `https://your-backend-url/health` |

Expected health response:

```json
{ "status": "ok" }
```

## Requirements

- Node.js 20+
- Python 3.12+
- Google OAuth 2.0 credentials
- Hero video: `frontend/public/video/HP.mp4`

## Project Structure

```text
online-banking/
  backend/                 FastAPI OAuth backend
    app/
      main.py
      config.py
      routes/auth.py
  frontend/                Vite frontend
    public/                Static assets
    src/
      app/                 App bootstrap
      adapters/            External data adapters
      components/          UI behavior by section
      config/              Env and static config
      core/                Shared browser utilities
      features/            Auth and live crypto features
      services/            External services
      styles/              CSS design system and sections
      types/               Shared TypeScript types
```

## Local Setup

### 1. Hero Video

Unzip `HP.mp4.zip` from the task materials and put the file here:

```text
frontend/public/video/HP.mp4
```

### 2. Google OAuth

Create a Google OAuth 2.0 Client ID with these local URLs:

```text
Authorized JavaScript origins:
http://localhost:5173

Authorized redirect URIs:
http://localhost:8000/auth/google/callback
```

### 3. Backend

```bash
cd backend
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
copy .env.example .env
```

macOS/Linux:

```bash
source .venv/bin/activate
cp .env.example .env
```

Edit `backend/.env`:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000
```

Install and run:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend health check:

```text
http://localhost:8000/health
```

### 4. Frontend

Open a second terminal:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

For macOS/Linux use `cp .env.example .env`.

Open:

```text
http://localhost:5173
```

## Environment Variables

Backend: `backend/.env`

| Variable | Example | Required |
| --- | --- | --- |
| `GOOGLE_CLIENT_ID` | `xxx.apps.googleusercontent.com` | Yes |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-xxx` | Yes |
| `FRONTEND_URL` | `http://localhost:5173` | Yes |
| `BACKEND_URL` | `http://localhost:8000` | Yes |

Frontend: `frontend/.env`

| Variable | Example | Required |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:8000` | Yes |

## Scripts

Frontend:

```bash
npm run dev       # local Vite server
npm run build     # TypeScript check + production build
npm run preview   # preview production build
```

Backend:

```bash
uvicorn app.main:app --reload --port 8000
```

## Deploy

### Backend on Railway

1. Create a Railway project from the GitHub repository.
2. Set root directory to `backend`.
3. Add environment variables from `backend/.env`.
4. Set production URLs:

```env
FRONTEND_URL=https://your-frontend-url
BACKEND_URL=https://your-backend-url
```

5. Add this Google OAuth redirect URI:

```text
https://your-backend-url/auth/google/callback
```

### Frontend on Vercel

1. Import the GitHub repository in Vercel.
2. Set root directory to `frontend`.
3. Add environment variable:

```env
VITE_API_URL=https://your-backend-url
```

4. Deploy.

## How It Works

1. The user opens the Vite frontend.
2. The hero video runs from `frontend/public/video/HP.mp4`.
3. The Google button redirects to `{VITE_API_URL}/auth/google`.
4. FastAPI completes Google OAuth2 and redirects back to the frontend.
5. Crypto prices are updated in real time through Binance public WebSocket.

## Before Submitting

- `frontend/public/video/HP.mp4` exists.
- `npm run build` passes in `frontend`.
- Backend `/health` returns `{ "status": "ok" }`.
- Google OAuth works on the deployed URLs.
- README live demo links point to the real public deployment.

# Online Banking

**Стек:** Vite + TypeScript + CSS (без фреймворков), FastAPI + Google OAuth2, курсы криптовалют через Binance WebSocket.

## Демо

| Сервис | URL |
| --- | --- |
| Frontend | `https://your-frontend-url` |
| Backend | `https://your-backend-url/health` → `{ "status": "ok" }` |

**Видео:** `frontend/public/video/demo-online-banking.mp4`

## Требования

- Node.js 20+
- Python 3.12+
- Google OAuth 2.0

## Запуск

### Backend

```bash
cd backend
python -m venv .venv
```

Windows: `.venv\Scripts\activate` и `copy .env.example .env`  
macOS/Linux: `source .venv/bin/activate` и `cp .env.example .env`

`backend/.env`:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000
```

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run dev
```

Открыть: http://localhost:5173

### Google OAuth (локально)

**Authorized JavaScript origins:** `http://localhost:5173`  
**Authorized redirect URIs:** `http://localhost:8000/auth/google/callback`

## Переменные окружения

**Backend** (`backend/.env`): `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FRONTEND_URL`, `BACKEND_URL`

**Frontend** (`frontend/.env`): `VITE_API_URL` → `http://localhost:8000`

## Скрипты

```bash
# frontend
npm run dev | build | preview

# backend
uvicorn app.main:app --reload --port 8000
```

## Деплой

**Railway (backend):** root `backend`, env из `.env`, в Google OAuth добавить `https://your-backend-url/auth/google/callback`.

**Vercel (frontend):** root `frontend`, `VITE_API_URL=https://your-backend-url`.

## Структура

```text
online-banking/
  backend/app/          FastAPI, OAuth
  frontend/src/         компоненты, стили, features
  frontend/public/      статика, video/demo-online-banking.mp4
```

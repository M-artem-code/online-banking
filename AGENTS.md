# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

KAIROS is a cryptocurrency-focused online banking landing page with two services:
- **Frontend** (Next.js + React + SCSS, port 5173) — the main product UI in `frontend-next/`
- **Legacy Frontend** (Vite + TypeScript SPA) — original version in `frontend/` (kept for reference)
- **Backend** (Python FastAPI, port 8000) — Google OAuth only; the frontend works without it

### Running services

```bash
# Frontend - Next.js (required)
cd frontend-next && npm run dev -- -p 5173

# Backend (optional — only needed for Google OAuth sign-in)
cd backend && uvicorn app.main:app --reload --port 8000
```

### Key notes

- **Frontend uses Next.js 15 + React 19 + SCSS.** All styles are global SCSS (ported from original CSS to maintain visual parity).
- **Lint:** `cd frontend-next && npx eslint .` (ESLint with Next.js plugin).
- **Build:** `cd frontend-next && npm run build`.
- **No unit test framework exists.** Validation is done via ESLint and `npm run build`.
- **Python packages install to `~/.local/bin`** — ensure `PATH` includes `$HOME/.local/bin` before running `uvicorn`.
- **Binance WebSocket** (`wss://stream.binance.com:9443`) provides live crypto prices. This may fail in restricted network environments (cloud VMs); the UI still loads and functions without live data.
- **Google OAuth** requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` env vars in `backend/.env`. Without them the backend starts fine (`/health` returns `{"status":"ok"}`) but the sign-in flow won't work.
- **Environment files:** Copy `.env.example` to `.env` in both `frontend-next/` and `backend/` before running.
- **State management:** Uses Zustand for mobile menu state; intro state uses React Context.

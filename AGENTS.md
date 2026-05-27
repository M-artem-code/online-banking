# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

KAIROS is a cryptocurrency-focused online banking landing page with two services:
- **Frontend** (Vite + TypeScript SPA, port 5173) — the main product UI
- **Backend** (Python FastAPI, port 8000) — Google OAuth only; the frontend works without it

### Running services

```bash
# Frontend (required)
cd frontend && npm run dev

# Backend (optional — only needed for Google OAuth sign-in)
cd backend && uvicorn app.main:app --reload --port 8000
```

### Key notes

- **No test framework exists.** There are no unit/integration tests. Validation is done via `tsc --noEmit` (TypeScript) and `npm run build`.
- **No ESLint config.** The only lint-like check is TypeScript strict mode via `npx tsc --noEmit` in `frontend/`.
- **Python packages install to `~/.local/bin`** — ensure `PATH` includes `$HOME/.local/bin` before running `uvicorn`.
- **Binance WebSocket** (`wss://stream.binance.com:9443`) provides live crypto prices. This may fail in restricted network environments (cloud VMs); the UI still loads and functions without live data.
- **Google OAuth** requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` env vars in `backend/.env`. Without them the backend starts fine (`/health` returns `{"status":"ok"}`) but the sign-in flow won't work.
- **Environment files:** Copy `.env.example` to `.env` in both `frontend/` and `backend/` before running.
- **Build command:** `cd frontend && npm run build` (runs `tsc && vite build`).

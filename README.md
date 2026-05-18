# Online Banking

| Часть | Технологии |
| --- | --- |
| Frontend | Vite, TypeScript, CSS (без React/Vue) |
| Backend | Python, FastAPI, Google OAuth2 |
| Курсы | Binance public WebSocket |
| Деплой | Vercel (frontend) + Railway (backend) |

---

| Сервис | URL |
| --- | --- |
| [Frontend](https://online-banking-weld-beta.vercel.app/) |

Ожидаемый ответ health:

```json
{ "status": "ok" }
```

## Video and Screens Demo
[Google drive](https://drive.google.com/drive/folders/1aBfyxy0T2qSkuAuQmUCvdHxAL9PmM-9i?usp=drive_link)

## Требования

- Node.js 20+
- Python 3.12+
- [Google OAuth 2.0](https://console.cloud.google.com/) (тип «Web application»)
- `HP.mp4` из архива задания → `frontend/public/video/HP.mp4`

---

## Структура проекта

```text
online-banking/
  backend/
    app/
      main.py              # FastAPI, CORS, /health
      config.py            # Переменные окружения
      routes/auth.py       # Google OAuth
    .env.example
    requirements.txt
  frontend/
    public/
      video/HP.mp4         # Hero-видео (в коде)
      favicon.svg
      icons/crypto/        # SVG монет
      figma/               # Референсы и ассеты для вёрстки
    src/
      app/                 # Старт приложения
      adapters/            # Binance WebSocket
      components/          # UI: header, hero, crypto-hub, auth-card
      config/              # Монеты, env, breakpoints
      core/                # DOM, intro-анимация
      features/            # auth, crypto-live
      services/            # cryptoSocket
      styles/              # CSS: tokens, секции, модалки
    index.html
    .env.example
```

---

## Локальный запуск

### Шаг 1. Hero-видео

Распакуйте `HP.mp4.zip` из материалов задания:

```text
frontend/public/video/HP.mp4
```

Без файла сайт откроется, но hero-видео и модалка будут пустыми (404).

### Шаг 2. Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials.
2. Создайте **OAuth 2.0 Client ID** (Web application).
3. **Authorized JavaScript origins:**
   ```text
   http://localhost:5173
   ```
4. **Authorized redirect URIs:**
   ```text
   http://localhost:8000/auth/google/callback
   ```

### Шаг 3. Backend

```bash
cd backend
python -m venv .venv
```

**Windows:**

```bash
.venv\Scripts\activate
copy .env.example .env
```

**macOS / Linux:**

```bash
source .venv/bin/activate
cp .env.example .env
```

Заполните `backend/.env`:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000
```

Запуск:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Проверка: http://localhost:8000/health → `{"status":"ok"}`

### Шаг 4. Frontend

Во **втором** терминале:

```bash
cd frontend
npm install
```

**Windows:** `copy .env.example .env`  
**macOS / Linux:** `cp .env.example .env`

В `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

```bash
npm run dev
```

Откройте: http://localhost:5173

---

## Переменные окружения

### Backend (`backend/.env`)

| Переменная | Пример | Обязательно |
| --- | --- | --- |
| `GOOGLE_CLIENT_ID` | `xxx.apps.googleusercontent.com` | Да |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-xxx` | Да |
| `FRONTEND_URL` | `http://localhost:5173` | Да |
| `BACKEND_URL` | `http://localhost:8000` | Да |

### Frontend (`frontend/.env`)

| Переменная | Пример | Обязательно |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:8000` | Да |

---

## Как это работает

1. Пользователь открывает frontend (Vite).
2. Hero воспроизводит `/video/HP.mp4`.
3. Кнопка Google → `{VITE_API_URL}/auth/google`.
4. FastAPI завершает OAuth и редиректит на frontend с данными профиля в query.
5. Frontend сохраняет пользователя в `sessionStorage` (только в браузере).
6. Курсы криптовалют обновляются через Binance WebSocket.

**Сессий на сервере нет** — пользователи не хранятся в БД.

---

## Скрипты

| Команда | Где | Описание |
| --- | --- | --- |
| `npm run dev` | frontend | Dev-сервер :5173 |
| `npm run build` | frontend | TypeScript + production build |
| `npm run preview` | frontend | Просмотр production-сборки |
| `uvicorn app.main:app --reload --port 8000` | backend | API :8000 |

---

## Деплой

### Backend (Railway)

1. New Project → Deploy from GitHub.
2. **Root Directory:** `backend`
3. Переменные из `backend/.env` с production URL:
   ```env
   FRONTEND_URL=https://your-frontend-url
   BACKEND_URL=https://your-backend-url
   ```
4. В Google Console добавьте redirect URI:
   ```text
   https://your-backend-url/auth/google/callback
   ```

### Frontend (Vercel)

1. Import репозитория в [Vercel](https://vercel.com).
2. **Root Directory:** `frontend`
3. Environment variable:
   ```env
   VITE_API_URL=https://your-backend-url
   ```
4. Deploy.

> **Важно:** `HP.mp4` должен быть в git (см. `git add -f` выше), иначе на Vercel видео не появится.

---

## Чеклист перед сдачей

- [ ] `frontend/public/video/HP.mp4` в репозитории (или доступен на деплое)
- [ ] `npm run build` в `frontend` проходит без ошибок
- [ ] `GET /health` на backend → `{ "status": "ok" }`
- [ ] Google OAuth работает локально и на production URL
- [ ] В README указаны реальные ссылки на frontend и backend
- [ ] Favicon отображается (`frontend/public/favicon.svg`)

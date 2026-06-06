# Nifty100 FinIntel

Monorepo for the Nifty100 FinIntel backend and frontend.

## Prerequisites

- Python 3.14 or a compatible Python 3 version
- Node.js and npm
- Git

## Local Setup

### 1. Clone the repo

```powershell
git clone <repo-url>
cd nifty100-finintel
```

### 2. Set up the backend

Create and activate the virtual environment if you do not already have one:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install Python dependencies:

```powershell
python -m pip install -r requirements.txt
```

By default the backend uses SQLite at `backend/db.sqlite3`.

If you want PostgreSQL instead, set `DB_NAME` and the related database variables before starting Django:

- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`

Run the backend checks and migrations:

```powershell
python backend/manage.py check
python backend/manage.py migrate
```

Start the backend server:

```powershell
python backend/manage.py runserver 127.0.0.1:8000
```

### 3. Set up the frontend

Install the frontend dependencies:

```powershell
cd frontend
npm ci
```

The Vite dev server proxies `/api` to `http://127.0.0.1:8000`, so no extra frontend env file is required for local development.

Start the frontend server:

```powershell
npm run dev
```

The app runs at `http://127.0.0.1:5173`.

## Optional Environment Variables

Root `.env.example` documents the backend defaults and the optional admin seed settings.

- `DEBUG`
- `ALLOWED_HOSTS`
- `CORS_ALLOWED_ORIGINS`
- `CORS_ALLOW_CREDENTIALS`
- `JWT_ACCESS_TOKEN_LIFETIME_HOURS`
- `JWT_REFRESH_TOKEN_LIFETIME_DAYS`
- `ADMIN_USERNAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_FIRST_NAME`

If you want to create or update an admin user from environment variables, run:

```powershell
python backend/manage.py seed_admin
```

## Useful Commands

```powershell
python backend/manage.py check
python backend/manage.py migrate
python backend/manage.py runserver 127.0.0.1:8000
```

```powershell
cd frontend
npm run build
npm run dev
```

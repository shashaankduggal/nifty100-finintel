@echo off
setlocal EnableExtensions

set "ROOT=%~dp0"
cd /d "%ROOT%"
set "PYTHON_EXE=%ROOT%venv\Scripts\python.exe"

if not exist "%PYTHON_EXE%" set "PYTHON_EXE=python"

if not defined SECRET_KEY (
  for /f %%I in ('powershell -NoLogo -NoProfile -Command "$bytes = New-Object byte[] 64; [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes); [Convert]::ToBase64String($bytes)"') do set "SECRET_KEY=%%I"
)

if not defined DEBUG set "DEBUG=true"
if not defined DB_NAME set "DB_NAME=nifty100"
if not defined DB_USER set "DB_USER=postgres"
if not defined DB_PASSWORD set "DB_PASSWORD=12345"
if not defined DB_HOST set "DB_HOST=localhost"
if not defined DB_PORT set "DB_PORT=5432"
if not defined ALLOWED_HOSTS set "ALLOWED_HOSTS=localhost,127.0.0.1,testserver"
if not defined CORS_ALLOWED_ORIGINS set "CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173"
if not defined CORS_ALLOW_CREDENTIALS set "CORS_ALLOW_CREDENTIALS=true"
if not defined JWT_ACCESS_TOKEN_LIFETIME_HOURS set "JWT_ACCESS_TOKEN_LIFETIME_HOURS=24"
if not defined JWT_REFRESH_TOKEN_LIFETIME_DAYS set "JWT_REFRESH_TOKEN_LIFETIME_DAYS=7"
if not defined VITE_API_BASE_URL set "VITE_API_BASE_URL=/api"

echo Starting Nifty100 backend on http://127.0.0.1:8000
start "Nifty100 Backend" cmd /k "cd /d ""%ROOT%"" && ""%PYTHON_EXE%"" backend\manage.py runserver 127.0.0.1:8000"

echo Starting Nifty100 frontend on http://127.0.0.1:5173
start "Nifty100 Frontend" cmd /k "cd /d ""%ROOT%frontend"" && npm run dev"

echo.
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://127.0.0.1:5173
echo.
echo Launch windows opened. Keep them running to use the app.

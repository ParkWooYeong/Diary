@echo off
REM ===== Django + React 동시 실행 =====

REM 1. Django 서버 실행
start cmd /k "cd /d %~dp0 && venv\Scripts\activate && python manage.py runserver"

REM 2. React 서버 실행
start cmd /k "cd /d %~dp0frontend && npm run dev"

REM 3. 브라우저 자동 실행 (React 주소)
timeout /t 3 >nul
start http://localhost:5173

exit
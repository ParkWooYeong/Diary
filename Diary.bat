@echo off
REM ===== Django + React(Vite) 동시 실행 배치 파일 =====

REM 1. Django 서버 실행 (오늘 사용하신 8080 포트 기준)
start cmd /k "cd /d %~dp0 && venv\Scripts\activate && python manage.py runserver 8080"

REM 2. React(Vite) 서버 실행
start cmd /k "cd /d %~dp0frontend && npm run dev"

REM 3. 브라우저 자동 실행 (Vite 기본 포트 5173)
timeout /t 5 >nul
start http://localhost:5173

exit
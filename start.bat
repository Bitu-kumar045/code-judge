@echo off
echo ======================================================
echo    Starting CodeJudge Platform (Backend + Frontend)
echo ======================================================

echo [1/2] Starting Backend API Server on http://localhost:8080...
start "CodeJudge Backend" cmd /k "node backend/local-api-server.js"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend Vite Server on http://localhost:3000...
start "CodeJudge Frontend" cmd /k "cd frontend && npm run dev -- --host 0.0.0.0 --port 3000"

timeout /t 2 /nobreak >nul

echo ======================================================
echo    Opening browser at http://localhost:3000...
echo ======================================================
start http://localhost:3000

echo Done! Both servers are running in their respective windows.
pause


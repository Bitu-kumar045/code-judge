@echo off
echo ======================================================
echo          Stopping CodeJudge Servers
echo ======================================================

echo Stopping processes on Port 3000 (Frontend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /f /pid %%a 2>nul
)

echo Stopping processes on Port 8080 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING"') do (
    taskkill /f /pid %%a 2>nul
)

echo.
echo Both servers have been stopped.
ping 127.0.0.1 -n 2 >nul

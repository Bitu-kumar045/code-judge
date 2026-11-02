@echo off
set "ROOT=C:\Users\layri\OneDrive\Desktop\All cse\code-judge"
cd /d "%ROOT%"

:: Check if port 8080 (Backend) is already listening
netstat -ano | findstr ":8080" | findstr "LISTENING" >nul
if errorlevel 1 (
    start "" /b "C:\Program Files\nodejs\node.exe" "%ROOT%\backend\local-api-server.js"
)

:: Check if port 3000 (Frontend) is already listening
netstat -ano | findstr ":3000" | findstr "LISTENING" >nul
if errorlevel 1 (
    cd /d "%ROOT%\frontend"
    start "" /b "C:\Program Files\nodejs\npm.cmd" run dev -- --host 0.0.0.0 --port 3000
)

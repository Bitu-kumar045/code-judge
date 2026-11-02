' CodeJudge Silent Background Runner
Dim WshShell, rootDir
Set WshShell = CreateObject("WScript.Shell")

rootDir = "C:\Users\layri\OneDrive\Desktop\All cse\code-judge"

WshShell.CurrentDirectory = rootDir
WshShell.Run "cmd.exe /c node backend/local-api-server.js > backend.log 2>&1", 0, False
WScript.Sleep 2000
WshShell.CurrentDirectory = rootDir & "\frontend"
WshShell.Run "cmd.exe /c npm run dev -- --host 0.0.0.0 --port 3000 > frontend.log 2>&1", 0, False

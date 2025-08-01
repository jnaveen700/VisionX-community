@echo off
echo Starting development servers...

cd %~dp0

echo Starting backend server...
cd server
start cmd /k "npm run dev"

echo Starting frontend server...
cd ../client
start cmd /k "npm run dev"

echo Development servers started!
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause

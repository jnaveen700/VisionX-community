@echo off
echo Starting VisionX Development Servers
echo ================================

REM Check if MongoDB is running
echo Checking MongoDB...
timeout /t 2 /nobreak > nul
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MongoDB is not installed or not in PATH
    echo Please install MongoDB first
    pause
    exit /b 1
)

REM Start Backend
echo Starting Backend Server...
cd /d D:\visionX\server
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)
start "Backend Server" cmd /k "npm run dev"

REM Start Frontend
echo Starting Frontend Server...
cd /d D:\visionX\client
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Servers are starting...
echo.
echo Backend will be at: http://localhost:5000
echo Frontend will be at: http://localhost:5173
echo.
echo Waiting for servers to start...
timeout /t 10 /nobreak > nul

REM Test backend connection
curl -s http://localhost:5000/api/questions >nul 2>&1
if %errorlevel% neq 0 (
    echo Warning: Backend server might not be running properly
    echo Please check the Backend Server window for errors
)

echo.
echo All done! Check the server windows for any error messages.
echo Press any key to close this window...
pause

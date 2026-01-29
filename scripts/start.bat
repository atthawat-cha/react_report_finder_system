@echo off
chcp 65001 >nul
color 0A
title Starting Report Search System

echo ╔════════════════════════════════════════════════════════════╗
echo ║         Starting Report Search System...                   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist backend\node_modules (
    echo ❌ Backend dependencies not installed!
    echo Please run scripts\install.bat first
    pause
    exit /b 1
)

if not exist frontend\node_modules (
    echo ❌ Frontend dependencies not installed!
    echo Please run scripts\install.bat first
    pause
    exit /b 1
)

echo ✅ Dependencies verified
echo.

echo [1/3] Starting Backend Server...
start "Backend - Report Search System" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
echo ✅ Backend server starting on http://localhost:5000
echo.

echo [2/3] Starting Frontend Server...
start "Frontend - Report Search System" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak >nul
echo ✅ Frontend server starting on http://localhost:3000
echo.

echo [3/3] Opening browser...
timeout /t 5 /nobreak >nul
start http://localhost:3000
echo.

echo ╔════════════════════════════════════════════════════════════╗
echo ║            Report Search System Started!                   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 🌐 Access Points:
echo    Frontend:  http://localhost:3000
echo    Backend:   http://localhost:5000
echo    API Docs:  http://localhost:5000/api-docs
echo.
echo 🔐 Default Login:
echo    Admin:  admin@example.com / Admin@123
echo    User:   user@example.com / Admin@123
echo.
echo 📝 Server windows have been opened separately
echo    - Backend Server (port 5000)
echo    - Frontend Server (port 3000)
echo.
echo ⚠️  To stop the servers:
echo    - Close the server windows, OR
echo    - Run scripts\stop.bat
echo.
echo Press any key to return to main menu...
pause >nul
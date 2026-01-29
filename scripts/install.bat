@echo off
chcp 65001 >nul
color 0A
title Report Search System - Installation

echo ╔════════════════════════════════════════════════════════════╗
echo ║      ระบบสืบค้นข้อมูลรายงาน - Report Search System       ║
echo ║                   Installation Script                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js is installed
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo    Version: %NODE_VERSION%
echo.

REM Check if PostgreSQL is installed
echo [2/6] Checking PostgreSQL installation...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  PostgreSQL command line tools not found
    echo    Please ensure PostgreSQL is installed and in PATH
    echo    Download from: https://www.postgresql.org/download/windows/
    echo.
    set /p CONTINUE="Continue anyway? (y/n): "
    if /i not "%CONTINUE%"=="y" exit /b 1
) else (
    echo ✅ PostgreSQL is installed
    for /f "tokens=*" %%i in ('psql --version') do echo    %%i
)
echo.

REM Install Backend Dependencies
echo [3/6] Installing Backend Dependencies...
cd backend
if not exist package.json (
    echo ❌ Backend package.json not found!
    pause
    exit /b 1
)

echo Installing npm packages...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed
cd ..
echo.

REM Install Frontend Dependencies
echo [4/6] Installing Frontend Dependencies...
cd frontend
if not exist package.json (
    echo ❌ Frontend package.json not found!
    pause
    exit /b 1
)

echo Installing npm packages...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed
cd ..
echo.

REM Setup Environment Files
echo [5/6] Setting up Environment Files...

REM Backend .env
if not exist backend\.env (
    if exist backend\.env.example (
        copy backend\.env.example backend\.env >nul
        echo ✅ Created backend/.env from .env.example
        echo ⚠️  Please update backend/.env with your database credentials
    ) else (
        echo ⚠️  backend/.env.example not found
    )
) else (
    echo ℹ️  backend/.env already exists
)

REM Frontend .env
if not exist frontend\.env (
    if exist frontend\.env.example (
        copy frontend\.env.example frontend\.env >nul
        echo ✅ Created frontend/.env from .env.example
    ) else (
        echo ⚠️  frontend/.env.example not found
    )
) else (
    echo ℹ️  frontend/.env already exists
)
echo.

REM Create necessary directories
echo [6/6] Creating necessary directories...
if not exist backend\uploads mkdir backend\uploads
if not exist backend\uploads\reports mkdir backend\uploads\reports
if not exist backend\uploads\temp mkdir backend\uploads\temp
if not exist backend\logs mkdir backend\logs
if not exist backend\backups mkdir backend\backups
echo ✅ Directories created
echo.

echo ╔════════════════════════════════════════════════════════════╗
echo ║                 Installation Completed!                    ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📝 Next Steps:
echo.
echo 1. Configure Database:
echo    - Edit backend/.env file
echo    - Update database credentials (DB_HOST, DB_USER, DB_PASSWORD)
echo.
echo 2. Setup Database:
echo    - Run: scripts\setup-db.bat
echo.
echo 3. Start Application:
echo    - Run: scripts\start.bat
echo.
echo 4. Access Application:
echo    - Frontend: http://localhost:3000
echo    - Backend:  http://localhost:5000
echo.
echo 📚 Default Credentials:
echo    - Admin: admin@example.com / Admin@123
echo    - User:  user@example.com / Admin@123
echo.
echo ⚠️  Remember to change default passwords after first login!
echo.
pause
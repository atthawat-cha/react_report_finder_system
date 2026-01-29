@echo off
chcp 65001 >nul
color 0E
title Report Search System - Main Menu

:MENU
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║      ระบบสืบค้นข้อมูลรายงาน - Report Search System       ║
echo ║                      Main Menu                             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo  [1] 📦 Install Dependencies
echo  [2] 🗄️  Setup Database
echo  [3] 🚀 Start Application
echo  [4] 🛑 Stop Application
echo  [5] 📊 Check Status
echo  [6] 🔧 Rebuild Application
echo  [7] 📝 View Logs
echo  [8] 🧹 Clean Project
echo  [9] ℹ️  Information
echo  [0] 🚪 Exit
echo.
echo ════════════════════════════════════════════════════════════
echo.

set /p choice="Select option (0-9): "

if "%choice%"=="1" goto INSTALL
if "%choice%"=="2" goto SETUP_DB
if "%choice%"=="3" goto START
if "%choice%"=="4" goto STOP
if "%choice%"=="5" goto STATUS
if "%choice%"=="6" goto REBUILD
if "%choice%"=="7" goto LOGS
if "%choice%"=="8" goto CLEAN
if "%choice%"=="9" goto INFO
if "%choice%"=="0" goto EXIT

echo Invalid option! Please try again.
timeout /t 2 /nobreak >nul
goto MENU

:INSTALL
cls
echo.
echo 📦 Installing Dependencies...
echo.
call scripts\install.bat
pause
goto MENU

:SETUP_DB
cls
echo.
echo 🗄️  Setting up Database...
echo.
call scripts\setup-db.bat
pause
goto MENU

:START
cls
echo.
echo 🚀 Starting Application...
echo.
call scripts\start.bat
goto MENU

:STOP
cls
echo.
echo 🛑 Stopping Application...
echo.
call scripts\stop.bat
pause
goto MENU

:STATUS
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                    System Status                           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check Node.js
echo [Node.js]
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do echo ✅ Installed: %%i
) else (
    echo ❌ Not installed
)
echo.

REM Check PostgreSQL
echo [PostgreSQL]
psql --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('psql --version') do echo ✅ Installed: %%i
) else (
    echo ❌ Not installed
)
echo.

REM Check Backend
echo [Backend]
if exist backend\node_modules (
    echo ✅ Dependencies installed
) else (
    echo ❌ Dependencies not installed
)
echo.

REM Check Frontend
echo [Frontend]
if exist frontend\node_modules (
    echo ✅ Dependencies installed
) else (
    echo ❌ Dependencies not installed
)
echo.

REM Check running processes
echo [Running Processes]
netstat -ano | findstr :5000 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend running on port 5000
) else (
    echo ⚪ Backend not running
)

netstat -ano | findstr :3000 | findstr LISTENING >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend running on port 3000
) else (
    echo ⚪ Frontend not running
)
echo.
pause
goto MENU

:REBUILD
cls
echo.
echo 🔧 Rebuilding Application...
echo.
echo [1/4] Cleaning node_modules...
if exist backend\node_modules rmdir /s /q backend\node_modules
if exist frontend\node_modules rmdir /s /q frontend\node_modules
echo ✅ Cleaned
echo.

echo [2/4] Cleaning build files...
if exist frontend\dist rmdir /s /q frontend\dist
echo ✅ Cleaned
echo.

echo [3/4] Installing backend dependencies...
cd backend
call npm install
cd ..
echo ✅ Installed
echo.

echo [4/4] Installing frontend dependencies...
cd frontend
call npm install
cd ..
echo ✅ Installed
echo.

echo ╔════════════════════════════════════════════════════════════╗
echo ║              Rebuild Completed Successfully!               ║
echo ╚════════════════════════════════════════════════════════════╝
pause
goto MENU

:LOGS
cls
echo.
echo 📝 Application Logs
echo ════════════════════════════════════════════════════════════
echo.
if exist backend\logs\app.log (
    echo Latest log entries:
    echo.
    powershell -Command "Get-Content backend\logs\app.log -Tail 20"
) else (
    echo No logs found
)
echo.
pause
goto MENU

:CLEAN
cls
echo.
echo 🧹 Cleaning Project...
echo.
echo ⚠️  This will remove:
echo    - node_modules directories
echo    - Build files
echo    - Log files
echo    - Uploaded files (optional)
echo.
set /p CONFIRM="Are you sure? (y/n): "
if /i not "%CONFIRM%"=="y" goto MENU

echo.
echo Cleaning...
if exist backend\node_modules rmdir /s /q backend\node_modules
if exist frontend\node_modules rmdir /s /q frontend\node_modules
if exist frontend\dist rmdir /s /q frontend\dist
if exist backend\logs rmdir /s /q backend\logs

set /p CLEAN_UPLOADS="Remove uploaded files? (y/n): "
if /i "%CLEAN_UPLOADS%"=="y" (
    if exist backend\uploads rmdir /s /q backend\uploads
    echo ✅ Uploads cleaned
)

echo.
echo ✅ Project cleaned successfully!
pause
goto MENU

:INFO
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                  System Information                        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📱 Application: Report Search System
echo 🏷️  Version: 1.0.0
echo 📅 Date: January 2025
echo.
echo 🌐 URLs:
echo    Frontend:  http://localhost:3000
echo    Backend:   http://localhost:5000
echo    API Docs:  http://localhost:5000/api-docs
echo.
echo 🔐 Default Credentials:
echo    Super Admin:
echo    - Email: admin@example.com
echo    - Password: Admin@123
echo.
echo    Manager:
echo    - Email: manager@example.com
echo    - Password: Admin@123
echo.
echo    User:
echo    - Email: user@example.com
echo    - Password: Admin@123
echo.
echo 📚 Tech Stack:
echo    - Frontend: React + Material-UI
echo    - Backend: Node.js + Express
echo    - Database: PostgreSQL
echo.
echo 📂 Project Structure:
echo    /backend    - Node.js API Server
echo    /frontend   - React Application
echo    /database   - SQL Scripts
echo    /scripts    - Utility Scripts
echo    /docs       - Documentation
echo.
echo 🔗 Documentation:
echo    - API: /docs/API.md
echo    - User Manual: /docs/USER_MANUAL.md
echo    - Admin Manual: /docs/ADMIN_MANUAL.md
echo.
pause
goto MENU

:EXIT
cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                   Thank you for using                      ║
echo ║              Report Search System v1.0.0                   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
timeout /t 2 /nobreak >nul
exit
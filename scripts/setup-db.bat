@echo off
chcp 65001 >nul
color 0B
title Database Setup - Report Search System

echo ╔════════════════════════════════════════════════════════════╗
echo ║           Database Setup - Report Search System            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if PostgreSQL is available
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL is not available!
    echo Please install PostgreSQL and add it to PATH
    pause
    exit /b 1
)

echo ✅ PostgreSQL found
echo.

REM Get database credentials
set /p DB_HOST="Enter Database Host [localhost]: "
if "%DB_HOST%"=="" set DB_HOST=localhost

set /p DB_PORT="Enter Database Port [5432]: "
if "%DB_PORT%"=="" set DB_PORT=5432

set /p DB_USER="Enter Database User [postgres]: "
if "%DB_USER%"=="" set DB_USER=postgres

set /p DB_NAME="Enter Database Name [report_search_db]: "
if "%DB_NAME%"=="" set DB_NAME=report_search_db

echo.
echo Database Configuration:
echo - Host: %DB_HOST%
echo - Port: %DB_PORT%
echo - User: %DB_USER%
echo - Database: %DB_NAME%
echo.

set /p CONFIRM="Is this correct? (y/n): "
if /i not "%CONFIRM%"=="y" (
    echo Setup cancelled
    pause
    exit /b 0
)

echo.
echo [1/4] Creating database...
set PGPASSWORD=
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -c "CREATE DATABASE %DB_NAME%;" 2>nul
if %errorlevel% equ 0 (
    echo ✅ Database created successfully
) else (
    echo ℹ️  Database may already exist, continuing...
)
echo.

echo [2/4] Creating schema...
if exist database\schema.sql (
    psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f database\schema.sql
    if %errorlevel% equ 0 (
        echo ✅ Schema created successfully
    ) else (
        echo ❌ Failed to create schema
        pause
        exit /b 1
    )
) else (
    echo ❌ schema.sql file not found!
    pause
    exit /b 1
)
echo.

echo [3/4] Seeding initial data...
if exist database\seed.sql (
    psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f database\seed.sql
    if %errorlevel% equ 0 (
        echo ✅ Data seeded successfully
    ) else (
        echo ❌ Failed to seed data
        pause
        exit /b 1
    )
) else (
    echo ❌ seed.sql file not found!
    pause
    exit /b 1
)
echo.

echo [4/4] Updating .env file...
REM Update backend .env file with database credentials
if exist backend\.env (
    powershell -Command "(gc backend\.env) -replace 'DB_HOST=.*', 'DB_HOST=%DB_HOST%' | Out-File -encoding ASCII backend\.env"
    powershell -Command "(gc backend\.env) -replace 'DB_PORT=.*', 'DB_PORT=%DB_PORT%' | Out-File -encoding ASCII backend\.env"
    powershell -Command "(gc backend\.env) -replace 'DB_USER=.*', 'DB_USER=%DB_USER%' | Out-File -encoding ASCII backend\.env"
    powershell -Command "(gc backend\.env) -replace 'DB_NAME=.*', 'DB_NAME=%DB_NAME%' | Out-File -encoding ASCII backend\.env"
    echo ✅ .env file updated
) else (
    echo ⚠️  backend/.env not found, please configure manually
)
echo.

echo ╔════════════════════════════════════════════════════════════╗
echo ║              Database Setup Completed!                     ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo 📊 Database Summary:
echo    - Database: %DB_NAME%
echo    - Host: %DB_HOST%:%DB_PORT%
echo    - Tables created: ✅
echo    - Initial data: ✅
echo.
echo 🔐 Default User Accounts:
echo    - Super Admin: admin@example.com / Admin@123
echo    - Manager: manager@example.com / Admin@123
echo    - User: user@example.com / Admin@123
echo.
echo ⚠️  IMPORTANT: Change default passwords after first login!
echo.
echo Next step: Run scripts\start.bat to start the application
echo.
pause
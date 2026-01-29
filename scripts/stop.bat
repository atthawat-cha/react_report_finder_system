@echo off
chcp 65001 >nul
color 0C
title Stopping Report Search System

echo ╔════════════════════════════════════════════════════════════╗
echo ║         Stopping Report Search System...                   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo [1/2] Finding and stopping Node.js processes...

REM Find Node.js processes on port 5000 (Backend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Stopping Backend server (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
)

REM Find Node.js processes on port 3000 (Frontend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Stopping Frontend server (PID: %%a)
    taskkill /PID %%a /F >nul 2>&1
)

echo ✅ Process termination completed
echo.

echo [2/2] Cleaning up...
timeout /t 2 /nobreak >nul
echo ✅ Cleanup completed
echo.

echo ╔════════════════════════════════════════════════════════════╗
echo ║        Report Search System Stopped Successfully           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo All servers have been stopped.
echo.
echo To start again, run: scripts\start.bat
echo.
pause
@echo off
title CampusX — Learn • Share • Grow
color 0B
echo ========================================================
echo         🎓 CampusX — Learn • Share • Grow
echo      College Academic Resource-Sharing Platform
echo ========================================================
echo.

:: Switch to script's own directory
cd /d "%~dp0"

echo [1/2] Launching CampusX Express Backend on Port 3000...
start "CampusX Backend (Port 3000)" cmd /k "cd /d "%~dp0backend" && node server.js"

echo Waiting for API to initialize...
timeout /t 2 /nobreak >nul

echo [2/2] Opening CampusX in your default web browser...
start "" "http://localhost:3000/api/status"
start "" "index.html"

echo.
echo ========================================================
echo   CampusX is running!
echo   Frontend : index.html
echo   Backend  : http://localhost:3000
echo   Health   : http://localhost:3000/api/health
echo ========================================================
echo Press any key to close this launcher window (Backend stays running).
pause >nul

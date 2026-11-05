@echo off
title Queen's Domain // Install Tampermonkey Companion Userscript
cd /d "%~dp0"

echo ===================================================
echo   INSTALL SPAWN.CO AGENT & GLB COMPANION SCRIPT
echo ===================================================
echo.
echo Opening Userscript URL in your browser...
echo If you have Tampermonkey or Violentmonkey installed, click 'Install' on the page.
echo.

:: Ensure server is running
netstat -ano | findstr :47831 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Starting Queen's Domain server...
    start /b node server\server.js >nul 2>&1
    timeout /t 2 /nobreak >nul
)

start "" "http://127.0.0.1:47831/api/spawn/userscript"

echo.
echo [✔] Userscript served from http://127.0.0.1:47831/api/spawn/userscript
pause

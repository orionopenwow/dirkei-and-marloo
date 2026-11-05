@echo off
title Queen's Domain // Spawn.co Live Agent & GLB Bridge Launcher
cd /d "%~dp0"

echo ===================================================
echo   QUEEN'S DOMAIN // SPAWN.CO AGENT & GLB BRIDGE
echo ===================================================
echo.

:: 1. Check if Queen's Domain server is running on port 47831
netstat -ano | findstr :47831 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [✔] Queen's Domain server is already active on http://127.0.0.1:47831
) else (
    echo [*] Starting Queen's Domain background server...
    start /b node server\server.js >nul 2>&1
    timeout /t 2 /nobreak >nul
)

:: 2. Find Edge or Chrome executable for --app standalone window
set "BROWSER="
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "BROWSER=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not defined BROWSER if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "BROWSER=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if not defined BROWSER if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "BROWSER=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined BROWSER if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "BROWSER=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"

set "TARGET_URL=https://www.spawn.co"
if not "%~1"=="" set "TARGET_URL=%~1"

echo [*] Launching Spawn.co with Live Agent Bridge: %TARGET_URL%

if defined BROWSER (
    start "" "%BROWSER%" --app="%TARGET_URL%" --disable-features=Translate
) else (
    start "" "%TARGET_URL%"
)

echo.
echo [✔] Connected! The Tampermonkey Companion will now bridge in-game Three.js meshes and the AI agent.
echo.
pause

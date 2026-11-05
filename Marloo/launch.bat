@echo off
setlocal enabledelayedexpansion
title QueensDomain Launcher

echo ===================================================
echo   QUEEN'S DOMAIN // ARCHITECTURE ENGINE
echo ===================================================

:: If compiled native exe exists, run it directly
if exist "%~dp0QueensDomain.exe" (
  echo [INFO] Starting native QueensDomain.exe...
  start "" "%~dp0QueensDomain.exe"
  exit /b 0
)

:: Otherwise check scripts/launcher.ps1
if exist "%~dp0scripts\launcher.ps1" (
  set "PROJECT_ROOT=%~dp0"
  set "LAUNCHER=%~dp0scripts\launcher.ps1"
) else if exist "%~dp0ai-game-studio-main\scripts\launcher.ps1" (
  set "PROJECT_ROOT=%~dp0ai-game-studio-main"
  set "LAUNCHER=%~dp0ai-game-studio-main\scripts\launcher.ps1"
) else (
  echo [ERROR] Could not find launcher files!
  pause
  exit /b 1
)

echo [INFO] Launching app via PowerShell launcher...
powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%LAUNCHER%"

if %ERRORLEVEL% neq 0 (
  echo [INFO] Starting fallback server directly...
  cd /d "%PROJECT_ROOT%"
  start "" node server\server.js
  timeout /t 2 /nobreak >nul
  start "" http://127.0.0.1:47831/
)

echo [OK] Queen's Domain launched.

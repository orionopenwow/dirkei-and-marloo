@echo off
setlocal enabledelayedexpansion
title QueensDomain - Pull Fresh Updates from GitHub

echo ===================================================
echo   QUEEN'S DOMAIN // REPO UPDATE SYNCHRONIZER
echo ===================================================
echo Target: https://github.com/orionopenwow/queens-domain.git
echo.

cd /d "%~dp0"

:: 1. Check if git is available
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo [ERROR] Git is not installed or not found in system PATH.
  echo Please install Git for Windows from https://git-scm.com/
  echo.
  pause
  exit /b 1
)

:: 2. Check if this folder is a git repo
if not exist ".git" (
  echo [INFO] Initializing git repository in this folder...
  git init
  git remote add origin https://github.com/orionopenwow/queens-domain.git
)

:: Ensure remote origin points to orionopenwow/queens-domain
git remote get-url origin >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo [INFO] Setting remote origin...
  git remote add origin https://github.com/orionopenwow/queens-domain.git
) else (
  git remote set-url origin https://github.com/orionopenwow/queens-domain.git
)

echo [1/3] Fetching latest commits from GitHub...
git fetch origin main --tags

if %ERRORLEVEL% neq 0 (
  echo [ERROR] Failed to contact GitHub. Please check your internet connection.
  echo.
  pause
  exit /b 1
)

echo [2/3] Pulling updates from origin/main...
git checkout main >nul 2>nul
git pull origin main

if %ERRORLEVEL% neq 0 (
  echo.
  echo [WARN] Standard pull encountered local changes.
  echo Reset to fresh GitHub upstream state? (Y/N)
  set /p "CHOICE=Reset to origin/main? [Y/N]: "
  if /i "!CHOICE!"=="Y" (
    echo [INFO] Resetting local tree to origin/main...
    git reset --hard origin/main
    echo [OK] Reset to fresh GitHub upstream complete.
  ) else (
    echo [INFO] Kept local modified files.
  )
)

echo.
echo [3/3] Verifying integrity...
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
  if exist "tests\run.js" (
    echo Running invariant checks...
    node tests\run.js
  )
)

echo.
echo ===================================================
echo   PULL COMPLETE // REPO IS FRESH & UP TO DATE!
echo ===================================================
echo Latest commit:
git log -1 --oneline
echo.
pause

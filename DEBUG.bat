@echo off
REM ============================================
REM   DIAGNOSTIC SCRIPT - Find the Problem
REM ============================================

setlocal enabledelayedexpansion

title DIAGNOSTIC TEST

color 0A

echo.
echo ===================================================
echo         DIAGNOSTIC TEST - Finding Issue
echo ===================================================
echo.
echo STEP 1: Check Node.js
echo.

node --version
if %ERRORLEVEL% EQU 0 (
    echo ✓ Node.js is installed and working
) else (
    color 0C
    echo ✗ ERROR: Node.js NOT working!
    echo Try reinstalling from: https://nodejs.org
    pause
    exit /b 1
)

echo.
echo STEP 2: Check npm
echo.

npm --version
if %ERRORLEVEL% EQU 0 (
    echo ✓ npm is installed and working
) else (
    color 0C
    echo ✗ ERROR: npm NOT working!
    pause
    exit /b 1
)

echo.
echo STEP 3: Check Git
echo.

git --version
if %ERRORLEVEL% EQU 0 (
    echo ✓ Git is installed and working
) else (
    color 0C
    echo ✗ ERROR: Git NOT working!
    echo Try reinstalling from: https://git-scm.com
    pause
    exit /b 1
)

echo.
echo STEP 4: Check current directory
echo.
echo Current location: %cd%
cd /d "%~dp0"
echo Project directory: %cd%
if exist "package.json" (
    echo ✓ package.json found
) else (
    echo ✗ package.json NOT found!
    pause
    exit /b 1
)

echo.
echo STEP 5: Check if npm packages installed
echo.
if exist "node_modules" (
    echo ✓ node_modules exists
) else (
    echo ✗ node_modules NOT found
    echo Running: npm install
    call npm install
)

echo.
echo STEP 6: Test building
echo.
echo Running: npm run build
call npm run build
if %ERRORLEVEL% EQU 0 (
    echo ✓ Build succeeded!
) else (
    echo ✗ Build FAILED!
    color 0C
    pause
    exit /b 1
)

echo.
color 0A
echo ===================================================
echo ✓ ALL TESTS PASSED!
echo ===================================================
echo.
echo Your system is ready to deploy.
echo.
echo Next: Run START_KEEP_OPEN.bat
echo.

pause

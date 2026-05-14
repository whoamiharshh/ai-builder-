@echo off
REM ============================================
REM   SYNTHETICAI - DEPLOYMENT SCRIPT
REM   KEEPS WINDOW OPEN SO YOU CAN SEE RESULTS
REM ============================================

setlocal enabledelayedexpansion

title SyntheticAI - Master Deployment

color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                                                                  ║
echo ║              SYNTHETICAI PRODUCTION DEPLOYMENT                  ║
echo ║              Phase 9 - Monetization Complete                    ║
echo ║                                                                  ║
echo ║         🚀 One-Click Deployment to Live Production 🚀          ║
echo ║                                                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

REM Check prerequisites
echo Checking Prerequisites...
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo ✗ ERROR: Node.js not installed
    echo Install from: https://nodejs.org
    pause
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo ✗ ERROR: npm not installed
    pause
    exit /b 1
)

where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo ✗ ERROR: Git not installed
    echo Install from: https://git-scm.com
    pause
    exit /b 1
)

color 0A

echo ✓ Node.js
echo ✓ npm
echo ✓ Git
echo.

REM === MAIN MENU ===
:MAIN_MENU
color 0A

echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                     MAIN MENU                                    ║
echo ╠══════════════════════════════════════════════════════════════════╣
echo ║                                                                  ║
echo ║  1) 🧪 TEST PRODUCTION READINESS                                ║
echo ║                                                                  ║
echo ║  2) 🔧 SETUP ENVIRONMENT (Configure API keys)                   ║
echo ║                                                                  ║
echo ║  3) 📦 BUILD & COMMIT (Prepare code)                            ║
echo ║                                                                  ║
echo ║  4) 🚀 DEPLOY TO PRODUCTION                                     ║
echo ║                                                                  ║
echo ║  5) ⚡ QUICK START (ALL STEPS - RECOMMENDED)                    ║
echo ║                                                                  ║
echo ║  6) 📖 VIEW DOCUMENTATION                                       ║
echo ║                                                                  ║
echo ║  7) 🔙 EXIT                                                      ║
echo ║                                                                  ║
echo ║  *** THIS WINDOW WILL STAY OPEN ***                            ║
echo ║  *** YOU WILL SEE YOUR LIVE URL ***                            ║
echo ║                                                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

set /p CHOICE=Enter your choice (1-7): 

if "%CHOICE%"=="1" goto TEST_READY
if "%CHOICE%"=="2" goto SETUP_ENV
if "%CHOICE%"=="3" goto BUILD_COMMIT
if "%CHOICE%"=="4" goto DEPLOY_PROD
if "%CHOICE%"=="5" goto QUICK_START
if "%CHOICE%"=="6" goto VIEW_DOCS
if "%CHOICE%"=="7" goto EXIT_SCRIPT

echo Invalid choice. Try again.
timeout /t 2 >nul
cls
goto MAIN_MENU

REM ===== TEST READINESS =====
:TEST_READY
echo.
echo Running production readiness tests...
call test-ready.bat
pause
goto MAIN_MENU

REM ===== SETUP ENVIRONMENT =====
:SETUP_ENV
echo.
echo Running environment setup wizard...
call setup-env.bat
pause
goto MAIN_MENU

REM ===== BUILD AND COMMIT =====
:BUILD_COMMIT
echo.
echo Running local deployment...
call deploy-local.bat
pause
goto MAIN_MENU

REM ===== DEPLOY TO PRODUCTION =====
:DEPLOY_PROD
echo.
echo Starting deployment...
echo.
echo Choose your platform:
echo 1) Vercel (EASIEST - Recommended)
echo 2) Railway (Fast)
echo 3) AWS (Advanced)
echo.
set /p PLAT=Enter choice (1-3): 

if "%PLAT%"=="1" goto DEPLOY_VERCEL
if "%PLAT%"=="2" goto DEPLOY_RAILWAY
if "%PLAT%"=="3" goto DEPLOY_AWS

echo Invalid choice.
timeout /t 2 >nul
goto DEPLOY_PROD

:DEPLOY_VERCEL
echo.
echo Deploying to Vercel...
call deploy-vercel.bat
pause
goto MAIN_MENU

:DEPLOY_RAILWAY
echo.
echo Deploying to Railway...
call deploy-railway.bat
pause
goto MAIN_MENU

:DEPLOY_AWS
echo.
echo Deploying to AWS...
call deploy-aws.bat
pause
goto MAIN_MENU

REM ===== QUICK START =====
:QUICK_START
color 0F
cls

echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║   QUICK START - FULL AUTOMATION                                 ║
echo ║   (Everything runs automatically)                               ║
echo ║   (THIS WINDOW STAYS OPEN - YOU WILL SEE YOUR LIVE URL!)       ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

echo STEP 1 of 4: Testing Production Readiness...
echo.
call test-ready.bat

cls
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║   STEP 2 of 4: Setting Up Environment                          ║
echo ║   (You will be asked for your API keys)                        ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.
call setup-env.bat

cls
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║   STEP 3 of 4: Building & Committing Code                      ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.
call deploy-local.bat

cls
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║   STEP 4 of 4: Deploying to Production                         ║
echo ║   Choosing Vercel (easiest and fastest)                        ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

REM Auto-deploy to Vercel
call deploy-vercel.bat

color 0A
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║   ✓ QUICK START COMPLETE!                                       ║
echo ║                                                                  ║
echo ║   ⭐⭐⭐ LOOK ABOVE FOR YOUR LIVE URL ⭐⭐⭐                    ║
echo ║                                                                  ║
echo ║   It should say:                                                ║
echo ║   YOUR SITE IS NOW LIVE AT:                                    ║
echo ║   https://your-domain.vercel.app                               ║
echo ║                                                                  ║
echo ║   COPY THAT URL AND PASTE IN YOUR BROWSER!                     ║
echo ║                                                                  ║
echo ║   What to do next:                                              ║
echo ║   1. Copy the URL above                                        ║
echo ║   2. Open Google Chrome / Firefox / Safari                     ║
echo ║   3. Paste URL in address bar                                  ║
echo ║   4. Press Enter                                               ║
echo ║   5. See your LIVE WEBSITE! 🌍                                 ║
echo ║                                                                  ║
echo ║   6. Click "Pricing" → "Subscribe"                             ║
echo ║   7. Test with card: 4242 4242 4242 4242                      ║
echo ║   8. Verify payment works ✅                                    ║
echo ║   9. Check your email for confirmation                         ║
echo ║  10. Check Google Analytics for tracking                       ║
echo ║                                                                  ║
echo ║   🎉 YOU'RE NOW LIVE AND EARNING MONEY! 🎉                    ║
echo ║                                                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

REM Keep window open indefinitely
:STAY_OPEN
echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║  THIS WINDOW WILL NOW STAY OPEN                                ║
echo ║  Scroll up to see your live URL                                ║
echo ║  Press any key to close when done                              ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

pause
goto MAIN_MENU

REM ===== VIEW DOCUMENTATION =====
:VIEW_DOCS
color 0F

echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║   DOCUMENTATION FILES                                           ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

echo Quick Reference:
echo  • HOW_TO_START.md - Step-by-step visual guide
echo  • 00_START_HERE.md - 2-minute overview
echo  • QUICK_DEPLOY_REFERENCE.md - 5-minute guide
echo.

echo Deployment Guides:
echo  • FINAL_DEPLOYMENT_READY.md - 600-line complete guide
echo  • README_DEPLOYMENT.md - Quick start
echo.

echo Support:
echo  • TESTING_GUIDE.md - How to test
echo  • PRODUCTION_CHECKLIST.md - Checklist
echo.

set /p DOCFILE=Enter filename to open (or press Enter to skip): 

if not "!DOCFILE!"=="" (
    if exist !DOCFILE! (
        start !DOCFILE!
        echo ✓ Opening !DOCFILE!
    ) else (
        echo ✗ File not found: !DOCFILE!
    )
)

echo.
pause
goto MAIN_MENU

REM ===== EXIT =====
:EXIT_SCRIPT
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║   GOODBYE!                                                      ║
echo ║                                                                  ║
echo ║   Your site is ready to deploy!                                ║
echo ║   Run START_KEEP_OPEN.bat again to continue.                   ║
echo ║                                                                  ║
echo ║   Good luck! 🚀                                                 ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

pause
exit /b 0

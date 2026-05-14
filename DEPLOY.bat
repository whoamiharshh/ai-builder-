@echo off
setlocal enabledelayedexpansion

REM ============================================
REM   SYNTHETICAI - MASTER DEPLOYMENT SCRIPT
REM   Complete Automation from Local to Live
REM ============================================

title SyntheticAI Phase 9 - Master Deployment

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║         SYNTHETICAI - PHASE 9 COMPLETE DEPLOYMENT             ║
echo ║         Monetization System Ready to Launch                   ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check Prerequisites
echo ✓ Checking Prerequisites...
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ✗ ERROR: Node.js not found
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js installed

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ✗ ERROR: npm not found
    pause
    exit /b 1
)
echo ✓ npm installed

where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ✗ ERROR: Git not found
    echo Please install Git from https://git-scm.com
    pause
    exit /b 1
)
echo ✓ Git installed

echo.
echo ✓ All prerequisites met!
echo.

REM Menu Selection
:MENU
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   DEPLOYMENT OPTIONS                                          ║
echo ╠════════════════════════════════════════════════════════════════╣
echo ║                                                                ║
echo ║   1) FULL LOCAL DEPLOYMENT (Commit + Build)                   ║
echo ║      ├─ Commits code to git                                   ║
echo ║      └─ Verifies production build                             ║
echo ║                                                                ║
echo ║   2) DEPLOY TO VERCEL (Recommended)                           ║
echo ║      ├─ Easiest deployment                                    ║
echo ║      ├─ Free tier available                                   ║
echo ║      └─ Takes ~5-10 minutes                                   ║
echo ║                                                                ║
echo ║   3) DEPLOY TO RAILWAY (Fast)                                 ║
echo ║      ├─ Great for full-stack apps                            ║
echo ║      ├─ Free tier available                                   ║
echo ║      └─ Takes ~5-10 minutes                                   ║
echo ║                                                                ║
echo ║   4) DEPLOY TO AWS (Advanced)                                 ║
echo ║      ├─ Most control & features                               ║
echo ║      ├─ Requires AWS account & CLI                            ║
echo ║      └─ Takes ~15-20 minutes                                  ║
echo ║                                                                ║
echo ║   5) COMPLETE SETUP (All of above)                            ║
echo ║      ├─ Runs full local deployment                            ║
echo ║      ├─ Sets up all infrastructure                            ║
echo ║      └─ Takes ~45-60 minutes total                            ║
echo ║                                                                ║
echo ║   6) EXIT                                                      ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

set /p CHOICE=Enter your choice (1-6): 

if "%CHOICE%"=="1" goto LOCAL_DEPLOY
if "%CHOICE%"=="2" goto VERCEL_DEPLOY
if "%CHOICE%"=="3" goto RAILWAY_DEPLOY
if "%CHOICE%"=="4" goto AWS_DEPLOY
if "%CHOICE%"=="5" goto COMPLETE_SETUP
if "%CHOICE%"=="6" goto EXIT_SCRIPT

echo Invalid choice. Please try again.
echo.
goto MENU

REM ===== LOCAL DEPLOYMENT =====
:LOCAL_DEPLOY
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   STARTING LOCAL DEPLOYMENT                                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

call deploy-local.bat
if %ERRORLEVEL% NEQ 0 goto DEPLOY_FAILED

echo.
echo ✓ Local deployment complete!
echo Your code is committed and built.
echo.
goto MENU

REM ===== VERCEL DEPLOYMENT =====
:VERCEL_DEPLOY
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   STARTING VERCEL DEPLOYMENT                                  ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

call deploy-vercel.bat
if %ERRORLEVEL% NEQ 0 goto DEPLOY_FAILED

echo.
echo ✓ Vercel deployment complete!
echo.
goto MENU

REM ===== RAILWAY DEPLOYMENT =====
:RAILWAY_DEPLOY
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   STARTING RAILWAY DEPLOYMENT                                 ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

call deploy-railway.bat
if %ERRORLEVEL% NEQ 0 goto DEPLOY_FAILED

echo.
echo ✓ Railway deployment complete!
echo.
goto MENU

REM ===== AWS DEPLOYMENT =====
:AWS_DEPLOY
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   STARTING AWS DEPLOYMENT                                     ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

call deploy-aws.bat
if %ERRORLEVEL% NEQ 0 goto DEPLOY_FAILED

echo.
echo ✓ AWS deployment complete!
echo.
goto MENU

REM ===== COMPLETE SETUP =====
:COMPLETE_SETUP
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   RUNNING COMPLETE SETUP                                      ║
echo ║   This will deploy everywhere (takes 45-60 min)               ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Step 1: Local deployment
call deploy-local.bat
if %ERRORLEVEL% NEQ 0 goto DEPLOY_FAILED

REM Step 2: Ask which platforms
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   SELECT PLATFORMS TO DEPLOY TO                               ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Which platforms would you like to deploy to?
echo.

set /p DEPLOY_VERCEL=Deploy to Vercel? (y/n): 
set /p DEPLOY_RAILWAY=Deploy to Railway? (y/n): 
set /p DEPLOY_AWS=Deploy to AWS? (y/n): 

if /i "%DEPLOY_VERCEL%"=="y" (
    echo.
    call deploy-vercel.bat
)

if /i "%DEPLOY_RAILWAY%"=="y" (
    echo.
    call deploy-railway.bat
)

if /i "%DEPLOY_AWS%"=="y" (
    echo.
    call deploy-aws.bat
)

echo.
echo ✓ Complete setup finished!
echo.
goto MENU

REM ===== ERROR HANDLING =====
:DEPLOY_FAILED
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   ✗ DEPLOYMENT FAILED                                         ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Please check the error messages above and try again.
echo.
goto MENU

REM ===== EXIT =====
:EXIT_SCRIPT
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   THANK YOU FOR USING SYNTHETICAI DEPLOYMENT                  ║
echo ║                                                                ║
echo ║   Your platform is ready to generate revenue!                 ║
echo ║                                                                ║
echo ║   For help, see: FINAL_DEPLOYMENT_READY.md                    ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

exit /b 0

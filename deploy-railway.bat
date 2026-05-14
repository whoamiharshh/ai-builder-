@echo off
REM ============================================
REM   Deploy to Railway (Fast & Easy)
REM ============================================

echo.
echo ╔════════════════════════════════════════╗
echo ║   DEPLOYING TO RAILWAY                 ║
echo ║   (Fast & Easy)                        ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if Railway CLI is installed
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Railway CLI not found. Installing...
    call npm install -g @railway/cli
)

echo.
echo ╔════════════════════════════════════════╗
echo ║   STEP 1: Login to Railway             ║
echo ╚════════════════════════════════════════╝
echo.
echo If you don't have a Railway account:
echo   1. Go to https://railway.app/
echo   2. Create free account (GitHub login)
echo   3. Come back here
echo.

railway login

echo.
echo ╔════════════════════════════════════════╗
echo ║   STEP 2: Initialize Railway Project   ║
echo ╚════════════════════════════════════════╝
echo.

railway init

echo.
echo ╔════════════════════════════════════════╗
echo ║   STEP 3: Deploy to Production         ║
echo ╚════════════════════════════════════════╝
echo.

railway up --detach

echo.
echo ╔════════════════════════════════════════╗
echo ║   STEP 4: Add Environment Variables    ║
echo ╚════════════════════════════════════════╝
echo.
echo Railway Dashboard Instructions:
echo   1. Go to: https://railway.app/dashboard
echo   2. Click your project
echo   3. Click your service
echo   4. Click "Variables" tab
echo   5. Add these variables:
echo.
echo   STRIPE_SECRET_KEY = sk_live_...
echo   VITE_STRIPE_PUBLISHABLE_KEY = pk_live_...
echo   STRIPE_WEBHOOK_SECRET = whsec_...
echo   VITE_GOOGLE_ANALYTICS_ID = G-XXXXXXXXXX
echo.

echo ╔════════════════════════════════════════╗
echo ║   ✓ RAILWAY DEPLOYMENT COMPLETE       ║
echo ║                                        ║
echo ║   Your site will be live in ~1 minute  ║
echo ║   Check: https://railway.app/dashboard ║
echo ╚════════════════════════════════════════╝
echo.

pause

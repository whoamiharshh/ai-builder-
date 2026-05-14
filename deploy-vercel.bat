@echo off
REM ============================================
REM   Deploy to Vercel (Recommended - Easiest)
REM ============================================

echo.
echo ╔════════════════════════════════════════╗
echo ║   DEPLOYING TO VERCEL                  ║
echo ║   (Easiest Option)                     ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Vercel CLI not found. Installing...
    call npm install -g vercel
)

echo.
echo ╔════════════════════════════════════════╗
echo ║   STEP 1: Login to Vercel              ║
echo ╚════════════════════════════════════════╝
echo.
echo If you don't have a Vercel account:
echo   1. Go to https://vercel.com/signup
echo   2. Create free account
echo   3. Come back here
echo.

vercel login

echo.
echo ╔════════════════════════════════════════╗
echo ║   STEP 2: Deploy to Production         ║
echo ╚════════════════════════════════════════╝
echo.

vercel --prod

echo.
echo ╔════════════════════════════════════════╗
echo ║   STEP 3: Add Environment Variables    ║
echo ╚════════════════════════════════════════╝
echo.
echo Vercel Dashboard Instructions:
echo   1. Go to: https://vercel.com/dashboard
echo   2. Click your project
echo   3. Click "Settings" tab
echo   4. Click "Environment Variables"
echo   5. Add these variables:
echo.
echo   STRIPE_SECRET_KEY = sk_live_...
echo   VITE_STRIPE_PUBLISHABLE_KEY = pk_live_...
echo   STRIPE_WEBHOOK_SECRET = whsec_...
echo   VITE_GOOGLE_ANALYTICS_ID = G-XXXXXXXXXX
echo.
echo   (Get these from Stripe dashboard and Google Analytics)
echo.

echo ╔════════════════════════════════════════╗
echo ║   ✓ VERCEL DEPLOYMENT COMPLETE        ║
echo ║                                        ║
echo ║   Your site is now live at:            ║
echo ║   https://your-domain.vercel.app      ║
echo ║                                        ║
echo ║   or your custom domain                ║
echo ╚════════════════════════════════════════╝
echo.

pause

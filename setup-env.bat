@echo off
REM ============================================
REM   Setup Environment Variables
REM   Run this to configure your deployment
REM ============================================

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   ENVIRONMENT SETUP WIZARD                                    ║
echo ║   Configure secrets for production deployment                 ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Create .env.production file
setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   STEP 1: STRIPE KEYS                                         ║
echo ║   Get from: https://dashboard.stripe.com/apikeys              ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

set /p STRIPE_SECRET=Enter STRIPE_SECRET_KEY (sk_live_...): 
set /p STRIPE_PUBLISHABLE=Enter VITE_STRIPE_PUBLISHABLE_KEY (pk_live_...): 
set /p STRIPE_WEBHOOK=Enter STRIPE_WEBHOOK_SECRET (whsec_...): 

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   STEP 2: GOOGLE ANALYTICS                                    ║
echo ║   Get from: https://analytics.google.com/                     ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

set /p GA_ID=Enter VITE_GOOGLE_ANALYTICS_ID (G-XXXXXXXXXX): 

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   STEP 3: EMAIL SERVICE (Optional)                            ║
echo ║   Get from: https://sendgrid.com/                             ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

set /p SENDGRID_KEY=Enter SENDGRID_API_KEY (or press Enter to skip): 

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   STEP 4: ERROR MONITORING (Optional)                         ║
echo ║   Get from: https://sentry.io/                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

set /p SENTRY_DSN=Enter SENTRY_DSN (or press Enter to skip): 

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   STEP 5: DATABASE (If using Supabase)                        ║
echo ║   Get from: https://supabase.com/                             ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

set /p DATABASE_URL=Enter DATABASE_URL (PostgreSQL, or press Enter to skip): 

REM Create .env.production
echo.
echo Creating .env.production...
echo.

(
    echo # Stripe Configuration
    echo STRIPE_SECRET_KEY=%STRIPE_SECRET%
    echo VITE_STRIPE_PUBLISHABLE_KEY=%STRIPE_PUBLISHABLE%
    echo STRIPE_WEBHOOK_SECRET=%STRIPE_WEBHOOK%
    echo.
    echo # Google Analytics
    echo VITE_GOOGLE_ANALYTICS_ID=%GA_ID%
    echo.
) > .env.production

if not "!SENDGRID_KEY!"=="" (
    echo SENDGRID_API_KEY=!SENDGRID_KEY! >> .env.production
    echo. >> .env.production
)

if not "!SENTRY_DSN!"=="" (
    echo SENTRY_DSN=!SENTRY_DSN! >> .env.production
    echo. >> .env.production
)

if not "!DATABASE_URL!"=="" (
    echo DATABASE_URL=!DATABASE_URL! >> .env.production
    echo. >> .env.production
)

echo.
echo ✓ .env.production created successfully!
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   ENVIRONMENT SETUP COMPLETE                                  ║
echo ║                                                                ║
echo ║   Your .env.production file is ready:                         ║
echo ║   - Stripe API keys configured                                ║
echo ║   - Google Analytics configured                               ║
echo ║   - Optional services configured                              ║
echo ║                                                                ║
echo ║   IMPORTANT:                                                  ║
echo ║   - Never commit .env.production to git                       ║
echo ║   - Keep this file secure and private                         ║
echo ║   - Add to .gitignore (already done)                          ║
echo ║                                                                ║
echo ║   Next: Run DEPLOY.bat to deploy                              ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

pause

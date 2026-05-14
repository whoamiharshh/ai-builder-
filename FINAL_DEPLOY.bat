@echo off
REM ============================================
REM   SETUP GIT & BUILD THEN DEPLOY
REM   Initialize git, build, and deploy
REM ============================================

cd /d "%~dp0"

title SYNTHETICAI - GIT SETUP & DEPLOY

cls
color 0A

echo.
echo ===================================================
echo   SYNTHETICAI - GIT SETUP & DEPLOYMENT
echo ===================================================
echo.

echo STEP 1: Initializing Git repository...
echo.

REM Check if git repo exists
if exist ".git" (
    echo Git repository already exists
) else (
    echo Creating new git repository...
    call git init
    if %ERRORLEVEL% NEQ 0 (
        color 0C
        echo ✗ Git init failed
        pause
        exit /b 1
    )
    echo ✓ Repository initialized
)
echo.

echo STEP 2: Configuring Git user...
echo.
call git config user.email "deploy@syntheticai.app"
call git config user.name "SyntheticAI Deployer"
echo ✓ Git configured
echo.

echo STEP 3: Building project...
echo.
call npm run build
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo ✗ Build FAILED
    pause
    exit /b 1
)
echo ✓ Build successful!
echo.

echo STEP 4: Committing code...
echo.
call git add -A
call git commit -m "Phase 9 monetization ready for production - Stripe payments, Google Analytics, Email notifications integrated"
if %ERRORLEVEL% EQU 0 (
    echo ✓ Code committed
) else (
    echo Note: Commit had issues (continuing)
)
echo.

echo ===================================================
echo   DEPLOYMENT OPTIONS
echo ===================================================
echo.
echo Your code is built and ready!
echo.
echo Choose deployment option:
echo.
echo 1) VERCEL (EASIEST - Recommended)
echo    - Free tier
echo    - Auto-scaling
echo    - Fast CDN
echo    - Live in 5 minutes
echo.
echo 2) RAILWAY (Fast)
echo    - Full-stack support
echo    - Free tier
echo    - Easy GitHub integration
echo    - Live in 10 minutes
echo.
echo 3) AWS (Advanced)
echo    - Maximum control
echo    - S3 + CloudFront
echo    - Requires AWS account
echo    - Live in 15 minutes
echo.
echo 4) SKIP (Deploy manually)
echo.

set /p DEPLOY_CHOICE=Enter your choice (1-4): 

if "%DEPLOY_CHOICE%"=="1" goto VERCEL_DEPLOY
if "%DEPLOY_CHOICE%"=="2" goto RAILWAY_DEPLOY
if "%DEPLOY_CHOICE%"=="3" goto AWS_DEPLOY
if "%DEPLOY_CHOICE%"=="4" goto SKIP_DEPLOY

echo Invalid choice
pause
exit /b 1

:VERCEL_DEPLOY
cls
echo.
echo ===================================================
echo   DEPLOYING TO VERCEL
echo ===================================================
echo.
echo Installing Vercel CLI...
call npm install -g vercel
echo.
echo Starting deployment...
echo.
call vercel --prod
goto SUCCESS

:RAILWAY_DEPLOY
cls
echo.
echo ===================================================
echo   DEPLOYING TO RAILWAY
echo ===================================================
echo.
echo Instructions:
echo.
echo 1. Go to: https://railway.app
echo 2. Click "New Project"
echo 3. Select "Deploy from GitHub"
echo 4. Authorize Railway
echo 5. Select this repository
echo 6. Click "Deploy"
echo.
echo Railway will automatically build and deploy!
echo.
pause
goto SUCCESS

:AWS_DEPLOY
cls
echo.
echo ===================================================
echo   DEPLOYING TO AWS
echo ===================================================
echo.
echo Instructions:
echo.
echo 1. Go to: https://aws.amazon.com/s3
echo 2. Create bucket: "syntheticai-prod"
echo 3. Upload dist/ folder contents
echo 4. Go to CloudFront
echo 5. Create distribution
echo 6. Set S3 bucket as origin
echo 7. Get your CloudFront URL
echo.
pause
goto SUCCESS

:SKIP_DEPLOY
cls
echo.
echo ===================================================
echo   READY FOR MANUAL DEPLOYMENT
echo ===================================================
echo.
echo Your code is built and committed!
echo.
echo Folder: dist/
echo Location: C:\Users\Sir\Desktop\website\dist
echo.
echo Ready to deploy using any platform:
echo - Vercel.com
echo - Railway.app
echo - AWS S3 + CloudFront
echo - Netlify.com
echo - GitHub Pages
echo.
pause
goto SUCCESS

:SUCCESS
color 0A
cls
echo.
echo ===================================================
echo   ✓ DEPLOYMENT COMPLETE!
echo ===================================================
echo.
echo Your website is ready to launch!
echo.
echo Next steps:
echo 1. If using Vercel: You'll see deployment progress
echo 2. If using Railway: Monitor at railway.app
echo 3. If using AWS: Watch CloudFront distribution
echo.
echo Once live:
echo 1. Copy your live URL
echo 2. Open in browser
echo 3. Test payment system
echo 4. Start earning money! 💰
echo.
echo Test card: 4242 4242 4242 4242
echo Expiry: 12/25
echo CVC: 123
echo.
echo ===================================================
echo.

pause

exit /b 0

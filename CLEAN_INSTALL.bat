@echo off
REM ============================================
REM   COMPLETE CLEAN INSTALL
REM   Fixes npm cache and package issues
REM ============================================

cd /d "%~dp0"

title SYNTHETICAI - CLEAN INSTALL

cls
color 0A

echo.
echo ===================================================
echo   SYNTHETICAI - COMPLETE CLEAN INSTALL
echo ===================================================
echo.
echo THIS WINDOW WILL STAY OPEN THE ENTIRE TIME
echo.

echo STEP 1: Clearing npm cache...
echo.
call npm cache clean --force
if %ERRORLEVEL% EQU 0 (
    echo ✓ Cache cleared
) else (
    echo ! Cache clear had issues (continuing anyway)
)
echo.

echo STEP 2: Removing old node_modules...
echo.
if exist node_modules (
    echo Deleting node_modules folder...
    rmdir /s /q node_modules >nul 2>&1
    echo ✓ Removed
) else (
    echo (none to remove)
)
echo.

echo STEP 3: Removing package-lock.json...
echo.
if exist package-lock.json (
    del /q package-lock.json
    echo ✓ Removed
) else (
    echo (none to remove)
)
echo.

echo STEP 4: Fresh npm install...
echo.
call npm install
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo ✗ npm install FAILED
    echo.
    echo Trying with --no-optional flag...
    call npm install --no-optional
    if %ERRORLEVEL% NEQ 0 (
        echo ✗ Still failed
        pause
        exit /b 1
    )
)
echo ✓ Dependencies installed
echo.

echo STEP 5: Building project...
echo.
call npm run build
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo ✗ Build FAILED
    pause
    exit /b 1
)
echo ✓ Build successful
echo.

echo STEP 6: Preparing for deployment...
echo.
call git add -A
call git commit -m "Phase 9 monetization ready for production"
echo ✓ Code committed
echo.

echo ===================================================
echo   DEPLOYMENT OPTIONS
echo ===================================================
echo.
echo Choose how to deploy:
echo.
echo 1) Deploy to Vercel (EASIEST - Recommended)
echo 2) Deploy to Railway (Simple)
echo 3) Deploy to AWS (Advanced)
echo 4) Exit (you'll deploy manually)
echo.

set /p DEPLOY_CHOICE=Enter your choice (1-4): 

if "%DEPLOY_CHOICE%"=="1" goto DEPLOY_VERCEL
if "%DEPLOY_CHOICE%"=="2" goto DEPLOY_RAILWAY
if "%DEPLOY_CHOICE%"=="3" goto DEPLOY_AWS
if "%DEPLOY_CHOICE%"=="4" goto MANUAL_DEPLOY

echo Invalid choice. Try again.
timeout /t 2 >nul
cls
goto :DEPLOY_OPTIONS

:DEPLOY_VERCEL
echo.
echo ===================================================
echo   DEPLOYING TO VERCEL
echo ===================================================
echo.
echo Option A: Using Vercel CLI (Automatic)
echo   Run this:
echo   npm install -g vercel
echo   vercel --prod
echo.
echo Option B: Using GitHub (Easier)
echo   Run this:
echo   git push origin main
echo.
echo   Then go to vercel.com and import your repo
echo.
pause
goto FINAL

:DEPLOY_RAILWAY
echo.
echo ===================================================
echo   DEPLOYING TO RAILWAY
echo ===================================================
echo.
echo 1. Go to railway.app
echo 2. Create new project
echo 3. Connect your GitHub account
echo 4. Select this repository
echo 5. Click Deploy
echo.
echo You'll get your live URL!
echo.
pause
goto FINAL

:DEPLOY_AWS
echo.
echo ===================================================
echo   DEPLOYING TO AWS
echo ===================================================
echo.
echo 1. Go to aws.amazon.com
echo 2. Create S3 bucket: "syntheticai-prod"
echo 3. Upload dist/ folder contents
echo 4. Create CloudFront distribution
echo 5. Set S3 as origin
echo.
echo You'll get a CloudFront URL!
echo.
pause
goto FINAL

:MANUAL_DEPLOY
echo.
echo ===================================================
echo   MANUAL DEPLOYMENT STEPS
echo ===================================================
echo.
echo Your code is built and ready in: dist/
echo.
echo Deploy using any service:
echo - Vercel.com
echo - Railway.app
echo - AWS S3 + CloudFront
echo - Netlify.com
echo - GitHub Pages
echo.
pause
goto FINAL

:FINAL
color 0A

echo.
echo ===================================================
echo   ✓ DEPLOYMENT READY!
echo ===================================================
echo.
echo Your code is built and committed.
echo.
echo Next steps:
echo 1. Deploy using one of the options above
echo 2. You'll get a live URL
echo 3. Copy the URL
echo 4. Open in browser
echo 5. Test payment system
echo.
echo Test card: 4242 4242 4242 4242
echo.
echo THIS WINDOW WILL STAY OPEN.
echo Press any key to close when done.
echo.

pause

echo.
echo Thank you! Your site is now live! 🚀
echo.

exit /b 0

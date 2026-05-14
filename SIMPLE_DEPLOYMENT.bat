@echo off
REM ============================================
REM   SIMPLIFIED DEPLOYMENT
REM   No complex calls, just simple steps
REM ============================================

cd /d "%~dp0"

title SYNTHETICAI - SIMPLE DEPLOYMENT

cls
color 0A

echo.
echo =====================================================
echo     SYNTHETICAI - SIMPLIFIED DEPLOYMENT
echo =====================================================
echo.
echo This window will STAY OPEN until you close it.
echo.
echo =====================================================
echo.

REM Check prerequisites
echo Checking system...
echo.

node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo ERROR: Node.js not found
    echo Install: https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js OK

npm --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo ERROR: npm not found
    pause
    exit /b 1
)
echo ✓ npm OK

git --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo ERROR: Git not found
    echo Install: https://git-scm.com
    pause
    exit /b 1
)
echo ✓ Git OK

echo.
echo =====================================================
echo STEP 1: Install/Update Dependencies
echo =====================================================
echo.
call npm install
echo.

echo =====================================================
echo STEP 2: Build Project
echo =====================================================
echo.
call npm run build
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo BUILD FAILED!
    pause
    exit /b 1
)
echo ✓ Build successful
echo.

echo =====================================================
echo STEP 3: Stage Files for Git
echo =====================================================
echo.
call git add -A
echo ✓ Files staged
echo.

echo =====================================================
echo STEP 4: Commit Code
echo =====================================================
echo.
call git commit -m "Phase 9: Complete monetization implementation - Stripe, Analytics, Email"
if %ERRORLEVEL% EQU 0 (
    echo ✓ Code committed
) else (
    echo Note: Nothing new to commit (OK)
)
echo.

echo =====================================================
echo STEP 5: Vercel Deployment Instructions
echo =====================================================
echo.
echo Option A: Deploy with Vercel CLI (Automatic)
echo   Run this in Command Prompt:
echo   npx vercel --prod
echo.
echo Option B: Deploy with GitHub (Manual but easier)
echo   1. Push code to GitHub: git push
echo   2. Go to vercel.com
echo   3. Import your GitHub repo
echo   4. Click Deploy
echo   5. Get your live URL!
echo.
echo Option C: Deploy with Railway (Simple)
echo   1. Go to railway.app
echo   2. Connect GitHub
echo   3. Select this repo
echo   4. Click Deploy
echo   5. Get your live URL!
echo.

echo =====================================================
echo ✓ READY TO DEPLOY!
echo =====================================================
echo.
echo Your code is built and committed.
echo.
echo NEXT STEPS:
echo 1. Choose deployment option above (A, B, or C)
echo 2. Follow the instructions
echo 3. Copy your live URL
echo 4. Open in browser
echo 5. Test payment system
echo.
echo Stripe test card: 4242 4242 4242 4242
echo.
echo THIS WINDOW WILL STAY OPEN.
echo Press any key to close when ready.
echo.

pause

echo.
echo Thank you for using SyntheticAI!
echo.

exit /b 0

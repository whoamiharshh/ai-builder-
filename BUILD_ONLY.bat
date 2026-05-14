@echo off
REM ============================================
REM   SIMPLE BUILD ONLY
REM   Just builds - you deploy manually
REM ============================================

cd /d "%~dp0"

title SYNTHETICAI - SIMPLE BUILD

cls
color 0A

echo.
echo ===================================================
echo   SYNTHETICAI - SIMPLE BUILD
echo ===================================================
echo.
echo This will ONLY build your code.
echo You will deploy manually using web interfaces.
echo.

echo STEP 1: Building project...
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

color 0A

echo ===================================================
echo   ✓ BUILD COMPLETE!
echo ===================================================
echo.
echo Your website files are ready in: dist/
echo Location: C:\Users\Sir\Desktop\website\dist
echo.
echo Now choose one of these options:
echo.
echo OPTION 1: DEPLOY WITH VERCEL (Web UI - No CLI)
echo   1. Go to: https://vercel.com/new
echo   2. Click: "Create Git Repository"
echo   3. Or connect your GitHub account
echo   4. Upload dist/ folder
echo   5. Click Deploy
echo   Time: ~5 minutes
echo.
echo OPTION 2: DEPLOY WITH NETLIFY (Easy)
echo   1. Go to: https://app.netlify.com/drop
echo   2. Drag and drop dist/ folder
echo   3. Wait for deployment
echo   4. Get your URL immediately
echo   Time: ~1 minute
echo.
echo OPTION 3: DEPLOY WITH GITHUB PAGES (Free)
echo   1. Go to: https://github.com/new
echo   2. Create new repository
echo   3. Upload dist/ folder contents
echo   4. Go to Settings → Pages
echo   5. Enable GitHub Pages
echo   Time: ~10 minutes
echo.
echo OPTION 4: TEST LOCALLY FIRST
echo   Run: npx http-server dist
echo   Then: Open http://localhost:8080
echo   Test before deploying!
echo.
echo ===================================================
echo.
echo NEXT STEPS:
echo 1. Choose one option above
echo 2. Follow the instructions
echo 3. Your site will be LIVE! 🌍
echo.

pause

exit /b 0

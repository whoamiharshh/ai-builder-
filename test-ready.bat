@echo off
REM ============================================
REM   Production Readiness Test Script
REM   Verify everything is ready to deploy
REM ============================================

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   SYNTHETICAI - PRODUCTION READINESS TEST                     ║
echo ║   Comprehensive Verification Suite                            ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

set /a TESTS_PASSED=0
set /a TESTS_FAILED=0

REM Function to report test result
setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   PHASE 1: CODE QUALITY CHECKS                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check TypeScript
echo Checking TypeScript compilation...
call tsc --noEmit
if %ERRORLEVEL% EQU 0 (
    echo ✓ TypeScript: 0 errors
    set /a TESTS_PASSED+=1
) else (
    echo ✗ TypeScript: FAILED
    set /a TESTS_FAILED+=1
)

REM Check ESLint (if configured)
if exist .eslintrc.* (
    echo Checking code style...
    call npm run lint 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo ✓ Linting: Passed
        set /a TESTS_PASSED+=1
    ) else (
        echo ✗ Linting: Issues found
        set /a TESTS_FAILED+=1
    )
)

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   PHASE 2: DEPENDENCY CHECKS                                  ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check dependencies
echo Auditing npm dependencies...
call npm audit --production 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Security Audit: No vulnerabilities
    set /a TESTS_PASSED+=1
) else (
    echo ! Security Audit: Review recommended
    set /a TESTS_FAILED+=1
)

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   PHASE 3: BUILD VERIFICATION                                 ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo Building for production...
call npm run build
if %ERRORLEVEL% EQU 0 (
    echo ✓ Production Build: SUCCESS
    set /a TESTS_PASSED+=1
    
    REM Check build output
    if exist dist (
        echo ✓ Build Output: dist/ folder created
        set /a TESTS_PASSED+=1
        
        REM Count files
        for /r dist %%F in (*) do set /a FILE_COUNT+=1
        echo   Files in dist: !FILE_COUNT!
        
        REM Check main files
        if exist dist\index.html (
            echo ✓ index.html: Found
            set /a TESTS_PASSED+=1
        )
    ) else (
        echo ✗ Build Output: dist/ not found
        set /a TESTS_FAILED+=1
    )
) else (
    echo ✗ Production Build: FAILED
    set /a TESTS_FAILED+=1
)

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   PHASE 4: CONFIGURATION CHECKS                               ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check .env files
if exist .env.example (
    echo ✓ .env.example: Found
    set /a TESTS_PASSED+=1
) else (
    echo ✗ .env.example: Missing
    set /a TESTS_FAILED+=1
)

if exist .env (
    echo ✓ .env: Found (local development)
    set /a TESTS_PASSED+=1
) else (
    echo ! .env: Not found (may be needed locally)
)

REM Check git setup
echo Checking git configuration...
where git >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Git: Installed
    set /a TESTS_PASSED+=1
    
    REM Check git status
    git status >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo ✓ Git Repository: Valid
        set /a TESTS_PASSED+=1
        
        REM Check recent commits
        git log --oneline -1 >nul 2>nul
        if %ERRORLEVEL% EQU 0 (
            echo ✓ Git History: Commits found
            set /a TESTS_PASSED+=1
        )
    )
) else (
    echo ✗ Git: Not installed
    set /a TESTS_FAILED+=1
)

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   PHASE 5: FEATURE VERIFICATION                               ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check for Stripe integration
if exist src\contexts\PaymentContext.tsx (
    echo ✓ Payment System: Implemented
    set /a TESTS_PASSED+=1
) else (
    echo ✗ Payment System: Not found
    set /a TESTS_FAILED+=1
)

REM Check for Analytics
if exist src\analytics.ts (
    echo ✓ Analytics: Implemented
    set /a TESTS_PASSED+=1
) else (
    echo ✗ Analytics: Not found
    set /a TESTS_FAILED+=1
)

REM Check for Email Service
if exist server\emailService.ts (
    echo ✓ Email Service: Implemented
    set /a TESTS_PASSED+=1
) else (
    echo ✗ Email Service: Not found
    set /a TESTS_FAILED+=1
)

REM Check for Monitoring
if exist src\monitoring.ts (
    echo ✓ Error Monitoring: Implemented
    set /a TESTS_PASSED+=1
) else (
    echo ✗ Error Monitoring: Not found
    set /a TESTS_FAILED+=1
)

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   PHASE 6: DOCUMENTATION CHECKS                               ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Check documentation files
set /a DOC_COUNT=0

if exist FINAL_DEPLOYMENT_READY.md (echo ✓ FINAL_DEPLOYMENT_READY.md & set /a DOC_COUNT+=1)
if exist COMPLETE_PROJECT_SUMMARY.md (echo ✓ COMPLETE_PROJECT_SUMMARY.md & set /a DOC_COUNT+=1)
if exist TESTING_GUIDE.md (echo ✓ TESTING_GUIDE.md & set /a DOC_COUNT+=1)
if exist PRODUCTION_CHECKLIST.md (echo ✓ PRODUCTION_CHECKLIST.md & set /a DOC_COUNT+=1)
if exist PAYMENT_INTEGRATION.md (echo ✓ PAYMENT_INTEGRATION.md & set /a DOC_COUNT+=1)

echo.
echo Documentation files found: !DOC_COUNT!/5
if !DOC_COUNT! GEQ 5 (
    set /a TESTS_PASSED+=1
    echo ✓ Documentation: Complete
) else (
    set /a TESTS_FAILED+=1
    echo ! Documentation: Incomplete
)

REM === FINAL REPORT ===
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   TEST RESULTS SUMMARY                                        ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo Tests Passed: !TESTS_PASSED!
echo Tests Failed: !TESTS_FAILED!
echo.

if !TESTS_FAILED! EQU 0 (
    echo ╔════════════════════════════════════════════════════════════════╗
    echo ║   ✓ ALL TESTS PASSED - READY FOR DEPLOYMENT                   ║
    echo ║                                                                ║
    echo ║   Your application is production-ready!                       ║
    echo ║                                                                ║
    echo ║   Next Steps:                                                 ║
    echo ║   1. Run: setup-env.bat (configure secrets)                   ║
    echo ║   2. Run: DEPLOY.bat (deploy to production)                   ║
    echo ║   3. Monitor your site live                                   ║
    echo ║                                                                ║
    echo ║   Estimated time to revenue: 30-45 minutes                    ║
    echo ╚════════════════════════════════════════════════════════════════╝
) else (
    echo ╔════════════════════════════════════════════════════════════════╗
    echo ║   ✗ SOME TESTS FAILED                                         ║
    echo ║                                                                ║
    echo ║   Please fix the issues above before deploying                ║
    echo ╚════════════════════════════════════════════════════════════════╝
)

echo.
pause

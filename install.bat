@echo off
cd /d "%~dp0"
echo Installing dependencies...
call npm install
if %ERRORLEVEL% EQU 0 (
    echo ✓ Dependencies installed
    echo.
    echo Now run: npm run build
) else (
    echo ✗ Installation failed
    pause
    exit /b 1
)
pause

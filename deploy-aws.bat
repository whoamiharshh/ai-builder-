@echo off
REM ============================================
REM   Deploy to AWS (Most Control)
REM ============================================

echo.
echo ╔════════════════════════════════════════╗
echo ║   DEPLOYING TO AWS                     ║
echo ║   (Most Control & Features)            ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if AWS CLI is installed
where aws >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo AWS CLI not found. Please install:
    echo https://aws.amazon.com/cli/
    pause
    exit /b 1
)

echo ✓ AWS CLI found
echo.

echo ╔════════════════════════════════════════╗
echo ║   STEP 1: Configure AWS Credentials    ║
echo ╚════════════════════════════════════════╝
echo.

aws configure

echo.
echo ╔════════════════════════════════════════╗
echo ║   STEP 2: Create S3 Bucket             ║
echo ╚════════════════════════════════════════╝
echo.

set /p BUCKET_NAME=Enter S3 bucket name (e.g., syntheticai-prod): 

aws s3api create-bucket ^
  --bucket %BUCKET_NAME% ^
  --region us-east-1

echo ✓ S3 bucket created: %BUCKET_NAME%
echo.

echo ╔════════════════════════════════════════╗
echo ║   STEP 3: Upload Build to S3           ║
echo ╚════════════════════════════════════════╝
echo.

aws s3 sync dist/ s3://%BUCKET_NAME%/ --delete --cache-control "public, max-age=31536000"

echo ✓ Build uploaded to S3
echo.

echo ╔════════════════════════════════════════╗
echo ║   STEP 4: Create CloudFront Distribution║
echo ╚════════════════════════════════════════╝
echo.
echo Manual Step Required:
echo   1. Go to AWS Console > CloudFront
echo   2. Click "Create Distribution"
echo   3. Origin Domain: %BUCKET_NAME%.s3.amazonaws.com
echo   4. Viewer Protocol: HTTPS only
echo   5. Add Cache Policy: Managed-CachingOptimized
echo   6. Click "Create Distribution"
echo   7. Wait ~5 minutes for deployment
echo.

echo ╔════════════════════════════════════════╗
echo ║   STEP 5: Configure Domain             ║
echo ╚════════════════════════════════════════╝
echo.
echo Optional (if you have a custom domain):
echo   1. In CloudFront, add "Alternate Domain Names"
echo   2. In Route 53, create CNAME pointing to CloudFront
echo   3. In CloudFront, add SSL certificate
echo.

echo ╔════════════════════════════════════════╗
echo ║   ✓ AWS DEPLOYMENT COMPLETE           ║
echo ║                                        ║
echo ║   Your site is deployed!               ║
echo ║   CloudFront URL visible in console    ║
echo ║                                        ║
echo ║   Add environment variables in:        ║
echo ║   Lambda Functions (if using backend)  ║
echo ╚════════════════════════════════════════╝
echo.

pause

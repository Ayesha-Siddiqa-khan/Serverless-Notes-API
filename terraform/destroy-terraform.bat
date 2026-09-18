@echo off
echo WARNING: This will destroy all infrastructure!
echo.
set /p confirm="Type 'destroy' to confirm: "
if not "%confirm%"=="destroy" (
    echo Aborted.
    exit /b 1
)

terraform destroy -auto-approve
if %errorlevel% neq 0 (
    echo Terraform destroy failed!
    exit /b 1
)

echo.
echo Infrastructure destroyed.

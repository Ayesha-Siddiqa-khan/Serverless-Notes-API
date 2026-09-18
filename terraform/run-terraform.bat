@echo off
echo [1/3] Initializing Terraform...
terraform init
if %errorlevel% neq 0 (
    echo Terraform init failed!
    exit /b 1
)

echo [2/3] Planning infrastructure...
terraform plan -out=tfplan
if %errorlevel% neq 0 (
    echo Terraform plan failed!
    exit /b 1
)

echo [3/3] Applying infrastructure...
terraform apply tfplan
if %errorlevel% neq 0 (
    echo Terraform apply failed!
    exit /b 1
)

echo.
echo Deployment complete!
terraform output

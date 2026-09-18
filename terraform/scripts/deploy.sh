#!/bin/bash
set -e

echo "=== Serverless Notes API Deployment ==="
echo ""

# Check prerequisites
command -v terraform >/dev/null 2>&1 || { echo "Error: terraform not found"; exit 1; }
command -v aws >/dev/null 2>&1 || { echo "Error: aws cli not found"; exit 1; }

# Check AWS credentials
aws sts get-caller-identity > /dev/null 2>&1 || { echo "Error: AWS credentials not configured"; exit 1; }

echo "[1/4] Initializing..."
terraform init

echo "[2/4] Validating..."
terraform validate

echo "[3/4] Planning..."
terraform plan -out=tfplan

echo "[4/4] Applying..."
terraform apply tfplan

echo ""
echo "=== Deployment Complete ==="
terraform output

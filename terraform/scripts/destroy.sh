#!/bin/bash
set -e

echo "=== Serverless Notes API Destroy ==="
echo ""
echo "WARNING: This will destroy all infrastructure!"
echo ""

read -p "Type 'destroy' to confirm: " confirm
if [ "$confirm" != "destroy" ]; then
    echo "Aborted."
    exit 1
fi

terraform destroy -auto-approve

echo ""
echo "=== Infrastructure Destroyed ==="

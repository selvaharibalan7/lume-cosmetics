#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Building Frontend..."
npm install
npm run build

echo "Installing Backend Dependencies..."
pip install -r backend/requirements.txt

echo "Running Database Seeds (if applicable)..."
python backend/database/seed.py

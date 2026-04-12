#!/bin/bash
# ============================================================
# ShopElite — Quick Start Script
# Run this from the affiliate-store/ root directory
# ============================================================

set -e

echo ""
echo "🛍️  ShopElite Affiliate Store — Setup"
echo "======================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌  Node.js not found. Install from https://nodejs.org"
  exit 1
fi
echo "✅  Node.js $(node -v) found"

# Check MongoDB
if ! command -v mongod &> /dev/null; then
  echo "⚠️   mongod not found locally — make sure MONGODB_URI in backend/.env points to Atlas or a running instance"
else
  echo "✅  MongoDB found"
fi

echo ""
echo "📦  Installing backend dependencies..."
cd backend && npm install --silent
echo "✅  Backend dependencies installed"

echo ""
echo "📦  Installing frontend dependencies..."
cd ../frontend && npm install --silent
echo "✅  Frontend dependencies installed"

cd ..

# Copy .env if not already done
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo ""
  echo "📝  Created backend/.env from example."
  echo "    ⚠️  IMPORTANT: Edit backend/.env and fill in your Cloudinary + MongoDB credentials before continuing!"
  echo ""
  read -p "Press Enter once you have edited backend/.env ..."
fi

echo ""
echo "🌱  Seeding database with sample data..."
cd backend && npm run seed
cd ..

echo ""
echo "============================================="
echo "✅  Setup complete! Run the app:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   cd backend && npm run dev"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   cd frontend && npm start"
echo ""
echo "   Store:   http://localhost:3000"
echo "   Admin:   http://localhost:3000/admin/login"
echo "============================================="
echo ""

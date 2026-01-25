#!/bin/bash

echo "🚀 Starting Pastel Book Maker Dev Server"
echo "========================================"
echo ""

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "📍 Current directory: $(pwd)"
echo ""

# Check if we're in the right place
if [ ! -f "app/page.tsx" ]; then
    echo "❌ ERROR: app/page.tsx not found!"
    echo "   Make sure you're in the project root directory"
    exit 1
fi

echo "🧹 Clearing Next.js cache..."
rm -rf .next
echo "✅ Cache cleared"
echo ""

echo "📦 Verifying dependencies..."
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found. Installing dependencies..."
    npm install --cache /tmp/npm-cache
else
    echo "✅ Dependencies found"
fi
echo ""

echo "🚀 Starting development server..."
echo "   Open the URL shown below in your browser"
echo "   (Usually http://localhost:3000 or http://localhost:3001)"
echo ""
echo "   Press Ctrl+C to stop the server"
echo ""

npm run dev


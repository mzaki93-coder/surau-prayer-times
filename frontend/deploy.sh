#!/bin/bash

# 🚀 Quick Deployment Script for Netlify
# Surau Al-Ittihad Prayer Times Display

echo "🕌 Surau Al-Ittihad Prayer Times - Netlify Deployment"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Check if netlify-cli is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""
echo "Choose deployment method:"
echo "1) Deploy to Netlify (requires login)"
echo "2) Just build (already done)"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying to Netlify..."
        echo ""
        netlify deploy --prod --dir=dist
        echo ""
        echo "✅ Deployment complete!"
        echo "🌐 Your site is now live!"
        ;;
    2)
        echo ""
        echo "✅ Build complete! The dist/ folder is ready."
        echo "📁 You can manually upload the dist/ folder to Netlify."
        echo "🌐 Or visit: https://app.netlify.com/drop"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📖 For more deployment options, see DEPLOYMENT.md"

#!/bin/bash

# WP Engine Deployment Script
# This script builds and prepares the assessment for WP Engine deployment

set -e  # Exit on error

echo "🚀 Building Assessment for WP Engine Deployment"
echo "================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "   Please run this script from the assessment directory"
    exit 1
fi

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Verify build succeeded
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not created"
    exit 1
fi

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "📁 Files ready in ./dist/ folder"
echo ""
echo "Next steps:"
echo "1. Connect to WP Engine via SFTP:"
echo "   Host: yoursite.sftp.wpengine.com"
echo "   Port: 2222"
echo "   User: [your-wpengine-sftp-user]"
echo ""
echo "2. Navigate to WordPress root directory"
echo ""
echo "3. Create 'assessment' folder if it doesn't exist"
echo ""
echo "4. Upload CONTENTS of ./dist/ folder to /assessment/"
echo "   (Not the dist folder itself, just the contents!)"
echo ""
echo "5. Verify files at: https://yoursite.com/assessment/"
echo ""
echo "📖 Full instructions: WPENGINE_DEPLOYMENT.md"
echo ""

# Create a deployment checklist
cat > DEPLOYMENT_CHECKLIST.txt <<EOF
WP Engine Deployment Checklist
===============================

Build Status: ✅ Complete ($(date))

Pre-Deployment:
[ ] Build completed without errors
[ ] WP Engine SFTP credentials ready
[ ] Backup current site (optional)

Deployment Steps:
[ ] Connect to WP Engine SFTP (port 2222)
[ ] Navigate to WordPress root
[ ] Create /assessment/ folder (if new)
[ ] Upload dist/* to /assessment/
[ ] Verify all files uploaded

WordPress Configuration:
[ ] Add rewrite rules to functions.php or .htaccess
[ ] Flush permalinks (Settings → Permalinks → Save)
[ ] Clear WP Engine cache

Testing:
[ ] Visit https://yoursite.com/assessment/
[ ] Test on desktop browser
[ ] Test on mobile device
[ ] Test form submission
[ ] Test all assessment steps
[ ] Verify Supabase connection works

Post-Deployment:
[ ] Add to WordPress navigation menu
[ ] Test from menu link
[ ] Monitor for 24 hours
[ ] Update documentation

Files to Upload (from dist/):
- index.html
- assets/ folder (JS, CSS, fonts, images)
- Any other generated files

Upload Location on WP Engine:
/assessment/

Notes:
- Upload CONTENTS of dist/, not the dist folder itself
- Final structure: /assessment/index.html (not /assessment/dist/index.html)
- Clear WP Engine cache after upload
- Test thoroughly before announcing

Created: $(date)
EOF

echo "📋 Deployment checklist saved to: DEPLOYMENT_CHECKLIST.txt"
echo ""

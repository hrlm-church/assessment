# GitHub Release Guide - Automatic WordPress Plugin Updates

This plugin now supports **automatic updates from GitHub**! When you create a new GitHub release, WordPress will automatically detect it and show an update notification.

## How Automatic Updates Work

1. **You create a GitHub release** with a version tag (e.g., `v1.1.0`)
2. **WordPress checks for updates** automatically (checks GitHub API)
3. **Update notification appears** in WordPress admin under Plugins
4. **One-click update** - Admin clicks "Update Now" button
5. **WordPress downloads and installs** the new version from GitHub

## Creating a New Release

### Step 1: Make Your Changes

1. Make code changes to the plugin
2. Update version number in **two places**:
   - `am-i-called-assessment.php` - Line 6: `Version: 1.1.0`
   - `am-i-called-assessment.php` - Line 22: `define('AICA_VERSION', '1.1.0');`
3. Rebuild the React app if needed:
   ```bash
   npm run build
   cp -r dist/* wordpress-plugin/am-i-called-assessment/dist/
   ```

### Step 2: Commit and Push Changes

```bash
git add .
git commit -m "Version 1.1.0 - Description of changes"
git push origin main
```

### Step 3: Create GitHub Release

**Option A: Via GitHub Web Interface (Easiest)**

1. Go to: `https://github.com/hrlm-church/assessment/releases`
2. Click **"Draft a new release"**
3. **Choose a tag**: Enter version number (e.g., `v1.1.0`)
   - ⚠️ Must start with `v` followed by version number
   - Must match version in plugin file
4. **Release title**: Same as tag (e.g., `v1.1.0`)
5. **Describe this release**: Add changelog/release notes
   - What's new
   - What's fixed
   - Any breaking changes
6. Click **"Publish release"**

**Option B: Via GitHub CLI**

```bash
# Install gh CLI first: https://cli.github.com/

# Create release with notes
gh release create v1.1.0 \
  --title "v1.1.0" \
  --notes "
## What's New
- Added automatic GitHub updates
- Fixed Elementor scrolling issues
- Added 7 guidance videos to results page

## Improvements
- Better WordPress integration
- Enhanced mobile responsiveness
"
```

### Step 4: Verify Release

1. **Check release page**: `https://github.com/hrlm-church/assessment/releases`
2. Verify tag created: `v1.1.0`
3. Verify download link exists (GitHub auto-creates .zip)

### Step 5: Test Update in WordPress

1. Go to WordPress Admin → Plugins
2. Wait ~1 hour (or clear transients to force check)
3. Should see update notification
4. Click "Update Now"
5. Plugin updates automatically!

## Version Numbering

Use **Semantic Versioning**: `MAJOR.MINOR.PATCH`

- **MAJOR** (1.x.x): Breaking changes, major rewrites
- **MINOR** (x.1.x): New features, backwards compatible
- **PATCH** (x.x.1): Bug fixes, small improvements

**Examples:**
- `1.0.0` → `1.0.1` - Bug fix (Elementor scrolling)
- `1.0.1` → `1.1.0` - New feature (Auto-updates, videos)
- `1.1.0` → `2.0.0` - Breaking change (complete rewrite)

## Release Checklist

Before creating a release:

- [ ] Update version in `am-i-called-assessment.php` (2 places)
- [ ] Rebuild React app if changes made to src/
- [ ] Copy built files to plugin dist/ folder
- [ ] Test plugin locally
- [ ] Commit all changes
- [ ] Push to GitHub
- [ ] Create GitHub release with proper tag (`v1.x.x`)
- [ ] Add detailed release notes
- [ ] Verify release appears on GitHub
- [ ] Test auto-update in WordPress

## Changelog Format (Optional but Recommended)

Use this format in your release notes:

```markdown
## Version 1.1.0

### New Features
- ✨ Automatic GitHub updates
- 🎥 Added 7 guidance videos to results page

### Improvements
- ⚡ Better performance with Elementor
- 📱 Improved mobile responsiveness

### Bug Fixes
- 🐛 Fixed scrolling issues in Elementor
- 🔧 Fixed container height constraints

### Breaking Changes
- None
```

## Troubleshooting

### Update not showing in WordPress?

1. **Clear transients**: Install "Transients Manager" plugin and delete `aica_github_release`
2. **Check version**: Ensure GitHub tag version is HIGHER than installed version
3. **Wait**: Updates check hourly by default
4. **Force check**: Go to Dashboard → Updates → Check Again

### Download failing?

1. Ensure release has a tag
2. GitHub auto-creates .zip from tag
3. Check release URL is accessible

### Plugin won't activate after update?

1. Check for PHP errors in WordPress debug log
2. Ensure all plugin files uploaded correctly
3. Try manual SFTP upload as fallback

## Current Version

**Installed**: Check `am-i-called-assessment.php` header
**Latest on GitHub**: https://github.com/hrlm-church/assessment/releases/latest

## Questions?

Check the main README.md or create an issue on GitHub.

# Quick WP Engine Setup Guide

## 5-Minute Setup

### 1. Get Your Build Files

The `dist/` folder contains your ready-to-upload files:
```
dist/
├── index.html          ← Main file
└── assets/            ← JS, CSS, fonts
    ├── index-[hash].js
    ├── index-[hash].css
    └── ...
```

### 2. Upload to WP Engine via SFTP

**Connection Info:**
- Host: `yoursite.sftp.wpengine.com`
- Port: `2222`
- User: Get from WP Engine Portal → SFTP Users
- Pass: Get from WP Engine Portal → SFTP Users

**Using FileZilla, Cyberduck, or Transmit:**

1. Connect with credentials above
2. Navigate to your WordPress root (you'll see `wp-content/`, `wp-admin/`, etc.)
3. Create a new folder: `assessment`
4. Enter the `assessment` folder
5. Upload everything from `dist/` folder:
   - Drag `index.html` into `assessment/`
   - Drag `assets/` folder into `assessment/`

**Final structure on server:**
```
/ (WordPress root)
├── wp-content/
├── wp-admin/
├── assessment/           ← Your new folder
│   ├── index.html       ← From dist/
│   └── assets/          ← From dist/
```

### 3. Add Rewrite Rules

**Option A - Simple .htaccess method:**

1. SFTP to your WordPress root
2. Edit `.htaccess` file
3. Add this **BEFORE** the `# BEGIN WordPress` line:

```apache
# Assessment App
<IfModule mod_rewrite.c>
RewriteEngine On

# Serve static assets directly
RewriteCond %{REQUEST_URI} ^/assessment/assets/
RewriteRule ^ - [L]

# Route all other /assessment requests to index.html
RewriteCond %{REQUEST_URI} ^/assessment
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^assessment(.*)$ /assessment/index.html [L]
</IfModule>
```

4. Save the file

**Option B - WordPress functions.php:**

See detailed instructions in `WPENGINE_DEPLOYMENT.md`

### 4. Flush WordPress Permalinks

1. Log in to WordPress Admin
2. Go to **Settings → Permalinks**
3. Click **Save Changes** (don't change anything, just save)

### 5. Clear WP Engine Cache

1. Log in to WP Engine Portal
2. Go to your site → Utilities → **Purge All Caches**
3. Click **Purge**

### 6. Test!

Visit: `https://yoursite.com/assessment/`

Should load seamlessly - no iframe! 🎉

---

## Adding to WordPress Menu

1. WordPress Admin → **Appearance → Menus**
2. Click **Custom Links**
3. URL: `/assessment/`
4. Link Text: `Take Assessment` (or whatever you prefer)
5. Click **Add to Menu**
6. **Save Menu**

---

## Troubleshooting

### Shows 404?
- Check files uploaded to `/assessment/index.html` (not `/assessment/dist/index.html`)
- Flush permalinks again
- Check .htaccess has the rewrite rules

### Blank page?
- Open browser console (F12)
- Look for errors
- Usually means assets path is wrong
- Check that `vite.config.js` has `base: '/assessment/'`

### Styles broken?
- Rebuild: `npm run build`
- Re-upload files
- Clear WP Engine cache

---

## Future Updates

When you make changes:

1. Edit code locally
2. Test: `npm run dev`
3. Build: `npm run build`
4. Upload new `dist/` contents via SFTP
5. Clear WP Engine cache
6. Test!

---

## Build Script

Use the provided script to prepare files:

```bash
./deploy-wpengine.sh
```

This will:
- Clean previous builds
- Install dependencies
- Build for production
- Show upload instructions
- Create deployment checklist

---

## Need Help?

- Full guide: `WPENGINE_DEPLOYMENT.md`
- WordPress integration: `WORDPRESS_INTEGRATION.md`
- Plugin option: `wordpress-plugin/README.md`

---

**That's it!** Your assessment is now hosted directly in WordPress on the same domain.

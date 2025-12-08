# Deploy Assessment to WP Engine

This guide explains how to host the assessment directly in your WordPress site on WP Engine at `yoursite.com/assessment/` for a completely seamless experience.

## Benefits of Direct Hosting

- ✅ Same domain (no iframe)
- ✅ Better SEO
- ✅ Faster loading
- ✅ No iframe scroll issues
- ✅ Looks completely native

---

## Deployment Steps for WP Engine

### Step 1: Build the Application

On your local machine:

```bash
cd /path/to/assessment
npm install
npm run build
```

This creates a `dist/` folder with all the compiled static files.

### Step 2: Upload to WP Engine

You have **3 options** to upload files to WP Engine:

#### Option A: SFTP (Recommended - Easiest)

1. **Get SFTP credentials** from WP Engine:
   - Log in to WP Engine Portal
   - Go to your site → SFTP Users
   - Note: Host, Username, Password, Port (usually 2222)

2. **Connect with SFTP client** (like FileZilla, Cyberduck, or Transmit):
   - Host: `yoursite.sftp.wpengine.com`
   - Username: `yoursite-user`
   - Password: [from WP Engine]
   - Port: `2222`

3. **Navigate to the WordPress root**:
   - You'll see folders like: `wp-content/`, `wp-admin/`, `wp-includes/`

4. **Create `assessment` folder**:
   - Create a new folder named `assessment` in the root directory

5. **Upload the files**:
   - Upload **contents** of the `dist/` folder into the `assessment/` folder
   - Important: Upload the **contents** (index.html, assets/, etc.), not the dist folder itself

Final structure should look like:
```
/ (WordPress root)
├── wp-content/
├── wp-admin/
├── wp-includes/
├── assessment/          ← New folder
│   ├── index.html
│   ├── assets/
│   │   ├── index-[hash].js
│   │   ├── index-[hash].css
│   │   └── ...
│   └── ...
```

#### Option B: WP Engine Git Push

If you have Git Push enabled on WP Engine:

```bash
# Add WP Engine as remote
git remote add wpengine git@git.wpengine.com:production/yoursite.git

# Build the app
npm run build

# Copy dist contents to assessment folder in repo
mkdir -p assessment
cp -r dist/* assessment/

# Commit and push
git add assessment/
git commit -m "Deploy assessment app"
git push wpengine main
```

#### Option C: WP Engine Portal File Manager

1. Log in to WP Engine Portal
2. Go to your site → Backup Points → Download (optional backup first)
3. Use the File Manager (if available)
4. Upload files manually

**Note:** SFTP (Option A) is usually the fastest and most reliable.

---

### Step 3: Configure WordPress Rewrite Rules

The React app uses client-side routing. We need to ensure all routes serve the index.html.

**Add to your theme's `functions.php`** (or use a custom plugin):

```php
<?php
/**
 * Add rewrite rules for assessment app
 */
function assessment_rewrite_rules() {
    // Serve index.html for all /assessment/* routes
    add_rewrite_rule(
        '^assessment/?',
        'index.php?assessment_app=1',
        'top'
    );

    add_rewrite_rule(
        '^assessment/(.+)',
        'index.php?assessment_app=1',
        'top'
    );
}
add_action('init', 'assessment_rewrite_rules');

/**
 * Add query var for assessment
 */
function assessment_query_vars($vars) {
    $vars[] = 'assessment_app';
    return $vars;
}
add_filter('query_vars', 'assessment_query_vars');

/**
 * Serve the assessment app
 */
function assessment_template_redirect() {
    if (get_query_var('assessment_app')) {
        $file = ABSPATH . 'assessment/index.html';
        if (file_exists($file)) {
            header('Content-Type: text/html; charset=utf-8');
            readfile($file);
            exit;
        }
    }
}
add_action('template_redirect', 'assessment_template_redirect');

/**
 * Flush rewrite rules on activation (run once)
 */
function assessment_flush_rewrites() {
    assessment_rewrite_rules();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'assessment_flush_rewrites');
```

**Or use `.htaccess` (simpler, but may get overwritten by WordPress):**

Add to your `.htaccess` file in WordPress root, **before** the WordPress rules:

```apache
# Assessment App - Serve index.html for all assessment routes
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /

# Serve static files directly
RewriteCond %{REQUEST_URI} ^/assessment/assets/ [OR]
RewriteCond %{REQUEST_URI} ^/assessment/.*\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$
RewriteRule ^ - [L]

# Serve index.html for all other /assessment routes
RewriteCond %{REQUEST_URI} ^/assessment
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^assessment(.*)$ /assessment/index.html [L]
</IfModule>

# BEGIN WordPress
# ... existing WordPress rules below
```

---

### Step 4: Flush Rewrite Rules

After adding the code:

1. Go to WordPress Admin
2. Navigate to **Settings → Permalinks**
3. Click **Save Changes** (this flushes rewrite rules)

---

### Step 5: Test the Deployment

Visit: `https://yoursite.com/assessment/`

You should see the assessment loading directly (not in an iframe)!

**Test checklist:**
- ✅ Page loads without errors
- ✅ Styles look correct
- ✅ Can navigate through the assessment
- ✅ Form submissions work
- ✅ Supabase connection works
- ✅ Mobile responsive

---

## Troubleshooting

### Assessment shows 404

**Cause:** Rewrite rules not working or files not uploaded correctly.

**Fix:**
1. Verify files are at `/assessment/index.html` on server
2. Flush permalinks: Settings → Permalinks → Save
3. Check `.htaccess` has the rewrite rules
4. Try accessing directly: `yoursite.com/assessment/index.html`

### Styles are broken / White screen

**Cause:** Asset paths are wrong.

**Fix:**
1. Check `vite.config.js` has `base: '/assessment/'`:
   ```javascript
   export default defineConfig({
     plugins: [react(), tailwindcss()],
     base: '/assessment/',  // Must match folder name
   })
   ```
2. Rebuild: `npm run build`
3. Re-upload files

### CORS errors with Supabase

**Cause:** Supabase doesn't recognize your new domain.

**Fix:**
1. Go to Supabase Dashboard → Settings → API
2. Add your domain to allowed origins if needed
3. Usually not required for same-domain hosting

### Assessment works but WordPress header/footer show

**Cause:** WordPress template is wrapping the assessment.

**Fix:** This is actually fine! But if you want to hide them:

Add to your theme's CSS or use the plugin template:
```css
/* Hide header/footer on assessment page */
body.page-template-template-assessment-fullscreen .site-header,
body.page-template-template-assessment-fullscreen .site-footer {
    display: none;
}
```

### WP Engine caching issues

**Fix:**
1. Clear WP Engine cache: WP Engine Portal → Utilities → Purge Cache
2. Or add to WordPress: WP Engine → Settings → Clear All Cache

---

## Integrating with WordPress

### Add to WordPress Navigation

1. Go to **Appearance → Menus**
2. Add **Custom Link**:
   - URL: `/assessment/`
   - Link Text: `Take Assessment`
3. Save menu

### Create a Landing Page

Instead of linking directly to `/assessment/`, create a WordPress page that introduces it:

1. Create new page: "Pastoral Assessment"
2. Add introduction text
3. Add button/link to `/assessment/`
4. Style it with your theme

### Link from Posts/Pages

Use this HTML anywhere:
```html
<a href="/assessment/" class="button">Start the Assessment</a>
```

---

## Auto-Deployment Setup (Advanced)

### Using GitHub Actions + SFTP

Create `.github/workflows/deploy-wpengine.yml`:

```yaml
name: Deploy to WP Engine

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install and Build
        run: |
          npm install
          npm run build

      - name: Deploy to WP Engine via SFTP
        uses: SamKirkland/FTP-Deploy-Action@4.3.0
        with:
          server: yoursite.sftp.wpengine.com
          username: ${{ secrets.WPENGINE_SFTP_USER }}
          password: ${{ secrets.WPENGINE_SFTP_PASSWORD }}
          port: 2222
          protocol: ftps
          local-dir: ./dist/
          server-dir: /assessment/
```

**Setup:**
1. Add secrets in GitHub: Settings → Secrets → Actions
   - `WPENGINE_SFTP_USER`
   - `WPENGINE_SFTP_PASSWORD`
2. Push to main branch → Auto-deploys!

---

## Updating the Assessment

When you make changes:

1. **Make changes** to code locally
2. **Test locally**: `npm run dev`
3. **Build**: `npm run build`
4. **Upload via SFTP**: Upload new files from `dist/` to `/assessment/`
5. **Clear cache**: Purge WP Engine cache

---

## Performance Optimization

### Enable WP Engine CDN

The assessment static files (JS, CSS, images) will be served from WP Engine's CDN automatically - no extra config needed!

### Minification

Already handled by Vite build process. Your files are:
- ✅ Minified
- ✅ Tree-shaken
- ✅ Code-split
- ✅ Hashed for cache-busting

### Caching Headers

WP Engine automatically adds proper cache headers for static assets in the `/assessment/` folder.

---

## Security Notes

- ✅ Static files only (HTML, JS, CSS) - no server-side code in assessment folder
- ✅ Supabase handles all API security with RLS policies
- ✅ No WordPress database access from assessment
- ✅ Completely isolated from WordPress authentication

---

## Maintenance

### Regular Updates

1. Pull latest code from GitHub
2. Test locally
3. Build and deploy
4. Test on production

### Monitoring

- Check Supabase logs for API errors
- Monitor WP Engine logs for 404s or errors
- Test assessment quarterly to ensure it's working

---

## Quick Reference

**Build command:**
```bash
npm run build
```

**SFTP Upload:**
- Host: `yoursite.sftp.wpengine.com`
- Port: `2222`
- Upload `dist/` contents to `/assessment/`

**Access URL:**
```
https://yoursite.com/assessment/
```

**Clear WP Engine Cache:**
WP Engine Portal → Utilities → Purge All Caches

---

## Next Steps

1. Build the app: `npm run build`
2. Get WP Engine SFTP credentials
3. Upload via SFTP to `/assessment/` folder
4. Add rewrite rules (functions.php or .htaccess)
5. Flush permalinks in WordPress
6. Test at `yoursite.com/assessment/`
7. Add to WordPress navigation menu
8. Done! 🎉

Need help with any specific step? Let me know!

# WP Engine Deployment Guide

## 🚀 Upload Assessment to WP Engine

You have **3 options** for uploading to WP Engine. Choose the one that works best for you:

---

## Option 1: WP Engine User Portal (Easiest)

### Step 1: Access File Manager

1. Log in to **WP Engine User Portal**: https://my.wpengine.com/
2. Click on your site: **revdaveharvey**
3. In the left menu, click **"Sites"** → your environment (Production/Staging)
4. Click **"File Manager"** or **"SFTP"** tab

### Step 2: Navigate to Root Directory

In the File Manager, navigate to:
```
/home/wpe-user/sites/[your-site-name]/
```

Or more commonly:
```
/
```

### Step 3: Create Assessment Folder

1. Create a new folder called `assessment`
2. Enter that folder

### Step 4: Upload Files

Upload the contents of your **`dist/`** folder:

**Files to upload:**
- `index.html` (upload directly into `/assessment/`)
- `assets/` folder (create this folder and upload all files from `dist/assets/`)

**Final structure:**
```
/assessment/
  ├── index.html
  └── assets/
      ├── index-D_GgIpgV.js
      ├── index-B13w-LjL.css
      ├── purify.es-B6FQ9oRL.js
      ├── index.es-Gqs_2nA8.js
      └── html2canvas.esm-B0tyYwQk.js
```

### Step 5: Test

Visit: https://revdaveharvey.com/assessment/

---

## Option 2: SFTP (Recommended for Developers)

### Step 1: Get SFTP Credentials

1. Log in to **WP Engine User Portal**
2. Go to your site
3. Click **"SFTP"** in the left menu
4. Note your credentials:
   - **Host**: `revdaveharvey.sftp.wpengine.com` (or similar)
   - **Port**: `2222`
   - **Username**: Usually your WP Engine username
   - **Password**: Your WP Engine password or SSH key

### Step 2: Connect with SFTP Client

**Using FileZilla:**
1. Download FileZilla: https://filezilla-project.org/
2. Open FileZilla
3. Enter connection details:
   - Host: `sftp://revdaveharvey.sftp.wpengine.com`
   - Username: [your username]
   - Password: [your password]
   - Port: `2222`
4. Click **"Quickconnect"**

**Using Cyberduck:**
1. Download Cyberduck: https://cyberduck.io/
2. Click **"Open Connection"**
3. Select **"SFTP"**
4. Enter your WP Engine SFTP details
5. Connect

### Step 3: Navigate to Site Root

Once connected, you'll see:
```
/
├── wp-content/
├── wp-admin/
├── wp-includes/
└── ...
```

### Step 4: Upload Assessment

1. In the root directory, create a new folder: `assessment`
2. Drag the **contents** of your local `dist/` folder into `/assessment/`

**Final structure on server:**
```
/assessment/
  ├── index.html
  └── assets/
      └── [all JS/CSS files]
```

### Step 5: Set Permissions (if needed)

Right-click on the `assessment` folder → **File Permissions**
- Set to: `755` (or `rwxr-xr-x`)

---

## Option 3: WP Engine Git Push (Advanced)

If you have Git Push enabled on WP Engine:

### Step 1: Set Up Git Remote

```bash
git remote add wpengine git@git.wpengine.com:production/revdaveharvey.git
```

### Step 2: Add Build Files

Since Git Push deploys WordPress files, you'd need to:

1. Add `dist/` contents to your WordPress theme or create a custom folder
2. Or skip Git Push and use SFTP instead (recommended for static files)

**Note:** Git Push is mainly for WordPress code, not static assets. **Use SFTP instead.**

---

## ✅ After Upload - Verify

### Test the Assessment Directly

Visit: https://revdaveharvey.com/assessment/

**Should see:**
- ✅ Assessment loads
- ✅ "Am I Called?" header
- ✅ Getting Started screen

**If you see errors:**
- Check browser console (F12 → Console)
- Verify files are in `/assessment/` (not `/assessment/dist/`)

### Test in WordPress

1. Install the updated plugin (wordpress-plugin.zip)
2. Add shortcode to a page: `[am_i_called_assessment]`
3. View the page

**Should see:**
- ✅ Seamless integration
- ✅ No double headers
- ✅ Auto-resizing iframe

---

## 🔧 WP Engine Specific Tips

### Clear WP Engine Cache

After uploading, clear the cache:

1. **User Portal**: Sites → your site → **"Purge all caches"**
2. **WordPress Admin**: WP Engine menu → **"General Settings"** → **"Purge all caches"**

### CDN Cache (if using WP Engine CDN)

If using WP Engine's CDN:
1. Go to: **CDN** section in User Portal
2. Click **"Purge CDN Cache"**

### .htaccess Configuration (Optional)

Add to your `.htaccess` for better performance:

```apache
# Cache assessment assets
<FilesMatch "\.(js|css|jpg|jpeg|png|gif|svg|woff|woff2)$">
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>

# Enable Gzip
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>
```

---

## 🚨 Common WP Engine Issues

### Issue: "Permission Denied"

**Solution**: WP Engine sets permissions automatically. If you get errors:
1. Contact WP Engine support
2. Or use the User Portal File Manager instead of SFTP

### Issue: Files in wrong location

**Wrong:**
```
/wp-content/assessment/
/public_html/assessment/
```

**Correct:**
```
/assessment/
```

WP Engine's root is `/` (no `public_html`)

### Issue: "404 Not Found"

**Check:**
1. Files are at `/assessment/` (not `/dist/` or elsewhere)
2. `index.html` is directly in `/assessment/`
3. Folder permissions are `755`
4. Clear all WP Engine caches

---

## 📞 Need Help?

**WP Engine Support:**
- Chat: Available in User Portal
- Phone: Available in User Portal
- They can help with SFTP access and file uploads

**File Structure Checklist:**
```
✅ /assessment/index.html exists
✅ /assessment/assets/ folder exists
✅ /assessment/assets/index-[hash].js exists
✅ /assessment/assets/index-[hash].css exists
```

Visit https://revdaveharvey.com/assessment/ to verify!

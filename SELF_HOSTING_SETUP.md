# Self-Hosting Setup Guide for revdaveharvey.com

## ✅ Quick Setup (3 Steps)

### Step 1: Upload Files to Your WordPress Server

Upload the contents of the **`dist/`** folder to your WordPress server at:

```
/public_html/assessment/
```

**What to upload:**
- `dist/index.html` → `/public_html/assessment/index.html`
- `dist/assets/` (entire folder) → `/public_html/assessment/assets/`

**Upload Options:**
- **cPanel File Manager**: Upload via your hosting control panel
- **FTP/SFTP**: Use FileZilla, Cyberduck, or similar
- **SSH**: `scp -r dist/* user@yourserver.com:/public_html/assessment/`

**Verify Upload:**
Visit: https://revdaveharvey.com/assessment/

You should see the assessment tool loading.

---

### Step 2: Install/Update the WordPress Plugin

1. **Download the plugin**: `wordpress-plugin.zip` (or re-zip the `wordpress-plugin/` folder)

2. **Install in WordPress**:
   - Go to: **WordPress Admin → Plugins → Add New → Upload Plugin**
   - Upload `wordpress-plugin.zip`
   - Click **Install Now** then **Activate**

   OR if already installed:
   - **Deactivate** the old version
   - **Delete** it
   - Upload and activate the new version

---

### Step 3: Add to Your WordPress Page

**Option A: Using the Shortcode (Recommended)**

Edit your WordPress page and add:

```
[am_i_called_assessment]
```

**Option B: Using the Full-Screen Template**

1. Create/edit a page in WordPress
2. In **Page Attributes → Template**, select: **Assessment (Full Screen)**
3. Publish

---

## 🧪 Testing

### Test the Assessment Directly
Visit: https://revdaveharvey.com/assessment/

**Should see:**
- ✅ Assessment loads with header/navigation
- ✅ Getting Started screen
- ✅ All styles and functionality work

### Test the WordPress Embed
Visit your WordPress page with the shortcode.

**Should see:**
- ✅ Seamless integration (no double headers)
- ✅ Transparent background
- ✅ Auto-resizing iframe
- ✅ Starts at "Getting Started" (skips Hero)

---

## 🔧 Troubleshooting

### "Assessment not loading" / Blank iframe

**Check file paths:**
```bash
# Should exist:
https://revdaveharvey.com/assessment/index.html
https://revdaveharvey.com/assessment/assets/index-[hash].js
https://revdaveharvey.com/assessment/assets/index-[hash].css
```

**Fix:** Verify files are at `/public_html/assessment/` (not `/public_html/assessment/dist/`)

### "404 Not Found" errors

Your files might be in the wrong location. Should be:

```
✅ Correct:
/public_html/assessment/index.html
/public_html/assessment/assets/...

❌ Wrong:
/public_html/assessment/dist/index.html
/public_html/assessment/dist/assets/...
```

### Double headers showing

Make sure the iframe URL includes `?embedded=true`:

```html
https://revdaveharvey.com/assessment/?embedded=true
```

The plugin does this automatically.

### Background still gray/not transparent

Add this CSS to your WordPress page:

```css
.assessment-wrapper iframe {
  background: transparent !important;
}
```

### Iframe not resizing

The plugin includes auto-resize JavaScript. Make sure:
1. Plugin is activated
2. Using the shortcode `[am_i_called_assessment]`
3. Check browser console (F12) for errors

---

## 📁 File Structure After Upload

```
/public_html/
  └── assessment/
      ├── index.html
      └── assets/
          ├── index-[hash].css
          ├── index-[hash].js
          ├── purify.es-[hash].js
          ├── index.es-[hash].js
          └── html2canvas.esm-[hash].js
```

---

## 🔄 Future Updates

When you make changes to the assessment:

1. **Rebuild**:
   ```bash
   npm run build
   ```

2. **Upload**: Replace the `assessment/` folder on your server with new `dist/` contents

3. **Clear caches**:
   - WordPress cache (WP Rocket, W3 Total Cache, etc.)
   - Browser cache (Ctrl+F5)
   - CDN cache (Cloudflare, etc.)

---

## 💡 Tips

- **Performance**: The assessment is ~1.7 MB total. Consider enabling gzip compression on your server.
- **Caching**: Set long cache headers for `/assessment/assets/*` files (they have unique hashes).
- **SSL**: Make sure your SSL certificate covers the main domain (https).
- **Backups**: Keep a copy of the `dist/` folder for easy rollback.

---

## Need Help?

If something doesn't work:
1. Check browser console for errors (F12 → Console tab)
2. Verify all files uploaded correctly
3. Test the assessment directly at https://revdaveharvey.com/assessment/
4. Check that your WordPress page is using the shortcode correctly

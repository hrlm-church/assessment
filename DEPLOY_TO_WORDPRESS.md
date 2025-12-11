# Deploy Seamless WordPress Integration

## Quick Steps to Update revdaveharvey.com

### Step 1: Build the New Version

```bash
npm run build
```

This creates an updated `dist/` folder with all the seamless integration features.

### Step 2: Upload to Your Server

Upload the contents of the `dist/` folder to your WordPress server at:
```
/assessment/
```

**Options:**
- **FTP/SFTP**: Upload via FileZilla or similar
- **WP Engine**: Use their File Manager or SFTP
- **cPanel**: Use File Manager

### Step 3: Update Your WordPress Page

Go to your WordPress page: **Am I Called Assessment**

1. Click **Edit**
2. Switch to **Code Editor** (or HTML mode)
3. Replace the current iframe code with the new code from `wordpress-iframe-code.html`

**Key changes in the new code:**
```html
<!-- The NEW URL includes ?embedded=true -->
<iframe src="https://revdaveharvey.com/assessment/?embedded=true"></iframe>
```

This `?embedded=true` parameter triggers:
- ✅ Skip the Hero screen
- ✅ Hide the navigation header
- ✅ Use transparent backgrounds
- ✅ Auto-resize the iframe height
- ✅ Match WordPress styling

### Step 4: Clear Caches

1. **WordPress cache** (if using WP Rocket, W3 Total Cache, etc.)
2. **Browser cache** (Ctrl+F5 or Cmd+Shift+R)
3. **CDN cache** (if using Cloudflare, etc.)

### Step 5: Test

Visit: https://revdaveharvey.com/am-i-called-assessment/

**You should see:**
- ✅ No double headers
- ✅ Seamless background (no gray box)
- ✅ Content flows naturally with your WordPress theme
- ✅ Iframe auto-resizes as you navigate
- ✅ No visible borders or frames

---

## What Changed?

### Before (looked embedded):
- 🔴 Double headers (WordPress + Assessment)
- 🔴 Gray background box
- 🔴 Visible iframe borders
- 🔴 Fixed height causing scrollbars
- 🔴 Started with "Hero" screen

### After (seamless):
- ✅ Single WordPress header
- ✅ Transparent background
- ✅ No visible borders
- ✅ Auto-resizing height
- ✅ Starts with "Getting Started"

---

## Troubleshooting

### Still looks embedded?

1. **Check the URL** in your iframe:
   - Must include `?embedded=true`
   - Example: `https://revdaveharvey.com/assessment/?embedded=true`

2. **Clear all caches**:
   ```bash
   # WordPress cache
   # Browser cache (hard refresh)
   # CDN cache (Cloudflare, etc.)
   ```

3. **Verify files uploaded**:
   - Check that `dist/` contents are at `/assessment/`
   - Open https://revdaveharvey.com/assessment/?embedded=true directly

### Double headers still showing?

Make sure the iframe URL has `?embedded=true`:
```html
<iframe src="https://revdaveharvey.com/assessment/?embedded=true"></iframe>
```

### Background still gray?

Add this CSS to your WordPress page:
```css
.assessment-wrapper iframe {
  background: transparent !important;
}
```

### Iframe not auto-resizing?

Ensure the JavaScript from `wordpress-iframe-code.html` is included on your page.

---

## Alternative: Subdirectory with Full WordPress Header

If you prefer to have the WordPress header/menu visible:

**Current setup:**
```
Iframe on WordPress page → Assessment in iframe
```

**Alternative:**
```
Direct link → /assessment/ (no iframe)
```

**How to set it up:**
1. Keep assessment at `/assessment/`
2. Create a WordPress menu link to `/assessment/`
3. Remove the iframe page entirely

**Pros:**
- No iframe at all
- Better SEO
- Faster performance
- Full WordPress navigation

**Cons:**
- Leaves WordPress when accessing assessment
- Different page structure

---

## Need Help?

If something doesn't look right:

1. Send me a screenshot of the page
2. Check browser console for errors (F12)
3. Verify the iframe URL includes `?embedded=true`
4. Try opening `/assessment/?embedded=true` directly

The integration should be completely seamless - if it's not, we can fix it!

# WordPress Integration Guide

This guide explains how to embed the "Am I Called?" assessment into your WordPress website.

## Quick Overview

There are 3 main approaches:

1. **iframe Embed** (Easiest, 5 minutes)
2. **Subdirectory Hosting** (Better UX, 30 minutes)
3. **WordPress Plugin** (Full integration, 2+ hours)

---

## Option 1: iframe Embed (Recommended for Quick Setup)

### Pros
- ✅ Takes 5 minutes
- ✅ No hosting changes needed
- ✅ Automatic updates (uses GitHub Pages)
- ✅ Completely isolated from WordPress

### Cons
- ❌ Separate URL in browser
- ❌ May have mobile scroll issues
- ❌ Less SEO-friendly

### Implementation

#### Step 1: Create a WordPress Page

1. Go to WordPress Admin → Pages → Add New
2. Title: "Pastoral Assessment" (or whatever you prefer)
3. Use the **Code Editor** (not Visual)

#### Step 2: Add iframe Code

Paste this HTML:

```html
<div class="assessment-embed" style="width: 100%; height: 100vh; margin: 0; padding: 0;">
  <iframe
    src="https://hrlm-church.github.io/assessment/"
    style="width: 100%; height: 100%; border: none; display: block;"
    title="Am I Called? Assessment"
    loading="lazy"
  ></iframe>
</div>

<script>
// Auto-resize iframe based on content (optional)
window.addEventListener('message', function(e) {
  if (e.origin === 'https://hrlm-church.github.io') {
    if (e.data.height) {
      document.querySelector('.assessment-embed iframe').style.height = e.data.height + 'px';
    }
  }
});
</script>
```

#### Step 3: Make it Full-Width

Add this CSS to **Appearance → Customize → Additional CSS**:

```css
/* Make assessment page full-width */
.page-template-default .assessment-embed {
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  max-width: 100vw;
  width: 100vw;
}

/* Hide WordPress header/footer on assessment page (optional) */
body.page-id-XXX .site-header,
body.page-id-XXX .site-footer {
  display: none;
}

body.page-id-XXX .assessment-embed {
  height: 100vh;
}
```

Replace `XXX` with your page ID (find it in the URL when editing the page).

#### Step 4: Publish

Click **Publish** and view your page!

---

## Option 2: Subdirectory Hosting (Better UX)

### Pros
- ✅ Same domain (better for SEO)
- ✅ Clean URLs like `yoursite.com/assessment/`
- ✅ No iframe issues
- ✅ Full control over hosting

### Cons
- ❌ Requires server access
- ❌ Need to set up build/deploy

### Implementation

This hosts the app at `yoursite.com/assessment/` instead of using GitHub Pages.

#### Step 1: Build the App

```bash
cd /path/to/assessment
npm run build
```

This creates a `dist/` folder with all the static files.

#### Step 2: Upload to WordPress Server

**Option A - FTP/SFTP:**
1. Connect to your WordPress server via FTP
2. Navigate to `/public_html/` (or your WordPress root)
3. Create folder: `assessment/`
4. Upload contents of `dist/` to `assessment/`

**Option B - cPanel File Manager:**
1. Log in to cPanel
2. Open File Manager → public_html
3. Create folder: `assessment`
4. Upload `dist/` contents

#### Step 3: Update Vite Base Path

Before building, update `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/assessment/',  // Already set correctly!
})
```

#### Step 4: Test

Visit: `https://yoursite.com/assessment/`

#### Step 5: Link from WordPress

Add a link anywhere in WordPress:

```html
<a href="/assessment/" class="button">Take the Assessment</a>
```

Or create a WordPress Menu item pointing to `/assessment/`

---

## Option 3: WordPress Plugin (Advanced)

### When to Use
- You want deep WordPress integration
- Need to track users in WordPress database
- Want to use WordPress authentication

### Implementation Overview

This would involve:
1. Creating a custom WordPress plugin
2. Registering a custom page/post type
3. Enqueueing React app assets
4. Building with WordPress REST API integration

**This is complex and requires PHP development. Let me know if you want detailed steps for this approach.**

---

## Recommended Approach by Use Case

### Just want it embedded quickly?
→ **Use Option 1: iframe Embed**

### Want professional integration on same domain?
→ **Use Option 2: Subdirectory Hosting**

### Need WordPress user integration?
→ **Use Option 3: WordPress Plugin** (custom development required)

---

## Making it Seamless (Any Option)

### 1. Match WordPress Styling

Add this to your assessment `src/index.css`:

```css
/* Optional: Match WordPress theme colors */
:root {
  --wp-primary: #your-theme-color;
  --wp-secondary: #your-secondary-color;
}

/* Override assessment colors if needed */
.bg-\[#6366F1\] {
  background-color: var(--wp-primary) !important;
}
```

### 2. WordPress Navigation Integration

Create a WordPress menu item that links to the assessment page.

### 3. Remove Duplicate Headers

If using iframe, hide the assessment's header and use WordPress header instead.

---

## Auto-Deploy from GitHub (Option 2 Enhancement)

Set up automatic deployment when you push to GitHub:

### Using GitHub Actions + FTP

Create `.github/workflows/deploy-wordpress.yml`:

```yaml
name: Deploy to WordPress

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

      - name: FTP Deploy
        uses: SamKirkland/FTP-Deploy-Action@4.3.0
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
          server-dir: /public_html/assessment/
```

Add FTP credentials in GitHub → Settings → Secrets.

---

## Troubleshooting

### iframe not loading
- Check browser console for CORS errors
- Ensure HTTPS on both WordPress and assessment
- Try adding `sandbox` attribute: `sandbox="allow-scripts allow-same-origin"`

### Styles look broken
- Clear WordPress cache
- Clear browser cache
- Check if files uploaded correctly

### Assessment page shows 404
- Check .htaccess rules
- Ensure all `dist/` files were uploaded
- Verify server supports SPA routing

---

## Next Steps

1. Choose your integration method
2. Follow the steps above
3. Test thoroughly on mobile and desktop
4. Monitor for any issues

Need help with implementation? Let me know which option you'd like to pursue!

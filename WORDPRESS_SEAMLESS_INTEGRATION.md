# WordPress Seamless Integration Guide

## Problem: Assessment Looks "Embedded"

When embedding the assessment into WordPress, common issues include:
- Double headers (WordPress + Assessment)
- Different background colors
- Mismatched container widths
- Visible borders/frames
- Font inconsistencies

## Solutions

### Option 1: CSS Override Method (Quickest)

Add this CSS to your WordPress page or theme:

```css
/* WordPress Page: Am I Called Assessment */

/* Remove iframe borders and make it seamless */
.assessment-embed iframe {
  border: none !important;
  width: 100% !important;
  min-height: 100vh !important;
  display: block !important;
}

/* Remove WordPress page padding/margins */
.page-id-XXX .entry-content {
  padding: 0 !important;
  margin: 0 !important;
  max-width: 100% !important;
}

/* Hide WordPress header/footer on assessment page */
.page-id-XXX .site-header,
.page-id-XXX .site-footer,
.page-id-XXX .site-navigation,
.page-id-XXX .breadcrumbs {
  display: none !important;
}

/* Make content full-width */
.page-id-XXX .site-content {
  padding: 0 !important;
  margin: 0 !important;
  max-width: 100% !important;
}

/* Remove any sidebars */
.page-id-XXX .sidebar {
  display: none !important;
}

/* Ensure main container is full-width */
.page-id-XXX .content-area {
  width: 100% !important;
  max-width: 100% !important;
}
```

**Replace `XXX`** with your actual page ID (find it in the URL when editing the page).

---

### Option 2: Build a Dedicated WordPress Template

Create a custom page template without header/footer:

**Step 1:** Create `page-assessment.php` in your theme:

```php
<?php
/**
 * Template Name: Assessment Full Width
 * Template Post Type: page
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
        }
        .assessment-embed {
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 0;
        }
        .assessment-embed iframe {
            width: 100%;
            height: 100%;
            border: none;
            display: block;
        }
    </style>
</head>
<body <?php body_class(); ?>>
    <div class="assessment-embed">
        <iframe
            src="https://revdaveharvey.com/assessment/"
            title="Am I Called Assessment"
            loading="eager"
        ></iframe>
    </div>
    <?php wp_footer(); ?>
</body>
</html>
```

**Step 2:** In WordPress, edit your page and select "Assessment Full Width" as the template.

---

### Option 3: Subdirectory Install (Best UX)

Instead of embedding, install the assessment directly in a subdirectory:

**Step 1:** Build the assessment:
```bash
npm run build
```

**Step 2:** Upload `dist/` contents to:
```
/public_html/assessment/
```

**Step 3:** Access directly at:
```
https://revdaveharvey.com/assessment/
```

**Step 4:** Match WordPress styling by updating these colors in `src/assets/css/tailwind.css`:

```css
/* Match RevDaveHarvey.com theme colors */
:root {
  --color-canvas: #FFFFFF; /* Change to match WP background */
  --color-surface: #FFFFFF;
  --color-border: #E5E7EB;
}
```

---

### Option 4: Remove Assessment's Hero Section

If you want WordPress to handle the header/intro, hide the assessment's hero:

**Step 1:** Update `src/App.jsx` to detect WordPress:

```javascript
// At the top of App.jsx
const isWordPress = window.location !== window.parent.location; // Detects iframe
// Or check for URL parameter: const isWordPress = new URLSearchParams(window.location.search).get('embedded') === 'true';

// Then conditionally render:
{!isWordPress && currentView === 'hero' && (
  <Hero onNext={() => setCurrentView('getting-started')} />
)}
```

**Step 2:** Update your iframe URL:
```html
<iframe src="https://your-site.com/assessment/?embedded=true"></iframe>
```

**Step 3:** Rebuild and deploy.

---

## Matching WordPress Theme

### Fonts

Add this to `src/assets/css/tailwind.css`:

```css
/* Match WordPress theme font */
@import url('https://fonts.googleapis.com/css2?family=Your-WordPress-Font:wght@400;500;600;700&display=swap');

body {
  font-family: 'Your-WordPress-Font', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### Colors

Update the primary colors to match your WordPress brand:

In `src/assets/css/tailwind.css`:

```css
/* Replace with RevDaveHarvey.com brand colors */
--color-indigo: #YourBrandColor;
--color-indigo-hover: #YourBrandColorDark;
--color-indigo-light: #YourBrandColorLight;
--color-indigo-pale: #YourBrandColorPale;
```

---

## Troubleshooting

### Issue: Double scrollbars

```css
.assessment-embed {
  overflow: hidden;
}
.assessment-embed iframe {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
```

### Issue: Height not adjusting

Add this JavaScript to auto-resize:

```javascript
<script>
window.addEventListener('message', function(e) {
  // Only accept messages from your domain
  if (e.origin === 'https://revdaveharvey.com') {
    if (e.data.type === 'resize' && e.data.height) {
      document.querySelector('.assessment-embed iframe').style.height = e.data.height + 'px';
    }
  }
});
</script>
```

Then add this to your React app (`src/App.jsx`):

```javascript
// Auto-report height changes to parent
useEffect(() => {
  const reportHeight = () => {
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'resize',
        height: document.documentElement.scrollHeight
      }, '*');
    }
  };

  reportHeight();
  window.addEventListener('resize', reportHeight);
  const observer = new MutationObserver(reportHeight);
  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    window.removeEventListener('resize', reportHeight);
    observer.disconnect();
  };
}, []);
```

### Issue: Different container width

Find your WordPress theme's content width (usually 1200px, 1140px, or 960px) and update:

```css
.max-w-\[720px\] {
  max-width: 1140px !important; /* Match your theme */
}
```

---

## Recommended Solution

For **revdaveharvey.com**, I recommend:

1. **Option 3: Subdirectory Install** - Best performance, no iframe issues
2. Update colors in the assessment to match your WordPress brand
3. Link to `/assessment/` from your WordPress navigation

This gives you:
- ✅ Same domain (SEO-friendly)
- ✅ No iframe scrolling issues
- ✅ Fastest performance
- ✅ Full control over styling
- ✅ Mobile-friendly

---

## Next Steps

1. Choose which option works best for your setup
2. Implement the CSS/template changes
3. Test on mobile and desktop
4. Clear all caches (WordPress cache, browser cache, CDN cache)
5. Check for console errors

Need help implementing? Let me know which option you'd like to use!

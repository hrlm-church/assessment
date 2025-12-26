# Am I Called Assessment - iFrame Plugin

WordPress plugin that embeds the Am I Called Assessment using an iframe to the Vercel deployment.

## Features

- ✅ Clean iframe embed of working Vercel version
- ✅ Auto-resize to fit content
- ✅ Fixes Elementor container constraints
- ✅ No scrolling issues
- ✅ Auto-updates via GitHub releases
- ✅ Same shortcode: `[am_i_called_assessment]`

## Installation

### Option 1: Upload via WordPress Admin

1. Download this folder: `am-i-called-assessment-iframe/`
2. Zip the folder as `am-i-called-assessment-iframe.zip`
3. Go to WordPress admin → Plugins → Add New → Upload Plugin
4. Upload the zip file
5. Activate the plugin

### Option 2: Manual Upload via SFTP

1. Upload the `am-i-called-assessment-iframe/` folder to `/wp-content/plugins/`
2. Go to WordPress admin → Plugins
3. Find "Am I Called Assessment (iFrame)" and click Activate

## Usage

Add this shortcode to any page or post:

```
[am_i_called_assessment]
```

The assessment will embed the full working version from https://assessment-lac.vercel.app/

## Auto-Updates

After version 2.0.0 is released on GitHub:

1. WordPress will automatically check for updates hourly
2. You'll see an "Update available" notification in Plugins
3. Click "Update Now" to update with one click
4. No manual uploads needed for future versions

## Version

**Current Version:** 2.0.0 (iFrame solution)

## Comparison to React Plugin

| Feature | iFrame Plugin (v2.0.0) | React Plugin (v1.1.4) |
|---------|------------------------|----------------------|
| Rendering | ✅ Works perfectly | ❌ Broken |
| Maintenance | ✅ Easy (uses Vercel) | ❌ Requires rebuilds |
| Updates | ✅ Auto from Vercel | ❌ Manual plugin updates |
| Scrolling | ✅ Fixed | ❌ Issues |
| Setup | ✅ Simple iframe | ❌ Complex script loading |

## Troubleshooting

### If you still see scrolling issues:

1. Make sure you're using this **iFrame plugin**, not the old React plugin
2. Deactivate the old "Am I Called Assessment" plugin (without "iFrame" in the name)
3. Clear WordPress cache (if using a caching plugin)
4. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

### If the iframe doesn't load:

- Check browser console for errors
- Make sure https://assessment-lac.vercel.app/ is accessible
- Try disabling any ad blockers or security plugins temporarily

## Support

For issues or questions, contact Digital Culture: https://godigitalculture.com/

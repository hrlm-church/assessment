# Am I Called Assessment - WordPress Plugin

A WordPress plugin for Dave Harvey's "Am I Called?" pastoral calling assessment tool.

## Description

This plugin integrates the React-based assessment application directly into WordPress without using iframes. It provides a seamless, native WordPress experience with smooth scrolling and full-width layout.

## Features

- **No iframe issues** - Assessment renders directly on the WordPress page
- **Smooth scrolling** - Natural page scroll, no embedded containers
- **Full-width layout** - Automatically hides WordPress theme elements for clean presentation
- **Shortcode-based** - Easy to add to any page or post
- **Performance optimized** - Scripts only load on pages using the shortcode

## Installation

### Method 1: Manual Upload via WordPress Admin

1. **Download the plugin folder** - Zip the entire `am-i-called-assessment` folder
2. **Login to WordPress Admin** - Go to your WordPress dashboard
3. **Navigate to Plugins** - Click "Plugins" → "Add New" → "Upload Plugin"
4. **Upload the zip file** - Click "Choose File" and select the zipped plugin
5. **Install and Activate** - Click "Install Now" then "Activate Plugin"

### Method 2: SFTP/FTP Upload to WP Engine

1. **Connect to WP Engine via SFTP**
   - Host: Your WP Engine SFTP hostname
   - Username: Your WP Engine username
   - Password: Your WP Engine password
   - Port: 22 (SFTP)

2. **Navigate to plugins directory**
   ```
   /wp-content/plugins/
   ```

3. **Upload the entire plugin folder**
   - Upload the `am-i-called-assessment` folder to `/wp-content/plugins/`
   - Ensure all files and subdirectories are uploaded

4. **Activate in WordPress**
   - Go to WordPress Admin → Plugins
   - Find "Am I Called Assessment"
   - Click "Activate"

### Method 3: WP Engine Git Push (If Enabled)

If you have Git Push enabled on WP Engine:

```bash
# From the wordpress-plugin directory
git add am-i-called-assessment
git commit -m "Add Am I Called Assessment plugin"
git push wpengine main
```

## Usage

### Creating an Assessment Page

1. **Create a new WordPress page**
   - Go to Pages → Add New
   - Title: "Assessment - Am I Called?" (or your preferred title)

2. **Add the shortcode**
   - In the page editor (Block Editor or Classic Editor), add:
   ```
   [am_i_called_assessment]
   ```

3. **Configure page template (Optional)**
   - For best results, use a "Full Width" or "Blank" page template
   - This removes sidebars and gives maximum space

4. **Publish the page**
   - Click "Publish"
   - Visit the page to see the assessment

### Replacing Your Current Iframe

If you're currently using an iframe embed:

1. **Edit the existing page** - Go to the page at `/assessment-am-i-called/`
2. **Remove the iframe code** - Delete the current iframe embed
3. **Add the shortcode** - Replace it with `[am_i_called_assessment]`
4. **Update the page**

## Customization

### Hiding Theme Elements

The plugin automatically hides common theme elements (header, footer, breadcrumbs) when the assessment is displayed. If you need to hide additional elements:

1. **Edit the plugin file** - Open `am-i-called-assessment.php`
2. **Find the CSS section** - Look for the `<style>` block in `aica_render_assessment()` function
3. **Add custom selectors** - Add your theme's specific classes to hide

Example:
```css
.aica-fullpage-mode .your-theme-element {
    display: none !important;
}
```

### Styling Adjustments

To adjust the appearance to match your WordPress theme better:

1. **Use WordPress Customizer** - Go to Appearance → Customize
2. **Add Custom CSS** - Go to "Additional CSS" section
3. **Target the assessment container**:
```css
#am-i-called-assessment-root {
    /* Your custom styles */
}
```

## Updating the Assessment

When you make changes to the React app:

1. **Rebuild the app**
   ```bash
   npm run build
   ```

2. **Copy new dist files**
   ```bash
   cp -r dist/* wordpress-plugin/am-i-called-assessment/dist/
   ```

3. **Re-upload to WordPress**
   - Upload via SFTP/FTP (overwrite existing files)
   - Or re-zip and upload via WordPress admin

4. **Clear WordPress cache**
   - If using a caching plugin (WP Rocket, W3 Total Cache, etc.), clear the cache
   - WP Engine: Clear cache from WP Engine dashboard

## Troubleshooting

### Assessment not displaying

- **Check if plugin is activated** - Go to Plugins and ensure it's activated
- **Check shortcode spelling** - Must be exactly `[am_i_called_assessment]`
- **Check browser console** - Press F12 and look for JavaScript errors

### Styling conflicts with WordPress theme

- **Try a different page template** - Use "Full Width" or "Blank" template
- **Add custom CSS** - Hide conflicting theme elements (see Customization section)
- **Contact theme support** - Some themes require specific settings

### Scripts not loading

- **Clear all caches** - WordPress cache, browser cache, WP Engine cache
- **Check file permissions** - Ensure plugin files are readable (644 for files, 755 for directories)
- **Check WordPress debug** - Enable WP_DEBUG in wp-config.php to see errors

### Assessment cuts off or scrolling issues

The plugin is designed to eliminate iframe scrolling issues. If you experience problems:

- **Remove max-width constraints** - Check your theme's content width settings
- **Disable other plugins temporarily** - Test for plugin conflicts
- **Check theme CSS** - Some themes force container widths

## File Structure

```
am-i-called-assessment/
├── am-i-called-assessment.php (Main plugin file)
├── README.md (This file)
└── dist/ (Built React app files)
    ├── index.html
    ├── .vite/
    │   └── manifest.json
    └── assets/
        ├── index.css (Main styles)
        ├── index.js (Main React app)
        ├── index.es.js (ES modules)
        ├── html2canvas.esm.js (PDF generation)
        └── purify.es.js (Sanitization)
```

## System Requirements

- WordPress 5.0 or higher
- PHP 7.4 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Support

For issues or questions:
- Repository: https://github.com/hrlm-church/assessment
- Website: https://revdaveharvey.com

## Changelog

### Version 1.0.0
- Initial release
- React app integration with WordPress
- Shortcode implementation
- Automatic theme element hiding
- Full-width layout support
- WP Engine compatible

## License

GPL v2 or later

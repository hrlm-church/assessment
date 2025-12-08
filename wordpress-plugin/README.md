# Am I Called? Assessment - WordPress Plugin

A simple WordPress plugin to embed the "Am I Called?" pastoral assessment tool.

## Installation

### Option 1: Upload via WordPress Admin

1. Zip the `wordpress-plugin` folder (rename to `am-i-called-assessment.zip`)
2. Go to WordPress Admin → Plugins → Add New → Upload Plugin
3. Upload the zip file
4. Click "Activate"

### Option 2: Manual FTP Upload

1. Upload the `wordpress-plugin` folder to `/wp-content/plugins/`
2. Rename folder to: `am-i-called-assessment`
3. Go to WordPress Admin → Plugins
4. Find "Am I Called? Assessment Embed" and click "Activate"

## Usage

### Method 1: Shortcode (Easiest)

Add this shortcode to any page or post:

```
[am_i_called_assessment]
```

#### Shortcode Options

```
[am_i_called_assessment height="800px"]
[am_i_called_assessment url="https://yoursite.com/assessment/"]
```

### Method 2: Full-Screen Template

1. Create a new Page
2. Select template: "Assessment (Full Screen)"
3. Publish

This removes all WordPress headers/footers for a cleaner experience.

### Method 3: Custom Page Builder

If using Elementor, Beaver Builder, etc.:

1. Add a "Shortcode" widget/block
2. Insert: `[am_i_called_assessment]`

## Customization

### Change Default Height

Edit `am-i-called-assessment.php` line 30:

```php
'height' => '100vh', // Change to '800px' or any value
```

### Use Self-Hosted Version

If you've uploaded the assessment to your server:

```
[am_i_called_assessment url="https://yoursite.com/assessment/"]
```

### Custom Styling

Add to your theme's CSS:

```css
.am-i-called-assessment-wrapper {
    /* Your custom styles */
}
```

## Settings

Go to **Settings → Assessment Embed** in WordPress admin for usage instructions.

## Support

For issues or questions:
- GitHub: https://github.com/hrlm-church/assessment
- Documentation: See WORDPRESS_INTEGRATION.md

## License

ISC

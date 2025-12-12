<?php
/**
 * Plugin Name: Am I Called? Assessment Embed
 * Plugin URI: https://github.com/hrlm-church/assessment
 * Description: Embed the "Am I Called?" pastoral assessment tool in WordPress
 * Version: 1.0.0
 * Author: Grace City Church
 * License: ISC
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Simple iframe embed shortcode
 * Usage: [am_i_called_assessment]
 */
function amic_assessment_shortcode($atts) {
    // Parse attributes
    $atts = shortcode_atts(array(
        'height' => '100vh',
        'url' => 'https://revdaveharvey.com/assessment/',
    ), $atts);

    // Sanitize
    $height = esc_attr($atts['height']);
    $url = esc_url($atts['url']);

    // Generate unique ID for this instance
    $id = 'amic-' . uniqid();

    // Build output
    ob_start();
    ?>
    <div class="am-i-called-assessment-wrapper" style="width: 100%; height: <?php echo $height; ?>; margin: 0; padding: 0;">
        <iframe
            id="<?php echo $id; ?>"
            src="<?php echo $url; ?>"
            style="width: 100%; height: 100%; border: none; display: block;"
            title="Am I Called? Assessment"
            loading="lazy"
            allow="fullscreen"
        ></iframe>
    </div>

    <script>
    (function() {
        // Auto-resize iframe based on content messages
        window.addEventListener('message', function(e) {
            // Only accept messages from our assessment domain
            if (e.origin === 'https://revdaveharvey.com') {
                var iframe = document.getElementById('<?php echo $id; ?>');
                if (e.data.height && iframe) {
                    iframe.style.height = e.data.height + 'px';
                }
            }
        });
    })();
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('am_i_called_assessment', 'amic_assessment_shortcode');

/**
 * Add CSS for full-width layout
 */
function amic_assessment_styles() {
    ?>
    <style>
        .am-i-called-assessment-wrapper {
            max-width: 100vw;
            margin-left: calc(-50vw + 50%);
            margin-right: calc(-50vw + 50%);
            width: 100vw;
        }

        /* Remove padding from common WordPress themes */
        .am-i-called-assessment-wrapper iframe {
            min-height: 600px;
        }

        @media (max-width: 768px) {
            .am-i-called-assessment-wrapper {
                height: 100vh !important;
            }
        }
    </style>
    <?php
}
add_action('wp_head', 'amic_assessment_styles');

/**
 * Register custom page template (optional)
 */
function amic_register_template($templates) {
    $templates['template-assessment-fullscreen.php'] = 'Assessment (Full Screen)';
    return $templates;
}
add_filter('theme_page_templates', 'amic_register_template');

/**
 * Load custom template
 */
function amic_load_template($template) {
    if (is_page() && get_page_template_slug() === 'template-assessment-fullscreen.php') {
        $plugin_template = plugin_dir_path(__FILE__) . 'templates/template-assessment-fullscreen.php';
        if (file_exists($plugin_template)) {
            return $plugin_template;
        }
    }
    return $template;
}
add_filter('template_include', 'amic_load_template');

/**
 * Add settings page
 */
function amic_add_admin_menu() {
    add_options_page(
        'Assessment Settings',
        'Assessment Embed',
        'manage_options',
        'amic-settings',
        'amic_settings_page'
    );
}
add_action('admin_menu', 'amic_add_admin_menu');

/**
 * Settings page content
 */
function amic_settings_page() {
    ?>
    <div class="wrap">
        <h1>Am I Called? Assessment Settings</h1>

        <div class="card" style="max-width: 800px; margin-top: 20px;">
            <h2>How to Use</h2>
            <p>Use the shortcode below to embed the assessment anywhere in WordPress:</p>

            <pre style="background: #f5f5f5; padding: 15px; border-radius: 3px;">[am_i_called_assessment]</pre>

            <h3>Shortcode Options</h3>
            <ul>
                <li><code>height</code> - Set iframe height (default: 100vh)</li>
                <li><code>url</code> - Custom URL if self-hosting (default: GitHub Pages)</li>
            </ul>

            <h3>Examples</h3>
            <pre style="background: #f5f5f5; padding: 15px; border-radius: 3px;">
[am_i_called_assessment height="800px"]

[am_i_called_assessment url="https://yoursite.com/assessment/"]
            </pre>

            <h3>Full-Width Page</h3>
            <p>For best experience:</p>
            <ol>
                <li>Create a new page in WordPress</li>
                <li>Add the shortcode: <code>[am_i_called_assessment]</code></li>
                <li>Use a full-width page template if your theme has one</li>
                <li>Publish!</li>
            </ol>

            <hr>

            <h3>Self-Hosting Option</h3>
            <p>To host the assessment on your own domain (<code>yoursite.com/assessment/</code>):</p>
            <ol>
                <li>Build the app: <code>npm run build</code></li>
                <li>Upload <code>dist/</code> folder contents to your server at <code>/public_html/assessment/</code></li>
                <li>Use shortcode: <code>[am_i_called_assessment url="https://yoursite.com/assessment/"]</code></li>
            </ol>

            <p><a href="https://github.com/hrlm-church/assessment" target="_blank" class="button">View Documentation</a></p>
        </div>
    </div>
    <?php
}

<?php
/**
 * Plugin Name: Am I Called Assessment
 * Plugin URI: https://revdaveharvey.com
 * Description: Dave Harvey's "Am I Called?" pastoral calling assessment tool. Use shortcode [am_i_called_assessment] to display the assessment on any page.
 * Version: 1.0.0
 * Author: Dave Harvey
 * Author URI: https://revdaveharvey.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: am-i-called-assessment
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('AICA_VERSION', '1.0.0');
define('AICA_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('AICA_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Enqueue React app scripts and styles
 */
function aica_enqueue_scripts() {
    // Only enqueue on pages/posts that have the shortcode
    global $post;
    if (!is_a($post, 'WP_Post') || !has_shortcode($post->post_content, 'am_i_called_assessment')) {
        return;
    }

    $dist_url = AICA_PLUGIN_URL . 'dist/';
    $version = AICA_VERSION;

    // Enqueue CSS
    wp_enqueue_style(
        'aica-main-styles',
        $dist_url . 'assets/index.css',
        array(),
        $version
    );

    // Enqueue main JavaScript (React app)
    wp_enqueue_script(
        'aica-main-script',
        $dist_url . 'assets/index.js',
        array(),
        $version,
        true // Load in footer
    );

    // Enqueue additional scripts
    wp_enqueue_script(
        'aica-index-es',
        $dist_url . 'assets/index.es.js',
        array('aica-main-script'),
        $version,
        true
    );

    wp_enqueue_script(
        'aica-html2canvas',
        $dist_url . 'assets/html2canvas.esm.js',
        array('aica-main-script'),
        $version,
        true
    );

    wp_enqueue_script(
        'aica-purify',
        $dist_url . 'assets/purify.es.js',
        array('aica-main-script'),
        $version,
        true
    );

    // Add module type to scripts
    add_filter('script_loader_tag', 'aica_add_type_attribute', 10, 3);
}
add_action('wp_enqueue_scripts', 'aica_enqueue_scripts');

/**
 * Add type="module" to specific scripts
 */
function aica_add_type_attribute($tag, $handle, $src) {
    $module_scripts = array(
        'aica-index-es',
        'aica-html2canvas',
        'aica-purify'
    );

    if (in_array($handle, $module_scripts)) {
        $tag = '<script type="module" src="' . esc_url($src) . '"></script>';
    }

    return $tag;
}

/**
 * Shortcode to render the assessment app
 */
function aica_render_assessment() {
    // Add custom styles to hide WordPress elements and make fullwidth
    $custom_css = '
    <style>
        /* Hide WordPress header/footer for seamless experience */
        .aica-fullpage-mode .site-header,
        .aica-fullpage-mode .site-footer,
        .aica-fullpage-mode .breadcrumbs,
        .aica-fullpage-mode .entry-header {
            display: none !important;
        }

        /* Make content full width */
        .aica-fullpage-mode .site-content,
        .aica-fullpage-mode .content-area,
        .aica-fullpage-mode .entry-content {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        /* Container for React app */
        #am-i-called-assessment-root {
            width: 100%;
            min-height: 100vh;
        }

        /* Ensure body doesn\'t have extra padding when plugin is active */
        body.aica-active {
            margin: 0;
            padding: 0;
        }
    </style>
    <script>
        // Add class to body for styling
        document.addEventListener("DOMContentLoaded", function() {
            document.body.classList.add("aica-active");

            // Optional: Add fullpage mode class to parent elements
            var container = document.getElementById("am-i-called-assessment-root");
            if (container) {
                var parent = container.closest(".entry-content, article, main");
                if (parent) {
                    parent.classList.add("aica-fullpage-mode");
                }
            }
        });
    </script>
    ';

    // Return the root div where React will mount
    return $custom_css . '<div id="root"></div>';
}
add_shortcode('am_i_called_assessment', 'aica_render_assessment');

/**
 * Add body class when shortcode is present
 */
function aica_body_class($classes) {
    global $post;
    if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'am_i_called_assessment')) {
        $classes[] = 'am-i-called-assessment-active';
    }
    return $classes;
}
add_filter('body_class', 'aica_body_class');

/**
 * Activation hook
 */
function aica_activate() {
    // Flush rewrite rules on activation
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'aica_activate');

/**
 * Deactivation hook
 */
function aica_deactivate() {
    // Flush rewrite rules on deactivation
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'aica_deactivate');

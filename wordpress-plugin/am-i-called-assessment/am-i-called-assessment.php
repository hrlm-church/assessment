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
    // Add custom styles to fix scrolling and layout issues
    $custom_css = '
    <style id="aica-fix-styles">
        /* CRITICAL: Fix Elementor and page builder overflow/height constraints */
        .elementor-widget-shortcode,
        .elementor-widget-shortcode > .elementor-widget-container,
        .elementor-element,
        .elementor-container,
        .e-con,
        .e-container {
            overflow: visible !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
        }

        /* React app root container - must be auto height */
        #root {
            overflow: visible !important;
            height: auto !important;
            min-height: 100vh !important;
            max-height: none !important;
            display: block !important;
        }

        /* Ensure all parent containers allow natural flow */
        body.am-i-called-assessment-active .elementor,
        body.am-i-called-assessment-active .elementor-section,
        body.am-i-called-assessment-active .elementor-column,
        body.am-i-called-assessment-active .elementor-column-wrap,
        body.am-i-called-assessment-active .elementor-widget-wrap {
            overflow: visible !important;
            height: auto !important;
            min-height: 0 !important;
        }

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

        /* Ensure body allows natural scroll */
        body.am-i-called-assessment-active {
            margin: 0;
            padding: 0;
            overflow-x: hidden !important;
            overflow-y: auto !important;
        }

        /* Fix any theme-specific containers */
        .am-i-called-assessment-active main,
        .am-i-called-assessment-active article,
        .am-i-called-assessment-active .entry-content {
            overflow: visible !important;
            height: auto !important;
        }
    </style>
    <script>
        // Add class to body and fix container constraints
        document.addEventListener("DOMContentLoaded", function() {
            document.body.classList.add("am-i-called-assessment-active");

            // Find the React root
            var root = document.getElementById("root");
            if (root) {
                // Add fullpage mode class to parent elements
                var parent = root.closest(".entry-content, article, main");
                if (parent) {
                    parent.classList.add("aica-fullpage-mode");
                }

                // Force remove any inline height styles on Elementor containers
                var elementorContainers = root.closest(".elementor-widget-shortcode, .e-con, .elementor-element");
                if (elementorContainers) {
                    var current = root;
                    while (current && current !== document.body) {
                        if (current.style) {
                            current.style.height = "auto";
                            current.style.maxHeight = "none";
                            current.style.overflow = "visible";
                        }
                        current = current.parentElement;
                    }
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

<?php
/**
 * Plugin Name: Am I Called Assessment
 * Plugin URI: https://revdaveharvey.com
 * Description: Dave Harvey's "Am I Called?" pastoral calling assessment tool. Use shortcode [am_i_called_assessment] to display the assessment on any page.
 * Version: 1.1.4
 * Author: Digital Culture
 * Author URI: https://godigitalculture.com/
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: am-i-called-assessment
 * GitHub Plugin URI: hrlm-church/assessment
 * GitHub Branch: main
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('AICA_VERSION', '1.1.4');
define('AICA_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('AICA_PLUGIN_URL', plugin_dir_url(__FILE__));

// Load GitHub Updater
require_once AICA_PLUGIN_DIR . 'includes/class-github-updater.php';

// Initialize GitHub Updater
if (is_admin()) {
    new AICA_GitHub_Updater(__FILE__);
}

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

    // Enqueue main JavaScript (React app) as module
    wp_enqueue_script(
        'aica-main-script',
        $dist_url . 'assets/index.js',
        array(),
        $version,
        true // Load in footer
    );

    // Add module type and crossorigin to main script
    add_filter('script_loader_tag', 'aica_add_module_type', 10, 3);
}
add_action('wp_enqueue_scripts', 'aica_enqueue_scripts');

/**
 * Add type="module" and crossorigin to main script
 */
function aica_add_module_type($tag, $handle, $src) {
    if ($handle === 'aica-main-script') {
        $tag = '<script type="module" crossorigin src="' . esc_url($src) . '"></script>';
    }
    return $tag;
}

/**
 * Shortcode to render the assessment app
 */
function aica_render_assessment() {
    // SCOPED FIX: Only target Elementor containers, NOT React app internals
    $custom_css = '
    <style id="aica-fix-styles">
        /* ONLY target Elementor containers that CONTAIN #root */
        /* DO NOT apply to elements INSIDE #root (React app) */

        .elementor-widget-shortcode:has(#root),
        .elementor-widget-container:has(#root),
        .elementor-element:has(#root),
        .elementor-container:has(#root),
        .e-con:has(#root),
        .e-container:has(#root),
        .elementor-section:has(#root),
        .elementor-column:has(#root),
        .elementor-widget-wrap:has(#root) {
            overflow: visible !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
        }

        /* React app root container */
        #root {
            overflow: visible !important;
            height: auto !important;
            min-height: 100vh !important;
            max-height: none !important;
            display: block !important;
        }

        /* Ensure body allows scroll */
        body.am-i-called-assessment-active {
            overflow-y: auto !important;
        }

        /* Hide WordPress header/footer for clean display */
        .aica-fullpage-mode .site-header,
        .aica-fullpage-mode .site-footer {
            display: none !important;
        }
    </style>
    <script>
        // SCOPED JavaScript: Only modify Elementor containers, not React app
        (function() {
            function fixElementorContainers() {
                document.body.classList.add("am-i-called-assessment-active");

                var root = document.getElementById("root");
                if (!root) return;

                // Only traverse UPWARDS to fix parent containers
                // DO NOT touch anything inside #root
                var current = root.parentElement;
                var iterations = 0;

                while (current && current !== document.documentElement && iterations < 50) {
                    // Only apply fixes to Elementor elements
                    if (current.classList && (
                        current.classList.contains("elementor-widget-shortcode") ||
                        current.classList.contains("elementor-element") ||
                        current.classList.contains("e-con") ||
                        current.classList.contains("elementor-section") ||
                        current.classList.contains("elementor-column")
                    )) {
                        current.style.setProperty("height", "auto", "important");
                        current.style.setProperty("max-height", "none", "important");
                        current.style.setProperty("min-height", "0", "important");
                        current.style.setProperty("overflow", "visible", "important");
                    }

                    current = current.parentElement;
                    iterations++;
                }

                // Add fullpage class
                var parent = root.closest(".entry-content, article, main");
                if (parent) {
                    parent.classList.add("aica-fullpage-mode");
                }
            }

            // Run once on load
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", fixElementorContainers);
            } else {
                fixElementorContainers();
            }

            // Run again after React loads
            setTimeout(fixElementorContainers, 1000);
        })();
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

<?php
/**
 * Plugin Name: Am I Called Assessment
 * Plugin URI: https://revdaveharvey.com
 * Description: Dave Harvey's "Am I Called?" pastoral calling assessment tool. Use shortcode [am_i_called_assessment] to display the assessment on any page.
 * Version: 1.1.1
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
define('AICA_VERSION', '1.1.1');
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
    // NUCLEAR OPTION: Ultra-aggressive CSS to force no scrolling
    $custom_css = '
    <style id="aica-fix-styles">
        /* NUCLEAR: Override ALL Elementor containers */
        .elementor *,
        .elementor-widget-shortcode,
        .elementor-widget-shortcode *,
        .elementor-widget-container,
        .elementor-element,
        .elementor-container,
        .e-con,
        .e-container,
        .e-con-inner,
        .elementor-section,
        .elementor-column,
        .elementor-column-wrap,
        .elementor-widget-wrap,
        div[data-elementor-type],
        div[data-elementor-id] {
            overflow: visible !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
        }

        /* CRITICAL: React app root - MUST be auto height */
        #root,
        #root > *,
        #root > div {
            overflow: visible !important;
            height: auto !important;
            min-height: 100vh !important;
            max-height: none !important;
            display: block !important;
        }

        /* Force ALL parents to allow natural flow */
        body.am-i-called-assessment-active *,
        body.am-i-called-assessment-active div,
        body.am-i-called-assessment-active section,
        body.am-i-called-assessment-active .elementor,
        body.am-i-called-assessment-active .elementor-section,
        body.am-i-called-assessment-active .elementor-column {
            overflow: visible !important;
            height: auto !important;
            min-height: 0 !important;
        }

        /* Hide WordPress header/footer */
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

        /* Body scroll only - NEVER container scroll */
        body.am-i-called-assessment-active {
            margin: 0 !important;
            padding: 0 !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
        }

        /* Prevent ALL containers from creating their own scroll */
        body.am-i-called-assessment-active main,
        body.am-i-called-assessment-active article,
        body.am-i-called-assessment-active .entry-content,
        body.am-i-called-assessment-active .elementor-widget-shortcode,
        body.am-i-called-assessment-active .e-con {
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
        }
    </style>
    <script>
        // AGGRESSIVE: Remove ALL height constraints via JavaScript
        (function() {
            function forceRemoveHeightConstraints() {
                // Add body class
                document.body.classList.add("am-i-called-assessment-active");

                // Find root
                var root = document.getElementById("root");
                if (!root) return;

                // Add fullpage class to parent
                var parent = root.closest(".entry-content, article, main");
                if (parent) {
                    parent.classList.add("aica-fullpage-mode");
                }

                // NUCLEAR: Traverse ALL parents and force remove constraints
                var current = root;
                var iterations = 0;
                while (current && current !== document.documentElement && iterations < 50) {
                    if (current.style) {
                        current.style.setProperty("height", "auto", "important");
                        current.style.setProperty("max-height", "none", "important");
                        current.style.setProperty("min-height", "0", "important");
                        current.style.setProperty("overflow", "visible", "important");
                        current.style.setProperty("overflow-y", "visible", "important");
                    }

                    // Remove height-related attributes
                    if (current.hasAttribute) {
                        ["data-height", "data-min-height", "data-max-height"].forEach(function(attr) {
                            if (current.hasAttribute(attr)) {
                                current.removeAttribute(attr);
                            }
                        });
                    }

                    current = current.parentElement;
                    iterations++;
                }

                // Also force on Elementor-specific selectors
                var elementorContainers = document.querySelectorAll(
                    ".elementor-widget-shortcode, .e-con, .elementor-element, .elementor-container, " +
                    ".elementor-section, .elementor-column, .elementor-widget-wrap"
                );
                elementorContainers.forEach(function(el) {
                    if (el.contains(root) || root.contains(el)) {
                        el.style.setProperty("height", "auto", "important");
                        el.style.setProperty("max-height", "none", "important");
                        el.style.setProperty("overflow", "visible", "important");
                    }
                });
            }

            // Run on DOM ready
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", forceRemoveHeightConstraints);
            } else {
                forceRemoveHeightConstraints();
            }

            // Run again after a short delay (in case Elementor modifies things)
            setTimeout(forceRemoveHeightConstraints, 100);
            setTimeout(forceRemoveHeightConstraints, 500);
            setTimeout(forceRemoveHeightConstraints, 1000);

            // Watch for changes and re-apply (Elementor editor mode)
            if (window.MutationObserver) {
                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.attributeName === "style") {
                            forceRemoveHeightConstraints();
                        }
                    });
                });

                setTimeout(function() {
                    var root = document.getElementById("root");
                    if (root && root.parentElement) {
                        observer.observe(root.parentElement, {
                            attributes: true,
                            attributeFilter: ["style", "class"],
                            subtree: true
                        });
                    }
                }, 1000);
            }
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

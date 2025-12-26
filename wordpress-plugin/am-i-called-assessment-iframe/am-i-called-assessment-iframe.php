<?php
/**
 * Plugin Name: Am I Called Assessment (iFrame)
 * Plugin URI: https://revdaveharvey.com
 * Description: Dave Harvey's "Am I Called?" pastoral calling assessment tool. Use shortcode [am_i_called_assessment] to display the assessment. iFrame version using Vercel deployment.
 * Version: 2.0.2
 * Author: Digital Culture
 * Author URI: https://godigitalculture.com/
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: am-i-called-assessment-iframe
 * GitHub Plugin URI: hrlm-church/assessment
 * GitHub Branch: main
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('AICA_IFRAME_VERSION', '2.0.2');
define('AICA_IFRAME_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('AICA_IFRAME_PLUGIN_URL', plugin_dir_url(__FILE__));

// Load GitHub Updater
require_once AICA_IFRAME_PLUGIN_DIR . 'includes/class-github-updater.php';

// Initialize GitHub Updater
if (is_admin()) {
    new AICA_GitHub_Updater(__FILE__);
}

/**
 * Enqueue iframe styles
 */
function aica_iframe_enqueue_styles() {
    global $post;
    if (!is_a($post, 'WP_Post') || !has_shortcode($post->post_content, 'am_i_called_assessment')) {
        return;
    }

    wp_enqueue_style(
        'aica-iframe-styles',
        AICA_IFRAME_PLUGIN_URL . 'assets/iframe-styles.css',
        array(),
        AICA_IFRAME_VERSION
    );
}
add_action('wp_enqueue_scripts', 'aica_iframe_enqueue_styles');

/**
 * Shortcode to render the assessment iframe
 */
function aica_iframe_render_assessment() {
    $iframe_url = 'https://assessment-lac.vercel.app/';

    $output = '
    <style>
        /* Full-width iframe container */
        .aica-iframe-container {
            width: 100%;
            height: 100vh;
            min-height: 800px;
            position: relative;
            overflow: hidden;
            border: none;
            margin: 0;
            padding: 0;
        }

        .aica-iframe-container iframe {
            width: 100%;
            height: 100%;
            border: none;
            display: block;
        }

        /* Fix Elementor containers */
        .elementor-widget-shortcode:has(.aica-iframe-container),
        .elementor-widget-container:has(.aica-iframe-container),
        .elementor-element:has(.aica-iframe-container),
        .elementor-container:has(.aica-iframe-container),
        .e-con:has(.aica-iframe-container),
        .e-container:has(.aica-iframe-container),
        .elementor-section:has(.aica-iframe-container),
        .elementor-column:has(.aica-iframe-container),
        .elementor-widget-wrap:has(.aica-iframe-container) {
            overflow: visible !important;
            height: auto !important;
            min-height: 100vh !important;
            max-height: none !important;
            padding: 0 !important;
        }

        /* Ensure body scrolling works */
        body.has-aica-iframe {
            overflow-y: auto !important;
        }

        /* No loading indicator - removed to prevent issues */
    </style>

    <script>
        (function() {
            // Add body class for styling
            document.body.classList.add("has-aica-iframe");

            // Fix Elementor containers
            function fixElementorContainers() {
                var container = document.querySelector(".aica-iframe-container");
                if (!container) return;

                var current = container.parentElement;
                var iterations = 0;

                while (current && current !== document.documentElement && iterations < 50) {
                    if (current.classList && (
                        current.classList.contains("elementor-widget-shortcode") ||
                        current.classList.contains("elementor-element") ||
                        current.classList.contains("e-con") ||
                        current.classList.contains("elementor-section") ||
                        current.classList.contains("elementor-column")
                    )) {
                        current.style.setProperty("overflow", "visible", "important");
                        current.style.setProperty("height", "auto", "important");
                        current.style.setProperty("min-height", "100vh", "important");
                        current.style.setProperty("max-height", "none", "important");
                        current.style.setProperty("padding", "0", "important");
                    }
                    current = current.parentElement;
                    iterations++;
                }
            }

            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", fixElementorContainers);
            } else {
                fixElementorContainers();
            }

            // Auto-resize iframe based on content
            window.addEventListener("message", function(event) {
                if (event.origin !== "https://assessment-lac.vercel.app") return;

                if (event.data.type === "resize") {
                    var iframe = document.querySelector(".aica-iframe-container iframe");
                    if (iframe && event.data.height) {
                        iframe.style.height = event.data.height + "px";
                    }
                }
            });

            // No loading indicator JavaScript needed
        })();
    </script>

    <div class="aica-iframe-container">
        <iframe
            src="' . esc_url($iframe_url) . '"
            title="Am I Called Assessment"
            loading="lazy"
            allow="fullscreen"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        ></iframe>
    </div>
    ';

    return $output;
}
add_shortcode('am_i_called_assessment', 'aica_iframe_render_assessment');

/**
 * Add body class when shortcode is present
 */
function aica_iframe_body_class($classes) {
    global $post;
    if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'am_i_called_assessment')) {
        $classes[] = 'has-aica-iframe';
    }
    return $classes;
}
add_filter('body_class', 'aica_iframe_body_class');

/**
 * Activation hook
 */
function aica_iframe_activate() {
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'aica_iframe_activate');

/**
 * Deactivation hook
 */
function aica_iframe_deactivate() {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'aica_iframe_deactivate');

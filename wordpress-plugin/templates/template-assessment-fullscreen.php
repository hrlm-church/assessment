<?php
/**
 * Template Name: Assessment (Full Screen)
 * Description: Full-screen template for the assessment with no header/footer
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        .assessment-fullscreen {
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 0;
        }
        .assessment-fullscreen iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>
</head>
<body <?php body_class(); ?>>
    <div class="assessment-fullscreen">
        <?php
        // Get URL from page meta or use default
        $url = get_post_meta(get_the_ID(), 'assessment_url', true);
        if (empty($url)) {
            $url = 'https://hrlm-church.github.io/assessment/';
        }
        ?>
        <iframe
            src="<?php echo esc_url($url); ?>"
            title="<?php the_title(); ?>"
            loading="eager"
            allow="fullscreen"
        ></iframe>
    </div>
    <?php wp_footer(); ?>
</body>
</html>

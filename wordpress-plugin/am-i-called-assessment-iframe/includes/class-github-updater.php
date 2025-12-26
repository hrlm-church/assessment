<?php
/**
 * GitHub Updater Class
 *
 * Enables automatic plugin updates from GitHub repository
 * Checks for new releases and provides one-click updates in WordPress admin
 */

if (!defined('ABSPATH')) {
    exit;
}

class AICA_GitHub_Updater {
    private $plugin_slug;
    private $plugin_basename;
    private $github_repo;
    private $github_user;
    private $plugin_data;

    public function __construct($plugin_file) {
        $this->plugin_slug = plugin_basename($plugin_file);
        $this->plugin_basename = plugin_basename($plugin_file);
        $this->github_user = 'hrlm-church';
        $this->github_repo = 'assessment';

        add_filter('pre_set_site_transient_update_plugins', array($this, 'check_update'));
        add_filter('plugins_api', array($this, 'plugin_info'), 10, 3);
        add_filter('upgrader_post_install', array($this, 'after_install'), 10, 3);

        // Add "View details" link
        add_filter('plugin_row_meta', array($this, 'plugin_row_meta'), 10, 2);
    }

    /**
     * Get plugin data
     */
    private function get_plugin_data() {
        if (!$this->plugin_data) {
            if (!function_exists('get_plugin_data')) {
                require_once(ABSPATH . 'wp-admin/includes/plugin.php');
            }
            $this->plugin_data = get_plugin_data(WP_PLUGIN_DIR . '/' . $this->plugin_basename);
        }
        return $this->plugin_data;
    }

    /**
     * Get latest release info from GitHub
     */
    private function get_github_release() {
        $transient_key = 'aica_github_release';
        $release = get_transient($transient_key);

        if (false === $release) {
            $url = sprintf(
                'https://api.github.com/repos/%s/%s/releases/latest',
                $this->github_user,
                $this->github_repo
            );

            $response = wp_remote_get($url, array(
                'headers' => array(
                    'Accept' => 'application/vnd.github.v3+json',
                )
            ));

            if (is_wp_error($response)) {
                return false;
            }

            $release = json_decode(wp_remote_retrieve_body($response));

            if (!empty($release)) {
                set_transient($transient_key, $release, 60 * 60); // Cache for 1 hour
            }
        }

        return $release;
    }

    /**
     * Check for plugin updates
     */
    public function check_update($transient) {
        if (empty($transient->checked)) {
            return $transient;
        }

        $release = $this->get_github_release();

        if (!$release || empty($release->tag_name)) {
            return $transient;
        }

        $plugin_data = $this->get_plugin_data();
        $current_version = $plugin_data['Version'];
        $latest_version = ltrim($release->tag_name, 'v'); // Remove 'v' prefix if present

        // Compare versions
        if (version_compare($current_version, $latest_version, '<')) {
            $plugin_info = array(
                'slug' => $this->plugin_slug,
                'plugin' => $this->plugin_basename,
                'new_version' => $latest_version,
                'url' => $release->html_url,
                'package' => $this->get_download_url($release),
                'tested' => get_bloginfo('version'),
                'compatibility' => new stdClass(),
            );

            $transient->response[$this->plugin_basename] = (object) $plugin_info;
        }

        return $transient;
    }

    /**
     * Get download URL for the release
     */
    private function get_download_url($release) {
        // First, try to find a .zip asset
        if (!empty($release->assets)) {
            foreach ($release->assets as $asset) {
                if (strpos($asset->name, '.zip') !== false) {
                    return $asset->browser_download_url;
                }
            }
        }

        // Fallback to zipball URL
        return sprintf(
            'https://github.com/%s/%s/archive/refs/tags/%s.zip',
            $this->github_user,
            $this->github_repo,
            $release->tag_name
        );
    }

    /**
     * Provide plugin information for the "View details" popup
     */
    public function plugin_info($false, $action, $args) {
        if ($action !== 'plugin_information') {
            return $false;
        }

        if (!isset($args->slug) || $args->slug !== $this->plugin_slug) {
            return $false;
        }

        $release = $this->get_github_release();

        if (!$release) {
            return $false;
        }

        $plugin_data = $this->get_plugin_data();

        $plugin_info = new stdClass();
        $plugin_info->name = $plugin_data['Name'];
        $plugin_info->slug = $this->plugin_slug;
        $plugin_info->version = ltrim($release->tag_name, 'v');
        $plugin_info->author = $plugin_data['Author'];
        $plugin_info->homepage = $plugin_data['PluginURI'];
        $plugin_info->requires = '5.0';
        $plugin_info->tested = get_bloginfo('version');
        $plugin_info->downloaded = 0;
        $plugin_info->last_updated = $release->published_at;
        $plugin_info->sections = array(
            'description' => $plugin_data['Description'],
            'changelog' => $this->parse_changelog($release->body),
        );
        $plugin_info->download_link = $this->get_download_url($release);

        return $plugin_info;
    }

    /**
     * Parse changelog from release notes
     */
    private function parse_changelog($body) {
        if (empty($body)) {
            return '<p>No changelog available.</p>';
        }

        // Convert markdown to basic HTML
        $changelog = wpautop($body);
        return $changelog;
    }

    /**
     * Handle post-install
     */
    public function after_install($response, $hook_extra, $result) {
        global $wp_filesystem;

        $install_directory = plugin_dir_path($result['destination']);
        $wp_filesystem->move($result['destination'], $install_directory);
        $result['destination'] = $install_directory;

        if ($this->plugin_basename == $hook_extra['plugin']) {
            activate_plugin($this->plugin_basename);
        }

        return $result;
    }

    /**
     * Add custom plugin row meta
     */
    public function plugin_row_meta($links, $file) {
        if ($file === $this->plugin_basename) {
            $release = $this->get_github_release();
            if ($release) {
                $links[] = '<a href="' . esc_url($release->html_url) . '" target="_blank">View on GitHub</a>';
            }
        }
        return $links;
    }
}

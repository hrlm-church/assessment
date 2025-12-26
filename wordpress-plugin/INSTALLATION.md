# Quick Installation Guide - Am I Called Assessment Plugin

## For WP Engine Hosting (Recommended Method)

### Option 1: SFTP Upload (Easiest)

1. **Prepare the plugin**
   ```bash
   cd wordpress-plugin
   zip -r am-i-called-assessment.zip am-i-called-assessment/
   ```

2. **Connect to WP Engine via SFTP**
   - Use an FTP client (FileZilla, Cyberduck, etc.)
   - Host: `your-site.sftp.wpengine.com`
   - Username: Your WP Engine username
   - Password: Your WP Engine password
   - Port: 2222 (for SFTP)

3. **Upload the plugin folder**
   - Navigate to: `/wp-content/plugins/`
   - Upload the entire `am-i-called-assessment` folder
   - Wait for all files to upload (may take 1-2 minutes)

4. **Activate in WordPress**
   - Login to WordPress Admin: `https://revdaveharvey.com/wp-admin`
   - Go to: Plugins → Installed Plugins
   - Find: "Am I Called Assessment"
   - Click: "Activate"

### Option 2: WordPress Admin Upload

1. **Zip the plugin**
   ```bash
   cd wordpress-plugin
   zip -r am-i-called-assessment.zip am-i-called-assessment/
   ```

2. **Upload via WordPress Admin**
   - Login to: `https://revdaveharvey.com/wp-admin`
   - Go to: Plugins → Add New → Upload Plugin
   - Click: "Choose File"
   - Select: `am-i-called-assessment.zip`
   - Click: "Install Now"
   - Click: "Activate Plugin"

## Deploying to Your Assessment Page

### Updating the Existing Page

1. **Edit the assessment page**
   - Go to: Pages → All Pages
   - Find: "Assessment - Am I Called?" (or similar)
   - Click: "Edit"

2. **Replace the iframe with shortcode**
   - Remove any existing iframe code
   - Add this shortcode:
   ```
   [am_i_called_assessment]
   ```

3. **Configure page settings**
   - Page Template: Select "Full Width" (if available)
   - Remove sidebar (if applicable)
   - Update the page

4. **Clear all caches**
   - WP Engine: Login to WP Engine portal → Clear all caches
   - WordPress: If using cache plugin, clear cache
   - Browser: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Verification Checklist

After installation, verify these items:

- [ ] Plugin appears in Plugins list and shows as "Active"
- [ ] Assessment page loads without errors
- [ ] No iframe - content flows naturally on the page
- [ ] Can scroll the entire page smoothly (no double scrolling)
- [ ] Assessment questions and navigation work correctly
- [ ] Videos play properly in the results section
- [ ] PDF export works
- [ ] Page is responsive on mobile devices
- [ ] No JavaScript errors in browser console (F12)

## Troubleshooting First Steps

**If assessment doesn't appear:**
1. Check that plugin is activated
2. Verify shortcode is spelled correctly: `[am_i_called_assessment]`
3. Clear all caches (WP Engine + WordPress + Browser)

**If styling looks broken:**
1. Select "Full Width" page template
2. Clear caches
3. Try different browser

**If scripts don't load:**
1. Check browser console for errors (F12)
2. Ensure all plugin files uploaded correctly
3. Check file permissions on server

## Getting Help

If you encounter issues:
1. Check the full README.md in the plugin folder
2. Enable WordPress debug mode to see specific errors
3. Contact WP Engine support for server-related issues

## URLs Reference

- **WordPress Admin:** `https://revdaveharvey.com/wp-admin`
- **Current Assessment Page:** `https://revdaveharvey.com/assessment-am-i-called/`
- **WP Engine Portal:** `https://my.wpengine.com`

## File Permissions (If Needed)

If you experience permission issues:
```bash
# Files should be 644
find am-i-called-assessment/ -type f -exec chmod 644 {} \;

# Directories should be 755
find am-i-called-assessment/ -type d -exec chmod 755 {} \;
```

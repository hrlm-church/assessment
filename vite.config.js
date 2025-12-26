import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // Relative paths for WordPress plugin compatibility
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate manifest for asset mapping
    manifest: true,
    rollupOptions: {
      output: {
        // Consistent naming for easier enqueuing in WordPress
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})

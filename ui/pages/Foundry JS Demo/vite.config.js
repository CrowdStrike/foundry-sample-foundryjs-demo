import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Strips crossorigin attribute from script/link tags — breaks iframe loading
const stripCrossorigin = () => ({
  name: 'strip-crossorigin',
  transformIndexHtml(html) {
    return html
      .replace(`type="module" crossorigin`, 'type="module"')
      .replace(`crossorigin `, '');
  },
});

export default defineConfig({
  plugins: [
    react(),
    stripCrossorigin(),
  ],
  root: 'src',
  base: '', // Empty base for relative paths that work with <base> tag
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'src/index.html',
      },
    },
    // Generate hashed filenames for cache busting
    assetsInlineLimit: 0,
  },
});

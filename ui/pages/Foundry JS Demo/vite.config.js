import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
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

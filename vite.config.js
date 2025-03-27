import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Content-Security-Policy': "frame-ancestors 'self' https://*.myshopify.com;",
      'Access-Control-Allow-Origin': '*', // Allow Shopify to load assets
    }
  },
  build: {
    outDir: 'dist', // Output to `dist` folder
    rollupOptions: {
      output: {
        entryFileNames: `shopify-mapbox-widget.js`, // Ensures correct script file name
        format: 'iife', // Use an Immediately Invoked Function Expression for Shopify
      }
    }
  }
});

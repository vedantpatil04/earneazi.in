import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

/**
 * `base` decides every asset URL in the build and the router's basename.
 *
 * Phase 0 §31 lists "domain root or subdirectory" as unconfirmed with the
 * host, so it is a build variable rather than a hard-coded path: set
 * VITE_BASE_PATH=/subdir/ to deploy into a subdirectory, and the router
 * follows automatically through import.meta.env.BASE_URL (see
 * src/config/site.ts). Default '/' is correct for a domain root.
 */
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

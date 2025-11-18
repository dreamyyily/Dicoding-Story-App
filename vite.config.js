import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',                                    // INI YANG HILANG!!! WAJIB ADA
  build: {
    outDir: '../dist',                            // hasil build ke folder dist di root
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
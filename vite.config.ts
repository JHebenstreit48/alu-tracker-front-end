import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.REACT_APP_API_BASE_URL': JSON.stringify(process.env.REACT_APP_API_BASE_URL || '')
  },
  server: {
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@components': resolve(__dirname, 'src/components'),
      '@scss': resolve(__dirname, 'src/scss') // ✅ Matches actual folder name

    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '' // ✅ Automatically injects scss variables/mixins
      },
    },
  },
});
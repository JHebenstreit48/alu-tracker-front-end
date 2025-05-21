import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.REACT_APP_API_BASE_URL': JSON.stringify(process.env.REACT_APP_API_BASE_URL || '')
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://alutracker-api.onrender.com', // Backend URL
        changeOrigin: true,
        secure: false
      },
    },
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
        additionalData: `@use "@scss/Globals/Variables" as *;` // ✅ Automatically injects scss variables/mixins
      },
    },
  },
});

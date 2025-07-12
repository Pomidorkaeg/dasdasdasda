import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/sdf/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['sql.js'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'sql.js': ['sql.js'],
        },
      },
    },
    sourcemap: true,
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
    port: 8080,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://192.168.68.104:8080',
        changeOrigin: true,
        secure: false
      }
    }
  },
}); 
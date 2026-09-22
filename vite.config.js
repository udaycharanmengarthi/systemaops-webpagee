// systemaops-webpage/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split heavy/rarely-changing vendor code into its own cacheable
        // chunks instead of one giant bundle. `three` in particular is
        // large and only needed for the background shader.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'three'
            if (id.includes('react-router')) return 'router'
            if (id.includes('react-dom') || id.includes('/react/')) return 'react-vendor'
            return 'vendor'
          }
        }
      }
    }
  }
})
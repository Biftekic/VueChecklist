import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    host: true
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
              return 'vendor-vue';
            }
            if (id.includes('vuetify')) {
              return 'vendor-vuetify';
            }
            if (id.includes('fuse.js') || id.includes('dexie')) {
              return 'vendor-utils';
            }
          }
          if (id.includes('/src/data/')) {
            return 'data-templates';
          }
        }
      }
    }
  }
})
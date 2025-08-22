import { defineConfig, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'
import type { ManualChunksOption, OutputOptions } from 'rollup'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Cleaning Checklist App',
        short_name: 'CleanCheck',
        description: 'Professional cleaning checklist management app',
        theme_color: '#2196F3',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
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
    target: 'esnext', // Use modern JavaScript for faster builds
    cssCodeSplit: true, // Enable CSS code splitting for better performance
    rollupOptions: {
      output: {
        manualChunks(id: string): string | undefined {
          if (id.includes('node_modules')) {
            // Core framework
            if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
              return 'vendor-vue';
            }
            // UI framework
            if (id.includes('vuetify')) {
              return 'vendor-vuetify';
            }
            // Utilities
            if (id.includes('fuse.js') || id.includes('dexie')) {
              return 'vendor-utils';
            }
            // PDF generation
            if (id.includes('jspdf')) {
              return 'vendor-pdf';
            }
            // Validation
            if (id.includes('zod')) {
              return 'vendor-validation';
            }
            // Icons
            if (id.includes('@mdi')) {
              return 'vendor-icons';
            }
          }
          // Split data and templates
          if (id.includes('/src/data/')) {
            return 'data-templates';
          }
          // Split large components
          if (id.includes('/src/components/checklist/')) {
            return 'components-checklist';
          }
          if (id.includes('/src/components/common/')) {
            return 'components-common';
          }
        },
        // Better chunking strategy
        chunkFileNames: (chunkInfo): string => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/[name]-${facadeModuleId}-[hash].js`;
        },
        assetFileNames: (assetInfo): string => {
          const info = assetInfo.name!.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          } else if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
            return `fonts/[name]-[hash][extname]`;
          } else {
            return `assets/[name]-[hash][extname]`;
          }
        }
      } as OutputOptions
    },
    // Enable minification for production
    minify: 'esbuild', // Using esbuild for faster builds
    // Enable source maps for production debugging
    sourcemap: 'hidden', // Generate source maps but don't reference them in the code
    // Reports
    reportCompressedSize: false,
    // Increase chunk size limit to reduce warnings
    chunkSizeWarningLimit: 500
  }
} as UserConfig)
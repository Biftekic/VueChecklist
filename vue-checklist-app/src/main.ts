import { createApp } from 'vue'
import type { App as VueApp, ComponentPublicInstance } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
// Removed @mdi/font - now using tree-shaken @mdi/js icons
import './assets/styles/main.scss'
import { errorHandler } from './services/errorHandler'
import { performanceMonitor } from './services/performanceMonitor'
import { logger } from './utils/logger'

const app: VueApp = createApp(App)
const pinia = createPinia()

// Initialize error handler with router
errorHandler.setRouter(router)

// Global error handler for Vue errors
app.config.errorHandler = (err: unknown, instance: ComponentPublicInstance | null, info: string) => {
  errorHandler.handleError(err as Error, {
    context: {
      component: instance?.$options.name || 'Unknown',
      info
    }
  })
}

// Global warning handler (development only)
if (import.meta.env.DEV) {
  app.config.warnHandler = (msg: string, instance: ComponentPublicInstance | null, trace: string) => {
    logger.warn(`[Vue Warning]: ${msg}`, trace)
  }
}

app.use(pinia)
app.use(router)
app.use(vuetify)

// Register service worker for PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      logger.info('Service Worker registered:', registration)
    })
    .catch(error => {
      logger.error('Service Worker registration failed:', error)
    })
}

app.mount('#app')
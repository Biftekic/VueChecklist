import { createApp } from 'vue'
import type { App as VueApp, ComponentPublicInstance } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
// Import Vuetify styles explicitly
import 'vuetify/styles'
// Removed @mdi/font - now using tree-shaken @mdi/js icons
import './assets/styles/main.scss'
// Temporarily disabled to diagnose blank screen issue
// import { errorHandler } from './services/errorHandler'
// import { performanceMonitor } from './services/performanceMonitor'
// import { logger } from './utils/logger'

const app: VueApp = createApp(App)
const pinia = createPinia()

// Temporarily disabled error handler
// errorHandler.setRouter(router)

// Simple error handler for debugging
app.config.errorHandler = (err: unknown, instance: ComponentPublicInstance | null, info: string) => {
  console.error('Vue Error:', err)
  console.error('Component:', instance?.$options.name || 'Unknown')
  console.error('Info:', info)
}

// Simple warning handler (development only)
if (import.meta.env.DEV) {
  app.config.warnHandler = (msg: string, instance: ComponentPublicInstance | null, trace: string) => {
    console.warn(`[Vue Warning]: ${msg}`, trace)
  }
}

app.use(pinia)
app.use(router)
app.use(vuetify)

// Temporarily disabled service worker
// if ('serviceWorker' in navigator && import.meta.env.PROD) {
//   navigator.serviceWorker.register('/sw.js')
//     .then(registration => {
//       console.log('Service Worker registered:', registration)
//     })
//     .catch(error => {
//       console.error('Service Worker registration failed:', error)
//     })
// }

app.mount('#app')

console.log('App initialized successfully!')
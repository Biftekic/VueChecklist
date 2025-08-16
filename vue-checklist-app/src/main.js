import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import '@mdi/font/css/materialdesignicons.css'
import './assets/styles/main.scss'
import { errorHandler } from './services/errorHandler'
import { performanceMonitor } from './services/performanceMonitor'

const app = createApp(App)
const pinia = createPinia()

// Initialize error handler with router
errorHandler.setRouter(router)

// Global error handler for Vue errors
app.config.errorHandler = (err, instance, info) => {
  errorHandler.handleError(err, {
    context: {
      component: instance?.$options.name || 'Unknown',
      info
    }
  })
}

// Global warning handler (development only)
if (import.meta.env.DEV) {
  app.config.warnHandler = (msg, instance, trace) => {
    console.warn(`[Vue Warning]: ${msg}`, trace)
  }
}

app.use(pinia)
app.use(router)
app.use(vuetify)

// Register service worker for PWA
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker registered:', registration)
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error)
    })
}

app.mount('#app')
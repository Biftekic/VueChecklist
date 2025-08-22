import { logger } from "@/services/logger"
import { createApp } from 'vue'
import type { App as VueApp, ComponentPublicInstance } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
// Import Vuetify styles explicitly
import 'vuetify/styles'
// Material Design Icons are now imported individually via @mdi/js for better tree-shaking
// See src/utils/icons.ts for icon imports
import './assets/styles/main.scss'
// Error handling and performance monitoring disabled
// See BUGS.md for details on re-enabling these services

const app: VueApp = createApp(App)
const pinia = createPinia()


// Production error handler
app.config.errorHandler = (err: unknown, instance: ComponentPublicInstance | null, info: string) => {
  if (import.meta.env.DEV) {
    logger.error('[Vue Error]', {
      error: err,
      component: instance?.$options.name || 'Unknown',
      info
    })
  }
}

// Development warning handler
if (import.meta.env.DEV) {
  app.config.warnHandler = (msg: string) => {
    logger.warn(`[Vue Warning]: ${msg}`)
  }
}

app.use(pinia)
app.use(router)
app.use(vuetify)


app.mount('#app')
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
// Import Vuetify styles explicitly
import 'vuetify/styles'
import './assets/styles/main.scss'

console.log('main.ts: Starting app initialization...')

try {
  const app = createApp(App)
  console.log('main.ts: Vue app created')
  
  const pinia = createPinia()
  console.log('main.ts: Pinia store created')
  
  app.use(pinia)
  console.log('main.ts: Pinia installed')
  
  app.use(router)
  console.log('main.ts: Router installed')
  
  app.use(vuetify)
  console.log('main.ts: Vuetify installed')
  
  app.mount('#app')
  console.log('main.ts: App mounted successfully!')
  
} catch (error) {
  console.error('main.ts: Error during app initialization:', error)
}
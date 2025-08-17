<template>
  <v-app>
    <v-main>
      <v-container>
        <v-card class="pa-4">
          <v-card-title>Vue Checklist App</v-card-title>
          <v-card-text>
            <p>App is working! The page is loading correctly.</p>
            <p>Current route: {{ currentRoute }}</p>
            <v-btn color="primary" @click="navigateHome">Go to Home</v-btn>
          </v-card-text>
        </v-card>
        
        <v-card class="mt-4 pa-4">
          <router-view />
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

console.log('App.vue: Component loading...')

const route = useRoute()
const router = useRouter()

const currentRoute = computed(() => route.path)

const navigateHome = () => {
  router.push('/')
}

console.log('App.vue: Setup complete')
</script>
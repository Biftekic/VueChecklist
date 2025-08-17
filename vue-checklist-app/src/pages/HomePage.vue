<template>
  <v-container>
    <h1>Test Home Page</h1>
    <p>If you see this, the app is working!</p>
    
    <v-btn color="primary" @click="navigateTo('/checklists')">
      Go to Checklists
    </v-btn>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'

console.log('HomePage.vue loaded - test version')

const router = useRouter()

const navigateTo = (path) => {
  router.push(path)
}
</script>
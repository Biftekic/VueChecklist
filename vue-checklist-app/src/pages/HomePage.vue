<template>
  <MainLayout title="Cleaning Checklist Pro">
    <v-container class="pa-4">
      <h1>Test Home Page with MainLayout</h1>
      <p>If you see this, MainLayout is working!</p>
      
      <v-btn color="primary" @click="navigateTo('/checklists')">
        Go to Checklists
      </v-btn>
    </v-container>
  </MainLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

console.log('HomePage.vue loaded - with MainLayout')

const router = useRouter()

const navigateTo = (path) => {
  router.push(path)
}
</script>
<template>
  <MainLayout title="Cleaning Checklist Pro">
    <v-container class="pa-4">
      <h1>Home Page - Simple Version</h1>
      <p>This version has no store dependencies.</p>
      
      <v-btn color="primary" @click="navigateTo('/create')">
        Create Checklist
      </v-btn>
    </v-container>
  </MainLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const router = useRouter()

const navigateTo = (path) => {
  router.push(path)
}

console.log('HomePageSimple loaded - no stores')
</script>
<template>
  <MainLayout title="Create Checklist">
    <v-container class="pa-4">
      <h1>Create Checklist - Simple Test Version</h1>
      <p>This is a simplified version to test if the page loads.</p>
      
      <v-btn color="primary" @click="goBack">
        Go Back
      </v-btn>
    </v-container>
  </MainLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

const router = useRouter()

const goBack = () => {
  router.push('/checklists')
}

console.log('CreateChecklistPage.simple loaded successfully')
</script>
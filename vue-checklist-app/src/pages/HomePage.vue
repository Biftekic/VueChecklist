<template>
  <MainLayout title="Cleaning Checklist Pro">
    <v-container class="pa-4">
      <!-- Welcome Section -->
      <v-card class="mb-4 pa-4" elevation="0" color="primary">
        <v-card-title class="text-white">
          Welcome Back!
        </v-card-title>
        <v-card-subtitle class="text-white">
          {{ greeting }}
        </v-card-subtitle>
      </v-card>
      
      <!-- Quick Stats -->
      <div class="mb-4">
        <v-row>
          <v-col cols="6">
            <v-card class="pa-3 text-center" elevation="2">
              <v-icon color="primary" size="32" class="mb-2">
                mdi-clipboard-check
              </v-icon>
              <div class="text-h4 font-weight-bold text-primary">
                0
              </div>
              <div class="text-caption text-medium-emphasis">
                Total Checklists
              </div>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card class="pa-3 text-center" elevation="2">
              <v-icon color="success" size="32" class="mb-2">
                mdi-calendar-check
              </v-icon>
              <div class="text-h4 font-weight-bold text-success">
                0
              </div>
              <div class="text-caption text-medium-emphasis">
                This Week
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
      
      <!-- Quick Actions -->
      <div class="mb-4">
        <h2 class="mb-3">Quick Actions</h2>
        <v-row>
          <v-col cols="6">
            <v-card
              @click="navigateTo('/create')"
              class="pa-4 text-center"
              elevation="2"
              rounded="xl"
            >
              <v-icon size="48" color="primary">
                mdi-plus-circle
              </v-icon>
              <v-card-title class="text-body-1">
                Create New
              </v-card-title>
            </v-card>
          </v-col>
          
          <v-col cols="6">
            <v-card
              @click="navigateTo('/checklists')"
              class="pa-4 text-center"
              elevation="2"
              rounded="xl"
            >
              <v-icon size="48" color="accent">
                mdi-format-list-checks
              </v-icon>
              <v-card-title class="text-body-1">
                View Lists
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </MainLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

console.log('HomePage.vue loaded - without store')

const router = useRouter()

// Computed greeting based on time of day
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning! Ready to create today\'s checklists?'
  if (hour < 17) return 'Good afternoon! Keep up the great work!'
  return 'Good evening! Time to wrap up today\'s tasks?'
})

const navigateTo = (path) => {
  router.push(path)
}
</script>
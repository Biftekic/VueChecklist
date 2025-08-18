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
                {{ totalChecklists }}
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
                {{ weeklyChecklists }}
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
        <v-row class="mt-2">
          <v-col cols="6">
            <v-card
              @click="navigateTo('/templates')"
              class="pa-4 text-center"
              elevation="2"
              rounded="xl"
            >
              <v-icon size="48" color="warning">
                mdi-file-document-outline
              </v-icon>
              <v-card-title class="text-body-1">
                Templates
              </v-card-title>
            </v-card>
          </v-col>
          
          <v-col cols="6">
            <v-card
              @click="navigateTo('/inventory')"
              class="pa-4 text-center"
              elevation="2"
              rounded="xl"
            >
              <v-icon size="48" color="success">
                mdi-package-variant
              </v-icon>
              <v-card-title class="text-body-1">
                Inventory
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="mt-2">
          <v-col cols="12">
            <v-card
              @click="navigateTo('/settings')"
              class="pa-4 text-center"
              elevation="2"
              rounded="xl"
            >
              <v-icon size="48" color="info">
                mdi-cog
              </v-icon>
              <v-card-title class="text-body-1">
                Settings
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { useChecklistStore } from '@/stores/checklistStore'

console.log('HomePage.vue loaded - with store integration')

const router = useRouter()
const checklistStore = useChecklistStore()

// Initialize with static values, update from store if available
const totalChecklists = ref(0)
const weeklyChecklists = ref(0)

// Computed greeting based on time of day
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning! Ready to create today\'s checklists?'
  if (hour < 17) return 'Good afternoon! Keep up the great work!'
  return 'Good evening! Time to wrap up today\'s tasks?'
})

// Safely load checklists
onMounted(async () => {
  console.log('HomePage mounted successfully')
  try {
    // Only load if the store has the method
    if (checklistStore.loadChecklists) {
      await checklistStore.loadChecklists()
      totalChecklists.value = checklistStore.totalChecklists || 0
      weeklyChecklists.value = checklistStore.activeChecklists?.length || 0
    }
  } catch (error) {
    console.error('Error loading checklists:', error)
    // Keep static values on error
  }
})

const navigateTo = (path) => {
  router.push(path)
}
</script>
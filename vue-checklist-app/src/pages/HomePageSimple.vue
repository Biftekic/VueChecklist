<template>
  <MainLayout title="Cleaning Checklist Pro">
    <v-container class="pa-4">
      <!-- Welcome Card -->
      <v-card class="mb-6 elevation-4 welcome-card">
        <v-card-text class="text-center pa-8">
          <v-icon size="80" color="primary" class="mb-4">
            mdi-home-heart
          </v-icon>
          <h1 class="text-h4 font-weight-bold mb-2">Welcome Back!</h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            Professional cleaning management made simple
          </p>
        </v-card-text>
      </v-card>

      <!-- Quick Actions -->
      <v-row>
        <v-col 
          v-for="action in actionCards" 
          :key="action.id"
          cols="12" 
          sm="6"
        >
          <v-card 
            class="action-card elevation-3" 
            @click="handleNavigation(action.path)"
            hover
            :aria-label="action.title"
          >
            <v-card-text class="text-center pa-6">
              <v-icon 
                size="48" 
                :color="action.color" 
                class="mb-3"
              >
                {{ action.icon }}
              </v-icon>
              <h3 class="text-h6 font-weight-medium">{{ action.title }}</h3>
              <p class="text-body-2 text-medium-emphasis mt-2">
                {{ action.description }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Stats Section -->
      <v-card class="mt-6 elevation-3 stats-card">
        <v-card-title class="text-h6">
          <v-icon class="mr-2">mdi-chart-box</v-icon>
          Quick Stats
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col 
              v-for="stat in quickStats" 
              :key="stat.label"
              cols="6"
            >
              <div class="text-center">
                <div class="text-h4 font-weight-bold" :class="`text-${stat.color}`">
                  {{ stat.value }}
                </div>
                <div class="text-caption">{{ stat.label }}</div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import type { ActionCard, QuickStat } from '@/types/navigation'

const router = useRouter()

// Action cards configuration
const actionCards = computed<ActionCard[]>(() => [
  {
    id: 'create',
    title: 'Create New Checklist',
    description: 'Start a new cleaning project',
    icon: 'mdi-plus-circle',
    color: 'success',
    path: '/create'
  },
  {
    id: 'view',
    title: 'View Checklists',
    description: 'Browse existing checklists',
    icon: 'mdi-format-list-checks',
    color: 'info',
    path: '/checklists'
  },
  {
    id: 'templates',
    title: 'Templates',
    description: 'Use pre-built templates',
    icon: 'mdi-file-document-multiple',
    color: 'warning',
    path: '/templates'
  },
  {
    id: 'inventory',
    title: 'Inventory',
    description: 'Manage supplies & equipment',
    icon: 'mdi-package-variant',
    color: 'purple',
    path: '/inventory'
  }
])

// Quick stats configuration
const quickStats = computed<QuickStat[]>(() => [
  {
    label: 'Active Checklists',
    value: 0,
    color: 'primary'
  },
  {
    label: 'Completed Today',
    value: 0,
    color: 'success'
  }
])

// Navigation handler with error handling
const handleNavigation = (path: string): void => {
  try {
    router.push(path)
  } catch (error) {
    console.error('Navigation error:', error)
  }
}

// Home page with simplified architecture
</script>

<style scoped>
.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.welcome-card .v-icon {
  color: white !important;
}

.action-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 12px;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
}

.stats-card {
  border-radius: 12px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
</style>
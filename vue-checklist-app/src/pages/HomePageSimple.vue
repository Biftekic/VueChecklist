<template>
  <MainLayout title="Cleaning Checklist Pro">
    <v-container class="pa-4" role="region" aria-label="Dashboard">
      <!-- Welcome Card -->
      <v-card class="mb-6 elevation-4 welcome-card" role="banner">
        <v-card-text class="text-center pa-8">
          <v-icon size="80" color="primary" class="mb-4" aria-hidden="true">
            mdi-home-heart
          </v-icon>
          <h1 class="text-h4 font-weight-bold mb-2" id="page-title">Welcome Back!</h1>
          <p class="text-subtitle-1 text-medium-emphasis">
            Professional cleaning management made simple
          </p>
        </v-card-text>
      </v-card>

      <!-- Quick Actions -->
      <section aria-labelledby="quick-actions-title">
      <h2 id="quick-actions-title" class="sr-only">Quick Actions</h2>
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
            @keydown.enter="handleNavigation(action.path)"
            @keydown.space.prevent="handleNavigation(action.path)"
            hover
            tabindex="0"
            role="button"
            :aria-label="`${action.title}: ${action.description}`"
            :aria-describedby="`action-desc-${action.id}`"
          >
            <v-card-text class="text-center pa-6">
              <v-icon 
                size="48" 
                :color="action.color" 
                class="mb-3"
                aria-hidden="true"
              >
                {{ action.icon }}
              </v-icon>
              <h3 class="text-h6 font-weight-medium">{{ action.title }}</h3>
              <p :id="`action-desc-${action.id}`" class="text-body-2 text-medium-emphasis mt-2">
                {{ action.description }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      </section>

      <!-- Stats Section -->
      <v-card class="mt-6 elevation-3 stats-card" role="region" aria-labelledby="stats-title">
        <v-card-title class="text-h6" id="stats-title">
          <v-icon class="mr-2" aria-hidden="true">mdi-chart-box</v-icon>
          Quick Stats
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col 
              v-for="stat in quickStats" 
              :key="stat.label"
              cols="6"
            >
              <div class="text-center" role="group" :aria-label="stat.label">
                <div class="text-h4 font-weight-bold" :class="`text-${stat.color}`" aria-describedby="`stat-label-${stat.label.replace(' ', '-')}`">
                  {{ stat.value }}
                </div>
                <div :id="`stat-label-${stat.label.replace(' ', '-')}`" class="text-caption">{{ stat.label }}</div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { logger } from "@/services/logger"
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import type { ActionCard, QuickStat } from '@/types/navigation'
import { useAccessibility } from '@/composables/useAccessibility'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'

const router = useRouter()
const { announcePolite } = useAccessibility()

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
    announcePolite(`Navigating to ${path}`)
  } catch (error) {
    logger.error('Navigation error:', error)
  }
}

// Keyboard shortcuts for this page
const pageShortcuts = [
  {
    key: '1',
    alt: true,
    description: 'Create new checklist',
    action: () => handleNavigation('/create')
  },
  {
    key: '2',
    alt: true,
    description: 'View checklists',
    action: () => handleNavigation('/checklists')
  },
  {
    key: '3',
    alt: true,
    description: 'View templates',
    action: () => handleNavigation('/templates')
  },
  {
    key: '4',
    alt: true,
    description: 'View inventory',
    action: () => handleNavigation('/inventory')
  }
]

useKeyboardShortcuts(pageShortcuts)

// Announce page load for screen readers
onMounted(() => {
  announcePolite('Dashboard loaded. Use Alt+1 through Alt+4 for quick navigation.')
})

// Home page with simplified architecture
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

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

.action-card:focus {
  outline: 3px solid #667eea;
  outline-offset: 2px;
}

.action-card:focus-visible {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.5);
}

.stats-card {
  border-radius: 12px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
</style>
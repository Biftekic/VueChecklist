<template>
  <MainLayout title="My Checklists">
    <v-container class="pa-4">
      <!-- Header with Action Button -->
      <div class="d-flex justify-space-between align-center mb-4">
        <h1 class="text-h4">Checklists</h1>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="navigateTo('/create')"
        >
          New Checklist
        </v-btn>
      </div>

      <!-- Filter Tabs -->
      <v-tabs
        v-model="filterTab"
        class="mb-4"
        color="primary"
      >
        <v-tab value="all">All</v-tab>
        <v-tab value="active">Active</v-tab>
        <v-tab value="completed">Completed</v-tab>
      </v-tabs>

      <!-- Loading State -->
      <v-progress-linear
        v-if="isLoading || isDeleting"
        indeterminate
        color="primary"
        class="mb-4"
      />

      <!-- Empty State -->
      <v-card
        v-if="!isLoading && filteredChecklists.length === 0"
        class="pa-8 text-center"
        elevation="0"
        color="grey-lighten-4"
      >
        <v-icon size="64" color="grey">
          mdi-clipboard-text-outline
        </v-icon>
        <v-card-title class="text-grey">
          {{ emptyStateMessage }}
        </v-card-title>
        <v-card-subtitle>
          {{ emptyStateSubtitle }}
        </v-card-subtitle>
        <v-btn
          v-if="filterTab === 'all'"
          color="primary"
          class="mt-4"
          @click="navigateTo('/create')"
        >
          Create Your First Checklist
        </v-btn>
      </v-card>

      <!-- Checklists List -->
      <v-row v-else>
        <v-col
          v-for="checklist in filteredChecklists"
          :key="checklist.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            class="checklist-card"
            elevation="2"
            @click="viewChecklist(checklist.id)"
          >
            <v-card-title>
              <v-icon left class="mr-2">mdi-clipboard-check</v-icon>
              {{ checklist.name || 'Unnamed Checklist' }}
            </v-card-title>
            
            <v-card-subtitle>
              <v-icon size="small" class="mr-1">mdi-account</v-icon>
              {{ checklist.clientName || 'No client' }}
            </v-card-subtitle>

            <v-card-text>
              <div class="d-flex justify-space-between align-center">
                <div>
                  <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                  {{ formatDate(checklist.createdAt) }}
                </div>
                <v-chip
                  size="small"
                  :color="getStatusColor(checklist.status)"
                >
                  {{ checklist.status || 'active' }}
                </v-chip>
              </div>
              
              <div class="mt-2" v-if="checklist.tasks">
                <v-progress-linear
                  :value="getProgress(checklist)"
                  color="success"
                  height="8"
                  rounded
                />
                <div class="text-caption mt-1 text-center">
                  {{ getCompletedTasks(checklist) }} / {{ getTotalTasks(checklist) }} tasks
                </div>
              </div>
            </v-card-text>

            <v-card-actions>
              <v-btn
                text
                color="primary"
                @click.stop="viewChecklist(checklist.id)"
              >
                View
              </v-btn>
              <v-spacer />
              <v-btn
                icon
                @click.stop="deleteChecklist(checklist.id)"
              >
                <v-icon color="error">mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </MainLayout>
</template>

<script setup>
import { logger } from "@/services/logger"
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { useChecklistStore } from '@/stores/checklistStore'

const router = useRouter()
const checklistStore = useChecklistStore()

// State
const checklists = ref([])
const isLoading = ref(false)
const filterTab = ref('all')

// Loading indicator for delete operations
const isDeleting = ref(false)

// Computed
const filteredChecklists = computed(() => {
  if (filterTab.value === 'all') return checklists.value
  if (filterTab.value === 'active') {
    return checklists.value.filter(c => c.status !== 'completed')
  }
  if (filterTab.value === 'completed') {
    return checklists.value.filter(c => c.status === 'completed')
  }
  return checklists.value
})

const emptyStateMessage = computed(() => {
  if (filterTab.value === 'all') return 'No checklists yet'
  if (filterTab.value === 'active') return 'No active checklists'
  if (filterTab.value === 'completed') return 'No completed checklists'
  return 'No checklists found'
})

const emptyStateSubtitle = computed(() => {
  if (filterTab.value === 'all') return 'Create your first checklist to get started'
  if (filterTab.value === 'active') return 'All your checklists are completed!'
  if (filterTab.value === 'completed') return 'Complete some checklists to see them here'
  return ''
})

// Methods
const loadChecklists = async () => {
  isLoading.value = true
  try {
    // Load actual checklists from database via store
    await checklistStore.loadChecklists()
    checklists.value = checklistStore.checklists || []
    logger.debug('Loaded checklists:', checklists.value)
    // Debug: Log the first checklist if it exists
    if (checklists.value.length > 0) {
      logger.debug('First checklist details:', checklists.value[0])
      logger.debug('First checklist ID:', checklists.value[0].id)
      logger.debug('ID type:', typeof checklists.value[0].id)
    }
  } catch (error) {
    logger.error('Error loading checklists:', error)
    checklists.value = []
  } finally {
    isLoading.value = false
  }
}

const navigateTo = (path) => {
  router.push(path)
}

const viewChecklist = (id) => {
  logger.debug('=== viewChecklist called ===')
  logger.debug('Checklist ID:', id)
  logger.debug('ID type:', typeof id)
  logger.debug('Router instance:', router)
  
  if (!id && id !== 0) {
    logger.error('No ID provided for checklist')
    return
  }
  
  const path = `/checklist/${id}`
  logger.debug('Navigating to:', path)
  
  try {
    router.push(path).then(() => {
      logger.debug('Navigation successful')
    }).catch((err) => {
      logger.error('Navigation failed:', err)
    })
  } catch (error) {
    logger.error('Error during navigation:', error)
  }
}

const deleteChecklist = async (id) => {
  if (confirm('Are you sure you want to delete this checklist?')) {
    isDeleting.value = true
    try {
      await checklistStore.deleteChecklist(id)
      // Refresh the list after deletion
      await loadChecklists()
    } catch (error) {
      logger.error('Error deleting checklist:', error)
      // Show error notification if needed
      alert('Failed to delete checklist. Please try again.')
    } finally {
      isDeleting.value = false
    }
  }
}

const formatDate = (date) => {
  if (!date) return 'Unknown'
  const d = new Date(date)
  const now = new Date()
  const diffTime = Math.abs(now - d)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const getStatusColor = (status) => {
  const colors = {
    active: 'primary',
    completed: 'success',
    pending: 'warning',
    cancelled: 'error'
  }
  return colors[status] || 'grey'
}

const getTotalTasks = (checklist) => {
  return checklist.tasks ? checklist.tasks.length : 0
}

const getCompletedTasks = (checklist) => {
  if (!checklist.tasks) return 0
  return checklist.tasks.filter(t => t.completed).length
}

const getProgress = (checklist) => {
  const total = getTotalTasks(checklist)
  if (total === 0) return 0
  return (getCompletedTasks(checklist) / total) * 100
}

// Lifecycle
onMounted(() => {
  loadChecklists()
})
</script>

<style scoped>
.checklist-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.checklist-card:hover {
  transform: translateY(-2px);
}
</style>
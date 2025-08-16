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
      
      <!-- Recent Checklists -->
      <div>
        <div class="d-flex justify-space-between align-center mb-3">
          <h2>Recent Checklists</h2>
          <v-btn
            v-if="recentChecklists.length > 0"
            text
            size="small"
            @click="navigateTo('/checklists')"
            class="text-primary"
          >
            View All
          </v-btn>
        </div>
        
        <v-card
          v-if="recentChecklists.length === 0"
          class="pa-8 text-center"
          elevation="0"
          color="grey-lighten-4"
        >
          <v-icon size="64" color="grey">
            mdi-clipboard-text-outline
          </v-icon>
          <v-card-title class="text-grey">
            No checklists yet
          </v-card-title>
          <v-card-subtitle>
            Create your first checklist to get started
          </v-card-subtitle>
          <v-btn
            color="primary"
            class="mt-4"
            @click="navigateTo('/create')"
          >
            Create Your First
          </v-btn>
        </v-card>
        
        <v-list v-else>
          <v-list-item
            v-for="checklist in recentChecklists"
            :key="checklist.id"
            @click="viewChecklist(checklist.id)"
            class="mb-2"
            rounded="lg"
            elevation="1"
          >
            <template v-slot:prepend>
              <v-avatar color="primary" size="40">
                <v-icon color="white">mdi-clipboard-check</v-icon>
              </v-avatar>
            </template>
            
            <v-list-item-title>
              {{ checklist.name || 'Unnamed Checklist' }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ checklist.clientName || 'No client' }}
              <br>
              <v-icon size="12" class="mr-1">mdi-clock-outline</v-icon>
              {{ formatDate(checklist.createdAt) }}
            </v-list-item-subtitle>
            
            <template v-slot:append>
              <v-chip
                size="small"
                :color="getSyncColor(checklist.syncStatus)"
              >
                {{ checklist.syncStatus }}
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </v-container>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChecklistsStore } from '@/stores/checklists'
import MainLayout from '@/layouts/MainLayout.vue'

const router = useRouter()
const checklistsStore = useChecklistsStore()

const recentChecklists = ref([])
const totalChecklists = ref(0)
const weeklyChecklists = ref(0)

// Computed greeting based on time of day
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning! Ready to create today\'s checklists?'
  if (hour < 17) return 'Good afternoon! Keep up the great work!'
  return 'Good evening! Time to wrap up today\'s tasks?'
})

onMounted(async () => {
  await loadDashboardData()
})

async function loadDashboardData() {
  try {
    // Load all checklists
    await checklistsStore.loadChecklists()
    
    // Get recent checklists (last 5)
    const allChecklists = checklistsStore.checklistsList
    recentChecklists.value = allChecklists.slice(0, 5)
    totalChecklists.value = allChecklists.length
    
    // Calculate weekly checklists
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    weeklyChecklists.value = allChecklists.filter(c => 
      new Date(c.createdAt) > oneWeekAgo
    ).length
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
}

const navigateTo = (path) => {
  router.push(path)
}

const viewChecklist = (id) => {
  router.push(`/checklist/${id}`)
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

const getSyncColor = (status) => {
  const colors = {
    synced: 'success',
    pending: 'warning',
    error: 'error'
  }
  return colors[status] || 'grey'
}
</script>

<style scoped>
/* Custom styles if needed */
</style>
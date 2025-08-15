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
      
      <!-- Recent Checklists -->
      <div>
        <h2 class="mb-3">Recent Checklists</h2>
        
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
              {{ checklist.client?.name || 'Unnamed Client' }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ checklist.client?.address || 'No address' }}
              <br>
              {{ formatTime(checklist.totalTime) }}
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

// Computed greeting based on time of day
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning! Ready to create today\'s checklists?'
  if (hour < 17) return 'Good afternoon! Keep up the great work!'
  return 'Good evening! Time to wrap up today\'s tasks?'
})

onMounted(async () => {
  // Load recent checklists (placeholder for now)
  // In real app, this would load from the store
  recentChecklists.value = []
})

const navigateTo = (path) => {
  router.push(path)
}

const viewChecklist = (id) => {
  router.push(`/checklist/${id}`)
}

const formatTime = (time) => {
  if (!time) return ''
  return `${time.min}-${time.max} minutes`
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
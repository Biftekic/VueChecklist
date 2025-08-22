<template>
  <MainLayout 
    :title="pageTitle" 
    :show-back-button="true"
    @back="router.back()"
  >
    <v-container fluid class="pa-0">
      <!-- Loading State -->
      <v-progress-linear v-if="loading" indeterminate color="primary" />
      
      <!-- Error State -->
      <v-alert v-if="error" type="error" class="ma-4">
        {{ error }}
      </v-alert>
      
      <!-- Checklist Content -->
      <div v-if="checklist && !loading" class="checklist-detail">
        <!-- Header with Stats -->
        <ChecklistHeader 
          :checklist="checklist" 
          :stats="checklistStats"
        />
        
        <!-- Client Info -->
        <ClientInfoCard :client-info="checklist.clientInfo" />
        
        <!-- Search and Filter Bar -->
        <v-card flat class="mb-2">
          <v-card-text class="pb-2 pt-2">
            <v-row align="center">
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="searchQuery"
                  prepend-inner-icon="mdi-magnify"
                  label="Search tasks..."
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                />
              </v-col>
              <v-col cols="6" sm="3">
                <v-select
                  v-model="filterRoom"
                  :items="roomOptions"
                  label="Room"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                />
              </v-col>
              <v-col cols="6" sm="3">
                <v-select
                  v-model="filterStatus"
                  :items="statusOptions"
                  label="Status"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        
        <!-- Task List -->
        <v-card flat>
          <TaskList 
            :organized-tasks="filteredTasks"
            @toggle-task="toggleTask"
          />
          
          <!-- Empty State -->
          <v-card-text v-if="filteredTasks.length === 0" class="text-center py-8">
            <v-icon size="64" color="grey-lighten-1">mdi-clipboard-text-outline</v-icon>
            <p class="text-h6 mt-4">No tasks found</p>
            <p class="text-body-2 text-grey">
              {{ searchQuery || filterRoom || filterStatus ? 'Try adjusting your filters' : 'Add tasks to get started' }}
            </p>
          </v-card-text>
        </v-card>
      </div>
      
      <!-- Empty State (No Checklist) -->
      <v-card v-if="!checklist && !loading && !error" flat class="ma-4">
        <v-card-text class="text-center py-8">
          <v-icon size="64" color="grey-lighten-1">mdi-clipboard-text-off</v-icon>
          <p class="text-h6 mt-4">Checklist not found</p>
          <v-btn color="primary" variant="tonal" class="mt-4" to="/checklists">
            View All Checklists
          </v-btn>
        </v-card-text>
      </v-card>
    </v-container>
    
    <!-- Floating Action Menu -->
    <ChecklistActions
      @edit="editChecklist"
      @share="shareChecklist"
      @export="exportChecklist"
      @delete="deleteChecklist"
    />
    
    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title>Delete Checklist</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ checklist?.name }}"? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showDeleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChecklistStore } from '@/stores/checklistStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { useAsyncOperation } from '@/composables/useAsyncOperation'
import MainLayout from '@/layouts/MainLayout.vue'
import ChecklistHeader from '@/components/checklist/ChecklistHeader.vue'
import ClientInfoCard from '@/components/checklist/ClientInfoCard.vue'
import TaskList from '@/components/checklist/TaskList.vue'
import ChecklistActions from '@/components/checklist/ChecklistActions.vue'
import type { Checklist, Task } from '@/stores/checklistStore'

// Router & Store
const route = useRoute()
const router = useRouter()
const checklistStore = useChecklistStore()
const notificationStore = useNotificationStore()

// Data
const checklist = ref<Checklist | null>(null)
const searchQuery = ref('')
const filterRoom = ref('')
const filterStatus = ref('')
const showDeleteDialog = ref(false)

// Async Operation Handler
const { execute: loadChecklist, isLoading: loading, error } = useAsyncOperation<Checklist | undefined>()

// Computed Properties
const pageTitle = computed(() => checklist.value?.name || 'Checklist Details')

const checklistStats = computed(() => {
  if (!checklist.value) {
    return {
      completedTasks: 0,
      totalTasks: 0,
      completionPercentage: 0,
      formattedTotalTime: '0m',
      roomCount: 0
    }
  }
  
  const tasks = checklist.value.selectedTasks || []
  const completedTasks = tasks.filter(t => t.completed).length
  const totalTasks = tasks.length
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0
  
  const totalTime = tasks.reduce((sum, task) => 
    sum + (task.adjustedTime || task.estimatedTime || 0), 0
  )
  
  const hours = Math.floor(totalTime / 60)
  const mins = totalTime % 60
  const formattedTotalTime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  
  const rooms = [...new Set(tasks.map(t => t.roomId).filter(Boolean))]
  
  return {
    completedTasks,
    totalTasks,
    completionPercentage,
    formattedTotalTime,
    roomCount: rooms.length
  }
})

const roomOptions = computed(() => {
  if (!checklist.value) return []
  const rooms = [...new Set(
    checklist.value.selectedTasks
      ?.map(t => t.roomId)
      .filter(Boolean) || []
  )]
  return ['All Rooms', ...rooms]
})

const statusOptions = ['All', 'Pending', 'Completed']

interface OrganizedRoom {
  name: string
  tasks: Task[]
  totalTime: number
}

const filteredTasks = computed((): OrganizedRoom[] => {
  if (!checklist.value?.selectedTasks) return []
  
  let tasks = [...checklist.value.selectedTasks]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    tasks = tasks.filter(task => 
      task.name.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query) ||
      task.category?.toLowerCase().includes(query)
    )
  }
  
  // Apply room filter
  if (filterRoom.value && filterRoom.value !== 'All Rooms') {
    tasks = tasks.filter(task => task.roomId === filterRoom.value)
  }
  
  // Apply status filter
  if (filterStatus.value && filterStatus.value !== 'All') {
    const isCompleted = filterStatus.value === 'Completed'
    tasks = tasks.filter(task => task.completed === isCompleted)
  }
  
  // Organize by room
  const roomMap = new Map<string, Task[]>()
  
  tasks.forEach(task => {
    const roomName = task.roomId || 'General'
    if (!roomMap.has(roomName)) {
      roomMap.set(roomName, [])
    }
    roomMap.get(roomName)!.push(task)
  })
  
  // Convert to array and calculate totals
  return Array.from(roomMap.entries()).map(([name, roomTasks]) => ({
    name,
    tasks: roomTasks,
    totalTime: roomTasks.reduce((sum, task) => 
      sum + (task.adjustedTime || task.estimatedTime || 0), 0
    )
  }))
})

// Methods
async function fetchChecklist() {
  const checklistId = route.params.id as string
  if (!checklistId) {
    error.value = new Error('No checklist ID provided')
    return
  }
  
  const result = await loadChecklist(
    () => checklistStore.loadChecklist(checklistId),
    {
      context: 'Failed to load checklist',
      showErrorNotification: true
    }
  )
  
  if (result) {
    checklist.value = result
  } else {
    error.value = new Error('Checklist not found')
  }
}

async function toggleTask(task: Task) {
  if (!checklist.value) return
  
  const updatedTask = { ...task, completed: !task.completed }
  const taskIndex = checklist.value.selectedTasks.findIndex(t => t.id === task.id)
  
  if (taskIndex !== -1) {
    checklist.value.selectedTasks[taskIndex] = updatedTask
    
    try {
      await checklistStore.updateTaskStatus(
        checklist.value.id,
        task.id,
        updatedTask.completed
      )
      
      const action = updatedTask.completed ? 'completed' : 'marked as pending'
      notificationStore.showSuccess(`Task ${action}`)
    } catch (err) {
      console.error('Failed to update task:', err)
      notificationStore.showError('Failed to update task status')
      // Revert on error
      checklist.value.selectedTasks[taskIndex] = task
    }
  }
}

function editChecklist() {
  if (!checklist.value) return
  router.push(`/checklist/edit/${checklist.value.id}`)
}

async function shareChecklist() {
  if (!checklist.value) return
  
  try {
    const shareData = {
      title: checklist.value.name || 'Cleaning Checklist',
      text: `Check out this cleaning checklist: ${checklist.value.name || 'Checklist'}`,
      url: window.location.href
    }
    
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href)
      notificationStore.showSuccess('Link copied to clipboard')
    }
  } catch (err) {
    console.error('Error sharing:', err)
    notificationStore.showError('Failed to share checklist')
  }
}

async function exportChecklist() {
  if (!checklist.value) return
  
  try {
    const data = JSON.stringify(checklist.value, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `checklist-${checklist.value.id}.json`
    a.click()
    URL.revokeObjectURL(url)
    notificationStore.showSuccess('Checklist exported')
  } catch (err) {
    console.error('Error exporting:', err)
    notificationStore.showError('Failed to export checklist')
  }
}

function deleteChecklist() {
  showDeleteDialog.value = true
}

async function confirmDelete() {
  if (!checklist.value) return
  
  try {
    await checklistStore.deleteChecklist(checklist.value.id)
    notificationStore.showSuccess('Checklist deleted')
    router.push('/checklists')
  } catch (err) {
    console.error('Error deleting:', err)
    notificationStore.showError('Failed to delete checklist')
  } finally {
    showDeleteDialog.value = false
  }
}

// Lifecycle
onMounted(() => {
  fetchChecklist()
})

// Watch for route changes
watch(() => route.params.id, () => {
  if (route.params.id) {
    fetchChecklist()
  }
})
</script>

<style scoped>
.checklist-detail {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
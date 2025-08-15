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
        <!-- Header Card -->
        <v-card flat class="mb-2">
          <v-card-text class="pb-2">
            <div class="d-flex justify-space-between align-center mb-2">
              <div>
                <h2 class="text-h5 font-weight-bold">{{ checklist.name || 'Untitled Checklist' }}</h2>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Created {{ formatDate(checklist.createdAt) }}
                </p>
              </div>
              <v-chip :color="getStatusColor(checklist.status)" variant="tonal">
                {{ checklist.status || 'Pending' }}
              </v-chip>
            </div>
            
            <!-- Quick Stats -->
            <v-row class="mt-3">
              <v-col cols="3" class="text-center">
                <div class="text-h6 font-weight-bold">{{ completedTasks }}/{{ totalTasks }}</div>
                <div class="text-caption">Tasks</div>
              </v-col>
              <v-col cols="3" class="text-center">
                <div class="text-h6 font-weight-bold">{{ completionPercentage }}%</div>
                <div class="text-caption">Complete</div>
              </v-col>
              <v-col cols="3" class="text-center">
                <div class="text-h6 font-weight-bold">{{ formattedTotalTime }}</div>
                <div class="text-caption">Est. Time</div>
              </v-col>
              <v-col cols="3" class="text-center">
                <div class="text-h6 font-weight-bold">{{ roomCount }}</div>
                <div class="text-caption">Rooms</div>
              </v-col>
            </v-row>
            
            <!-- Progress Bar -->
            <v-progress-linear
              :model-value="completionPercentage"
              height="8"
              rounded
              color="success"
              class="mt-3"
            />
          </v-card-text>
        </v-card>
        
        <!-- Action Buttons -->
        <v-card flat class="mb-2">
          <v-card-text class="py-2">
            <v-row no-gutters>
              <v-col cols="6" class="pr-1">
                <v-btn
                  block
                  color="primary"
                  variant="tonal"
                  prepend-icon="mdi-file-pdf-box"
                  @click="exportPDF"
                >
                  Export PDF
                </v-btn>
              </v-col>
              <v-col cols="6" class="pl-1">
                <v-btn
                  block
                  color="primary"
                  variant="tonal"
                  prepend-icon="mdi-share-variant"
                  @click="shareChecklist"
                >
                  Share
                </v-btn>
              </v-col>
            </v-row>
            <v-row no-gutters class="mt-2">
              <v-col cols="6" class="pr-1">
                <v-btn
                  block
                  variant="outlined"
                  prepend-icon="mdi-pencil"
                  @click="editChecklist"
                >
                  Edit
                </v-btn>
              </v-col>
              <v-col cols="6" class="pl-1">
                <v-btn
                  block
                  variant="outlined"
                  color="error"
                  prepend-icon="mdi-delete"
                  @click="deleteDialog = true"
                >
                  Delete
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        
        <!-- Client Information -->
        <v-card flat class="mb-2" v-if="checklist.clientInfo">
          <v-card-title class="text-subtitle-1 font-weight-bold pb-1">
            <v-icon size="small" class="mr-2">mdi-account</v-icon>
            Client Information
          </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item v-if="checklist.clientInfo.name">
                <template v-slot:prepend>
                  <v-icon size="small">mdi-account</v-icon>
                </template>
                <v-list-item-title>{{ checklist.clientInfo.name }}</v-list-item-title>
              </v-list-item>
              <v-list-item v-if="checklist.clientInfo.address">
                <template v-slot:prepend>
                  <v-icon size="small">mdi-map-marker</v-icon>
                </template>
                <v-list-item-title>{{ checklist.clientInfo.address }}</v-list-item-title>
              </v-list-item>
              <v-list-item v-if="checklist.clientInfo.phone">
                <template v-slot:prepend>
                  <v-icon size="small">mdi-phone</v-icon>
                </template>
                <v-list-item-title>
                  <a :href="`tel:${checklist.clientInfo.phone}`">{{ checklist.clientInfo.phone }}</a>
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-if="checklist.clientInfo.email">
                <template v-slot:prepend>
                  <v-icon size="small">mdi-email</v-icon>
                </template>
                <v-list-item-title>
                  <a :href="`mailto:${checklist.clientInfo.email}`">{{ checklist.clientInfo.email }}</a>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
        
        <!-- Property Details -->
        <v-card flat class="mb-2">
          <v-card-title class="text-subtitle-1 font-weight-bold pb-1">
            <v-icon size="small" class="mr-2">mdi-home</v-icon>
            Property Details
          </v-card-title>
          <v-card-text>
            <v-chip-group>
              <v-chip size="small" variant="outlined">
                <v-icon start size="small">mdi-domain</v-icon>
                {{ checklist.industry }}
              </v-chip>
              <v-chip size="small" variant="outlined" v-if="checklist.propertySize">
                <v-icon start size="small">mdi-move-resize</v-icon>
                {{ checklist.propertySize }} m²
              </v-chip>
              <v-chip size="small" variant="outlined" v-if="checklist.numberOfFloors">
                <v-icon start size="small">mdi-stairs</v-icon>
                {{ checklist.numberOfFloors }} floors
              </v-chip>
              <v-chip size="small" variant="outlined" v-if="checklist.clientInfo?.frequency">
                <v-icon start size="small">mdi-calendar-repeat</v-icon>
                {{ checklist.clientInfo.frequency }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </v-card>
        
        <!-- Tasks by Room -->
        <v-card flat>
          <v-card-title class="text-subtitle-1 font-weight-bold pb-1">
            <v-icon size="small" class="mr-2">mdi-format-list-checks</v-icon>
            Tasks by Room
          </v-card-title>
          <v-card-text class="pa-0">
            <v-expansion-panels v-model="expandedRooms" multiple>
              <v-expansion-panel
                v-for="room in tasksByRoom"
                :key="room.name"
                :value="room.name"
              >
                <v-expansion-panel-title>
                  <div class="d-flex align-center justify-space-between flex-grow-1 mr-2">
                    <div class="d-flex align-center">
                      <v-icon size="small" class="mr-2">{{ getRoomIcon(room.name) }}</v-icon>
                      <span class="font-weight-medium">{{ room.name }}</span>
                    </div>
                    <div class="d-flex align-center gap-2">
                      <v-chip size="x-small" variant="tonal">
                        {{ room.completedCount }}/{{ room.tasks.length }}
                      </v-chip>
                      <v-chip size="x-small" variant="text">
                        {{ formatTime(room.totalTime) }}
                      </v-chip>
                    </div>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-list density="compact">
                    <v-list-item
                      v-for="(task, index) in room.tasks"
                      :key="index"
                      @click="toggleTask(task)"
                      class="task-item"
                    >
                      <template v-slot:prepend>
                        <v-checkbox
                          :model-value="task.completed"
                          density="compact"
                          hide-details
                          @click.stop="toggleTask(task)"
                        />
                      </template>
                      <v-list-item-title :class="{ 'text-decoration-line-through': task.completed }">
                        {{ task.name }}
                      </v-list-item-title>
                      <template v-slot:append>
                        <span class="text-caption text-medium-emphasis">
                          {{ formatTime(task.adjustedTime || task.estimatedTime) }}
                        </span>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </div>
      
      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="deleteDialog" max-width="400">
        <v-card>
          <v-card-title>Delete Checklist?</v-card-title>
          <v-card-text>
            Are you sure you want to delete this checklist? This action cannot be undone.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
            <v-btn color="error" variant="flat" @click="confirmDelete">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
      <!-- Floating Action Button for marking complete -->
      <v-btn
        v-if="checklist && completionPercentage === 100"
        color="success"
        icon="mdi-check-all"
        size="large"
        position="fixed"
        location="bottom end"
        class="mb-16 mr-4"
        @click="markComplete"
      />
    </v-container>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChecklistsStore } from '@/stores/checklists'
import { useAppStore } from '@/stores/app'
import MainLayout from '@/layouts/MainLayout.vue'
import pdfService from '@/services/pdfService'

const route = useRoute()
const router = useRouter()
const checklistsStore = useChecklistsStore()
const appStore = useAppStore()

// State
const loading = ref(true)
const error = ref(null)
const checklist = ref(null)
const deleteDialog = ref(false)
const expandedRooms = ref([])

// Computed
const pageTitle = computed(() => {
  return checklist.value?.name || 'Checklist Details'
})

const totalTasks = computed(() => {
  return checklist.value?.selectedTasks?.length || 0
})

const completedTasks = computed(() => {
  return checklist.value?.selectedTasks?.filter(t => t.completed).length || 0
})

const completionPercentage = computed(() => {
  if (totalTasks.value === 0) return 0
  return Math.round((completedTasks.value / totalTasks.value) * 100)
})

const formattedTotalTime = computed(() => {
  const totalMinutes = checklist.value?.selectedTasks?.reduce((sum, task) => {
    return sum + (task.adjustedTime || task.estimatedTime || 0)
  }, 0) || 0
  return formatTime(totalMinutes)
})

const roomCount = computed(() => {
  const rooms = new Set()
  checklist.value?.selectedTasks?.forEach(task => {
    if (task.room) rooms.add(task.room)
  })
  return rooms.size
})

const tasksByRoom = computed(() => {
  const rooms = {}
  
  checklist.value?.selectedTasks?.forEach(task => {
    const roomName = task.room || 'General'
    if (!rooms[roomName]) {
      rooms[roomName] = {
        name: roomName,
        tasks: [],
        totalTime: 0,
        completedCount: 0
      }
    }
    rooms[roomName].tasks.push(task)
    rooms[roomName].totalTime += task.adjustedTime || task.estimatedTime || 0
    if (task.completed) rooms[roomName].completedCount++
  })
  
  // Sort rooms alphabetically
  return Object.values(rooms).sort((a, b) => a.name.localeCompare(b.name))
})

// Methods
const loadChecklist = async () => {
  loading.value = true
  error.value = null
  
  try {
    const id = route.params.id
    checklist.value = await checklistsStore.getChecklistById(id)
    
    if (!checklist.value) {
      error.value = 'Checklist not found'
    } else {
      // Expand first room by default
      if (tasksByRoom.value.length > 0) {
        expandedRooms.value = [tasksByRoom.value[0].name]
      }
    }
  } catch (err) {
    console.error('Error loading checklist:', err)
    error.value = 'Failed to load checklist'
  } finally {
    loading.value = false
  }
}

const toggleTask = async (task) => {
  task.completed = !task.completed
  // Save the updated checklist
  await checklistsStore.updateChecklist(checklist.value.id, checklist.value)
}

const exportPDF = () => {
  try {
    const pdf = pdfService.generateChecklistPDF(checklist.value)
    const filename = `${checklist.value.name || 'checklist'}_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(filename)
    appStore.showSnackbar('PDF exported successfully', 'success')
  } catch (error) {
    console.error('Error generating PDF:', error)
    appStore.showSnackbar('Failed to generate PDF', 'error')
  }
}

const shareChecklist = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: checklist.value.name,
        text: `Checklist: ${checklist.value.name}`,
        url: window.location.href
      })
    } catch (err) {
      console.log('Share cancelled or failed:', err)
    }
  } else {
    // Fallback: copy link to clipboard
    await navigator.clipboard.writeText(window.location.href)
    appStore.showSnackbar('Link copied to clipboard', 'success')
  }
}

const editChecklist = () => {
  router.push(`/checklist/${checklist.value.id}/edit`)
}

const confirmDelete = async () => {
  try {
    await checklistsStore.deleteChecklist(checklist.value.id)
    appStore.showSnackbar('Checklist deleted successfully', 'success')
    router.push('/checklists')
  } catch (error) {
    console.error('Error deleting checklist:', error)
    appStore.showSnackbar('Failed to delete checklist', 'error')
  }
  deleteDialog.value = false
}

const markComplete = async () => {
  checklist.value.status = 'completed'
  checklist.value.completedAt = new Date().toISOString()
  await checklistsStore.updateChecklist(checklist.value.id, checklist.value)
  appStore.showSnackbar('Checklist marked as complete!', 'success')
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown'
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  
  return date.toLocaleDateString()
}

const formatTime = (minutes) => {
  if (!minutes) return '0 min'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins} min`
}

const getStatusColor = (status) => {
  const colors = {
    'pending': 'warning',
    'in-progress': 'info',
    'completed': 'success',
    'cancelled': 'error'
  }
  return colors[status] || 'grey'
}

const getRoomIcon = (roomName) => {
  const icons = {
    'Lobby': 'mdi-door-open',
    'Office': 'mdi-desk',
    'Restroom': 'mdi-toilet',
    'Kitchen': 'mdi-silverware-fork-knife',
    'Conference Room': 'mdi-presentation',
    'Bedroom': 'mdi-bed',
    'Living Room': 'mdi-sofa',
    'Bathroom': 'mdi-shower',
    'Dining Room': 'mdi-table-chair',
    'General': 'mdi-home'
  }
  return icons[roomName] || 'mdi-door'
}

// Lifecycle
onMounted(() => {
  loadChecklist()
})
</script>

<style scoped>
.checklist-detail {
  padding-bottom: 80px; /* Space for FAB */
}

.task-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.task-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.v-expansion-panel {
  margin-bottom: 2px !important;
}

.v-expansion-panel-text {
  padding: 0 !important;
}
</style>
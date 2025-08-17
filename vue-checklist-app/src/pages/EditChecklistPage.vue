<template>
  <MainLayout 
    :title="'Edit Checklist'" 
    :show-back-button="true"
    @back="handleBack"
  >
    <v-container fluid class="pa-0">
      <!-- Loading State -->
      <v-progress-linear v-if="loading" indeterminate color="primary" />
      
      <!-- Error State -->
      <v-alert v-if="error" type="error" class="ma-4">
        {{ error }}
      </v-alert>
      
      <!-- Edit Form -->
      <div v-if="checklist && !loading" class="edit-checklist">
        <!-- Basic Information -->
        <v-card flat class="mb-2">
          <v-card-title class="text-h6">
            <v-icon class="mr-2">mdi-information</v-icon>
            Basic Information
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="checklist.name"
              label="Checklist Name"
              variant="outlined"
              density="compact"
              :rules="[v => !!v || 'Name is required']"
              class="mb-3"
            />
            
            <v-textarea
              v-model="checklist.description"
              label="Description (Optional)"
              variant="outlined"
              density="compact"
              rows="2"
            />
          </v-card-text>
        </v-card>

        <!-- Property Details -->
        <v-card flat class="mb-2">
          <v-card-title class="text-h6">
            <v-icon class="mr-2">mdi-home</v-icon>
            Property Details
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="checklist.propertyType"
                  :items="propertyTypes"
                  label="Property Type"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="checklist.propertySize"
                  :items="propertySizes"
                  label="Property Size"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="checklist.cleaningType"
                  :items="cleaningTypes"
                  label="Cleaning Type"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="checklist.frequency"
                  :items="frequencies"
                  label="Frequency"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Client Information -->
        <v-card flat class="mb-2">
          <v-card-title class="text-h6">
            <v-icon class="mr-2">mdi-account</v-icon>
            Client Information
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="checklist.clientName"
                  label="Client Name"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="checklist.clientPhone"
                  label="Phone Number"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
            </v-row>
            
            <v-text-field
              v-model="checklist.clientEmail"
              label="Email Address"
              variant="outlined"
              density="compact"
              type="email"
            />
            
            <v-text-field
              v-model="checklist.clientAddress"
              label="Service Address"
              variant="outlined"
              density="compact"
            />
          </v-card-text>
        </v-card>

        <!-- Room & Task Management -->
        <v-card flat class="mb-2">
          <v-card-title class="text-h6">
            <v-icon class="mr-2">mdi-format-list-checks</v-icon>
            Rooms & Tasks
            <v-spacer />
            <v-btn
              color="primary"
              size="small"
              variant="tonal"
              @click="openTaskManager"
            >
              <v-icon start>mdi-pencil</v-icon>
              Manage Tasks
            </v-btn>
          </v-card-title>
          <v-card-text>
            <!-- Room Summary -->
            <v-chip-group>
              <v-chip
                v-for="room in getRoomSummary"
                :key="room.name"
                variant="outlined"
                size="small"
              >
                <v-icon start size="small">mdi-door</v-icon>
                {{ room.name }} ({{ room.taskCount }} tasks)
              </v-chip>
            </v-chip-group>
            
            <!-- Task Summary -->
            <v-alert
              type="info"
              variant="tonal"
              density="compact"
              class="mt-3"
            >
              <div class="d-flex justify-space-between">
                <span>Total Tasks: <strong>{{ totalTasks }}</strong></span>
                <span>Estimated Time: <strong>{{ formattedTotalTime }}</strong></span>
              </div>
            </v-alert>
          </v-card-text>
        </v-card>

        <!-- Time Adjustments -->
        <v-card flat class="mb-2">
          <v-card-title class="text-h6">
            <v-icon class="mr-2">mdi-clock-outline</v-icon>
            Time Adjustments
            <v-spacer />
            <v-btn
              color="primary"
              size="small"
              variant="tonal"
              @click="timeAdjustmentDialog = true"
            >
              <v-icon start>mdi-tune</v-icon>
              Adjust Time
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-alert
              type="info"
              variant="tonal"
              density="compact"
            >
              <div class="d-flex justify-space-between">
                <span>Base Time: <strong>{{ formattedTotalTime }}</strong></span>
                <span>Adjusted Time: <strong>{{ formattedAdjustedTime }}</strong></span>
              </div>
              <v-divider class="my-2" v-if="timeAdjustmentPercent !== 0" />
              <div v-if="timeAdjustmentPercent !== 0" class="text-center">
                Adjustment: 
                <strong :class="timeAdjustmentPercent > 0 ? 'text-error' : 'text-success'">
                  {{ timeAdjustmentPercent > 0 ? '+' : '' }}{{ timeAdjustmentPercent }}%
                </strong>
              </div>
            </v-alert>
          </v-card-text>
        </v-card>

        <!-- Action Buttons -->
        <v-card flat>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-btn
                  block
                  variant="outlined"
                  size="large"
                  @click="handleCancel"
                >
                  Cancel
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  block
                  color="primary"
                  size="large"
                  @click="saveChanges"
                  :loading="saving"
                >
                  Save Changes
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </div>
    </v-container>

    <!-- Task Manager Dialog -->
    <TaskManagerDialog
      v-model="taskManagerDialog"
      :tasks="checklist.tasks"
      @update:tasks="updateTasks"
    />
    
    <!-- Time Adjustment Modal -->
    <TimeAdjustmentModal
      v-model="timeAdjustmentDialog"
      :base-time="baseTotalTime"
      :adjustments="timeAdjustments"
      @apply="applyTimeAdjustments"
    />

    <!-- Unsaved Changes Dialog -->
    <v-dialog v-model="unsavedDialog" max-width="400">
      <v-card>
        <v-card-title>Unsaved Changes</v-card-title>
        <v-card-text>
          You have unsaved changes. Are you sure you want to leave?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="unsavedDialog = false">
            Stay
          </v-btn>
          <v-btn 
            color="primary" 
            variant="text" 
            @click="confirmLeave"
          >
            Leave
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChecklistsStore } from '@/stores/checklistStore'
import { useAppStore } from '@/stores/app'
import MainLayout from '@/layouts/MainLayout.vue'
import TaskManagerDialog from '@/components/checklist/TaskManagerDialog.vue'
import TimeAdjustmentModal from '@/components/checklist/TimeAdjustmentModal.vue'

const route = useRoute()
const router = useRouter()
const checklistsStore = useChecklistsStore()
const appStore = useAppStore()

// State
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const checklist = ref(null)
const originalChecklist = ref(null)
const taskManagerDialog = ref(false)
const unsavedDialog = ref(false)
const hasChanges = ref(false)
const timeAdjustmentDialog = ref(false)
const timeAdjustments = ref({
  condition: 1.0,
  teamSize: 1.0,
  equipment: 1.0,
  experience: 1.0,
  customMultiplier: 1.0
})

// Options
const propertyTypes = [
  'Residential House',
  'Apartment',
  'Condo',
  'Office',
  'Retail Store',
  'Restaurant',
  'Medical Facility',
  'School',
  'Warehouse',
  'Other'
]

const propertySizes = [
  'Small (< 1000 sq ft)',
  'Medium (1000-2500 sq ft)',
  'Large (2500-5000 sq ft)',
  'Extra Large (> 5000 sq ft)'
]

const cleaningTypes = [
  'Regular Cleaning',
  'Deep Cleaning',
  'Move-in/Move-out',
  'Post-Construction',
  'Spring Cleaning'
]

const frequencies = [
  'One-time',
  'Daily',
  'Weekly',
  'Bi-weekly',
  'Monthly',
  'Quarterly'
]

// Computed
const getRoomSummary = computed(() => {
  if (!checklist.value?.tasks) return []
  
  const roomMap = {}
  checklist.value.tasks.forEach(task => {
    const room = task.room || 'Unknown'
    if (!roomMap[room]) {
      roomMap[room] = { name: room, taskCount: 0 }
    }
    roomMap[room].taskCount++
  })
  
  return Object.values(roomMap)
})

const totalTasks = computed(() => {
  return checklist.value?.tasks?.length || 0
})

const baseTotalTime = computed(() => {
  if (!checklist.value?.tasks) return 0
  return checklist.value.tasks.reduce((total, task) => {
    return total + (task.estimatedTime || 0)
  }, 0)
})

const adjustedTotalTime = computed(() => {
  const multiplier = 
    timeAdjustments.value.condition *
    timeAdjustments.value.teamSize *
    timeAdjustments.value.equipment *
    timeAdjustments.value.experience *
    timeAdjustments.value.customMultiplier
  return Math.round(baseTotalTime.value * multiplier)
})

const timeAdjustmentPercent = computed(() => {
  if (baseTotalTime.value === 0) return 0
  return Math.round(((adjustedTotalTime.value - baseTotalTime.value) / baseTotalTime.value) * 100)
})

const formattedTotalTime = computed(() => {
  const minutes = baseTotalTime.value
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}min`
})

const formattedAdjustedTime = computed(() => {
  const minutes = adjustedTotalTime.value
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}min`
})

// Methods
const loadChecklist = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const id = route.params.id
    const data = await checklistsStore.getChecklist(id)
    
    if (!data) {
      error.value = 'Checklist not found'
      return
    }
    
    checklist.value = { ...data }
    originalChecklist.value = JSON.parse(JSON.stringify(data))
    
    // Load time adjustments if present
    if (checklist.value.timeAdjustments) {
      timeAdjustments.value = { ...checklist.value.timeAdjustments }
    }
    
  } catch (err) {
    console.error('Error loading checklist:', err)
    error.value = 'Failed to load checklist'
  } finally {
    loading.value = false
  }
}

const openTaskManager = () => {
  taskManagerDialog.value = true
}

const updateTasks = (tasks) => {
  checklist.value.tasks = tasks
  hasChanges.value = true
}

const applyTimeAdjustments = (adjustments) => {
  timeAdjustments.value = { ...adjustments }
  checklist.value.timeAdjustments = { ...adjustments }
  hasChanges.value = true
}


const saveChanges = async () => {
  try {
    saving.value = true
    
    // Validate required fields
    if (!checklist.value.name) {
      appStore.showSnackbar('Checklist name is required', 'error')
      return
    }
    
    // Update the checklist
    await checklistsStore.updateChecklist(checklist.value.id, checklist.value)
    
    appStore.showSnackbar('Checklist updated successfully', 'success')
    hasChanges.value = false
    originalChecklist.value = JSON.parse(JSON.stringify(checklist.value))
    
    // Navigate back to detail page
    router.push(`/checklist/${checklist.value.id}`)
    
  } catch (err) {
    console.error('Error saving checklist:', err)
    appStore.showSnackbar('Failed to save changes', 'error')
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  if (hasChanges.value) {
    unsavedDialog.value = true
  } else {
    router.back()
  }
}

const handleBack = () => {
  if (hasChanges.value) {
    unsavedDialog.value = true
  } else {
    router.back()
  }
}

const confirmLeave = () => {
  unsavedDialog.value = false
  hasChanges.value = false
  router.back()
}

// Watch for changes
watch(checklist, (newVal) => {
  if (originalChecklist.value && newVal) {
    hasChanges.value = JSON.stringify(newVal) !== JSON.stringify(originalChecklist.value)
  }
}, { deep: true })

// Lifecycle
onMounted(() => {
  loadChecklist()
})
</script>

<style scoped>
.edit-checklist {
  padding-bottom: 80px; /* Space for bottom navigation */
}
</style>
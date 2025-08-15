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
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="checklist.conditionModifier"
                  :items="conditionModifiers"
                  label="Property Condition"
                  variant="outlined"
                  density="compact"
                  item-title="label"
                  item-value="value"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="checklist.teamSize"
                  :items="teamSizes"
                  label="Team Size"
                  variant="outlined"
                  density="compact"
                  item-title="label"
                  item-value="value"
                />
              </v-col>
            </v-row>
            
            <v-alert
              type="info"
              variant="tonal"
              density="compact"
            >
              Adjusted Time: <strong>{{ adjustedTotalTime }}</strong>
              <span v-if="timeAdjustmentPercent !== 0" class="ml-2">
                ({{ timeAdjustmentPercent > 0 ? '+' : '' }}{{ timeAdjustmentPercent }}%)
              </span>
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
    <v-dialog
      v-model="taskManagerDialog"
      fullscreen
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar color="primary" dark>
          <v-btn icon @click="taskManagerDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Manage Tasks</v-toolbar-title>
          <v-spacer />
          <v-btn variant="text" @click="saveTaskChanges">
            Save
          </v-btn>
        </v-toolbar>
        
        <v-container>
          <!-- Enhanced Task Selection Component can be embedded here -->
          <EnhancedTaskSelectionStep 
            v-if="taskManagerDialog"
            :edit-mode="true"
            :existing-tasks="checklist.tasks"
            @update="updateTasks"
          />
        </v-container>
      </v-card>
    </v-dialog>

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
import { useChecklistsStore } from '@/stores/checklists'
import { useAppStore } from '@/stores/app'
import MainLayout from '@/layouts/MainLayout.vue'
import EnhancedTaskSelectionStep from '@/components/checklist/EnhancedTaskSelectionStep.vue'

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

const conditionModifiers = [
  { label: 'Light Cleaning', value: 0.7 },
  { label: 'Standard', value: 1.0 },
  { label: 'Deep Cleaning', value: 1.5 },
  { label: 'First-time/Heavy', value: 2.0 }
]

const teamSizes = [
  { label: 'Solo Cleaner', value: 1.0 },
  { label: '2-Person Team', value: 0.75 },
  { label: '3+ Person Team', value: 0.6 }
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
  const condition = checklist.value?.conditionModifier || 1.0
  const team = checklist.value?.teamSize || 1.0
  return Math.round(baseTotalTime.value * condition * team)
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
    
    // Set defaults if not present
    checklist.value.conditionModifier = checklist.value.conditionModifier || 1.0
    checklist.value.teamSize = checklist.value.teamSize || 1.0
    
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

const saveTaskChanges = () => {
  taskManagerDialog.value = false
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
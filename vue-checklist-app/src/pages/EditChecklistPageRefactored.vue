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
        <BasicInfoForm
          :name="checklist.name || ''"
          :description="''"
          @update:name="checklist.name = $event"
          @update:description="() => {}"
        />
        
        <!-- Property Details -->
        <PropertyDetailsForm
          :property-type="''"
          :property-size="String(checklist.propertySize || '')"
          :cleaning-type="''"
          :frequency="checklist.frequency || ''"
          :difficulty="checklist.difficulty"
          :number-of-floors="checklist.numberOfFloors || 1"
          @update:property-type="() => {}"
          @update:property-size="checklist.propertySize = Number($event)"
          @update:cleaning-type="() => {}"
          @update:frequency="checklist.frequency = $event"
          @update:difficulty="checklist.difficulty = $event as 'Light' | 'Average' | 'Heavy'"
          @update:number-of-floors="checklist.numberOfFloors = $event"
        />
        
        <!-- Client Information -->
        <ClientInfoForm
          :client-info="checklist.clientInfo || defaultClientInfo"
          @update:client-info="checklist.clientInfo = $event"
        />
        
        <!-- Tasks -->
        <TaskEditor
          :tasks="checklist.selectedTasks || []"
          :rooms="availableRooms as string[]"
          @update:tasks="checklist.selectedTasks = $event"
        />
        
        <!-- Action Buttons -->
        <v-card flat>
          <v-card-actions>
            <v-btn
              variant="text"
              @click="handleBack"
            >
              Cancel
            </v-btn>
            <v-spacer />
            <v-btn
              color="primary"
              variant="flat"
              :loading="saving"
              @click="saveChecklist"
            >
              Save Changes
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
      
      <!-- Empty State -->
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
    
    <!-- Unsaved Changes Dialog -->
    <v-dialog v-model="showUnsavedDialog" max-width="400">
      <v-card>
        <v-card-title>Unsaved Changes</v-card-title>
        <v-card-text>
          You have unsaved changes. Are you sure you want to leave?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showUnsavedDialog = false">
            Stay
          </v-btn>
          <v-btn color="error" variant="flat" @click="confirmLeave">
            Leave
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { useChecklistStore } from '@/stores/checklistStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { useAsyncOperation } from '@/composables/useAsyncOperation'
import MainLayout from '@/layouts/MainLayout.vue'
import BasicInfoForm from '@/components/checklist/edit/BasicInfoForm.vue'
import PropertyDetailsForm from '@/components/checklist/edit/PropertyDetailsForm.vue'
import ClientInfoForm from '@/components/checklist/edit/ClientInfoForm.vue'
import TaskEditor from '@/components/checklist/edit/TaskEditor.vue'
import type { Checklist, ClientInfo } from '@/stores/checklistStore'

// Router & Store
const route = useRoute()
const router = useRouter()
const checklistStore = useChecklistStore()
const notificationStore = useNotificationStore()

// Data
const checklist = ref<Checklist | null>(null)
const originalChecklist = ref<string>('')
const showUnsavedDialog = ref(false)
const pendingNavigation = ref<(() => void) | null>(null)

// Async Operations
const { execute: loadChecklist, isLoading: loading, error } = useAsyncOperation<Checklist | undefined>()
const { execute: save, isLoading: saving } = useAsyncOperation()

// Default client info structure
const defaultClientInfo: ClientInfo = {
  name: '',
  email: '',
  phone: '',
  address: '',
  notes: ''
}

// Computed
const availableRooms = computed(() => {
  const defaultRooms = [
    'General',
    'Kitchen',
    'Living Room',
    'Bedroom',
    'Bathroom',
    'Office',
    'Hallway',
    'Garage'
  ]
  
  if (!checklist.value?.selectedTasks) return defaultRooms
  
  const taskRooms = [...new Set(
    checklist.value.selectedTasks
      .map(t => t.roomId)
      .filter(Boolean)
  )]
  
  return [...new Set([...defaultRooms, ...taskRooms])]
})

const hasUnsavedChanges = computed(() => {
  if (!checklist.value || !originalChecklist.value) return false
  return JSON.stringify(checklist.value) !== originalChecklist.value
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
    checklist.value = { ...result }
    originalChecklist.value = JSON.stringify(result)
  }
}

async function saveChecklist() {
  if (!checklist.value) return
  
  const result = await save(
    async () => {
      // Update the checklist in the store
      await checklistStore.updateChecklist(checklist.value!.id, checklist.value!)
      return true
    },
    {
      context: 'Failed to save checklist',
      showErrorNotification: true
    }
  )
  
  if (result) {
    originalChecklist.value = JSON.stringify(checklist.value)
    notificationStore.showSuccess('Checklist saved successfully')
    router.push(`/checklist/${checklist.value.id}`)
  }
}

function handleBack() {
  if (hasUnsavedChanges.value) {
    showUnsavedDialog.value = true
    pendingNavigation.value = () => router.back()
  } else {
    router.back()
  }
}

function confirmLeave() {
  showUnsavedDialog.value = false
  if (pendingNavigation.value) {
    pendingNavigation.value()
    pendingNavigation.value = null
  }
}

// Lifecycle
onMounted(() => {
  fetchChecklist()
})

// Navigation guard
onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    showUnsavedDialog.value = true
    pendingNavigation.value = () => next()
  } else {
    next()
  }
})

// Prevent accidental navigation
onBeforeUnmount(() => {
  if (hasUnsavedChanges.value) {
    const confirmMsg = 'You have unsaved changes. Are you sure you want to leave?'
    if (!window.confirm(confirmMsg)) {
      return false
    }
  }
})
</script>

<style scoped>
.edit-checklist {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
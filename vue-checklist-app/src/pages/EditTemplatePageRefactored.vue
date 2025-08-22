<template>
  <MainLayout :title="`Edit Template: ${template?.name || 'Loading...'}`">
    <v-container class="pa-4">
      <v-card v-if="template" elevation="2">
        <v-card-title>
          <v-icon left class="mr-2">mdi-pencil</v-icon>
          Edit Template
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid">
            <!-- Basic Information -->
            <TemplateBasicInfoForm
              v-model:name="template.name"
              v-model:category="template.category"
              v-model:description="template.description"
            />

            <!-- Style Settings -->
            <TemplateStyleForm
              v-model:icon="template.icon"
              v-model:color="template.color"
            />

            <!-- Metrics -->
            <TemplateMetricsForm
              v-model:rooms="template.rooms"
              v-model:estimated-time="template.estimatedTime"
            />

            <!-- Task Management -->
            <TemplateTaskManager
              v-model:tasks-by-room="template.tasksByRoom"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="cancel"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            @click="saveTemplate"
            :disabled="!valid || saving"
          >
            <template v-if="saving">
              <v-progress-circular
                size="20"
                indeterminate
                class="mr-2"
              />
              Saving...
            </template>
            <template v-else>
              Save Template
            </template>
          </v-btn>
        </v-card-actions>
      </v-card>

      <!-- Loading State -->
      <v-card v-else elevation="2" class="pa-8 text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        />
        <v-card-title class="mt-4">
          Loading template...
        </v-card-title>
      </v-card>
    </v-container>

    <!-- Unsaved Changes Dialog -->
    <v-dialog v-model="showUnsavedDialog" max-width="500">
      <v-card>
        <v-card-title>Unsaved Changes</v-card-title>
        <v-card-text>
          You have unsaved changes. Are you sure you want to leave?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showUnsavedDialog = false">
            Cancel
          </v-btn>
          <v-btn color="error" variant="elevated" @click="confirmLeave">
            Leave Without Saving
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccess"
      color="success"
      timeout="3000"
    >
      Template saved successfully!
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="showSuccess = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { useChecklistStore } from '@/stores/checklistStore'
import { useNotificationStore } from '@/stores/notificationStore'
import MainLayout from '@/layouts/MainLayout.vue'
import TemplateBasicInfoForm from '@/components/template/edit/TemplateBasicInfoForm.vue'
import TemplateStyleForm from '@/components/template/edit/TemplateStyleForm.vue'
import TemplateMetricsForm from '@/components/template/edit/TemplateMetricsForm.vue'
import TemplateTaskManager from '@/components/template/edit/TemplateTaskManager.vue'
import { logger } from '@/services/logger'

interface Template {
  id: string
  name: string
  category: string
  description: string
  icon: string
  color: string
  rooms: number
  estimatedTime: number
  tasksByRoom: Record<string, string[]>
}

const router = useRouter()
const route = useRoute()
const checklistStore = useChecklistStore()
const notificationStore = useNotificationStore()

// State
const template = ref<Template | null>(null)
const originalTemplate = ref<Template | null>(null)
const valid = ref(false)
const form = ref(null)
const saving = ref(false)
const showUnsavedDialog = ref(false)
const showSuccess = ref(false)
const pendingNavigation = ref<(() => void) | null>(null)

// Sample template data - in a real app, this would come from a store or API
const templateData: Record<string, Template> = {
  '1': {
    id: '1',
    name: 'Standard House Cleaning',
    category: 'Residential',
    description: 'Complete house cleaning checklist for regular maintenance',
    icon: 'mdi-home',
    color: 'primary',
    rooms: 8,
    estimatedTime: 120,
    tasksByRoom: {
      'Living Room': [
        'Dust all surfaces',
        'Vacuum carpet',
        'Clean windows',
        'Organize items'
      ],
      'Kitchen': [
        'Clean countertops',
        'Wipe down appliances',
        'Mop floor',
        'Empty trash'
      ],
      'Bathroom': [
        'Clean toilet',
        'Scrub shower/tub',
        'Clean mirror',
        'Mop floor'
      ],
      'Bedroom': [
        'Make bed',
        'Dust furniture',
        'Vacuum floor',
        'Organize closet'
      ]
    }
  },
  '2': {
    id: '2',
    name: 'Deep Clean - Kitchen',
    category: 'Deep Clean',
    description: 'Thorough kitchen deep cleaning including appliances',
    icon: 'mdi-silverware-fork-knife',
    color: 'orange',
    rooms: 1,
    estimatedTime: 90,
    tasksByRoom: {
      'Kitchen': [
        'Clean inside oven',
        'Defrost and clean refrigerator',
        'Clean microwave thoroughly',
        'Descale coffee maker',
        'Clean dishwasher',
        'Scrub sink and faucet',
        'Clean cabinet fronts',
        'Wipe down backsplash',
        'Deep clean floor'
      ]
    }
  }
}

// Computed
const hasUnsavedChanges = computed(() => {
  if (!template.value || !originalTemplate.value) return false
  return JSON.stringify(template.value) !== JSON.stringify(originalTemplate.value)
})

// Methods
const loadTemplate = async () => {
  try {
    const templateId = route.params.id as string
    
    // In a real app, load from store or API
    const loadedTemplate = templateData[templateId]
    
    if (loadedTemplate) {
      template.value = { ...loadedTemplate }
      originalTemplate.value = JSON.parse(JSON.stringify(loadedTemplate))
      
      if (!template.value.tasksByRoom) {
        template.value.tasksByRoom = {}
      }
    } else {
      notificationStore.showError('Template not found')
      router.push('/templates')
    }
  } catch (error) {
    logger.error('Error loading template:', error)
    notificationStore.showError('Failed to load template')
    router.push('/templates')
  }
}

const saveTemplate = async () => {
  if (!form.value || !template.value) return
  
  const validation = await (form.value as any).validate()
  if (!validation.valid) return
  
  saving.value = true
  
  try {
    // In a real app, save to store or API
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
    
    logger.info('Template saved:', template.value)
    originalTemplate.value = JSON.parse(JSON.stringify(template.value))
    
    showSuccess.value = true
    notificationStore.showSuccess('Template saved successfully!')
    
    // Navigate back after a short delay
    setTimeout(() => {
      router.push('/templates')
    }, 1500)
  } catch (error) {
    logger.error('Error saving template:', error)
    notificationStore.showError('Failed to save template')
  } finally {
    saving.value = false
  }
}

const cancel = () => {
  if (hasUnsavedChanges.value) {
    showUnsavedDialog.value = true
    pendingNavigation.value = () => router.push('/templates')
  } else {
    router.push('/templates')
  }
}

const confirmLeave = () => {
  showUnsavedDialog.value = false
  if (pendingNavigation.value) {
    pendingNavigation.value()
    pendingNavigation.value = null
  }
}

// Navigation guard
onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value && !showUnsavedDialog.value) {
    showUnsavedDialog.value = true
    pendingNavigation.value = () => next()
    next(false)
  } else {
    next()
  }
})

// Lifecycle
onMounted(() => {
  loadTemplate()
})

// Cleanup
onBeforeUnmount(() => {
  // Clean up any subscriptions or timers if needed
})
</script>
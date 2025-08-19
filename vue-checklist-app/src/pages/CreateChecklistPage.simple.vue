<template>
  <MainLayout title="Create Checklist" :show-back-button="true">
    <v-container class="pa-4">
      <!-- Progress Indicator -->
      <v-card class="mb-4 elevation-2">
        <v-card-text>
          <v-progress-linear
            :model-value="progressPercentage"
            color="primary"
            height="8"
            rounded
          ></v-progress-linear>
          <div class="text-center mt-2 text-caption">
            Step {{ currentStep }} of {{ totalSteps }}
          </div>
        </v-card-text>
      </v-card>

      <!-- Main Form Card -->
      <v-card class="elevation-4 form-card">
        <v-card-title class="text-h5 font-weight-bold">
          <v-icon class="mr-2">mdi-clipboard-plus</v-icon>
          New Cleaning Checklist
        </v-card-title>
        
        <v-card-text>
          <v-form ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
            <!-- Property Name -->
            <v-text-field
              v-model="formData.propertyName"
              label="Property Name"
              placeholder="e.g., Beach House Villa"
              prepend-icon="mdi-home"
              variant="outlined"
              class="mb-4"
              :rules="validationRules.propertyName"
              required
            ></v-text-field>

            <!-- Address -->
            <v-text-field
              v-model="formData.address"
              label="Property Address"
              placeholder="123 Main St, City, State"
              prepend-icon="mdi-map-marker"
              variant="outlined"
              class="mb-4"
              :rules="validationRules.address"
            ></v-text-field>

            <!-- Property Type -->
            <v-select
              v-model="formData.propertyType"
              :items="propertyTypes"
              label="Property Type"
              prepend-icon="mdi-home-variant"
              variant="outlined"
              class="mb-4"
              :rules="validationRules.propertyType"
            ></v-select>

            <!-- Cleaning Type -->
            <v-select
              v-model="formData.cleaningType"
              :items="cleaningTypes"
              label="Cleaning Type"
              prepend-icon="mdi-broom"
              variant="outlined"
              class="mb-4"
              :rules="validationRules.cleaningType"
            ></v-select>

            <!-- Date and Time -->
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.date"
                  label="Date"
                  type="date"
                  prepend-icon="mdi-calendar"
                  variant="outlined"
                  :min="minDate"
                  :rules="validationRules.date"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.time"
                  label="Time"
                  type="time"
                  prepend-icon="mdi-clock"
                  variant="outlined"
                  :rules="validationRules.time"
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- Notes -->
            <v-textarea
              v-model="formData.notes"
              label="Additional Notes"
              placeholder="Any special instructions or requirements..."
              prepend-icon="mdi-note-text"
              variant="outlined"
              rows="3"
              class="mb-4"
              :counter="500"
              :rules="validationRules.notes"
            ></v-textarea>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-btn
            variant="text"
            @click="handleCancel"
          >
            Cancel
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="elevated"
            size="large"
            :disabled="!isFormValid || isSubmitting"
            :loading="isSubmitting"
            @click="handleSubmit"
            prepend-icon="mdi-check"
          >
            Create Checklist
          </v-btn>
        </v-card-actions>
      </v-card>

      <!-- Quick Templates -->
      <v-card class="mt-6 elevation-2 templates-card">
        <v-card-title class="text-h6">
          <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
          Quick Templates
        </v-card-title>
        <v-card-text>
          <v-chip-group v-model="selectedTemplate">
            <v-chip
              v-for="template in templates"
              :key="template.id"
              :value="template.id"
              @click="applyTemplate(template)"
              variant="outlined"
              color="primary"
            >
              {{ template.name }}
            </v-chip>
          </v-chip-group>
        </v-card-text>
      </v-card>

      <!-- Success Snackbar -->
      <v-snackbar
        v-model="showSnackbar"
        :timeout="3000"
        color="success"
      >
        Checklist created successfully!
        <template v-slot:actions>
          <v-btn
            variant="text"
            @click="showSnackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { VForm } from 'vuetify/components'
import MainLayout from '@/layouts/MainLayout.vue'
import type { ChecklistFormData, PropertyType, CleaningType } from '@/types/forms'

// Router instance
const router = useRouter()

// Form ref
const formRef = ref<InstanceType<typeof VForm>>()

// State
const isFormValid = ref(false)
const isSubmitting = ref(false)
const showSnackbar = ref(false)
const selectedTemplate = ref<string | null>(null)
const currentStep = ref(1)
const totalSteps = ref(3)

// Form data
const formData = reactive<ChecklistFormData>({
  propertyName: '',
  address: '',
  propertyType: '' as PropertyType,
  cleaningType: '' as CleaningType,
  date: '',
  time: '',
  notes: ''
})

// Constants
const propertyTypes: readonly PropertyType[] = [
  'House',
  'Apartment',
  'Condo',
  'Villa',
  'Office',
  'Commercial Space'
] as const

const cleaningTypes: readonly CleaningType[] = [
  'Standard Cleaning',
  'Deep Cleaning',
  'Move-in/Move-out',
  'Post-Construction',
  'Regular Maintenance'
] as const

interface Template {
  id: string
  name: string
  cleaningType: CleaningType
  propertyType?: PropertyType
  notes?: string
}

const templates: readonly Template[] = [
  { id: 'airbnb', name: 'Airbnb Turnover', cleaningType: 'Standard Cleaning' },
  { id: 'office', name: 'Office Cleaning', cleaningType: 'Regular Maintenance', propertyType: 'Office' },
  { id: 'deep', name: 'Deep Clean', cleaningType: 'Deep Cleaning' },
  { id: 'quick', name: 'Quick Clean', cleaningType: 'Standard Cleaning' }
] as const

// Computed
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const progressPercentage = computed(() => {
  return (currentStep.value / totalSteps.value) * 100
})

// Validation rules
const validationRules = {
  propertyName: [
    (v: string) => !!v || 'Property name is required',
    (v: string) => v.length >= 3 || 'Property name must be at least 3 characters',
    (v: string) => v.length <= 100 || 'Property name must be less than 100 characters'
  ],
  address: [
    (v: string) => !v || v.length <= 200 || 'Address must be less than 200 characters'
  ],
  propertyType: [
    (v: string) => !!v || 'Property type is required'
  ],
  cleaningType: [
    (v: string) => !!v || 'Cleaning type is required'
  ],
  date: [
    (v: string) => !!v || 'Date is required',
    (v: string) => {
      if (!v) return true
      const selectedDate = new Date(v)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate >= today || 'Date cannot be in the past'
    }
  ],
  time: [
    (v: string) => !!v || 'Time is required'
  ],
  notes: [
    (v: string) => !v || v.length <= 500 || 'Notes must be less than 500 characters'
  ]
}

// Methods
const applyTemplate = (template: Template): void => {
  formData.cleaningType = template.cleaningType
  if (template.propertyType) {
    formData.propertyType = template.propertyType
  }
  if (template.notes) {
    formData.notes = template.notes
  }
}

const handleCancel = (): void => {
  router.push('/')
}

const handleSubmit = async (): Promise<void> => {
  if (!formRef.value) return
  
  const { valid } = await formRef.value.validate()
  
  if (!valid) return
  
  isSubmitting.value = true
  
  try {
    // TODO: Implement actual checklist creation with store
    // For now, simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    showSnackbar.value = true
    
    // Navigate to checklists page after success
    setTimeout(() => {
      router.push('/checklists')
    }, 1500)
  } catch (error) {
    console.error('Error creating checklist:', error)
    // TODO: Show error message to user
  } finally {
    isSubmitting.value = false
  }
}

// Lifecycle
// Simplified create checklist page with validation
</script>

<style scoped>
.form-card {
  border-radius: 12px;
}

.templates-card {
  border-radius: 12px;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

/* Add smooth transitions */
.v-text-field,
.v-select,
.v-textarea {
  transition: all 0.3s ease;
}
</style>
<template>
  <v-card flat class="mb-2">
    <v-card-title class="text-h6">
      <v-icon class="mr-2">mdi-information</v-icon>
      Basic Information
    </v-card-title>
    <v-card-text>
      <v-text-field
        :model-value="name"
        @update:model-value="handleNameUpdate"
        @blur="validateName"
        label="Checklist Name"
        variant="outlined"
        density="compact"
        :error="!!nameError"
        :error-messages="nameError"
        placeholder="e.g., Weekly Office Cleaning"
        counter="100"
        class="mb-3"
      />
      
      <v-textarea
        :model-value="description"
        @update:model-value="handleDescriptionUpdate"
        @blur="validateDescription"
        label="Description (Optional)"
        variant="outlined"
        density="compact"
        rows="2"
        :error="!!descriptionError"
        :error-messages="descriptionError"
        placeholder="Add any special notes or requirements"
        counter="500"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { z } from 'zod'
import { useZodValidation } from '@/composables/useZodValidation'

const props = defineProps<{
  name: string
  description?: string
}>()

const emit = defineEmits<{
  'update:name': [value: string]
  'update:description': [value: string]
  'validation-change': [isValid: boolean]
}>()

// Validation schema
const basicInfoSchema = z.object({
  name: z.string()
    .min(1, 'Checklist name is required')
    .max(100, 'Checklist name must be less than 100 characters'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
})

// Setup validation
const { validateField, getError, isValid } = useZodValidation(basicInfoSchema)

// Error states
const nameError = ref('')
const descriptionError = ref('')

// Handle updates
const handleNameUpdate = (value: string) => {
  emit('update:name', value)
  // Clear error on input
  if (nameError.value) {
    nameError.value = ''
  }
}

const handleDescriptionUpdate = (value: string) => {
  emit('update:description', value)
  // Clear error on input
  if (descriptionError.value) {
    descriptionError.value = ''
  }
}

// Validation methods
const validateName = () => {
  validateField('name', props.name, { 
    name: props.name, 
    description: props.description 
  })
  nameError.value = getError('name') || ''
  emit('validation-change', isValid.value)
}

const validateDescription = () => {
  validateField('description', props.description, { 
    name: props.name, 
    description: props.description 
  })
  descriptionError.value = getError('description') || ''
  emit('validation-change', isValid.value)
}

// Watch for validation state changes
watch(isValid, (newValue) => {
  emit('validation-change', newValue)
})

// Expose validation method for parent component
defineExpose({
  validate: () => {
    validateName()
    validateDescription()
    return isValid.value
  }
})
</script>
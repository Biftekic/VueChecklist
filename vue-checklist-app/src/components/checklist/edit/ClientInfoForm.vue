<template>
  <v-card flat class="mb-2">
    <v-card-title class="text-h6">
      <v-icon class="mr-2">mdi-account</v-icon>
      Client Information
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="clientInfo.name"
            @update:model-value="updateClient('name', $event)"
            @blur="validateField('name')"
            label="Client Name"
            variant="outlined"
            density="compact"
            :error="!!errors.name"
            :error-messages="errors.name"
            placeholder="e.g., John Smith"
            prepend-inner-icon="mdi-account"
            required
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="clientInfo.email"
            @update:model-value="updateClient('email', $event)"
            @blur="validateField('email')"
            label="Email"
            type="email"
            variant="outlined"
            density="compact"
            :error="!!errors.email"
            :error-messages="errors.email"
            placeholder="e.g., john@example.com"
            prepend-inner-icon="mdi-email"
          />
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="clientInfo.phone"
            @update:model-value="updateClient('phone', $event)"
            @blur="validateField('phone')"
            label="Phone"
            type="tel"
            variant="outlined"
            density="compact"
            :error="!!errors.phone"
            :error-messages="errors.phone"
            placeholder="e.g., (555) 123-4567"
            prepend-inner-icon="mdi-phone"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="clientInfo.address"
            @update:model-value="updateClient('address', $event)"
            @blur="validateField('address')"
            label="Address"
            variant="outlined"
            density="compact"
            :error="!!errors.address"
            :error-messages="errors.address"
            placeholder="e.g., 123 Main St, City, State"
            prepend-inner-icon="mdi-map-marker"
            counter="200"
          />
        </v-col>
      </v-row>
      
      <v-textarea
        :model-value="clientInfo.notes"
        @update:model-value="updateClient('notes', $event)"
        @blur="validateField('notes')"
        label="Notes"
        variant="outlined"
        density="compact"
        rows="2"
        :error="!!errors.notes"
        :error-messages="errors.notes"
        placeholder="Any special instructions or preferences"
        prepend-inner-icon="mdi-note-text"
        counter="500"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { ClientInfo } from '@/stores/checklistStore'
import { clientInfoSchema } from '@/schemas/checklist.schema'
import { useZodValidation } from '@/composables/useZodValidation'

const props = defineProps<{
  clientInfo: ClientInfo
}>()

const emit = defineEmits<{
  'update:clientInfo': [value: ClientInfo]
  'validation-change': [isValid: boolean]
}>()

// Setup validation
const { validateField: validateZodField, getError, isValid, validate: validateAll } = useZodValidation(clientInfoSchema)

// Error states
const errors = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  notes: ''
})

// Update client field and clear error
function updateClient(field: keyof ClientInfo, value: string) {
  emit('update:clientInfo', {
    ...props.clientInfo,
    [field]: value
  })
  
  // Clear error when user starts typing
  if (errors[field as keyof typeof errors]) {
    errors[field as keyof typeof errors] = ''
  }
}

// Validate individual field
function validateField(field: keyof ClientInfo) {
  const fieldValue = props.clientInfo[field]
  
  // Special handling for email - allow empty
  if (field === 'email' && (!fieldValue || fieldValue === '')) {
    errors[field] = ''
    return
  }
  
  // Special handling for phone - allow empty
  if (field === 'phone' && (!fieldValue || fieldValue === '')) {
    errors[field] = ''
    return
  }
  
  validateZodField(field, fieldValue, props.clientInfo)
  errors[field as keyof typeof errors] = getError(field) || ''
  emit('validation-change', isValid.value)
}

// Validate all fields
function validateForm(): boolean {
  const result = validateAll(props.clientInfo)
  
  if (!result.success && result.errors) {
    result.errors.forEach(error => {
      if (errors.hasOwnProperty(error.field)) {
        errors[error.field as keyof typeof errors] = error.message
      }
    })
  }
  
  emit('validation-change', result.success)
  return result.success
}

// Watch for validation state changes
watch(isValid, (newValue) => {
  emit('validation-change', newValue)
})

// Expose validation method for parent component
defineExpose({
  validate: validateForm
})
</script>
<template>
  <v-container fluid class="pa-0">
    <v-card flat>
      <v-card-title class="text-h5 font-weight-bold">
        <v-icon class="mr-2">mdi-account-details</v-icon>
        Client Information
      </v-card-title>
      
      <v-card-subtitle>
        Enter client details and service frequency
      </v-card-subtitle>

      <v-card-text>
        <v-form ref="form" v-model="valid">
          <!-- Client Name -->
          <v-text-field
            v-model="clientInfo.name"
            label="Client Name"
            placeholder="Enter client or company name"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-account"
          />

          <!-- Address -->
          <v-textarea
            v-model="clientInfo.address"
            label="Address"
            placeholder="Enter full address"
            variant="outlined"
            density="comfortable"
            rows="2"
            class="mb-4"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-map-marker"
          />

          <!-- Contact Information Row -->
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="clientInfo.phone"
                label="Phone Number"
                placeholder="(555) 123-4567"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required, rules.phone]"
                prepend-inner-icon="mdi-phone"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="clientInfo.email"
                label="Email Address"
                placeholder="client@example.com"
                variant="outlined"
                density="comfortable"
                :rules="[rules.email]"
                prepend-inner-icon="mdi-email"
              />
            </v-col>
          </v-row>

          <!-- Service Frequency -->
          <v-card variant="outlined" class="mb-4">
            <v-card-title class="text-subtitle-1">
              <v-icon size="small" class="mr-2">mdi-calendar-repeat</v-icon>
              Service Frequency
            </v-card-title>
            <v-card-text>
              <v-chip-group
                v-model="clientInfo.frequency"
                selected-class="text-primary"
                mandatory
              >
                <v-chip
                  v-for="freq in frequencies"
                  :key="freq.value"
                  :value="freq.value"
                  variant="outlined"
                  filter
                >
                  <v-icon start size="small">{{ freq.icon }}</v-icon>
                  {{ freq.label }}
                </v-chip>
              </v-chip-group>

              <!-- Custom Frequency -->
              <v-expand-transition>
                <v-text-field
                  v-if="clientInfo.frequency === 'custom'"
                  v-model="clientInfo.customFrequency"
                  label="Specify Custom Frequency"
                  placeholder="e.g., Every 2 weeks on Monday"
                  variant="outlined"
                  density="compact"
                  class="mt-3"
                  :rules="[clientInfo.frequency === 'custom' ? rules.required : true]"
                />
              </v-expand-transition>
            </v-card-text>
          </v-card>

          <!-- Special Instructions -->
          <v-textarea
            v-model="clientInfo.specialInstructions"
            label="Special Instructions (Optional)"
            placeholder="Any special requirements or notes..."
            variant="outlined"
            density="comfortable"
            rows="3"
            prepend-inner-icon="mdi-note-text"
          />

          <!-- Contact Person (Optional) -->
          <v-expansion-panels variant="accordion" class="mb-4">
            <v-expansion-panel>
              <v-expansion-panel-title>
                <v-icon class="mr-2">mdi-account-plus</v-icon>
                Additional Contact Person (Optional)
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-text-field
                  v-model="clientInfo.contactPerson.name"
                  label="Contact Name"
                  variant="outlined"
                  density="compact"
                  class="mb-3"
                />
                <v-text-field
                  v-model="clientInfo.contactPerson.phone"
                  label="Contact Phone"
                  variant="outlined"
                  density="compact"
                  class="mb-3"
                />
                <v-text-field
                  v-model="clientInfo.contactPerson.email"
                  label="Contact Email"
                  variant="outlined"
                  density="compact"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <!-- Preferred Service Time -->
          <v-card variant="outlined">
            <v-card-title class="text-subtitle-1">
              <v-icon size="small" class="mr-2">mdi-clock-outline</v-icon>
              Preferred Service Time
            </v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="clientInfo.preferredDay"
                    :items="daysOfWeek"
                    label="Preferred Day"
                    variant="outlined"
                    density="compact"
                    clearable
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="clientInfo.preferredTime"
                    :items="timeSlots"
                    label="Preferred Time"
                    variant="outlined"
                    density="compact"
                    clearable
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Navigation Buttons -->
          <v-row class="mt-6">
            <v-col cols="12" sm="6">
              <v-btn
                size="large"
                variant="outlined"
                block
                @click="handleBack"
              >
                <v-icon start>mdi-arrow-left</v-icon>
                Back
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn
                color="primary"
                size="large"
                block
                :disabled="!valid"
                @click="handleNext"
              >
                Next: Review
                <v-icon end>mdi-arrow-right</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useChecklistStore } from '@/stores/checklistStore'

const emit = defineEmits(['next', 'back'])

const checklistStore = useChecklistStore()
const form = ref(null)
const valid = ref(false)

// Client information model
const clientInfo = ref({
  name: '',
  address: '',
  phone: '',
  email: '',
  frequency: 'weekly',
  customFrequency: '',
  specialInstructions: '',
  contactPerson: {
    name: '',
    phone: '',
    email: ''
  },
  preferredDay: null,
  preferredTime: null
})

// Frequency options
const frequencies = [
  { value: 'daily', label: 'Daily', icon: 'mdi-calendar-today' },
  { value: 'weekly', label: 'Weekly', icon: 'mdi-calendar-week' },
  { value: 'biweekly', label: 'Bi-Weekly', icon: 'mdi-calendar-range' },
  { value: 'monthly', label: 'Monthly', icon: 'mdi-calendar-month' },
  { value: 'quarterly', label: 'Quarterly', icon: 'mdi-calendar-multiple' },
  { value: 'custom', label: 'Custom', icon: 'mdi-calendar-edit' }
]

// Days of week
const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
  'Any Day'
]

// Time slots
const timeSlots = [
  'Morning (6AM - 9AM)',
  'Mid-Morning (9AM - 12PM)',
  'Afternoon (12PM - 3PM)',
  'Late Afternoon (3PM - 6PM)',
  'Evening (6PM - 9PM)',
  'Any Time'
]

// Validation rules
const rules = {
  required: value => !!value || 'This field is required',
  email: value => {
    if (!value) return true
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Invalid email address'
  },
  phone: value => {
    if (!value) return 'Phone number is required'
    const pattern = /^[\d\s\-\.\(\)\+]+$/
    return pattern.test(value) || 'Invalid phone number'
  }
}

// Watch for changes and update store
watch(clientInfo, (newValue) => {
  if (valid.value) {
    checklistStore.updateClientInfo(newValue)
  }
}, { deep: true })

// Load existing data on mount
onMounted(() => {
  const existingInfo = checklistStore.currentChecklist?.clientInfo
  if (existingInfo) {
    clientInfo.value = { ...clientInfo.value, ...existingInfo }
  }
})

// Validate form
const validateForm = async () => {
  const validation = await form.value?.validate()
  return validation?.valid || false
}

// Handle next step
const handleNext = async () => {
  const validation = await form.value?.validate()
  if (validation?.valid) {
    // Save to store
    checklistStore.updateClientInfo(clientInfo.value)
    emit('next')
  }
}

// Handle back step
const handleBack = () => {
  emit('back')
}

// Expose validation method for parent component
defineExpose({
  validateForm,
  clientInfo
})
</script>

<style scoped>
.v-chip-group {
  flex-wrap: wrap;
}

.v-chip {
  margin: 4px;
}

.v-expansion-panel {
  background-color: rgba(0, 0, 0, 0.02);
}

.v-expansion-panel-title {
  font-size: 0.95rem;
  padding: 12px 16px;
}
</style>
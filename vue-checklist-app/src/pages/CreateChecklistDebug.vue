<template>
  <MainLayout title="Debug Create Checklist">
    <v-container class="pa-4">
      <v-card class="mb-4">
        <v-card-title>Component Testing</v-card-title>
        <v-card-text>
          <v-btn-toggle v-model="testComponent" mandatory>
            <v-btn value="none">None</v-btn>
            <v-btn value="property">Property</v-btn>
            <v-btn value="room">Room</v-btn>
            <v-btn value="task">Task</v-btn>
            <v-btn value="client">Client</v-btn>
            <v-btn value="review">Review</v-btn>
          </v-btn-toggle>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-title>Current Test: {{ testComponent }}</v-card-title>
        <v-card-text>
          <!-- No component -->
          <div v-if="testComponent === 'none'">
            <p>No component loaded. If you see this, the basic page works.</p>
          </div>

          <!-- Test PropertyDetailsStep -->
          <div v-if="testComponent === 'property'">
            <p class="mb-4">Testing PropertyDetailsStep...</p>
            <div class="error-wrapper">
              <PropertyDetailsStep @next="handleNext" />
            </div>
          </div>

          <!-- Test RoomSelectionStep -->
          <div v-if="testComponent === 'room'">
            <p class="mb-4">Testing RoomSelectionStep...</p>
            <div class="error-wrapper">
              <RoomSelectionStep @next="handleNext" @back="handleBack" />
            </div>
          </div>

          <!-- Test EnhancedTaskSelectionStep -->
          <div v-if="testComponent === 'task'">
            <p class="mb-4">Testing EnhancedTaskSelectionStep...</p>
            <div class="error-wrapper">
              <EnhancedTaskSelectionStep @next="handleNext" @back="handleBack" />
            </div>
          </div>

          <!-- Test ClientInfoStep -->
          <div v-if="testComponent === 'client'">
            <p class="mb-4">Testing ClientInfoStep...</p>
            <div class="error-wrapper">
              <ClientInfoStep @next="handleNext" @back="handleBack" />
            </div>
          </div>

          <!-- Test ReviewStep -->
          <div v-if="testComponent === 'review'">
            <p class="mb-4">Testing ReviewStep...</p>
            <div class="error-wrapper">
              <ReviewStep @save="handleSave" @back="handleBack" />
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Console output -->
      <v-card class="mt-4">
        <v-card-title>Console Output</v-card-title>
        <v-card-text>
          <pre>{{ consoleOutput }}</pre>
        </v-card-text>
      </v-card>
    </v-container>
  </MainLayout>
</template>

<script setup>
import { ref, watch, onErrorCaptured } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useChecklistStore } from '@/stores/checklistStore'
import { useAppStore } from '@/stores/app'

// Import components conditionally
import PropertyDetailsStep from '@/components/checklist/PropertyDetailsStep.vue'
import RoomSelectionStep from '@/components/checklist/RoomSelectionStep.vue'
import EnhancedTaskSelectionStep from '@/components/checklist/EnhancedTaskSelectionStep.vue'
import ClientInfoStep from '@/components/steps/ClientInfoStep.vue'
import ReviewStep from '@/components/steps/ReviewStep.vue'

const testComponent = ref('none')
const consoleOutput = ref('Starting debug...\n')

// Initialize stores safely
const checklistStore = useChecklistStore()
const appStore = useAppStore()

// Initialize store data
try {
  if (!checklistStore.currentChecklist) {
    checklistStore.resetCurrentChecklist && checklistStore.resetCurrentChecklist()
  }
  appStore.currentStep = 1
  consoleOutput.value += 'Stores initialized successfully\n'
} catch (error) {
  consoleOutput.value += `Store initialization error: ${error}\n`
}

// Watch for component changes
watch(testComponent, (newVal) => {
  consoleOutput.value += `Loading component: ${newVal}\n`
})

// Error capture
onErrorCaptured((err, instance, info) => {
  consoleOutput.value += `ERROR: ${err}\n`
  consoleOutput.value += `Component: ${instance?.$options.name || 'Unknown'}\n`
  consoleOutput.value += `Info: ${info}\n`
  return false // Prevent propagation
})

// Event handlers
const handleNext = () => {
  consoleOutput.value += 'Next button clicked\n'
}

const handleBack = () => {
  consoleOutput.value += 'Back button clicked\n'
}

const handleSave = () => {
  consoleOutput.value += 'Save button clicked\n'
}

console.log('CreateChecklistDebug loaded')
</script>

<style scoped>
.error-wrapper {
  border: 1px solid #ddd;
  padding: 16px;
  min-height: 200px;
}

pre {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
}
</style>
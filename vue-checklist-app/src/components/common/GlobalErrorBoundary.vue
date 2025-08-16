<template>
  <div v-if="hasError" class="error-boundary pa-4">
    <v-alert
      type="error"
      prominent
      variant="elevated"
      class="mx-auto"
      max-width="600"
    >
      <template v-slot:title>
        <v-icon size="large" class="mr-2">mdi-alert-circle</v-icon>
        Oops! Something went wrong
      </template>

      <div class="mt-2">
        <p class="text-body-1">{{ errorMessage }}</p>
        
        <v-expansion-panels v-if="showDetails" class="mt-3">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon size="small" class="mr-2">mdi-bug</v-icon>
              Error Details
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <pre class="text-caption error-stack">{{ errorStack }}</pre>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>

      <v-card-actions class="mt-4 pa-0">
        <v-btn
          color="white"
          variant="outlined"
          @click="retry"
          prepend-icon="mdi-refresh"
        >
          Try Again
        </v-btn>
        <v-btn
          color="white"
          variant="text"
          @click="goHome"
          prepend-icon="mdi-home"
        >
          Go Home
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="!showDetails"
          variant="text"
          size="small"
          @click="showDetails = true"
        >
          Show Details
        </v-btn>
      </v-card-actions>
    </v-alert>

    <!-- Optional: Report error dialog -->
    <v-dialog v-model="reportDialog" max-width="500">
      <v-card>
        <v-card-title>Report Error</v-card-title>
        <v-card-text>
          <v-textarea
            v-model="reportDescription"
            label="Describe what you were doing"
            rows="3"
            variant="outlined"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="reportDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="sendReport">Send Report</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const hasError = ref(false)
const errorMessage = ref('')
const errorStack = ref('')
const showDetails = ref(false)
const reportDialog = ref(false)
const reportDescription = ref('')

// Capture errors from child components
onErrorCaptured((err, instance, info) => {
  hasError.value = true
  errorMessage.value = err.message || 'An unexpected error occurred'
  errorStack.value = err.stack || 'No stack trace available'
  
  // Log to console for development
  console.error('Error captured:', {
    error: err,
    component: instance,
    info: info
  })
  
  // Log to monitoring service in production
  if (import.meta.env.PROD) {
    logToMonitoring(err, instance, info)
  }
  
  // Prevent the error from propagating
  return false
})

const retry = () => {
  hasError.value = false
  errorMessage.value = ''
  errorStack.value = ''
  showDetails.value = false
  
  // Optionally reload the current route
  router.go(0)
}

const goHome = () => {
  hasError.value = false
  errorMessage.value = ''
  errorStack.value = ''
  showDetails.value = false
  router.push('/')
}

const sendReport = async () => {
  try {
    // Send error report to backend
    await logToMonitoring({
      message: errorMessage.value,
      stack: errorStack.value,
      userDescription: reportDescription.value,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    })
    
    reportDialog.value = false
    reportDescription.value = ''
    
    // Show success notification
    console.log('Error report sent successfully')
  } catch (error) {
    console.error('Failed to send error report:', error)
  }
}

const logToMonitoring = (error, instance, info) => {
  // Placeholder for monitoring service integration
  // In production, this would send to Sentry, LogRocket, etc.
  const errorData = {
    message: error.message,
    stack: error.stack,
    componentName: instance?.$options.name || 'Unknown',
    info: info,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent
  }
  
  // For now, just log to console
  console.error('Error logged to monitoring:', errorData)
  
  // In production, send to monitoring service
  // Example: Sentry.captureException(error, { extra: errorData })
}

// Expose reset method for parent components
defineExpose({
  reset: () => {
    hasError.value = false
    errorMessage.value = ''
    errorStack.value = ''
    showDetails.value = false
  }
})
</script>

<style scoped>
.error-boundary {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.error-stack {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  overflow-x: auto;
  padding: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}
</style>
<template>
  <MainLayout 
    :title="pageTitle" 
    :show-back-button="currentStep > 1"
    @back="previousStep"
  >
    <v-container class="pa-0">
      <!-- Progress Bar -->
      <v-progress-linear
        :model-value="stepProgress"
        color="primary"
        height="4"
        class="mb-4"
      />
      
      <!-- Step Content -->
      <div class="pa-4">
        <!-- Step 1: Property Details -->
        <div v-if="currentStep === 1">
          <PropertyDetailsStep @next="nextStep" />
        </div>
        
        <!-- Step 2: Room Selection -->
        <div v-if="currentStep === 2">
          <RoomSelectionStep @next="nextStep" @back="previousStep" />
        </div>
        
        <!-- Step 3: Task Selection -->
        <div v-if="currentStep === 3">
          <UniversalTaskSelectionStep @next="nextStep" @back="previousStep" />
        </div>
        
        <!-- Step 4: Client Info -->
        <div v-if="currentStep === 4">
          <ClientInfoStep @next="nextStep" @back="previousStep" />
        </div>
        
        <!-- Step 5: Review & Save -->
        <div v-if="currentStep === 5">
          <ReviewStep @save="saveChecklist" @back="previousStep" />
        </div>
      </div>
    </v-container>
  </MainLayout>
</template>

<script setup>
import { logger } from "@/services/logger"
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useChecklistStore } from '@/stores/checklistStore'
import MainLayout from '@/layouts/MainLayout.vue'

// Import step components
import PropertyDetailsStep from '@/components/checklist/PropertyDetailsStep.vue'
import RoomSelectionStep from '@/components/checklist/RoomSelectionStep.vue'
import UniversalTaskSelectionStep from '@/components/checklist/UniversalTaskSelectionStep.vue'
import ClientInfoStep from '@/components/steps/ClientInfoStep.vue'
import ReviewStep from '@/components/steps/ReviewStep.vue'

const router = useRouter()
const appStore = useAppStore()
const checklistStore = useChecklistStore()

const currentStep = computed(() => appStore.currentStep || 1)
const stepProgress = computed(() => (currentStep.value / 5) * 100)

const pageTitle = computed(() => {
  const titles = {
    1: 'Property Details',
    2: 'Select Rooms',
    3: 'Select Tasks',
    4: 'Client Information',
    5: 'Review & Save'
  }
  return `${titles[currentStep.value]} (${currentStep.value}/5)`
})

onMounted(() => {
  try {
    // Reset steps when starting fresh
    if (appStore.resetSteps) {
      appStore.resetSteps()
    } else {
      // Fallback if method doesn't exist
      appStore.currentStep = 1
    }
    
    // Initialize checklist store if needed
    if (!checklistStore.currentChecklist) {
      checklistStore.resetCurrentChecklist && checklistStore.resetCurrentChecklist()
    }
  } catch (error) {
    logger.error('Error initializing CreateChecklistPage:', error)
    // Ensure we have a valid state even if initialization fails
    appStore.currentStep = 1
  }
})

const nextStep = () => {
  if (appStore.nextStep) {
    appStore.nextStep()
  } else {
    // Fallback if store method doesn't exist
    appStore.currentStep = Math.min((appStore.currentStep || 1) + 1, 5)
  }
}

const previousStep = () => {
  if (appStore.previousStep) {
    appStore.previousStep()
  } else {
    // Fallback if store method doesn't exist
    appStore.currentStep = Math.max((appStore.currentStep || 1) - 1, 1)
  }
}

const saveChecklist = async () => {
  try {
    const id = await checklistStore.saveChecklist()
    if (id) {
      appStore.showNotification('Checklist saved successfully!', 'success')
      router.push(`/checklist/${id}`)
    }
  } catch (error) {
    logger.error('Failed to save checklist:', error)
    appStore.showNotification('Failed to save checklist', 'error')
  }
}
</script>

<style scoped>
.v-progress-linear {
  border-radius: 0;
}
</style>
<template>
  <MainLayout 
    :title="pageTitle" 
    :show-back-button="currentStep > 1"
  >
    <v-container class="pa-0">
      <!-- Progress Bar -->
      <v-progress-linear
        :model-value="stepProgress"
        color="primary"
        height="4"
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
          <EnhancedTaskSelectionStep @next="nextStep" @back="previousStep" />
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useChecklistsStore } from '@/stores/checklists'
import MainLayout from '@/layouts/MainLayout.vue'

// Import step components
import PropertyDetailsStep from '@/components/checklist/PropertyDetailsStep.vue'
import RoomSelectionStep from '@/components/checklist/RoomSelectionStep.vue'
import EnhancedTaskSelectionStep from '@/components/checklist/EnhancedTaskSelectionStep.vue'
import ClientInfoStep from '@/components/steps/ClientInfoStep.vue'
import ReviewStep from '@/components/steps/ReviewStep.vue'

const router = useRouter()
const appStore = useAppStore()
const checklistStore = useChecklistsStore()

const currentStep = computed(() => appStore.currentStep)
const stepProgress = computed(() => appStore.stepProgress)

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
  // Reset steps when starting fresh
  appStore.resetSteps()
})

const nextStep = () => {
  appStore.nextStep()
}

const previousStep = () => {
  appStore.previousStep()
}

const saveChecklist = async () => {
  try {
    const id = await checklistStore.saveChecklist()
    if (id) {
      appStore.showNotification('Checklist saved successfully!', 'success')
      router.push(`/checklist/${id}`)
    }
  } catch (error) {
    appStore.showNotification('Failed to save checklist', 'error')
  }
}
</script>

<style scoped>
/* Custom styles if needed */
</style>
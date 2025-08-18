<template>
  <MainLayout title="Debug Create Checklist - Safe Mode">
    <v-container class="pa-4">
      <v-card class="mb-4">
        <v-card-title>Component Testing - Safe Mode</v-card-title>
        <v-card-text>
          <p>If you see this, the basic page works!</p>
          <v-btn @click="loadPropertyStep">Load PropertyDetailsStep</v-btn>
        </v-card-text>
      </v-card>

      <v-card v-if="componentLoaded">
        <v-card-title>Component Loaded</v-card-title>
        <v-card-text>
          <div v-if="loadedComponent === 'property'">
            <component :is="PropertyComponent" v-if="PropertyComponent" @next="handleNext" />
            <p v-else>Failed to load PropertyDetailsStep</p>
          </div>
        </v-card-text>
      </v-card>

      <!-- Error display -->
      <v-alert v-if="error" type="error" class="mt-4">
        {{ error }}
      </v-alert>
    </v-container>
  </MainLayout>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useChecklistStore } from '@/stores/checklistStore'
import { useAppStore } from '@/stores/app'

const componentLoaded = ref(false)
const loadedComponent = ref('')
const error = ref('')
const PropertyComponent = shallowRef(null)

// Initialize stores safely
try {
  const checklistStore = useChecklistStore()
  const appStore = useAppStore()
  
  if (!checklistStore.currentChecklist) {
    checklistStore.resetCurrentChecklist && checklistStore.resetCurrentChecklist()
  }
  appStore.currentStep = 1
} catch (err) {
  error.value = `Store initialization error: ${err}`
}

const loadPropertyStep = async () => {
  try {
    error.value = ''
    const module = await import('@/components/checklist/PropertyDetailsStep.vue')
    PropertyComponent.value = module.default
    loadedComponent.value = 'property'
    componentLoaded.value = true
  } catch (err) {
    error.value = `Failed to load PropertyDetailsStep: ${err}`
  }
}

const handleNext = () => {
  console.log('Next clicked')
}

console.log('CreateChecklistDebug2 loaded - safe mode')
</script>
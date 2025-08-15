<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5">
        <v-icon class="mr-2">mdi-playlist-plus</v-icon>
        {{ editingTask ? 'Edit Task' : 'Create Custom Task' }}
      </v-card-title>
      
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <!-- Basic Information -->
          <div class="text-subtitle-2 mb-2">Basic Information</div>
          <v-text-field
            v-model="task.name"
            label="Task Name"
            variant="outlined"
            density="compact"
            :rules="[v => !!v || 'Task name is required']"
            class="mb-3"
          />
          
          <v-textarea
            v-model="task.description"
            label="Description (Optional)"
            variant="outlined"
            density="compact"
            rows="2"
            class="mb-3"
          />
          
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="task.frequency"
                :items="frequencies"
                label="Frequency"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="task.priority"
                :items="priorities"
                label="Priority"
                variant="outlined"
                density="compact"
              />
            </v-col>
          </v-row>
          
          <!-- Time Estimates -->
          <div class="text-subtitle-2 mb-2">Time Estimates (minutes)</div>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model.number="task.estimatedTime.amateur.min"
                label="Amateur Min"
                type="number"
                variant="outlined"
                density="compact"
                :rules="[v => v >= 0 || 'Must be positive']"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="task.estimatedTime.amateur.max"
                label="Amateur Max"
                type="number"
                variant="outlined"
                density="compact"
                :rules="[v => v >= task.estimatedTime.amateur.min || 'Must be >= min']"
              />
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model.number="task.estimatedTime.professional.min"
                label="Professional Min"
                type="number"
                variant="outlined"
                density="compact"
                :rules="[v => v >= 0 || 'Must be positive']"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="task.estimatedTime.professional.max"
                label="Professional Max"
                type="number"
                variant="outlined"
                density="compact"
                :rules="[v => v >= task.estimatedTime.professional.min || 'Must be >= min']"
              />
            </v-col>
          </v-row>
          
          <!-- Steps -->
          <div class="text-subtitle-2 mb-2">
            Step-by-Step Instructions
            <v-btn
              size="x-small"
              variant="tonal"
              class="ml-2"
              @click="addStep"
            >
              <v-icon size="small">mdi-plus</v-icon>
              Add Step
            </v-btn>
          </div>
          
          <div v-for="(step, index) in task.steps" :key="index" class="d-flex align-center mb-2">
            <v-text-field
              v-model="task.steps[index]"
              :label="`Step ${index + 1}`"
              variant="outlined"
              density="compact"
              hide-details
              class="mr-2"
            />
            <v-btn
              icon
              size="small"
              variant="text"
              @click="removeStep(index)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
          
          <!-- Chemicals -->
          <div class="text-subtitle-2 mb-2 mt-4">
            Chemicals Required
            <v-btn
              size="x-small"
              variant="tonal"
              class="ml-2"
              @click="addChemical"
            >
              <v-icon size="small">mdi-plus</v-icon>
              Add Chemical
            </v-btn>
          </div>
          
          <div v-for="(chemical, index) in task.chemicals" :key="`chem-${index}`" class="mb-3">
            <v-card variant="outlined">
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="chemical.name"
                      label="Chemical Name"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      v-model="chemical.dilution"
                      label="Dilution"
                      variant="outlined"
                      density="compact"
                      hide-details
                      placeholder="1:10"
                    />
                  </v-col>
                  <v-col cols="3">
                    <v-btn
                      icon
                      size="small"
                      variant="text"
                      @click="removeChemical(index)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </div>
          
          <!-- Tools -->
          <div class="text-subtitle-2 mb-2">
            Tools Required
            <v-btn
              size="x-small"
              variant="tonal"
              class="ml-2"
              @click="addTool"
            >
              <v-icon size="small">mdi-plus</v-icon>
              Add Tool
            </v-btn>
          </div>
          
          <div v-for="(tool, index) in task.tools" :key="`tool-${index}`" class="mb-3">
            <v-card variant="outlined">
              <v-card-text>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="tool.name"
                      label="Tool Name"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="3">
                    <v-select
                      v-model="tool.colorCode"
                      :items="colorCodes"
                      label="Color Code"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="3">
                    <v-btn
                      icon
                      size="small"
                      variant="text"
                      @click="removeTool(index)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </div>
          
          <!-- Safety -->
          <div class="text-subtitle-2 mb-2 mt-4">Safety Requirements</div>
          
          <v-combobox
            v-model="task.safety.ppe"
            label="PPE Required"
            variant="outlined"
            density="compact"
            multiple
            chips
            closable-chips
            :items="ppeOptions"
            class="mb-3"
          />
          
          <v-combobox
            v-model="task.safety.warnings"
            label="Safety Warnings"
            variant="outlined"
            density="compact"
            multiple
            chips
            closable-chips
            :items="warningOptions"
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
          variant="text"
          :disabled="!valid"
          @click="save"
        >
          {{ editingTask ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  editingTask: {
    type: Object,
    default: null
  },
  room: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

// Dialog state
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Form state
const form = ref(null)
const valid = ref(false)

// Task data
const task = ref({
  name: '',
  description: '',
  frequency: 'WEEKLY',
  priority: 'medium',
  estimatedTime: {
    amateur: { min: 15, max: 20 },
    professional: { min: 10, max: 15 }
  },
  steps: [],
  chemicals: [],
  tools: [],
  safety: {
    ppe: [],
    warnings: []
  },
  room: '',
  isCustom: true
})

// Options
const frequencies = ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY']
const priorities = ['high', 'medium', 'low']
const colorCodes = ['red', 'blue', 'green', 'yellow', 'white', 'none']
const ppeOptions = ['gloves', 'goggles', 'mask', 'apron', 'boots']
const warningOptions = [
  'Ensure ventilation',
  'Wet floor hazard',
  'Chemical hazard',
  'Sharp objects',
  'Heavy lifting'
]

// Methods
const addStep = () => {
  task.value.steps.push('')
}

const removeStep = (index) => {
  task.value.steps.splice(index, 1)
}

const addChemical = () => {
  task.value.chemicals.push({
    name: '',
    dilution: ''
  })
}

const removeChemical = (index) => {
  task.value.chemicals.splice(index, 1)
}

const addTool = () => {
  task.value.tools.push({
    name: '',
    colorCode: 'none'
  })
}

const removeTool = (index) => {
  task.value.tools.splice(index, 1)
}

const save = () => {
  if (form.value?.validate()) {
    // Generate unique ID if new task
    if (!task.value.id) {
      task.value.id = `custom-${Date.now()}`
    }
    
    // Set room
    task.value.room = props.room
    
    emit('save', { ...task.value })
    resetForm()
    dialog.value = false
  }
}

const cancel = () => {
  resetForm()
  dialog.value = false
}

const resetForm = () => {
  task.value = {
    name: '',
    description: '',
    frequency: 'WEEKLY',
    priority: 'medium',
    estimatedTime: {
      amateur: { min: 15, max: 20 },
      professional: { min: 10, max: 15 }
    },
    steps: [],
    chemicals: [],
    tools: [],
    safety: {
      ppe: [],
      warnings: []
    },
    room: '',
    isCustom: true
  }
  form.value?.resetValidation()
}

// Watch for editing task
watch(() => props.editingTask, (newTask) => {
  if (newTask) {
    task.value = JSON.parse(JSON.stringify(newTask))
  } else {
    resetForm()
  }
}, { immediate: true })
</script>

<style scoped>
.v-card {
  max-height: 90vh;
  overflow-y: auto;
}
</style>
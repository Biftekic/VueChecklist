<template>
  <v-container fluid class="pa-0">
    <v-card flat>
      <v-card-title class="text-h5 font-weight-bold">
        <v-icon class="mr-2">mdi-home-outline</v-icon>
        Property Details
      </v-card-title>
      
      <v-card-subtitle>
        Tell us about the property to clean
      </v-card-subtitle>

      <v-card-text>
        <v-form ref="form" v-model="valid">
          <!-- Industry Selection -->
          <div class="mb-6">
            <div class="text-subtitle-1 mb-3">Select Industry Type</div>
            <v-row dense>
              <v-col
                v-for="industry in industries"
                :key="industry.value"
                cols="6"
                sm="4"
                md="3"
              >
                <v-card
                  :color="selectedIndustry === industry.value ? industry.color : undefined"
                  :variant="selectedIndustry === industry.value ? 'flat' : 'outlined'"
                  class="pa-3 text-center cursor-pointer"
                  @click="selectedIndustry = industry.value"
                >
                  <v-icon
                    :color="selectedIndustry === industry.value ? 'white' : industry.color"
                    size="32"
                  >
                    {{ industry.icon }}
                  </v-icon>
                  <div 
                    class="text-caption mt-2"
                    :class="selectedIndustry === industry.value ? 'text-white' : ''"
                  >
                    {{ industry.name }}
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- Property Size -->
          <v-text-field
            v-model.number="propertySize"
            label="Property Size (m²)"
            type="number"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            :rules="[rules.required, rules.number]"
            prepend-inner-icon="mdi-ruler-square"
            suffix="m²"
          />
          
          <!-- Number of Floors -->
          <v-text-field
            v-model.number="numberOfFloors"
            label="Number of Floors"
            type="number"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            :rules="[rules.required, rules.number, rules.minFloors]"
            prepend-inner-icon="mdi-stairs"
          />
          
          <!-- Difficulty Modifiers -->
          <v-card variant="outlined" class="mb-4">
            <v-card-title class="text-subtitle-1">
              <v-icon size="small" class="mr-2">mdi-tune</v-icon>
              Difficulty Modifiers
            </v-card-title>
            <v-card-subtitle class="text-caption">
              These affect time estimates (Current multiplier: {{ timeMultiplier }}x)
            </v-card-subtitle>
            <v-card-text>
              <!-- Difficulty -->
              <div class="mb-4">
                <label class="text-body-2 mb-2 d-block">Cleaning Difficulty</label>
                <v-chip-group
                  v-model="difficulty"
                  selected-class="text-primary"
                  mandatory
                >
                  <v-chip value="Light" variant="outlined">Light (0.8x)</v-chip>
                  <v-chip value="Average" variant="outlined">Average (1.0x)</v-chip>
                  <v-chip value="Heavy" variant="outlined">Heavy (1.3x)</v-chip>
                </v-chip-group>
              </div>
              
              <!-- Client Expectations -->
              <div class="mb-4">
                <label class="text-body-2 mb-2 d-block">Client Expectations</label>
                <v-chip-group
                  v-model="expectations"
                  selected-class="text-primary"
                  mandatory
                >
                  <v-chip value="Very Reasonable" variant="outlined">Very Reasonable (0.9x)</v-chip>
                  <v-chip value="Reasonable" variant="outlined">Reasonable (1.0x)</v-chip>
                  <v-chip value="Demanding" variant="outlined">Demanding (1.2x)</v-chip>
                  <v-chip value="Very Demanding" variant="outlined">Very Demanding (1.4x)</v-chip>
                </v-chip-group>
              </div>
              
              <!-- Challenges -->
              <div class="mb-4">
                <label class="text-body-2 mb-2 d-block">Access/Layout Challenges</label>
                <v-chip-group
                  v-model="challenges"
                  selected-class="text-primary"
                  mandatory
                >
                  <v-chip value="Very Easy" variant="outlined">Very Easy (0.8x)</v-chip>
                  <v-chip value="Easy" variant="outlined">Easy (0.9x)</v-chip>
                  <v-chip value="Moderate" variant="outlined">Moderate (1.0x)</v-chip>
                  <v-chip value="Hard" variant="outlined">Hard (1.15x)</v-chip>
                  <v-chip value="Very Hard" variant="outlined">Very Hard (1.3x)</v-chip>
                </v-chip-group>
              </div>
            </v-card-text>
          </v-card>

          <!-- Navigation Buttons -->
          <v-row class="mt-6">
            <v-col>
              <v-btn
                color="primary"
                size="large"
                block
                :disabled="!valid || !selectedIndustry"
                @click="handleNext"
              >
                Next: Select Rooms
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
import { ref, computed, watch } from 'vue'
import { useChecklistStore } from '@/stores/checklist'
import { getIndustries } from '@/data/templates'

const emit = defineEmits(['next'])
const checklistStore = useChecklistStore()

// Form validation
const form = ref(null)
const valid = ref(false)

// Get industries from templates
const industries = getIndustries()

// Property details
const selectedIndustry = ref(checklistStore.currentChecklist?.industry || '')
const propertySize = ref(checklistStore.currentChecklist?.propertySize || '')
const numberOfFloors = ref(checklistStore.currentChecklist?.numberOfFloors || 1)

// Difficulty modifiers
const difficulty = ref(checklistStore.currentChecklist?.difficulty || 'Average')
const expectations = ref(checklistStore.currentChecklist?.expectations || 'Reasonable')
const challenges = ref(checklistStore.currentChecklist?.challenges || 'Moderate')

// Calculate time multiplier
const timeMultiplier = computed(() => {
  const difficultyMultipliers = {
    'Light': 0.8,
    'Average': 1.0,
    'Heavy': 1.3
  }
  
  const expectationsMultipliers = {
    'Very Reasonable': 0.9,
    'Reasonable': 1.0,
    'Demanding': 1.2,
    'Very Demanding': 1.4
  }
  
  const challengesMultipliers = {
    'Very Easy': 0.8,
    'Easy': 0.9,
    'Moderate': 1.0,
    'Hard': 1.15,
    'Very Hard': 1.3
  }
  
  const multiplier = 
    difficultyMultipliers[difficulty.value] *
    expectationsMultipliers[expectations.value] *
    challengesMultipliers[challenges.value]
  
  return multiplier.toFixed(2)
})

// Validation rules
const rules = {
  required: value => !!value || 'This field is required',
  number: value => !isNaN(value) && value > 0 || 'Must be a positive number',
  minFloors: value => value >= 1 || 'Must have at least 1 floor'
}

// Watch for changes and update store
watch([selectedIndustry, propertySize, numberOfFloors, difficulty, expectations, challenges], () => {
  if (valid.value) {
    checklistStore.updatePropertyDetails({
      industry: selectedIndustry.value,
      propertySize: propertySize.value,
      numberOfFloors: numberOfFloors.value,
      difficulty: difficulty.value,
      expectations: expectations.value,
      challenges: challenges.value
    })
  }
}, { deep: true })

// Handle next step
const handleNext = async () => {
  const validation = await form.value?.validate()
  if (validation?.valid && selectedIndustry.value) {
    // Save to store
    checklistStore.updatePropertyDetails({
      industry: selectedIndustry.value,
      propertySize: propertySize.value,
      numberOfFloors: numberOfFloors.value,
      difficulty: difficulty.value,
      expectations: expectations.value,
      challenges: challenges.value
    })
    
    emit('next')
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
  transition: all 0.2s;
}

.cursor-pointer:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.v-chip-group {
  flex-wrap: wrap;
}

.v-chip {
  margin: 4px;
}
</style>
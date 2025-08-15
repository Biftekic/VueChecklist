<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600"
  >
    <v-card>
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Time Adjustments</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="$emit('update:modelValue', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <!-- Current Time Summary -->
        <v-alert type="info" variant="tonal" class="mb-4">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-subtitle-2">Base Time</div>
              <div class="text-h5">{{ formatTime(baseTime) }}</div>
            </div>
            <v-icon size="large">mdi-arrow-right</v-icon>
            <div>
              <div class="text-subtitle-2">Adjusted Time</div>
              <div class="text-h5 text-primary">{{ formatTime(adjustedTime) }}</div>
            </div>
          </div>
          <v-divider class="my-2" />
          <div class="text-caption">
            Total Adjustment: 
            <strong :class="adjustmentPercent > 0 ? 'text-error' : 'text-success'">
              {{ adjustmentPercent > 0 ? '+' : '' }}{{ adjustmentPercent }}%
            </strong>
          </div>
        </v-alert>

        <!-- Property Condition -->
        <div class="mb-4">
          <div class="text-subtitle-1 mb-2">
            <v-icon start size="small">mdi-home-variant</v-icon>
            Property Condition
          </div>
          <v-btn-toggle
            v-model="localAdjustments.condition"
            mandatory
            color="primary"
            variant="outlined"
            divided
            class="w-100"
          >
            <v-btn
              v-for="option in conditionOptions"
              :key="option.value"
              :value="option.value"
              class="flex-grow-1"
            >
              <div>
                <div>{{ option.label }}</div>
                <div class="text-caption">{{ option.description }}</div>
                <v-chip size="x-small" :color="option.color" variant="tonal" class="mt-1">
                  {{ option.modifier > 1 ? '+' : '' }}{{ Math.round((option.modifier - 1) * 100) }}%
                </v-chip>
              </div>
            </v-btn>
          </v-btn-toggle>
        </div>

        <!-- Team Size -->
        <div class="mb-4">
          <div class="text-subtitle-1 mb-2">
            <v-icon start size="small">mdi-account-group</v-icon>
            Team Size
          </div>
          <v-btn-toggle
            v-model="localAdjustments.teamSize"
            mandatory
            color="primary"
            variant="outlined"
            divided
            class="w-100"
          >
            <v-btn
              v-for="option in teamSizeOptions"
              :key="option.value"
              :value="option.value"
              class="flex-grow-1"
            >
              <div>
                <div>{{ option.label }}</div>
                <div class="text-caption">{{ option.description }}</div>
                <v-chip size="x-small" :color="option.color" variant="tonal" class="mt-1">
                  {{ option.modifier < 1 ? '-' : '' }}{{ Math.abs(Math.round((1 - option.modifier) * 100)) }}%
                </v-chip>
              </div>
            </v-btn>
          </v-btn-toggle>
        </div>

        <!-- Equipment Availability -->
        <div class="mb-4">
          <div class="text-subtitle-1 mb-2">
            <v-icon start size="small">mdi-tools</v-icon>
            Equipment Availability
          </div>
          <v-btn-toggle
            v-model="localAdjustments.equipment"
            mandatory
            color="primary"
            variant="outlined"
            divided
            class="w-100"
          >
            <v-btn
              v-for="option in equipmentOptions"
              :key="option.value"
              :value="option.value"
              class="flex-grow-1"
            >
              <div>
                <div>{{ option.label }}</div>
                <div class="text-caption">{{ option.description }}</div>
                <v-chip size="x-small" :color="option.color" variant="tonal" class="mt-1">
                  {{ option.modifier > 1 ? '+' : '' }}{{ Math.round((option.modifier - 1) * 100) }}%
                </v-chip>
              </div>
            </v-btn>
          </v-btn-toggle>
        </div>

        <!-- Experience Level -->
        <div class="mb-4">
          <div class="text-subtitle-1 mb-2">
            <v-icon start size="small">mdi-star</v-icon>
            Experience Level
          </div>
          <v-btn-toggle
            v-model="localAdjustments.experience"
            mandatory
            color="primary"
            variant="outlined"
            divided
            class="w-100"
          >
            <v-btn
              v-for="option in experienceOptions"
              :key="option.value"
              :value="option.value"
              class="flex-grow-1"
            >
              <div>
                <div>{{ option.label }}</div>
                <div class="text-caption">{{ option.description }}</div>
                <v-chip size="x-small" :color="option.color" variant="tonal" class="mt-1">
                  {{ option.modifier > 1 ? '+' : '' }}{{ option.modifier < 1 ? '-' : '' }}
                  {{ Math.abs(Math.round((option.modifier - 1) * 100)) }}%
                </v-chip>
              </div>
            </v-btn>
          </v-btn-toggle>
        </div>

        <!-- Advanced Settings -->
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon start>mdi-cog</v-icon>
              Advanced Settings
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <!-- Custom Multiplier -->
              <div class="mb-3">
                <v-slider
                  v-model="localAdjustments.customMultiplier"
                  :min="0.5"
                  :max="2"
                  :step="0.1"
                  thumb-label
                  label="Custom Multiplier"
                  color="primary"
                >
                  <template v-slot:append>
                    <v-text-field
                      v-model.number="localAdjustments.customMultiplier"
                      type="number"
                      style="width: 80px"
                      density="compact"
                      hide-details
                      variant="outlined"
                    />
                  </template>
                </v-slider>
              </div>

              <!-- Historical Data -->
              <v-alert type="info" variant="tonal" density="compact">
                <div class="text-caption">
                  <strong>Historical Performance:</strong>
                  <div>Average actual time: 115% of estimates</div>
                  <div>Accuracy trend: Improving (±5% last month)</div>
                  <div>
                    <v-btn
                      size="x-small"
                      variant="text"
                      color="primary"
                      class="mt-1"
                      @click="applyHistoricalAdjustment"
                    >
                      Apply Historical Adjustment (+15%)
                    </v-btn>
                  </div>
                </div>
              </v-alert>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- Breakdown -->
        <v-divider class="my-4" />
        <div class="text-caption">
          <div class="text-overline">Adjustment Breakdown</div>
          <v-list density="compact">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon size="small">mdi-home-variant</v-icon>
              </template>
              <v-list-item-title>
                Condition: {{ getConditionLabel }}
              </v-list-item-title>
              <template v-slot:append>
                <span :class="getConditionModifier > 1 ? 'text-error' : 'text-grey'">
                  {{ getConditionModifier > 1 ? '+' : '' }}{{ Math.round((getConditionModifier - 1) * 100) }}%
                </span>
              </template>
            </v-list-item>
            
            <v-list-item>
              <template v-slot:prepend>
                <v-icon size="small">mdi-account-group</v-icon>
              </template>
              <v-list-item-title>
                Team: {{ getTeamLabel }}
              </v-list-item-title>
              <template v-slot:append>
                <span :class="getTeamModifier < 1 ? 'text-success' : 'text-grey'">
                  {{ getTeamModifier < 1 ? '-' : '' }}{{ Math.abs(Math.round((1 - getTeamModifier) * 100)) }}%
                </span>
              </template>
            </v-list-item>
            
            <v-list-item>
              <template v-slot:prepend>
                <v-icon size="small">mdi-tools</v-icon>
              </template>
              <v-list-item-title>
                Equipment: {{ getEquipmentLabel }}
              </v-list-item-title>
              <template v-slot:append>
                <span :class="getEquipmentModifier !== 1 ? (getEquipmentModifier > 1 ? 'text-error' : 'text-success') : 'text-grey'">
                  {{ getEquipmentModifier > 1 ? '+' : '' }}{{ Math.round((getEquipmentModifier - 1) * 100) }}%
                </span>
              </template>
            </v-list-item>
            
            <v-list-item>
              <template v-slot:prepend>
                <v-icon size="small">mdi-star</v-icon>
              </template>
              <v-list-item-title>
                Experience: {{ getExperienceLabel }}
              </v-list-item-title>
              <template v-slot:append>
                <span :class="getExperienceModifier !== 1 ? (getExperienceModifier > 1 ? 'text-error' : 'text-success') : 'text-grey'">
                  {{ getExperienceModifier > 1 ? '+' : '' }}
                  {{ getExperienceModifier < 1 ? '-' : '' }}
                  {{ Math.abs(Math.round((getExperienceModifier - 1) * 100)) }}%
                </span>
              </template>
            </v-list-item>
            
            <v-list-item v-if="localAdjustments.customMultiplier !== 1">
              <template v-slot:prepend>
                <v-icon size="small">mdi-cog</v-icon>
              </template>
              <v-list-item-title>
                Custom Multiplier
              </v-list-item-title>
              <template v-slot:append>
                <span class="text-primary">
                  ×{{ localAdjustments.customMultiplier }}
                </span>
              </template>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn
          variant="text"
          @click="resetAdjustments"
        >
          Reset to Defaults
        </v-btn>
        <v-spacer />
        <v-btn
          variant="text"
          @click="$emit('update:modelValue', false)"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="applyAdjustments"
        >
          Apply Adjustments
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  baseTime: {
    type: Number,
    default: 0
  },
  adjustments: {
    type: Object,
    default: () => ({
      condition: 1.0,
      teamSize: 1.0,
      equipment: 1.0,
      experience: 1.0,
      customMultiplier: 1.0
    })
  }
})

const emit = defineEmits(['update:modelValue', 'apply'])

// State
const localAdjustments = ref({ ...props.adjustments })

// Options
const conditionOptions = [
  { value: 0.7, label: 'Light', description: 'Recently cleaned', modifier: 0.7, color: 'success' },
  { value: 1.0, label: 'Standard', description: 'Regular maintenance', modifier: 1.0, color: 'grey' },
  { value: 1.5, label: 'Deep', description: 'Thorough cleaning', modifier: 1.5, color: 'warning' },
  { value: 2.0, label: 'Heavy', description: 'First-time/neglected', modifier: 2.0, color: 'error' }
]

const teamSizeOptions = [
  { value: 1.0, label: 'Solo', description: '1 cleaner', modifier: 1.0, color: 'grey' },
  { value: 0.75, label: '2-Person', description: 'Efficient team', modifier: 0.75, color: 'success' },
  { value: 0.6, label: '3+ Team', description: 'Large crew', modifier: 0.6, color: 'primary' }
]

const equipmentOptions = [
  { value: 1.2, label: 'Basic', description: 'Manual tools only', modifier: 1.2, color: 'warning' },
  { value: 1.0, label: 'Standard', description: 'Normal equipment', modifier: 1.0, color: 'grey' },
  { value: 0.85, label: 'Professional', description: 'Commercial grade', modifier: 0.85, color: 'success' }
]

const experienceOptions = [
  { value: 1.3, label: 'Trainee', description: 'Learning phase', modifier: 1.3, color: 'warning' },
  { value: 1.0, label: 'Standard', description: 'Competent staff', modifier: 1.0, color: 'grey' },
  { value: 0.8, label: 'Expert', description: 'Highly skilled', modifier: 0.8, color: 'success' }
]

// Computed
const adjustedTime = computed(() => {
  const multiplier = 
    localAdjustments.value.condition *
    localAdjustments.value.teamSize *
    localAdjustments.value.equipment *
    localAdjustments.value.experience *
    localAdjustments.value.customMultiplier
  
  return Math.round(props.baseTime * multiplier)
})

const adjustmentPercent = computed(() => {
  const diff = adjustedTime.value - props.baseTime
  if (props.baseTime === 0) return 0
  return Math.round((diff / props.baseTime) * 100)
})

const getConditionLabel = computed(() => {
  return conditionOptions.find(o => o.value === localAdjustments.value.condition)?.label || 'Standard'
})

const getConditionModifier = computed(() => {
  return localAdjustments.value.condition
})

const getTeamLabel = computed(() => {
  return teamSizeOptions.find(o => o.value === localAdjustments.value.teamSize)?.label || 'Solo'
})

const getTeamModifier = computed(() => {
  return localAdjustments.value.teamSize
})

const getEquipmentLabel = computed(() => {
  return equipmentOptions.find(o => o.value === localAdjustments.value.equipment)?.label || 'Standard'
})

const getEquipmentModifier = computed(() => {
  return localAdjustments.value.equipment
})

const getExperienceLabel = computed(() => {
  return experienceOptions.find(o => o.value === localAdjustments.value.experience)?.label || 'Standard'
})

const getExperienceModifier = computed(() => {
  return localAdjustments.value.experience
})

// Methods
const formatTime = (minutes) => {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}

const resetAdjustments = () => {
  localAdjustments.value = {
    condition: 1.0,
    teamSize: 1.0,
    equipment: 1.0,
    experience: 1.0,
    customMultiplier: 1.0
  }
}

const applyHistoricalAdjustment = () => {
  localAdjustments.value.customMultiplier = 1.15
}

const applyAdjustments = () => {
  emit('apply', { ...localAdjustments.value })
  emit('update:modelValue', false)
}

// Watch for prop changes
watch(() => props.adjustments, (newVal) => {
  localAdjustments.value = { ...newVal }
}, { deep: true })
</script>

<style scoped>
.v-btn-toggle .v-btn {
  min-height: 80px;
}
</style>
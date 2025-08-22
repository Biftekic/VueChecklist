<template>
  <v-card flat class="mb-2">
    <v-card-title class="text-h6">
      <v-icon class="mr-2">mdi-home</v-icon>
      Property Details
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            :model-value="propertyType"
            @update:model-value="$emit('update:propertyType', $event)"
            :items="propertyTypes"
            label="Property Type"
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            :model-value="propertySize"
            @update:model-value="$emit('update:propertySize', $event)"
            :items="propertySizes"
            label="Property Size"
            variant="outlined"
            density="compact"
          />
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            :model-value="cleaningType"
            @update:model-value="$emit('update:cleaningType', $event)"
            :items="cleaningTypes"
            label="Cleaning Type"
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            :model-value="frequency"
            @update:model-value="$emit('update:frequency', $event)"
            :items="frequencies"
            label="Frequency"
            variant="outlined"
            density="compact"
          />
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            :model-value="difficulty"
            @update:model-value="$emit('update:difficulty', $event)"
            :items="difficulties"
            label="Difficulty Level"
            variant="outlined"
            density="compact"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="numberOfFloors"
            @update:model-value="$emit('update:numberOfFloors', Number($event))"
            label="Number of Floors"
            type="number"
            variant="outlined"
            density="compact"
            min="1"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  propertyType?: string
  propertySize?: string
  cleaningType?: string
  frequency?: string
  difficulty?: string
  numberOfFloors?: number
}>()

defineEmits<{
  'update:propertyType': [value: string]
  'update:propertySize': [value: string]
  'update:cleaningType': [value: string]
  'update:frequency': [value: string]
  'update:difficulty': [value: string]
  'update:numberOfFloors': [value: number]
}>()

// Options
const propertyTypes = [
  'Residential',
  'Commercial',
  'Office',
  'Retail',
  'Industrial'
]

const propertySizes = [
  'Small (< 1000 sq ft)',
  'Medium (1000-2500 sq ft)',
  'Large (2500-5000 sq ft)',
  'Extra Large (> 5000 sq ft)'
]

const cleaningTypes = [
  'Regular Cleaning',
  'Deep Cleaning',
  'Move-in/Move-out',
  'Post-construction',
  'Seasonal'
]

const frequencies = [
  'One-time',
  'Weekly',
  'Bi-weekly',
  'Monthly',
  'Quarterly',
  'As needed'
]

const difficulties = [
  'Light',
  'Average',
  'Heavy'
]
</script>
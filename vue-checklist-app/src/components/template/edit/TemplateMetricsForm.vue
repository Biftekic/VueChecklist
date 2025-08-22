<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-text-field
        :model-value="rooms"
        @update:model-value="$emit('update:rooms', Number($event))"
        label="Number of Rooms"
        type="number"
        prepend-icon="mdi-door"
        :rules="[v => Number(v) > 0 || 'Must have at least 1 room']"
      />
    </v-col>
    
    <v-col cols="12" sm="6">
      <v-text-field
        :model-value="estimatedTime"
        @update:model-value="$emit('update:estimatedTime', Number($event))"
        label="Estimated Time (minutes)"
        type="number"
        prepend-icon="mdi-clock-outline"
        :rules="[v => Number(v) > 0 || 'Time must be greater than 0']"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
interface Props {
  rooms: number
  estimatedTime: number
}

defineProps<Props>()

defineEmits<{
  'update:rooms': [value: number]
  'update:estimatedTime': [value: number]
}>()
</script>
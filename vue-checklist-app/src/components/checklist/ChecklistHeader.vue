<template>
  <v-card flat class="mb-2">
    <v-card-text class="pb-2">
      <div class="d-flex justify-space-between align-center mb-2">
        <div>
          <h2 class="text-h5 font-weight-bold">{{ checklist.name || 'Untitled Checklist' }}</h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Created {{ formatDate(checklist.createdAt) }}
          </p>
        </div>
        <v-chip :color="getStatusColor(checklist.status)" variant="tonal">
          {{ checklist.status || 'Pending' }}
        </v-chip>
      </div>
      
      <!-- Quick Stats -->
      <v-row class="mt-3">
        <v-col cols="3" class="text-center">
          <div class="text-h6 font-weight-bold">{{ stats.completedTasks }}/{{ stats.totalTasks }}</div>
          <div class="text-caption">Tasks</div>
        </v-col>
        <v-col cols="3" class="text-center">
          <div class="text-h6 font-weight-bold">{{ stats.completionPercentage }}%</div>
          <div class="text-caption">Complete</div>
        </v-col>
        <v-col cols="3" class="text-center">
          <div class="text-h6 font-weight-bold">{{ stats.formattedTotalTime }}</div>
          <div class="text-caption">Est. Time</div>
        </v-col>
        <v-col cols="3" class="text-center">
          <div class="text-h6 font-weight-bold">{{ stats.roomCount }}</div>
          <div class="text-caption">Rooms</div>
        </v-col>
      </v-row>
      
      <!-- Progress Bar -->
      <v-progress-linear
        v-if="stats.totalTasks > 0"
        :model-value="stats.completionPercentage"
        color="primary"
        height="8"
        rounded
        class="mt-3"
      />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { Checklist } from '@/stores/checklistStore'

interface ChecklistStats {
  completedTasks: number
  totalTasks: number
  completionPercentage: number
  formattedTotalTime: string
  roomCount: number
}

defineProps<{
  checklist: Checklist
  stats: ChecklistStats
}>()

function formatDate(date: Date | string | undefined): string {
  if (!date) return 'Unknown'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

function getStatusColor(status: string | undefined): string {
  switch (status) {
    case 'active': return 'primary'
    case 'completed': return 'success'
    case 'archived': return 'grey'
    default: return 'warning'
  }
}
</script>
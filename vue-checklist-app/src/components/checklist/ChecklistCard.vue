<template>
  <v-card 
    flat 
    elevation="1" 
    class="checklist-card mb-2"
    @click="$emit('click')"
    :class="{ 'checklist-card--clickable': !readonly }"
  >
    <v-card-text class="pa-3">
      <div class="d-flex justify-space-between align-start mb-2">
        <div class="flex-grow-1">
          <h4 class="text-body-1 font-weight-medium">
            {{ checklist.name || 'Unnamed Checklist' }}
          </h4>
          <p class="text-caption text-medium-emphasis mb-0">
            {{ checklist.templateName || 'Custom Template' }}
          </p>
        </div>
        
        <!-- Action Menu -->
        <v-menu v-if="!readonly">
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              variant="text"
              size="small"
              v-bind="props"
              @click.stop
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list density="compact">
            <v-list-item @click.stop="$emit('click')">
              <v-list-item-title>
                <v-icon size="small" class="mr-2">mdi-eye</v-icon>
                View
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click.stop="$emit('edit')">
              <v-list-item-title>
                <v-icon size="small" class="mr-2">mdi-pencil</v-icon>
                Edit
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click.stop="$emit('duplicate')">
              <v-list-item-title>
                <v-icon size="small" class="mr-2">mdi-content-copy</v-icon>
                Duplicate
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click.stop="$emit('export')">
              <v-list-item-title>
                <v-icon size="small" class="mr-2">mdi-file-pdf-box</v-icon>
                Export PDF
              </v-list-item-title>
            </v-list-item>
            <v-divider />
            <v-list-item @click.stop="$emit('delete')" class="text-error">
              <v-list-item-title>
                <v-icon size="small" class="mr-2">mdi-delete</v-icon>
                Delete
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <!-- Status Badge -->
      <v-chip
        v-if="checklist.status"
        :color="getStatusColor(checklist.status)"
        size="x-small"
        class="mb-2"
      >
        {{ checklist.status }}
      </v-chip>

      <!-- Client Info -->
      <div v-if="checklist.client?.name" class="mb-2">
        <v-icon size="14" class="mr-1">mdi-account</v-icon>
        <span class="text-caption">{{ checklist.client.name }}</span>
      </div>

      <!-- Progress Bar -->
      <v-progress-linear
        v-if="showProgress"
        :model-value="checklist.completionPercentage || 0"
        :color="getProgressColor(checklist.completionPercentage)"
        height="4"
        rounded
        class="mb-2"
      />

      <!-- Meta Information -->
      <div class="d-flex justify-space-between align-center">
        <div>
          <v-icon size="14" class="mr-1">mdi-clock-outline</v-icon>
          <span class="text-caption text-medium-emphasis">
            {{ formatDate(checklist.createdAt) }}
          </span>
        </div>
        
        <!-- Task Count -->
        <div v-if="checklist.tasks">
          <v-chip size="x-small" variant="text">
            <v-icon size="14" class="mr-1">mdi-checkbox-marked-outline</v-icon>
            {{ completedTasks }}/{{ totalTasks }}
          </v-chip>
        </div>
        
        <!-- Duration -->
        <div v-else-if="checklist.totalDuration">
          <v-chip size="x-small" color="primary" variant="tonal">
            {{ formatDuration(checklist.totalDuration) }}
          </v-chip>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  checklist: {
    type: Object,
    required: true
  },
  readonly: {
    type: Boolean,
    default: false
  },
  showProgress: {
    type: Boolean,
    default: true
  }
})

defineEmits(['click', 'edit', 'duplicate', 'export', 'delete'])

// Computed
const totalTasks = computed(() => {
  return props.checklist.tasks?.length || 0
})

const completedTasks = computed(() => {
  return props.checklist.tasks?.filter(t => t.completed).length || 0
})

// Methods
const getStatusColor = (status) => {
  const colors = {
    draft: 'grey',
    active: 'primary',
    completed: 'success',
    archived: 'warning'
  }
  return colors[status] || 'grey'
}

const getProgressColor = (percentage) => {
  if (percentage >= 100) return 'success'
  if (percentage >= 75) return 'primary'
  if (percentage >= 50) return 'warning'
  return 'error'
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (d.toDateString() === today.toDateString()) {
    return 'Today ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (d.toDateString() === yesterday.toDateString()) {
    return 'Yesterday ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else {
    return d.toLocaleDateString()
  }
}

const formatDuration = (minutes) => {
  if (!minutes) return '0 min'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins} min`
}
</script>

<style scoped>
.checklist-card {
  transition: all 0.2s ease;
}

.checklist-card--clickable {
  cursor: pointer;
}

.checklist-card--clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
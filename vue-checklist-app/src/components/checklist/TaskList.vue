<template>
  <v-list class="pa-0">
    <template v-for="(room, roomIndex) in organizedTasks" :key="room.name">
      <!-- Room Header -->
      <v-list-subheader v-if="room.tasks.length > 0" class="room-header">
        <div class="d-flex align-center justify-space-between w-100">
          <div class="d-flex align-center">
            <v-icon small class="mr-2">mdi-door</v-icon>
            <span class="font-weight-medium">{{ room.name }}</span>
            <v-chip size="x-small" class="ml-2" variant="tonal">
              {{ room.tasks.length }} tasks
            </v-chip>
          </div>
          <div class="text-caption">
            {{ formatTime(room.totalTime) }}
          </div>
        </div>
      </v-list-subheader>
      
      <!-- Tasks in Room -->
      <v-list-item
        v-for="(task, taskIndex) in room.tasks"
        :key="`${roomIndex}-${taskIndex}`"
        class="task-item pl-8"
        :class="{ 'task-completed': task.completed }"
      >
        <template #prepend>
          <v-checkbox
            :model-value="task.completed"
            @update:model-value="$emit('toggle-task', task)"
            color="primary"
            hide-details
            density="compact"
          />
        </template>
        
        <v-list-item-title>
          {{ task.name }}
        </v-list-item-title>
        
        <v-list-item-subtitle v-if="task.description">
          {{ task.description }}
        </v-list-item-subtitle>
        
        <template #append>
          <div class="d-flex align-center gap-2">
            <v-chip 
              v-if="task.priority" 
              :color="getPriorityColor(task.priority)"
              size="small"
              variant="tonal"
            >
              {{ task.priority }}
            </v-chip>
            <span class="text-caption text-medium-emphasis">
              {{ task.adjustedTime || task.estimatedTime }} min
            </span>
            <v-btn
              icon="mdi-chevron-down"
              size="small"
              variant="text"
              @click="toggleTaskDetails(roomIndex, taskIndex)"
            />
          </div>
        </template>
      </v-list-item>
      
      <!-- Task Details (Expandable) -->
      <template v-for="(task, taskIndex) in room.tasks" :key="`${roomIndex}-${taskIndex}-details`">
        <v-expand-transition>
          <div 
            v-if="expandedTasks[`${roomIndex}-${taskIndex}`]"
            class="task-details pl-12 pr-4 py-2"
          >
          <v-row>
            <v-col v-if="task.supplies?.length" cols="12" md="6">
              <div class="text-caption font-weight-medium mb-1">Supplies:</div>
              <v-chip 
                v-for="supply in task.supplies" 
                :key="supply"
                size="small"
                class="mr-1 mb-1"
              >
                {{ supply }}
              </v-chip>
            </v-col>
            <v-col v-if="task.instructions?.length" cols="12" md="6">
              <div class="text-caption font-weight-medium mb-1">Instructions:</div>
              <ol class="text-body-2 pl-4">
                <li v-for="instruction in task.instructions" :key="instruction">
                  {{ instruction }}
                </li>
              </ol>
            </v-col>
          </v-row>
        </div>
        </v-expand-transition>
      </template>
      
      <v-divider v-if="roomIndex < organizedTasks.length - 1" />
    </template>
  </v-list>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import type { Task } from '@/stores/checklistStore'

interface OrganizedRoom {
  name: string
  tasks: Task[]
  totalTime: number
}

defineProps<{
  organizedTasks: OrganizedRoom[]
}>()

defineEmits<{
  'toggle-task': [task: Task]
}>()

const expandedTasks = ref<Record<string, boolean>>({})

function toggleTaskDetails(roomIndex: number, taskIndex: number): void {
  const key = `${roomIndex}-${taskIndex}`
  expandedTasks.value[key] = !expandedTasks.value[key]
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high': return 'error'
    case 'medium': return 'warning'
    case 'low': return 'success'
    default: return 'default'
  }
}
</script>

<style scoped>
.room-header {
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  font-size: 0.875rem;
}

.task-item {
  border-left: 2px solid transparent;
  transition: all 0.2s;
}

.task-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
  border-left-color: rgb(var(--v-theme-primary));
}

.task-completed {
  opacity: 0.6;
}

.task-completed .v-list-item-title {
  text-decoration: line-through;
}

.task-details {
  background-color: rgba(var(--v-theme-surface-variant), 0.3);
  border-left: 2px solid rgb(var(--v-theme-primary));
}
</style>
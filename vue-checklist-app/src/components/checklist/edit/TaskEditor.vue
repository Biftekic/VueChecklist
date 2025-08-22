<template>
  <v-card flat class="mb-2">
    <v-card-title class="text-h6">
      <v-icon class="mr-2">mdi-clipboard-list</v-icon>
      Tasks
      <v-spacer />
      <v-chip size="small" color="primary" variant="tonal">
        {{ tasks.length }} tasks
      </v-chip>
    </v-card-title>
    
    <v-card-text>
      <!-- Add Task Button -->
      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-plus"
        class="mb-3"
        @click="addTask"
      >
        Add Task
      </v-btn>
      
      <!-- Task List -->
      <v-list class="pa-0">
        <template v-for="(task, index) in tasks" :key="task.id || index">
          <v-list-item class="px-0">
            <v-row align="center">
              <v-col cols="12" md="5">
                <v-text-field
                  :model-value="task.name"
                  @update:model-value="updateTask(index, 'name', $event)"
                  label="Task Name"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              
              <v-col cols="6" md="2">
                <v-text-field
                  :model-value="task.estimatedTime"
                  @update:model-value="updateTask(index, 'estimatedTime', Number($event))"
                  label="Time (min)"
                  type="number"
                  variant="outlined"
                  density="compact"
                  hide-details
                  min="1"
                />
              </v-col>
              
              <v-col cols="6" md="2">
                <v-select
                  :model-value="task.priority"
                  @update:model-value="updateTask(index, 'priority', $event)"
                  :items="priorities"
                  label="Priority"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              
              <v-col cols="6" md="2">
                <v-select
                  :model-value="task.roomId"
                  @update:model-value="updateTask(index, 'roomId', $event)"
                  :items="rooms"
                  label="Room"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </v-col>
              
              <v-col cols="6" md="1" class="text-center">
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="removeTask(index)"
                />
              </v-col>
            </v-row>
            
            <!-- Expandable Details -->
            <v-expand-transition>
              <div v-if="expandedTasks[index]" class="mt-2">
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      :model-value="task.description"
                      @update:model-value="updateTask(index, 'description', $event)"
                      label="Description"
                      variant="outlined"
                      density="compact"
                      rows="2"
                      hide-details
                    />
                  </v-col>
                </v-row>
              </div>
            </v-expand-transition>
            
            <template #append>
              <v-btn
                :icon="expandedTasks[index] ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                size="small"
                variant="text"
                @click="toggleExpand(index)"
              />
            </template>
          </v-list-item>
          
          <v-divider v-if="index < tasks.length - 1" />
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from '@/stores/checklistStore'

const props = defineProps<{
  tasks: Task[]
  rooms: string[]
}>()

const emit = defineEmits<{
  'update:tasks': [value: Task[]]
}>()

const expandedTasks = ref<Record<number, boolean>>({})
const priorities = ['low', 'medium', 'high']

function addTask() {
  const newTask: Task = {
    id: `task-${Date.now()}`,
    name: '',
    estimatedTime: 15,
    priority: 'medium',
    roomId: props.rooms[0] || 'General',
    completed: false
  }
  
  emit('update:tasks', [...props.tasks, newTask])
}

function updateTask(index: number, field: keyof Task, value: any) {
  const updatedTasks = [...props.tasks]
  updatedTasks[index] = {
    ...updatedTasks[index],
    [field]: value
  }
  emit('update:tasks', updatedTasks)
}

function removeTask(index: number) {
  const updatedTasks = props.tasks.filter((_, i) => i !== index)
  emit('update:tasks', updatedTasks)
}

function toggleExpand(index: number) {
  expandedTasks.value[index] = !expandedTasks.value[index]
}
</script>
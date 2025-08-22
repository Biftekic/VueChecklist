<template>
  <div>
    <v-divider class="my-4" />
    
    <h3 class="text-h6 mb-3">
      <v-icon left>mdi-checkbox-marked-outline</v-icon>
      Template Tasks
    </h3>
    
    <v-alert type="info" variant="tonal" class="mb-4">
      Define the tasks that will be included when this template is used.
      You can add rooms and specific tasks for each room.
    </v-alert>

    <v-card variant="outlined" class="mb-4">
      <v-card-text>
        <!-- Add Room Section -->
        <div class="d-flex align-center mb-3">
          <v-text-field
            v-model="newRoomName"
            label="Add Room"
            variant="outlined"
            density="compact"
            hide-details
            @keyup.enter="handleAddRoom"
          />
          <v-btn
            color="primary"
            class="ml-2"
            @click="handleAddRoom"
            :disabled="!newRoomName"
          >
            Add Room
          </v-btn>
        </div>

        <!-- Room List -->
        <v-expansion-panels v-if="hasRooms">
          <v-expansion-panel
            v-for="(tasks, room) in tasksByRoom"
            :key="room"
          >
            <v-expansion-panel-title>
              <div class="d-flex align-center justify-space-between flex-grow-1">
                <span>
                  <v-icon class="mr-2">mdi-door-open</v-icon>
                  {{ room }}
                </span>
                <v-chip size="small" class="mr-2">
                  {{ tasks.length }} tasks
                </v-chip>
              </div>
            </v-expansion-panel-title>
            
            <v-expansion-panel-text>
              <!-- Add Task Section -->
              <div class="d-flex align-center mb-2">
                <v-text-field
                  v-model="newTaskByRoom[room]"
                  :label="`Add task to ${room}`"
                  variant="outlined"
                  density="compact"
                  hide-details
                  @keyup.enter="handleAddTask(room)"
                />
                <v-btn
                  size="small"
                  color="primary"
                  class="ml-2"
                  @click="handleAddTask(room)"
                  :disabled="!newTaskByRoom[room]"
                >
                  Add
                </v-btn>
              </div>
              
              <!-- Task List -->
              <v-list density="compact">
                <v-list-item
                  v-for="(task, index) in tasks"
                  :key="index"
                >
                  <template v-slot:prepend>
                    <v-icon size="small">mdi-checkbox-blank-outline</v-icon>
                  </template>
                  <v-list-item-title>{{ task }}</v-list-item-title>
                  <template v-slot:append>
                    <v-btn
                      icon
                      size="small"
                      variant="text"
                      @click="handleRemoveTask(room, index)"
                    >
                      <v-icon size="small" color="error">mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
              
              <!-- Remove Room Button -->
              <v-btn
                color="error"
                variant="text"
                size="small"
                class="mt-2"
                @click="handleRemoveRoom(room)"
              >
                <v-icon left size="small">mdi-delete</v-icon>
                Remove Room
              </v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
        
        <v-alert
          v-else
          type="info"
          variant="tonal"
          class="mt-3"
        >
          No rooms added yet. Add rooms above to define tasks.
        </v-alert>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

interface Props {
  tasksByRoom: Record<string, string[]>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:tasksByRoom': [value: Record<string, string[]>]
}>()

const newRoomName = ref('')
const newTaskByRoom = reactive<Record<string, string>>({})

const hasRooms = computed(() => {
  return props.tasksByRoom && Object.keys(props.tasksByRoom).length > 0
})

const handleAddRoom = () => {
  if (newRoomName.value) {
    const updatedTasks = { ...props.tasksByRoom }
    if (!updatedTasks[newRoomName.value]) {
      updatedTasks[newRoomName.value] = []
      newTaskByRoom[newRoomName.value] = ''
    }
    emit('update:tasksByRoom', updatedTasks)
    newRoomName.value = ''
  }
}

const handleRemoveRoom = (room: string) => {
  const updatedTasks = { ...props.tasksByRoom }
  delete updatedTasks[room]
  delete newTaskByRoom[room]
  emit('update:tasksByRoom', updatedTasks)
}

const handleAddTask = (room: string) => {
  if (newTaskByRoom[room]) {
    const updatedTasks = { ...props.tasksByRoom }
    updatedTasks[room] = [...updatedTasks[room], newTaskByRoom[room]]
    emit('update:tasksByRoom', updatedTasks)
    newTaskByRoom[room] = ''
  }
}

const handleRemoveTask = (room: string, index: number) => {
  const updatedTasks = { ...props.tasksByRoom }
  updatedTasks[room] = [...updatedTasks[room]]
  updatedTasks[room].splice(index, 1)
  emit('update:tasksByRoom', updatedTasks)
}
</script>

<style scoped>
.v-expansion-panel-title {
  padding: 12px 16px;
}

.v-expansion-panel-text {
  padding: 16px;
}
</style>
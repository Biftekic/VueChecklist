<template>
  <v-container fluid class="pa-0">
    <v-card flat>
      <v-card-title class="text-h5 font-weight-bold">
        <v-icon class="mr-2">mdi-format-list-checks</v-icon>
        Select Tasks for Each Room
      </v-card-title>
      
      <v-card-subtitle>
        Choose tasks to include in your checklist
      </v-card-subtitle>

      <v-card-text>
        <!-- Search Bar -->
        <v-text-field
          v-model="searchQuery"
          label="Search tasks..."
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-magnify"
          clearable
          class="mb-4"
        />

        <!-- Summary -->
        <v-alert
          type="info"
          variant="tonal"
          density="compact"
          class="mb-4"
        >
          <div class="d-flex justify-space-between">
            <span>
              <strong>{{ totalSelectedTasks }}</strong> tasks selected
            </span>
            <span>
              Estimated time: <strong>{{ formattedTotalTime }}</strong>
            </span>
          </div>
        </v-alert>

        <!-- Room Tabs -->
        <v-tabs
          v-model="activeRoom"
          color="primary"
          class="mb-4"
        >
          <v-tab
            v-for="(room, index) in selectedRooms"
            :key="index"
            :value="index"
          >
            {{ room.name }}
            <v-chip
              size="x-small"
              class="ml-2"
              :color="getSelectedTasksForRoom(room).length > 0 ? 'primary' : 'default'"
            >
              {{ getSelectedTasksForRoom(room).length }}
            </v-chip>
          </v-tab>
        </v-tabs>

        <!-- Task Selection for Active Room -->
        <v-window v-model="activeRoom">
          <v-window-item
            v-for="(room, roomIndex) in selectedRooms"
            :key="roomIndex"
            :value="roomIndex"
          >
            <div v-if="room.isCustom" class="text-center py-8">
              <v-icon size="64" color="grey">mdi-playlist-plus</v-icon>
              <p class="text-h6 mt-4">Custom Room: {{ room.name }}</p>
              <p class="text-body-2 text-grey">Add custom tasks below</p>
              
              <!-- Custom Task Input -->
              <v-card variant="outlined" class="mt-4">
                <v-card-text>
                  <v-row align="center">
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="customTaskName"
                        label="Task name"
                        variant="outlined"
                        density="compact"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model.number="customTaskTime"
                        label="Time (min)"
                        type="number"
                        variant="outlined"
                        density="compact"
                        hide-details
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-btn
                        color="primary"
                        block
                        @click="addCustomTask(room)"
                        :disabled="!customTaskName || !customTaskTime"
                      >
                        Add Task
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- Custom Tasks List -->
              <v-list v-if="customTasks[room.name]?.length > 0" class="mt-4">
                <v-list-item
                  v-for="(task, idx) in customTasks[room.name]"
                  :key="idx"
                >
                  <template v-slot:prepend>
                    <v-checkbox-btn
                      :model-value="true"
                      @click="removeCustomTask(room.name, idx)"
                    />
                  </template>
                  <v-list-item-title>{{ task.name }}</v-list-item-title>
                  <template v-slot:append>
                    <span class="text-caption">{{ task.estimatedTime }} min</span>
                  </template>
                </v-list-item>
              </v-list>
            </div>

            <div v-else>
              <!-- Quick Actions -->
              <v-row class="mb-3">
                <v-col cols="auto">
                  <v-btn
                    size="small"
                    variant="outlined"
                    @click="selectAllInRoom(room)"
                  >
                    Select All
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    size="small"
                    variant="outlined"
                    @click="deselectAllInRoom(room)"
                  >
                    Deselect All
                  </v-btn>
                </v-col>
              </v-row>

              <!-- Tasks List -->
              <v-list>
                <v-list-item
                  v-for="(task, taskIndex) in getFilteredTasks(room)"
                  :key="taskIndex"
                  @click="toggleTask(room, task)"
                >
                  <template v-slot:prepend>
                    <v-checkbox-btn
                      :model-value="isTaskSelected(room, task)"
                      @click.stop="toggleTask(room, task)"
                    />
                  </template>
                  
                  <v-list-item-title>
                    {{ task.name }}
                  </v-list-item-title>
                  
                  <v-list-item-subtitle>
                    <v-chip
                      size="x-small"
                      class="mr-1"
                      variant="outlined"
                    >
                      {{ getAdjustedTime(task.estimatedTime) }} min
                    </v-chip>
                    <span v-if="task.chemicals?.length">
                      <v-icon size="x-small">mdi-beaker</v-icon>
                      {{ task.chemicals.join(', ') }}
                    </span>
                    <span v-if="task.tools?.length" class="ml-2">
                      <v-icon size="x-small">mdi-tools</v-icon>
                      {{ task.tools.join(', ') }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </div>
          </v-window-item>
        </v-window>

        <!-- Navigation Buttons -->
        <v-row class="mt-6">
          <v-col cols="6">
            <v-btn
              variant="outlined"
              size="large"
              block
              @click="$emit('back')"
            >
              <v-icon start>mdi-arrow-left</v-icon>
              Back
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="primary"
              size="large"
              block
              :disabled="totalSelectedTasks === 0"
              @click="handleNext"
            >
              Next: Client Info
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useChecklistStore } from '@/stores/checklist'
import Fuse from 'fuse.js'

const emit = defineEmits(['next', 'back'])
const checklistStore = useChecklistStore()

// State
const activeRoom = ref(0)
const searchQuery = ref('')
const selectedTasks = ref({}) // { roomName: [tasks] }
const customTasks = ref({}) // { roomName: [customTasks] }
const customTaskName = ref('')
const customTaskTime = ref(15)

// Get selected rooms from store
const selectedRooms = computed(() => {
  return checklistStore.currentChecklist?.selectedRooms || []
})

// Initialize selected tasks
onMounted(() => {
  // Initialize structure for each room
  selectedRooms.value.forEach(room => {
    if (!room.isCustom) {
      selectedTasks.value[room.name] = []
    } else {
      customTasks.value[room.name] = []
    }
  })
  
  // Load any previously selected tasks
  const existing = checklistStore.currentChecklist?.selectedTasks
  if (existing) {
    existing.forEach(task => {
      if (selectedTasks.value[task.room]) {
        selectedTasks.value[task.room].push(task)
      }
    })
  }
})

// Get filtered tasks based on search
const getFilteredTasks = (room) => {
  if (!room.tasks) return []
  
  if (!searchQuery.value || searchQuery.value.trim() === '') {
    return room.tasks
  }
  
  const fuse = new Fuse(room.tasks, {
    keys: ['name', 'chemicals', 'tools'],
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 2,
    ignoreLocation: true,
    shouldSort: true
  })
  
  const results = fuse.search(searchQuery.value.trim())
  return results.map(result => result.item)
}

// Check if task is selected
const isTaskSelected = (room, task) => {
  return selectedTasks.value[room.name]?.some(t => t.name === task.name) || false
}

// Toggle task selection
const toggleTask = (room, task) => {
  if (!selectedTasks.value[room.name]) {
    selectedTasks.value[room.name] = []
  }
  
  const index = selectedTasks.value[room.name].findIndex(t => t.name === task.name)
  if (index > -1) {
    selectedTasks.value[room.name].splice(index, 1)
  } else {
    selectedTasks.value[room.name].push({
      ...task,
      room: room.name
    })
  }
}

// Select all tasks in room
const selectAllInRoom = (room) => {
  if (room.tasks) {
    selectedTasks.value[room.name] = room.tasks.map(task => ({
      ...task,
      room: room.name
    }))
  }
}

// Deselect all tasks in room
const deselectAllInRoom = (room) => {
  selectedTasks.value[room.name] = []
}

// Get selected tasks for a room
const getSelectedTasksForRoom = (room) => {
  if (room.isCustom) {
    return customTasks.value[room.name] || []
  }
  return selectedTasks.value[room.name] || []
}

// Add custom task
const addCustomTask = (room) => {
  if (!customTasks.value[room.name]) {
    customTasks.value[room.name] = []
  }
  
  customTasks.value[room.name].push({
    name: customTaskName.value,
    estimatedTime: customTaskTime.value,
    room: room.name,
    chemicals: [],
    tools: [],
    isCustom: true
  })
  
  customTaskName.value = ''
  customTaskTime.value = 15
}

// Remove custom task
const removeCustomTask = (roomName, index) => {
  if (customTasks.value[roomName]) {
    customTasks.value[roomName].splice(index, 1)
  }
}

// Get adjusted time with multiplier
const getAdjustedTime = (baseTime) => {
  const multiplier = checklistStore.getTimeMultiplier()
  return Math.round(baseTime * multiplier)
}

// Calculate totals
const totalSelectedTasks = computed(() => {
  let total = 0
  Object.values(selectedTasks.value).forEach(tasks => {
    total += tasks.length
  })
  Object.values(customTasks.value).forEach(tasks => {
    total += tasks.length
  })
  return total
})

const totalTime = computed(() => {
  let total = 0
  const multiplier = checklistStore.getTimeMultiplier()
  
  Object.values(selectedTasks.value).forEach(tasks => {
    tasks.forEach(task => {
      total += task.estimatedTime * multiplier
    })
  })
  
  Object.values(customTasks.value).forEach(tasks => {
    tasks.forEach(task => {
      total += task.estimatedTime * multiplier
    })
  })
  
  return Math.round(total)
})

const formattedTotalTime = computed(() => {
  const minutes = totalTime.value
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}min`
})

// Handle next step
const handleNext = () => {
  // Combine all selected tasks
  const allTasks = []
  
  // Add regular tasks
  Object.entries(selectedTasks.value).forEach(([roomName, tasks]) => {
    tasks.forEach(task => {
      allTasks.push({
        ...task,
        room: roomName,
        estimatedTime: task.estimatedTime || 15
      })
    })
  })
  
  // Add custom tasks
  Object.entries(customTasks.value).forEach(([roomName, tasks]) => {
    tasks.forEach(task => {
      allTasks.push({
        ...task,
        room: roomName
      })
    })
  })
  
  // Update store
  checklistStore.updateSelectedTasks(allTasks)
  
  emit('next')
}
</script>

<style scoped>
.v-list {
  padding: 8px;
}

.v-list-item {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  margin-bottom: 8px;
  padding: 12px 8px !important;
  min-height: 72px;
  transition: all 0.2s;
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.v-tabs {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
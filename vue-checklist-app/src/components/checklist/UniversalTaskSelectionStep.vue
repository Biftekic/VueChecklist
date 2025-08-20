<template>
  <v-container fluid class="pa-0">
    <v-card flat>
      <v-card-title class="text-h5 font-weight-bold">
        <v-icon class="mr-2">mdi-format-list-checks</v-icon>
        Select Tasks for Your Checklist
      </v-card-title>
      
      <v-card-subtitle>
        Assign tasks to rooms - all tasks are available for all rooms
      </v-card-subtitle>

      <v-card-text>
        <!-- Room Selection Chips -->
        <div class="mb-4">
          <div class="text-subtitle-1 mb-2">Select a room to assign tasks:</div>
          <v-chip-group
            v-model="activeRoomIndex"
            color="primary"
            mandatory
          >
            <v-chip
              v-for="(room, index) in selectedRooms"
              :key="index"
              :value="index"
              filter
              variant="outlined"
            >
              <v-icon start size="small">{{ room.icon || 'mdi-door' }}</v-icon>
              {{ room.name }}
              <v-badge
                :content="getTaskCountForRoom(room)"
                :color="getTaskCountForRoom(room) > 0 ? 'success' : 'grey'"
                inline
                class="ml-2"
              />
            </v-chip>
          </v-chip-group>
        </div>

        <v-divider class="mb-4" />

        <!-- Current Room Display -->
        <v-alert
          type="info"
          variant="tonal"
          density="compact"
          class="mb-4"
        >
          <div class="d-flex justify-space-between align-center">
            <span>
              <v-icon size="small" class="mr-2">{{ currentRoom?.icon || 'mdi-door' }}</v-icon>
              <strong>{{ currentRoom?.name }}</strong>
            </span>
            <span>
              <strong>{{ getTaskCountForRoom(currentRoom) }}</strong> tasks selected
              • <strong>{{ getTimeForRoom(currentRoom) }} min</strong>
            </span>
          </div>
        </v-alert>

        <!-- Search and Filters -->
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchQuery"
              label="Search all tasks..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="comfortable"
              clearable
              hide-details
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="selectedCategory"
              :items="taskCategories"
              label="Filter by category"
              variant="outlined"
              density="comfortable"
              clearable
              hide-details
            />
          </v-col>
        </v-row>

        <!-- Quick Actions -->
        <v-row class="mb-4">
          <v-col cols="auto">
            <v-btn
              variant="outlined"
              size="small"
              @click="selectAllVisible"
            >
              <v-icon start>mdi-checkbox-multiple-marked</v-icon>
              Select All Visible
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              variant="outlined"
              size="small"
              @click="clearRoomTasks"
            >
              <v-icon start>mdi-close-box-multiple</v-icon>
              Clear Room Tasks
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              variant="tonal"
              size="small"
              color="primary"
              @click="showCustomTaskDialog = true"
            >
              <v-icon start>mdi-plus</v-icon>
              Add Custom Task
            </v-btn>
          </v-col>
        </v-row>

        <!-- Task List -->
        <v-card variant="outlined" class="task-container">
          <v-list density="compact">
            <template v-if="filteredTasks.length > 0">
              <v-list-item
                v-for="task in filteredTasks"
                :key="task.id"
                @click="toggleTask(task)"
                class="task-item mb-1"
              >
                <template v-slot:prepend>
                  <v-checkbox-btn
                    :model-value="isTaskSelectedForRoom(task)"
                    @click.stop="toggleTask(task)"
                  />
                </template>
                
                <v-list-item-title>
                  <div class="d-flex align-center">
                    <span class="font-weight-medium">{{ task.name }}</span>
                    <v-spacer />
                    <v-chip size="x-small" variant="tonal" class="mr-2">
                      <v-icon start size="x-small">mdi-clock-outline</v-icon>
                      {{ task.estimatedTime }} min
                    </v-chip>
                    <v-chip 
                      v-if="task.category"
                      size="x-small" 
                      variant="outlined"
                    >
                      {{ task.category }}
                    </v-chip>
                  </div>
                </v-list-item-title>
                
                <v-list-item-subtitle v-if="task.description">
                  {{ task.description }}
                </v-list-item-subtitle>
                
                <!-- Show which rooms this task is assigned to -->
                <template v-if="getRoomsForTask(task).length > 0">
                  <div class="mt-1">
                    <v-chip
                      v-for="roomName in getRoomsForTask(task)"
                      :key="roomName"
                      size="x-small"
                      color="secondary"
                      variant="outlined"
                      class="mr-1"
                    >
                      {{ roomName }}
                    </v-chip>
                  </div>
                </template>
              </v-list-item>
            </template>
            
            <v-list-item v-else>
              <v-list-item-title class="text-center text-grey">
                No tasks found matching your search
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- Summary -->
        <v-alert
          type="success"
          variant="tonal"
          density="compact"
          class="mt-4"
        >
          <div class="d-flex justify-space-between">
            <span>
              <strong>Total:</strong> {{ totalTaskCount }} tasks across all rooms
            </span>
            <span>
              <strong>Total Time:</strong> {{ totalTime }} minutes
            </span>
          </div>
        </v-alert>

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
              :disabled="totalTaskCount === 0"
              @click="handleNext"
            >
              Next: Client Information
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Custom Task Dialog -->
    <v-dialog v-model="showCustomTaskDialog" max-width="500">
      <v-card>
        <v-card-title>Add Custom Task</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="customTask.name"
            label="Task Name"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          />
          <v-text-field
            v-model.number="customTask.estimatedTime"
            label="Estimated Time (minutes)"
            type="number"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          />
          <v-textarea
            v-model="customTask.description"
            label="Description (optional)"
            variant="outlined"
            density="comfortable"
            rows="3"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showCustomTaskDialog = false">Cancel</v-btn>
          <v-btn 
            color="primary" 
            variant="flat"
            :disabled="!customTask.name || !customTask.estimatedTime"
            @click="addCustomTask"
          >
            Add Task
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useChecklistStore } from '@/stores/checklistStore'
import { cleaningTasksDatabase } from '@/data/cleaningTasksDatabase'

const emit = defineEmits(['next', 'back'])
const checklistStore = useChecklistStore()

// Selected rooms from previous step
const selectedRooms = computed(() => checklistStore.currentChecklist?.selectedRooms || [])

// Active room selection
const activeRoomIndex = ref(0)
const currentRoom = computed(() => selectedRooms.value[activeRoomIndex.value])

// Task management - store tasks per room
const roomTasks = ref({})
const customTasks = ref([])

// Search and filtering
const searchQuery = ref('')
const selectedCategory = ref(null)
const showCustomTaskDialog = ref(false)

// Custom task form
const customTask = ref({
  name: '',
  estimatedTime: 15,
  description: ''
})

// Get all unique task categories
const taskCategories = computed(() => {
  const categories = new Set()
  cleaningTasksDatabase.forEach(task => {
    if (task.category) categories.add(task.category)
  })
  customTasks.value.forEach(task => {
    if (task.category) categories.add(task.category)
  })
  return Array.from(categories).sort()
})

// Get all available tasks (database + custom)
const allTasks = computed(() => {
  return [
    ...cleaningTasksDatabase,
    ...customTasks.value
  ]
})

// Filter tasks based on search and category
const filteredTasks = computed(() => {
  let tasks = [...allTasks.value]
  
  // Filter by category
  if (selectedCategory.value) {
    tasks = tasks.filter(task => task.category === selectedCategory.value)
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    tasks = tasks.filter(task => 
      task.name.toLowerCase().includes(query) ||
      (task.description && task.description.toLowerCase().includes(query)) ||
      (task.category && task.category.toLowerCase().includes(query))
    )
  }
  
  return tasks
})

// Initialize room tasks
onMounted(() => {
  // Initialize empty task arrays for each room
  selectedRooms.value.forEach(room => {
    if (!roomTasks.value[room.name]) {
      roomTasks.value[room.name] = []
    }
  })
  
  // Load any existing task selections from store
  const existingTasks = checklistStore.currentChecklist?.selectedTasks
  if (existingTasks && existingTasks.length > 0) {
    existingTasks.forEach(task => {
      if (task.roomName && roomTasks.value[task.roomName]) {
        roomTasks.value[task.roomName].push(task)
      }
    })
  }
})

// Check if task is selected for current room
const isTaskSelectedForRoom = (task) => {
  const roomName = currentRoom.value?.name
  if (!roomName || !roomTasks.value[roomName]) return false
  return roomTasks.value[roomName].some(t => t.id === task.id)
}

// Toggle task selection for current room
const toggleTask = (task) => {
  const roomName = currentRoom.value?.name
  if (!roomName) return
  
  if (!roomTasks.value[roomName]) {
    roomTasks.value[roomName] = []
  }
  
  const index = roomTasks.value[roomName].findIndex(t => t.id === task.id)
  if (index > -1) {
    roomTasks.value[roomName].splice(index, 1)
  } else {
    roomTasks.value[roomName].push({
      ...task,
      roomName: roomName
    })
  }
}

// Get task count for a room
const getTaskCountForRoom = (room) => {
  if (!room || !roomTasks.value[room.name]) return 0
  return roomTasks.value[room.name].length
}

// Get total time for a room
const getTimeForRoom = (room) => {
  if (!room || !roomTasks.value[room.name]) return 0
  const multiplier = checklistStore.getTimeMultiplier()
  const baseTime = roomTasks.value[room.name].reduce((sum, task) => sum + (task.estimatedTime || 0), 0)
  return Math.round(baseTime * multiplier)
}

// Get which rooms a task is assigned to
const getRoomsForTask = (task) => {
  const rooms = []
  Object.entries(roomTasks.value).forEach(([roomName, tasks]) => {
    if (tasks.some(t => t.id === task.id)) {
      rooms.push(roomName)
    }
  })
  return rooms
}

// Select all visible tasks for current room
const selectAllVisible = () => {
  const roomName = currentRoom.value?.name
  if (!roomName) return
  
  if (!roomTasks.value[roomName]) {
    roomTasks.value[roomName] = []
  }
  
  filteredTasks.value.forEach(task => {
    if (!roomTasks.value[roomName].some(t => t.id === task.id)) {
      roomTasks.value[roomName].push({
        ...task,
        roomName: roomName
      })
    }
  })
}

// Clear all tasks for current room
const clearRoomTasks = () => {
  const roomName = currentRoom.value?.name
  if (!roomName) return
  roomTasks.value[roomName] = []
}

// Add custom task
const addCustomTask = () => {
  const newTask = {
    id: `custom-${Date.now()}`,
    name: customTask.value.name,
    estimatedTime: customTask.value.estimatedTime,
    description: customTask.value.description,
    category: 'Custom',
    isCustom: true
  }
  
  customTasks.value.push(newTask)
  
  // Automatically add to current room
  const roomName = currentRoom.value?.name
  if (roomName) {
    if (!roomTasks.value[roomName]) {
      roomTasks.value[roomName] = []
    }
    roomTasks.value[roomName].push({
      ...newTask,
      roomName: roomName
    })
  }
  
  // Reset form
  customTask.value = {
    name: '',
    estimatedTime: 15,
    description: ''
  }
  showCustomTaskDialog.value = false
}

// Calculate totals
const totalTaskCount = computed(() => {
  return Object.values(roomTasks.value).reduce((sum, tasks) => sum + tasks.length, 0)
})

const totalTime = computed(() => {
  const multiplier = checklistStore.getTimeMultiplier()
  const baseTime = Object.values(roomTasks.value).reduce((sum, tasks) => {
    return sum + tasks.reduce((taskSum, task) => taskSum + (task.estimatedTime || 0), 0)
  }, 0)
  return Math.round(baseTime * multiplier)
})

// Handle next step
const handleNext = () => {
  // Flatten all room tasks into a single array
  const allSelectedTasks = []
  Object.entries(roomTasks.value).forEach(([roomName, tasks]) => {
    tasks.forEach(task => {
      allSelectedTasks.push({
        ...task,
        roomId: selectedRooms.value.find(r => r.name === roomName)?.id,
        roomName: roomName
      })
    })
  })
  
  // Update store
  checklistStore.setSelectedTasks(allSelectedTasks)
  
  emit('next')
}
</script>

<style scoped>
.task-container {
  max-height: 500px;
  overflow-y: auto;
}

.task-item {
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 8px;
  transition: all 0.2s;
}

.task-item:hover {
  background-color: rgba(0,0,0,0.02);
  transform: translateX(4px);
}

.v-chip-group {
  flex-wrap: wrap;
}
</style>
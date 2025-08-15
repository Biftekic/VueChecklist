<template>
  <v-container fluid class="pa-0">
    <v-card flat>
      <v-card-title class="text-h5 font-weight-bold">
        <v-icon class="mr-2">mdi-format-list-checks</v-icon>
        Select Tasks for Each Room
      </v-card-title>
      
      <v-card-subtitle>
        Search and add tasks to each room in your checklist
      </v-card-subtitle>

      <v-card-text>
        <!-- Global Search with Room Filter -->
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="globalSearchQuery"
              label="Search all tasks..."
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-magnify"
              clearable
              @input="performGlobalSearch"
              hint="Search by task name, category, tools, or chemicals"
              persistent-hint
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="roomFilter"
              :items="availableRooms"
              label="Filter by room"
              variant="outlined"
              density="comfortable"
              clearable
              prepend-inner-icon="mdi-door"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="categoryFilter"
              :items="taskCategories"
              label="Filter by category"
              variant="outlined"
              density="comfortable"
              clearable
              prepend-inner-icon="mdi-tag"
            />
          </v-col>
        </v-row>

        <!-- Quick Add from Search Results -->
        <v-expand-transition>
          <v-card v-if="globalSearchResults.length > 0" variant="outlined" class="mb-4">
            <v-card-title class="text-subtitle-1">
              Search Results ({{ globalSearchResults.length }} tasks found)
            </v-card-title>
            <v-card-text class="pa-0">
              <v-list density="compact" max-height="300" class="overflow-y-auto">
                <v-list-item
                  v-for="task in globalSearchResults"
                  :key="task.id"
                  @click="showQuickAddDialog(task)"
                >
                  <template v-slot:prepend>
                    <v-icon size="small">mdi-plus-circle</v-icon>
                  </template>
                  <v-list-item-title>{{ task.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip size="x-small" class="mr-1">{{ task.category }}</v-chip>
                    <v-chip size="x-small" variant="outlined">{{ task.estimatedTime }} min</v-chip>
                    <span class="ml-2 text-caption">
                      Available in: {{ task.rooms.join(', ') }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-expand-transition>

        <!-- Summary -->
        <v-alert
          type="info"
          variant="tonal"
          density="compact"
          class="mb-4"
        >
          <div class="d-flex justify-space-between">
            <span>
              <strong>{{ totalSelectedTasks }}</strong> tasks selected across <strong>{{ selectedRooms.length }}</strong> rooms
            </span>
            <span>
              Estimated time: <strong>{{ formattedTotalTime }}</strong>
            </span>
          </div>
        </v-alert>

        <!-- Room Tabs with Search -->
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
            <!-- Room-specific search -->
            <v-text-field
              v-model="roomSearchQuery"
              :label="`Search tasks for ${room.name}...`"
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-magnify"
              clearable
              class="mb-3"
              @input="performRoomSearch(room)"
            />

            <!-- Quick Actions -->
            <v-row class="mb-3">
              <v-col cols="auto">
                <v-btn
                  size="small"
                  variant="outlined"
                  @click="selectAllInRoom(room)"
                  :disabled="getAvailableTasksForRoom(room).length === 0"
                >
                  Select All
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  size="small"
                  variant="outlined"
                  @click="deselectAllInRoom(room)"
                  :disabled="getSelectedTasksForRoom(room).length === 0"
                >
                  Deselect All
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  size="small"
                  color="primary"
                  variant="outlined"
                  @click="openTaskBrowser(room)"
                >
                  <v-icon start>mdi-database-search</v-icon>
                  Browse All Tasks
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  size="small"
                  color="success"
                  variant="outlined"
                  @click="openCustomTaskDialog(room)"
                >
                  <v-icon start>mdi-plus</v-icon>
                  Add Custom Task
                </v-btn>
              </v-col>
            </v-row>

            <!-- Template Tasks (if available) -->
            <div v-if="room.tasks && room.tasks.length > 0">
              <v-chip class="mb-2" size="small" color="primary">
                Template Tasks ({{ room.tasks.length }})
              </v-chip>
              <v-list density="compact">
                <v-list-item
                  v-for="(task, taskIndex) in getFilteredRoomTasks(room)"
                  :key="`template-${taskIndex}`"
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
                    <v-chip size="x-small" class="mr-1" variant="outlined">
                      {{ getAdjustedTime(task.estimatedTime) }} min
                    </v-chip>
                    <span v-if="task.chemicals?.length" class="mr-2">
                      <v-icon size="x-small">mdi-beaker</v-icon>
                      {{ task.chemicals.join(', ') }}
                    </span>
                    <span v-if="task.tools?.length">
                      <v-icon size="x-small">mdi-tools</v-icon>
                      {{ task.tools.join(', ') }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </div>

            <!-- Selected Tasks for Room -->
            <div class="mt-4" v-if="getSelectedTasksForRoom(room).length > 0">
              <v-chip class="mb-2" size="small" color="success">
                Selected Tasks ({{ getSelectedTasksForRoom(room).length }})
              </v-chip>
              <v-list density="compact">
                <v-list-item
                  v-for="(task, idx) in getSelectedTasksForRoom(room)"
                  :key="`selected-${idx}`"
                >
                  <template v-slot:prepend>
                    <v-checkbox-btn
                      :model-value="true"
                      @click="removeTask(room, task)"
                    />
                  </template>
                  <v-list-item-title>
                    {{ task.name }}
                    <v-chip v-if="task.isCustom" size="x-small" color="orange" class="ml-2">
                      Custom
                    </v-chip>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip size="x-small" variant="outlined">
                      {{ getAdjustedTime(task.estimatedTime) }} min
                    </v-chip>
                    <span v-if="task.category" class="ml-2">{{ task.category }}</span>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </div>

            <!-- No tasks message -->
            <div v-if="getSelectedTasksForRoom(room).length === 0" class="text-center py-8">
              <v-icon size="64" color="grey">mdi-playlist-plus</v-icon>
              <p class="text-h6 mt-4">No tasks selected for {{ room.name }}</p>
              <p class="text-body-2 text-grey">Use the search or browse to add tasks</p>
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

    <!-- Quick Add Dialog -->
    <v-dialog v-model="quickAddDialog" max-width="500">
      <v-card>
        <v-card-title>Add Task to Room</v-card-title>
        <v-card-text>
          <p class="mb-4">
            <strong>Task:</strong> {{ selectedTask?.name }}<br>
            <strong>Category:</strong> {{ selectedTask?.category }}<br>
            <strong>Time:</strong> {{ selectedTask?.estimatedTime }} minutes
          </p>
          <v-select
            v-model="quickAddRoom"
            :items="compatibleRooms"
            label="Select room to add this task"
            variant="outlined"
            density="comfortable"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="quickAddDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="quickAddTask" :disabled="!quickAddRoom">
            Add Task
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Task Browser Dialog -->
    <v-dialog v-model="taskBrowserDialog" max-width="800">
      <v-card>
        <v-card-title>
          Browse All Tasks for {{ browserRoom?.name }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="browserSearchQuery"
            label="Search tasks..."
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-magnify"
            clearable
            class="mb-3"
          />
          <v-list density="compact" max-height="400" class="overflow-y-auto">
            <v-list-item
              v-for="task in filteredBrowserTasks"
              :key="task.id"
              @click="addTaskFromBrowser(task)"
            >
              <template v-slot:prepend>
                <v-checkbox-btn
                  :model-value="isTaskSelectedById(browserRoom, task.id)"
                  @click.stop="toggleTaskFromBrowser(task)"
                />
              </template>
              <v-list-item-title>{{ task.name }}</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip size="x-small" class="mr-1">{{ task.category }}</v-chip>
                <v-chip size="x-small" variant="outlined">{{ task.estimatedTime }} min</v-chip>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="taskBrowserDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Custom Task Dialog -->
    <v-dialog v-model="customTaskDialog" max-width="500">
      <v-card>
        <v-card-title>Add Custom Task to {{ customTaskRoom?.name }}</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="customTaskName"
            label="Task name"
            variant="outlined"
            density="comfortable"
            class="mb-3"
          />
          <v-text-field
            v-model.number="customTaskTime"
            label="Estimated time (minutes)"
            type="number"
            variant="outlined"
            density="comfortable"
            class="mb-3"
          />
          <v-text-field
            v-model="customTaskChemicals"
            label="Chemicals (comma separated)"
            variant="outlined"
            density="comfortable"
            class="mb-3"
            hint="e.g., All-purpose cleaner, Disinfectant"
          />
          <v-text-field
            v-model="customTaskTools"
            label="Tools (comma separated)"
            variant="outlined"
            density="comfortable"
            hint="e.g., Mop, Bucket, Cloth"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="customTaskDialog = false">Cancel</v-btn>
          <v-btn 
            color="primary" 
            @click="addCustomTask"
            :disabled="!customTaskName || !customTaskTime"
          >
            Add Task
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useChecklistStore } from '@/stores/checklist'
import Fuse from 'fuse.js'
import { 
  cleaningTasksDatabase, 
  searchTasks, 
  getTasksByRoom,
  getAllCategories,
  getAllRooms 
} from '@/data/cleaningTasksDatabase'

const emit = defineEmits(['next', 'back'])
const checklistStore = useChecklistStore()

// State
const activeRoom = ref(0)
const globalSearchQuery = ref('')
const roomSearchQuery = ref('')
const browserSearchQuery = ref('')
const roomFilter = ref(null)
const categoryFilter = ref(null)
const selectedTasks = ref({}) // { roomName: [tasks] }
const globalSearchResults = ref([])
const roomSearchResults = ref({})

// Dialog states
const quickAddDialog = ref(false)
const taskBrowserDialog = ref(false)
const customTaskDialog = ref(false)
const selectedTask = ref(null)
const quickAddRoom = ref(null)
const browserRoom = ref(null)
const customTaskRoom = ref(null)

// Custom task fields
const customTaskName = ref('')
const customTaskTime = ref(15)
const customTaskChemicals = ref('')
const customTaskTools = ref('')

// Get selected rooms from store
const selectedRooms = computed(() => {
  return checklistStore.currentChecklist?.selectedRooms || []
})

// Get available rooms and categories
const availableRooms = computed(() => getAllRooms())
const taskCategories = computed(() => getAllCategories())

// Get compatible rooms for quick add
const compatibleRooms = computed(() => {
  if (!selectedTask.value) return []
  return selectedRooms.value
    .filter(room => 
      selectedTask.value.rooms.includes(room.name) || 
      selectedTask.value.rooms.includes('All Rooms')
    )
    .map(room => room.name)
})

// Initialize selected tasks
onMounted(() => {
  selectedRooms.value.forEach(room => {
    selectedTasks.value[room.name] = []
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

// Global search
const performGlobalSearch = () => {
  if (!globalSearchQuery.value || globalSearchQuery.value.trim().length < 2) {
    globalSearchResults.value = []
    return
  }
  
  let results = searchTasks(globalSearchQuery.value.trim(), roomFilter.value)
  
  if (categoryFilter.value) {
    results = results.filter(task => task.category === categoryFilter.value)
  }
  
  globalSearchResults.value = results.slice(0, 20) // Limit to 20 results
}

// Room-specific search
const performRoomSearch = (room) => {
  if (!roomSearchQuery.value || roomSearchQuery.value.trim().length < 2) {
    roomSearchResults.value[room.name] = []
    return
  }
  
  const results = searchTasks(roomSearchQuery.value.trim(), room.name)
  roomSearchResults.value[room.name] = results
}

// Get filtered tasks for room
const getFilteredRoomTasks = (room) => {
  if (!room.tasks) return []
  
  if (!roomSearchQuery.value || roomSearchQuery.value.trim() === '') {
    return room.tasks
  }
  
  const fuse = new Fuse(room.tasks, {
    keys: ['name', 'chemicals', 'tools'],
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 2,
    ignoreLocation: true
  })
  
  const results = fuse.search(roomSearchQuery.value.trim())
  return results.map(result => result.item)
}

// Get available tasks for room from database
const getAvailableTasksForRoom = (room) => {
  return getTasksByRoom(room.name)
}

// Get filtered browser tasks
const filteredBrowserTasks = computed(() => {
  if (!browserRoom.value) return []
  
  let tasks = getAvailableTasksForRoom(browserRoom.value)
  
  if (browserSearchQuery.value && browserSearchQuery.value.trim().length >= 2) {
    const fuse = new Fuse(tasks, {
      keys: ['name', 'category', 'chemicals', 'tools'],
      threshold: 0.4
    })
    tasks = fuse.search(browserSearchQuery.value.trim()).map(r => r.item)
  }
  
  return tasks
})

// Check if task is selected
const isTaskSelected = (room, task) => {
  return selectedTasks.value[room.name]?.some(t => t.name === task.name) || false
}

// Check if task is selected by ID
const isTaskSelectedById = (room, taskId) => {
  return selectedTasks.value[room.name]?.some(t => t.id === taskId) || false
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

// Remove task
const removeTask = (room, task) => {
  const index = selectedTasks.value[room.name].findIndex(t => t.name === task.name)
  if (index > -1) {
    selectedTasks.value[room.name].splice(index, 1)
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
  return selectedTasks.value[room.name] || []
}

// Show quick add dialog
const showQuickAddDialog = (task) => {
  selectedTask.value = task
  quickAddRoom.value = null
  quickAddDialog.value = true
}

// Quick add task to room
const quickAddTask = () => {
  if (!quickAddRoom.value || !selectedTask.value) return
  
  if (!selectedTasks.value[quickAddRoom.value]) {
    selectedTasks.value[quickAddRoom.value] = []
  }
  
  const taskExists = selectedTasks.value[quickAddRoom.value].some(
    t => t.id === selectedTask.value.id || t.name === selectedTask.value.name
  )
  
  if (!taskExists) {
    selectedTasks.value[quickAddRoom.value].push({
      ...selectedTask.value,
      room: quickAddRoom.value
    })
  }
  
  quickAddDialog.value = false
}

// Open task browser
const openTaskBrowser = (room) => {
  browserRoom.value = room
  browserSearchQuery.value = ''
  taskBrowserDialog.value = true
}

// Add task from browser
const addTaskFromBrowser = (task) => {
  toggleTaskFromBrowser(task)
}

// Toggle task from browser
const toggleTaskFromBrowser = (task) => {
  if (!browserRoom.value) return
  
  if (!selectedTasks.value[browserRoom.value.name]) {
    selectedTasks.value[browserRoom.value.name] = []
  }
  
  const index = selectedTasks.value[browserRoom.value.name].findIndex(t => t.id === task.id)
  if (index > -1) {
    selectedTasks.value[browserRoom.value.name].splice(index, 1)
  } else {
    selectedTasks.value[browserRoom.value.name].push({
      ...task,
      room: browserRoom.value.name
    })
  }
}

// Open custom task dialog
const openCustomTaskDialog = (room) => {
  customTaskRoom.value = room
  customTaskName.value = ''
  customTaskTime.value = 15
  customTaskChemicals.value = ''
  customTaskTools.value = ''
  customTaskDialog.value = true
}

// Add custom task
const addCustomTask = () => {
  if (!customTaskRoom.value || !customTaskName.value || !customTaskTime.value) return
  
  if (!selectedTasks.value[customTaskRoom.value.name]) {
    selectedTasks.value[customTaskRoom.value.name] = []
  }
  
  const chemicals = customTaskChemicals.value 
    ? customTaskChemicals.value.split(',').map(c => c.trim()).filter(c => c)
    : []
    
  const tools = customTaskTools.value
    ? customTaskTools.value.split(',').map(t => t.trim()).filter(t => t)
    : []
  
  selectedTasks.value[customTaskRoom.value.name].push({
    id: `custom-${Date.now()}`,
    name: customTaskName.value,
    estimatedTime: customTaskTime.value,
    chemicals: chemicals,
    tools: tools,
    category: 'Custom',
    room: customTaskRoom.value.name,
    isCustom: true
  })
  
  customTaskDialog.value = false
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
  return total
})

const totalTime = computed(() => {
  let total = 0
  const multiplier = checklistStore.getTimeMultiplier()
  
  Object.values(selectedTasks.value).forEach(tasks => {
    tasks.forEach(task => {
      total += (task.estimatedTime || 15) * multiplier
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
  
  Object.entries(selectedTasks.value).forEach(([roomName, tasks]) => {
    tasks.forEach(task => {
      allTasks.push({
        ...task,
        room: roomName,
        estimatedTime: task.estimatedTime || 15
      })
    })
  })
  
  // Update store
  checklistStore.updateSelectedTasks(allTasks)
  
  emit('next')
}

// Watch for filter changes
watch([roomFilter, categoryFilter], () => {
  performGlobalSearch()
})
</script>

<style scoped>
.v-list-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.v-tabs {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.overflow-y-auto {
  overflow-y: auto;
}
</style>
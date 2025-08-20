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
        <!-- Professional Mode Toggle -->
        <v-card variant="outlined" class="mb-4">
          <v-card-text>
            <v-row align="center">
              <v-col cols="auto">
                <v-switch
                  v-model="professionalMode"
                  color="primary"
                  hide-details
                >
                  <template v-slot:label>
                    <span class="font-weight-medium">
                      Professional Mode
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                          <v-icon v-bind="props" size="small" class="ml-1">
                            mdi-information-outline
                          </v-icon>
                        </template>
                        <span>Switch between amateur and professional time estimates</span>
                      </v-tooltip>
                    </span>
                  </template>
                </v-switch>
              </v-col>
              <v-col cols="auto">
                <v-chip-group
                  v-model="selectedFrequencies"
                  multiple
                  filter
                >
                  <v-chip
                    v-for="(config, freq) in FREQUENCY_CONFIG"
                    :key="freq"
                    :color="config.color"
                    variant="outlined"
                    size="small"
                  >
                    <v-icon start size="small">{{ config.icon }}</v-icon>
                    {{ config.label }}
                  </v-chip>
                </v-chip-group>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

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
              <span class="text-caption ml-2">
                ({{ professionalMode ? 'Professional' : 'Amateur' }} estimate)
              </span>
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
                <v-col cols="auto">
                  <v-btn
                    size="small"
                    variant="outlined"
                    @click="selectByFrequency(room, 'DAILY')"
                  >
                    Select Daily
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    size="small"
                    variant="outlined"
                    @click="selectByFrequency(room, 'WEEKLY')"
                  >
                    Select Weekly
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    size="small"
                    variant="outlined"
                    color="primary"
                    prepend-icon="mdi-plus"
                    @click="openCustomTaskCreator(room)"
                  >
                    Add Custom Task
                  </v-btn>
                </v-col>
              </v-row>

              <!-- Enhanced Tasks List -->
              <v-list class="task-list-container">
                <v-list-item
                  v-for="(task, taskIndex) in getFilteredTasks(room)"
                  :key="taskIndex"
                  @click="toggleTask(room, task)"
                  class="enhanced-task-item mb-2 rounded-lg"
                >
                  <template v-slot:prepend>
                    <v-checkbox-btn
                      :model-value="isTaskSelected(room, task)"
                      @click.stop="toggleTask(room, task)"
                      class="mr-3"
                    />
                  </template>
                  
                  <div class="flex-grow-1">
                    <v-list-item-title class="d-flex align-center flex-wrap mb-1">
                      <span class="task-name mr-2">{{ task.name }}</span>
                      
                      <!-- Time Badge - Most Important -->
                      <v-chip
                        size="small"
                        color="primary"
                        variant="tonal"
                        class="mr-2"
                      >
                        <v-icon start size="small">mdi-clock-outline</v-icon>
                        {{ getTaskTime(task) }} min
                      </v-chip>

                      <!-- Edit Button -->
                      <v-btn
                        icon="mdi-pencil"
                        size="x-small"
                        variant="text"
                        @click.stop="openTaskEditor(task, room)"
                        class="mr-2"
                      />
                      
                      <!-- Safety Warning - High Priority -->
                      <v-chip
                        v-if="task.safety?.warnings?.length"
                        size="small"
                        color="warning"
                        variant="tonal"
                        class="mr-2"
                      >
                        <v-icon start size="small">mdi-alert</v-icon>
                        Safety
                      </v-chip>
                    </v-list-item-title>
                    
                    <v-list-item-subtitle class="d-flex align-center flex-wrap mt-1">
                      <!-- Frequency Badge -->
                      <v-chip
                        v-if="task.frequency"
                        size="x-small"
                        :color="FREQUENCY_CONFIG[task.frequency]?.color"
                        variant="outlined"
                        class="mr-2 mb-1"
                      >
                        <v-icon start size="x-small">
                          {{ FREQUENCY_CONFIG[task.frequency]?.icon }}
                        </v-icon>
                        {{ FREQUENCY_CONFIG[task.frequency]?.label }}
                      </v-chip>
                      
                      <!-- Priority Badge -->
                      <v-chip
                        v-if="task.priority"
                        size="x-small"
                        :color="PRIORITY_CONFIG[task.priority]?.color"
                        variant="outlined"
                        class="mr-2 mb-1"
                      >
                        {{ task.priority }}
                      </v-chip>
                      
                      <!-- Tools & Chemicals Summary -->
                      <span v-if="task.chemicals?.length" class="text-caption mr-3">
                        <v-icon size="x-small">mdi-beaker</v-icon>
                        {{ task.chemicals.length }} chemical{{ task.chemicals.length > 1 ? 's' : '' }}
                      </span>
                      <span v-if="task.tools?.length" class="text-caption">
                        <v-icon size="x-small">mdi-tools</v-icon>
                        {{ task.tools.length }} tool{{ task.tools.length > 1 ? 's' : '' }}
                      </span>
                    </v-list-item-subtitle>

                    <!-- Expandable Details -->
                    <v-expand-transition>
                      <div v-if="expandedTasks[task.id]">
                        <v-divider class="my-2" />
                        
                        <!-- Steps -->
                        <div v-if="task.steps?.length" class="mb-3">
                          <div class="text-caption font-weight-bold mb-1">
                            <v-icon size="small">mdi-format-list-numbered</v-icon>
                            Steps:
                          </div>
                          <ol class="task-steps pl-4">
                            <li v-for="(step, idx) in task.steps" :key="idx" class="text-caption">
                              {{ step }}
                            </li>
                          </ol>
                        </div>

                        <!-- Safety Information -->
                        <div v-if="task.safety" class="mb-3">
                          <v-alert
                            type="warning"
                            density="compact"
                            variant="tonal"
                            class="text-caption"
                          >
                            <div v-if="task.safety.ppe?.length">
                              <strong>PPE Required:</strong> {{ task.safety.ppe.join(', ') }}
                            </div>
                            <div v-if="task.safety.warnings?.length">
                              <strong>Warnings:</strong> {{ task.safety.warnings.join(', ') }}
                            </div>
                          </v-alert>
                        </div>

                        <!-- Quality Standards -->
                        <div v-if="task.standards" class="mb-2">
                          <div class="text-caption font-weight-bold mb-1">
                            <v-icon size="small">mdi-check-circle</v-icon>
                            Quality Standards:
                          </div>
                          <div class="text-caption">
                            <div v-if="task.standards.visual">
                              <strong>Visual:</strong> {{ task.standards.visual }}
                            </div>
                            <div v-if="task.standards.touch">
                              <strong>Touch:</strong> {{ task.standards.touch }}
                            </div>
                            <div v-if="task.standards.smell">
                              <strong>Smell:</strong> {{ task.standards.smell }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </v-expand-transition>
                  </div>

                  <!-- Expand Button -->
                  <template v-slot:append>
                    <v-btn
                      icon
                      size="small"
                      variant="text"
                      @click.stop="toggleExpand(task.id)"
                    >
                      <v-icon>
                        {{ expandedTasks[task.id] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                      </v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
            </div>
          </v-window-item>
        </v-window>

        <!-- Navigation Buttons (hidden in edit mode) -->
        <v-row v-if="!editMode" class="mt-6">
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
        
        <!-- Save button for edit mode -->
        <v-row v-else class="mt-6">
          <v-col>
            <v-btn
              color="primary"
              size="large"
              block
              :disabled="totalSelectedTasks === 0"
              @click="handleNext"
            >
              <v-icon start>mdi-check</v-icon>
              Apply Changes
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    
    <!-- Task Edit Modal -->
    <CustomTaskModal
      v-model="taskEditDialog"
      :task="editingTask"
      :room="editingRoom"
      @save="updateTask"
    />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useChecklistStore } from '@/stores/checklistStore'
import { 
  enhancedCleaningTasks, 
  getTasksByRoom,
  calculateAdjustedTime,
  FREQUENCY_CONFIG,
  PRIORITY_CONFIG 
} from '@/data/enhancedCleaningTasks'
import { cleaningTasksDatabase } from '@/data/cleaningTasksDatabase'
import CustomTaskModal from '@/components/checklist/CustomTaskModal.vue'
import Fuse from 'fuse.js'

const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  },
  existingTasks: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['next', 'back', 'update'])
const checklistStore = useChecklistStore()

// State
const activeRoom = ref(0)
const searchQuery = ref('')
const selectedTasks = ref({}) // { roomName: [tasks] }
const customTasks = ref({}) // { roomName: [customTasks] }
const customTaskName = ref('')
const customTaskTime = ref(15)
const expandedTasks = ref({}) // Track expanded state of tasks
const professionalMode = ref(false)
const selectedFrequencies = ref([]) // For frequency filtering

// Task editing state
const taskEditDialog = ref(false)
const editingTask = ref(null)
const editingRoom = ref(null)

// Get selected rooms from store or existing tasks in edit mode
const selectedRooms = computed(() => {
  if (props.editMode && props.existingTasks.length > 0) {
    // Extract unique rooms from existing tasks
    const roomSet = new Set(props.existingTasks.map(task => task.room))
    return Array.from(roomSet).map(roomName => ({
      name: roomName,
      isCustom: false
    }))
  }
  const rooms = checklistStore.currentChecklist?.selectedRooms || []
  // Enhance rooms with tasks
  return rooms.map(room => {
    if (!room.isCustom) {
      // Get enhanced tasks for this room
      const enhancedTasksForRoom = getTasksByRoom(room.name)
      // Fallback to original tasks if no enhanced tasks
      const originalTasksForRoom = cleaningTasksDatabase.filter(task => 
        task.rooms?.includes(room.name) || task.rooms?.includes('All Rooms')
      )
      
      // Merge enhanced and original tasks
      const allTasks = [
        ...enhancedTasksForRoom,
        ...originalTasksForRoom.filter(origTask => 
          !enhancedTasksForRoom.some(enhTask => 
            enhTask.name.toLowerCase() === origTask.name.toLowerCase()
          )
        ).map(task => ({
          ...task,
          id: `orig-${task.id}`,
          frequency: 'WEEKLY',
          priority: 'medium',
          estimatedTime: {
            amateur: { min: task.estimatedTime, max: task.estimatedTime + 5 },
            professional: { min: Math.round(task.estimatedTime * 0.6), max: Math.round(task.estimatedTime * 0.8) }
          }
        }))
      ]
      
      return {
        ...room,
        tasks: allTasks
      }
    }
    return room
  })
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
  
  // Load existing tasks based on mode
  let tasksToLoad = []
  if (props.editMode) {
    // In edit mode, load from props
    tasksToLoad = props.existingTasks || []
  } else {
    // In create mode, load from store
    tasksToLoad = checklistStore.currentChecklist?.selectedTasks || []
  }
  
  // Populate selected tasks
  tasksToLoad.forEach(task => {
    const roomName = task.room
    if (!selectedTasks.value[roomName]) {
      selectedTasks.value[roomName] = []
    }
    selectedTasks.value[roomName].push(task)
  })
})

// Get filtered tasks based on search and frequency
const getFilteredTasks = (room) => {
  if (!room.tasks) return []
  
  let tasks = room.tasks
  
  // Filter by frequency if selected
  if (selectedFrequencies.value.length > 0) {
    const frequencies = Object.keys(FREQUENCY_CONFIG).filter((_, idx) => 
      selectedFrequencies.value.includes(idx)
    )
    tasks = tasks.filter(task => frequencies.includes(task.frequency))
  }
  
  // Filter by search query
  if (!searchQuery.value || searchQuery.value.trim() === '') {
    return tasks
  }
  
  const fuse = new Fuse(tasks, {
    keys: ['name', 'category', 'chemicals.name', 'tools.name'],
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
  return selectedTasks.value[room.name]?.some(t => 
    t.id === task.id || t.name === task.name
  ) || false
}

// Toggle task selection
const toggleTask = (room, task) => {
  if (!selectedTasks.value[room.name]) {
    selectedTasks.value[room.name] = []
  }
  
  const index = selectedTasks.value[room.name].findIndex(t => 
    t.id === task.id || t.name === task.name
  )
  if (index > -1) {
    selectedTasks.value[room.name].splice(index, 1)
  } else {
    selectedTasks.value[room.name].push({
      ...task,
      room: room.name
    })
  }
}

// Toggle task expansion
const toggleExpand = (taskId) => {
  expandedTasks.value[taskId] = !expandedTasks.value[taskId]
}

// Select all tasks in room
const selectAllInRoom = (room) => {
  if (room.tasks) {
    selectedTasks.value[room.name] = getFilteredTasks(room).map(task => ({
      ...task,
      room: room.name
    }))
  }
}

// Deselect all tasks in room
const deselectAllInRoom = (room) => {
  selectedTasks.value[room.name] = []
}

// Select tasks by frequency
const selectByFrequency = (room, frequency) => {
  if (room.tasks) {
    const tasksToAdd = room.tasks
      .filter(task => task.frequency === frequency)
      .map(task => ({
        ...task,
        room: room.name
      }))
    
    // Add only tasks not already selected
    tasksToAdd.forEach(task => {
      if (!isTaskSelected(room, task)) {
        selectedTasks.value[room.name].push(task)
      }
    })
  }
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

// Task editing methods
const openTaskEditor = (task, room) => {
  editingTask.value = { ...task }
  editingRoom.value = room
  taskEditDialog.value = true
}

const openCustomTaskCreator = (room) => {
  editingTask.value = {
    name: '',
    estimatedTime: 10,
    chemicals: [],
    tools: [],
    isCustom: true
  }
  editingRoom.value = room
  taskEditDialog.value = true
}

const updateTask = (updatedTask) => {
  // Check if this is a new custom task (has isCustom flag and no id or empty name in editingTask)
  if (updatedTask.isCustom && (!editingTask.value.id && !editingTask.value.name)) {
    // This is a new custom task, add it to customTasks
    if (!customTasks.value[editingRoom.value.name]) {
      customTasks.value[editingRoom.value.name] = []
    }
    
    customTasks.value[editingRoom.value.name].push({
      ...updatedTask,
      id: `custom_${Date.now()}`,
      room: editingRoom.value.name,
      isCustom: true
    })
  } else {
    // Find and update the task in selectedTasks if it's already selected
    if (selectedTasks.value[editingRoom.value.name]) {
      const taskIndex = selectedTasks.value[editingRoom.value.name].findIndex(
        t => t.id === updatedTask.id || t.name === editingTask.value.name
      )
      if (taskIndex !== -1) {
        selectedTasks.value[editingRoom.value.name][taskIndex] = {
          ...selectedTasks.value[editingRoom.value.name][taskIndex],
          ...updatedTask
        }
      }
    }
    
    // Also update in the room's task list for display
    const roomIndex = selectedRooms.value.findIndex(r => r.name === editingRoom.value.name)
    if (roomIndex !== -1 && selectedRooms.value[roomIndex].tasks) {
      const taskIndex = selectedRooms.value[roomIndex].tasks.findIndex(
        t => t.id === updatedTask.id || t.name === editingTask.value.name
      )
      if (taskIndex !== -1) {
        selectedRooms.value[roomIndex].tasks[taskIndex] = {
          ...selectedRooms.value[roomIndex].tasks[taskIndex],
          ...updatedTask
        }
      }
    }
  }
  
  taskEditDialog.value = false
  editingTask.value = null
  editingRoom.value = null
}

// Get task time based on professional mode
const getTaskTime = (task) => {
  if (task.estimatedTime?.amateur && task.estimatedTime?.professional) {
    return calculateAdjustedTime(task, professionalMode.value)
  }
  // Fallback for original tasks
  const multiplier = checklistStore.getTimeMultiplier()
  const baseTime = task.estimatedTime?.min || task.estimatedTime || 15
  const adjustedTime = professionalMode.value ? baseTime * 0.7 : baseTime
  return Math.round(adjustedTime * multiplier)
}

// Get chemical names
const getChemicalNames = (chemicals) => {
  if (Array.isArray(chemicals)) {
    if (typeof chemicals[0] === 'string') {
      return chemicals.slice(0, 2).join(', ')
    }
    return chemicals.slice(0, 2).map(c => c.name).join(', ')
  }
  return ''
}

// Get tool names
const getToolNames = (tools) => {
  if (Array.isArray(tools)) {
    if (typeof tools[0] === 'string') {
      return tools.slice(0, 2).join(', ')
    }
    return tools.slice(0, 2).map(t => t.name).join(', ')
  }
  return ''
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
  
  Object.values(selectedTasks.value).forEach(tasks => {
    tasks.forEach(task => {
      total += getTaskTime(task)
    })
  })
  
  Object.values(customTasks.value).forEach(tasks => {
    tasks.forEach(task => {
      total += getTaskTime(task)
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
        estimatedTime: getTaskTime(task)
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
  
  if (props.editMode) {
    // In edit mode, emit update event
    emit('update', allTasks)
  } else {
    // In create mode, update store and proceed
    checklistStore.updateSelectedTasks(allTasks)
    emit('next')
  }
}
</script>

<style scoped>
.task-list-container {
  padding: 8px;
}

.enhanced-task-item {
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
  padding: 12px 8px !important;
  min-height: 80px;
}

.enhanced-task-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
  border-color: rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.enhanced-task-item.v-list-item--active {
  background-color: rgba(25, 118, 210, 0.04);
  border-color: rgba(25, 118, 210, 0.3);
}

.task-name {
  font-weight: 500;
  font-size: 15px;
  line-height: 1.4;
  flex: 1 1 auto;
  min-width: 200px;
}

.v-tabs {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.v-chip-group {
  gap: 8px;
}

.task-steps {
  line-height: 1.5;
}

.task-steps li {
  margin-bottom: 4px;
}

/* Improve chip visibility */
.v-chip {
  font-weight: 500;
}

/* Ensure checkbox has proper spacing */
.v-checkbox-btn {
  margin-top: 0 !important;
}
</style>
<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar color="primary" dark>
        <v-btn icon @click="$emit('update:modelValue', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Manage Tasks</v-toolbar-title>
        <v-spacer />
        <v-btn variant="text" @click="saveChanges" :disabled="!hasChanges">
          <v-icon start>mdi-content-save</v-icon>
          Save Changes
        </v-btn>
      </v-toolbar>

      <v-container fluid>
        <!-- Action Bar -->
        <v-card flat class="mb-3">
          <v-card-text>
            <v-row align="center">
              <v-col cols="auto">
                <v-btn-toggle v-model="viewMode" mandatory color="primary" variant="outlined">
                  <v-btn value="rooms" size="small">
                    <v-icon start>mdi-door</v-icon>
                    By Room
                  </v-btn>
                  <v-btn value="all" size="small">
                    <v-icon start>mdi-format-list-bulleted</v-icon>
                    All Tasks
                  </v-btn>
                </v-btn-toggle>
              </v-col>
              
              <v-col cols="auto">
                <v-btn
                  color="primary"
                  variant="tonal"
                  size="small"
                  @click="openAddTaskDialog"
                >
                  <v-icon start>mdi-plus</v-icon>
                  Add Custom Task
                </v-btn>
              </v-col>
              
              <v-col cols="auto">
                <v-btn
                  color="secondary"
                  variant="tonal"
                  size="small"
                  @click="templateLibraryDialog = true"
                >
                  <v-icon start>mdi-book-open-variant</v-icon>
                  Template Library
                </v-btn>
              </v-col>

              <v-col cols="auto" v-if="selectedTasks.length > 0">
                <v-chip color="primary" variant="elevated">
                  {{ selectedTasks.length }} selected
                </v-chip>
              </v-col>

              <v-spacer />

              <!-- Bulk Actions -->
              <v-col cols="auto" v-if="selectedTasks.length > 0">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      variant="outlined"
                      size="small"
                    >
                      <v-icon start>mdi-dots-vertical</v-icon>
                      Bulk Actions
                    </v-btn>
                  </template>
                  <v-list density="compact">
                    <v-list-item @click="openMoveToRoomDialog">
                      <v-list-item-title>
                        <v-icon start size="small">mdi-arrow-right</v-icon>
                        Move to Room
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="removeSelectedTasks">
                      <v-list-item-title class="text-error">
                        <v-icon start size="small">mdi-delete</v-icon>
                        Remove Selected
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Room View -->
        <div v-if="viewMode === 'rooms'">
          <v-expansion-panels v-model="expandedRooms" multiple>
            <v-expansion-panel
              v-for="room in tasksByRoom"
              :key="room.name"
              :value="room.name"
            >
              <v-expansion-panel-title>
                <div class="d-flex align-center justify-space-between w-100">
                  <div>
                    <v-icon class="mr-2">mdi-door</v-icon>
                    <strong>{{ room.name }}</strong>
                    <v-chip size="x-small" class="ml-2">
                      {{ room.tasks.length }} tasks
                    </v-chip>
                  </div>
                  <div class="mr-4">
                    <v-chip size="small" variant="tonal">
                      {{ formatTime(room.totalTime) }}
                    </v-chip>
                  </div>
                </div>
              </v-expansion-panel-title>
              
              <v-expansion-panel-text>
                <draggable
                  v-model="room.tasks"
                  group="tasks"
                  item-key="id"
                  handle=".drag-handle"
                  @change="handleDragChange(room.name)"
                  :animation="200"
                >
                  <template #item="{ element: task }">
                    <v-card
                      flat
                      class="task-item mb-2"
                      :class="{ 'selected': isTaskSelected(task.id) }"
                    >
                      <v-card-text class="pa-2">
                        <div class="d-flex align-center">
                          <!-- Drag Handle -->
                          <v-icon class="drag-handle mr-2" style="cursor: move;">
                            mdi-drag-vertical
                          </v-icon>

                          <!-- Checkbox -->
                          <v-checkbox
                            :model-value="isTaskSelected(task.id)"
                            @update:model-value="toggleTaskSelection(task.id)"
                            density="compact"
                            hide-details
                            class="flex-grow-0 mr-2"
                          />

                          <!-- Task Info -->
                          <div class="flex-grow-1">
                            <div class="font-weight-medium">{{ task.name }}</div>
                            <div class="text-caption text-grey">
                              <v-chip
                                v-if="task.frequency"
                                size="x-small"
                                :color="getFrequencyColor(task.frequency)"
                                variant="tonal"
                                class="mr-1"
                              >
                                {{ task.frequency }}
                              </v-chip>
                              <span>{{ task.estimatedTime }} min</span>
                            </div>
                          </div>

                          <!-- Actions -->
                          <v-menu>
                            <template v-slot:activator="{ props }">
                              <v-btn
                                v-bind="props"
                                icon="mdi-dots-vertical"
                                size="small"
                                variant="text"
                              />
                            </template>
                            <v-list density="compact">
                              <v-list-item @click="editTask(task)">
                                <v-list-item-title>
                                  <v-icon start size="small">mdi-pencil</v-icon>
                                  Edit Task
                                </v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="duplicateTask(task)">
                                <v-list-item-title>
                                  <v-icon start size="small">mdi-content-copy</v-icon>
                                  Duplicate
                                </v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="removeTask(task.id)">
                                <v-list-item-title class="text-error">
                                  <v-icon start size="small">mdi-delete</v-icon>
                                  Remove
                                </v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </div>
                      </v-card-text>
                    </v-card>
                  </template>
                </draggable>

                <!-- Drop zone for empty rooms -->
                <v-alert
                  v-if="room.tasks.length === 0"
                  type="info"
                  variant="tonal"
                  density="compact"
                  class="text-center"
                >
                  No tasks in this room. Drag tasks here to add them.
                </v-alert>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>

        <!-- All Tasks View -->
        <div v-else>
          <v-card flat>
            <v-card-text>
              <v-data-table
                v-model="selectedTasks"
                :headers="tableHeaders"
                :items="allTasks"
                item-value="id"
                show-select
                class="elevation-0"
              >
                <template v-slot:item.name="{ item }">
                  <div class="font-weight-medium">{{ item.name }}</div>
                </template>
                
                <template v-slot:item.room="{ item }">
                  <v-chip size="small" variant="tonal">
                    {{ item.room }}
                  </v-chip>
                </template>
                
                <template v-slot:item.frequency="{ item }">
                  <v-chip
                    v-if="item.frequency"
                    size="small"
                    :color="getFrequencyColor(item.frequency)"
                    variant="tonal"
                  >
                    {{ item.frequency }}
                  </v-chip>
                </template>
                
                <template v-slot:item.estimatedTime="{ item }">
                  {{ item.estimatedTime }} min
                </template>
                
                <template v-slot:item.actions="{ item }">
                  <v-btn
                    icon="mdi-pencil"
                    size="small"
                    variant="text"
                    @click="editTask(item)"
                  />
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    color="error"
                    @click="removeTask(item.id)"
                  />
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </div>
      </v-container>

      <!-- Move to Room Dialog -->
      <v-dialog v-model="moveToRoomDialog" max-width="400">
        <v-card>
          <v-card-title>Move Tasks to Room</v-card-title>
          <v-card-text>
            <v-select
              v-model="targetRoom"
              :items="availableRooms"
              label="Select Target Room"
              variant="outlined"
              density="compact"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn variant="text" @click="moveToRoomDialog = false">
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              variant="text"
              @click="moveSelectedToRoom"
              :disabled="!targetRoom"
            >
              Move Tasks
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Custom Task Dialog -->
      <CustomTaskModal
        v-model="customTaskDialog"
        :task="editingTask"
        @save="handleTaskSave"
      />
      
      <!-- Task Template Library -->
      <TaskTemplateLibrary
        v-model="templateLibraryDialog"
        @add-tasks="handleTemplateAdd"
      />
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import CustomTaskModal from './CustomTaskModal.vue'
import TaskTemplateLibrary from './TaskTemplateLibrary.vue'

const props = defineProps({
  modelValue: Boolean,
  tasks: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'update:tasks'])

// State
const viewMode = ref('rooms')
const expandedRooms = ref([])
const selectedTasks = ref([])
const hasChanges = ref(false)
const localTasks = ref([])
const moveToRoomDialog = ref(false)
const targetRoom = ref('')
const customTaskDialog = ref(false)
const editingTask = ref(null)
const templateLibraryDialog = ref(false)

// Table headers for all tasks view
const tableHeaders = [
  { title: 'Task Name', key: 'name', sortable: true },
  { title: 'Room', key: 'room', sortable: true },
  { title: 'Frequency', key: 'frequency', sortable: true },
  { title: 'Time', key: 'estimatedTime', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Initialize local tasks
watch(() => props.tasks, (newTasks) => {
  localTasks.value = JSON.parse(JSON.stringify(newTasks || []))
  // Ensure each task has an ID
  localTasks.value.forEach((task, index) => {
    if (!task.id) {
      task.id = `task-${Date.now()}-${index}`
    }
  })
}, { immediate: true, deep: true })

// Computed
const tasksByRoom = computed(() => {
  const rooms = {}
  
  localTasks.value.forEach(task => {
    const roomName = task.room || 'Unassigned'
    if (!rooms[roomName]) {
      rooms[roomName] = {
        name: roomName,
        tasks: [],
        totalTime: 0
      }
    }
    rooms[roomName].tasks.push(task)
    rooms[roomName].totalTime += task.estimatedTime || 0
  })
  
  // Convert to array and sort
  return Object.values(rooms).sort((a, b) => a.name.localeCompare(b.name))
})

const allTasks = computed(() => localTasks.value)

const availableRooms = computed(() => {
  const rooms = new Set()
  localTasks.value.forEach(task => {
    if (task.room) rooms.add(task.room)
  })
  // Add common rooms if not present
  const commonRooms = ['Living Room', 'Kitchen', 'Bathroom', 'Bedroom', 'Office']
  commonRooms.forEach(room => rooms.add(room))
  return Array.from(rooms).sort()
})

// Methods
const formatTime = (minutes) => {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}

const getFrequencyColor = (frequency) => {
  const colors = {
    'DAILY': 'red',
    'WEEKLY': 'orange',
    'MONTHLY': 'blue',
    'QUARTERLY': 'purple'
  }
  return colors[frequency] || 'grey'
}

const isTaskSelected = (taskId) => {
  return selectedTasks.value.includes(taskId)
}

const toggleTaskSelection = (taskId) => {
  const index = selectedTasks.value.indexOf(taskId)
  if (index > -1) {
    selectedTasks.value.splice(index, 1)
  } else {
    selectedTasks.value.push(taskId)
  }
}

const handleDragChange = (roomName) => {
  // Update room assignments after drag
  tasksByRoom.value.forEach(room => {
    room.tasks.forEach(task => {
      task.room = room.name
    })
  })
  hasChanges.value = true
}

const openMoveToRoomDialog = () => {
  moveToRoomDialog.value = true
  targetRoom.value = ''
}

const moveSelectedToRoom = () => {
  if (!targetRoom.value) return
  
  localTasks.value.forEach(task => {
    if (selectedTasks.value.includes(task.id)) {
      task.room = targetRoom.value
    }
  })
  
  selectedTasks.value = []
  moveToRoomDialog.value = false
  hasChanges.value = true
}

const removeSelectedTasks = () => {
  localTasks.value = localTasks.value.filter(task => 
    !selectedTasks.value.includes(task.id)
  )
  selectedTasks.value = []
  hasChanges.value = true
}

const removeTask = (taskId) => {
  localTasks.value = localTasks.value.filter(task => task.id !== taskId)
  hasChanges.value = true
}

const editTask = (task) => {
  editingTask.value = { ...task }
  customTaskDialog.value = true
}

const duplicateTask = (task) => {
  const newTask = {
    ...task,
    id: `task-${Date.now()}`,
    name: `${task.name} (Copy)`
  }
  localTasks.value.push(newTask)
  hasChanges.value = true
}

const openAddTaskDialog = () => {
  editingTask.value = null
  customTaskDialog.value = true
}

const handleTaskSave = (task) => {
  if (editingTask.value) {
    // Update existing task
    const index = localTasks.value.findIndex(t => t.id === task.id)
    if (index > -1) {
      localTasks.value[index] = task
    }
  } else {
    // Add new task
    task.id = `task-${Date.now()}`
    task.room = task.room || 'Living Room'
    localTasks.value.push(task)
  }
  hasChanges.value = true
  customTaskDialog.value = false
}

const handleTemplateAdd = (tasks) => {
  // Add tasks from template library
  tasks.forEach(task => {
    localTasks.value.push(task)
  })
  hasChanges.value = true
  templateLibraryDialog.value = false
}

const saveChanges = () => {
  emit('update:tasks', localTasks.value)
  emit('update:modelValue', false)
  hasChanges.value = false
}

// Auto-expand first few rooms
watch(() => props.modelValue, (isOpen) => {
  if (isOpen && tasksByRoom.value.length > 0) {
    expandedRooms.value = tasksByRoom.value.slice(0, 3).map(r => r.name)
  }
})
</script>

<style scoped>
.task-item {
  border: 1px solid rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease;
}

.task-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.task-item.selected {
  background-color: rgba(33, 150, 243, 0.08);
  border-color: rgb(33, 150, 243);
}

.drag-handle {
  opacity: 0.5;
}

.drag-handle:hover {
  opacity: 1;
}

.sortable-ghost {
  opacity: 0.4;
  background-color: rgba(33, 150, 243, 0.1);
}

.sortable-drag {
  opacity: 0.8;
  background-color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
</style>
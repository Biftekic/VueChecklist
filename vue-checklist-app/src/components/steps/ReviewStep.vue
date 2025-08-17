<template>
  <v-container fluid class="pa-0">
    <v-card flat>
      <v-card-title class="text-h5 font-weight-bold">
        <v-icon class="mr-2">mdi-clipboard-check</v-icon>
        Review Checklist
      </v-card-title>
      
      <v-card-subtitle>
        Review your checklist before saving
      </v-card-subtitle>

      <v-card-text>
        <!-- Summary Card -->
        <v-card variant="tonal" color="primary" class="mb-4">
          <v-card-text>
            <v-row>
              <v-col cols="6" sm="3">
                <div class="text-caption">Total Tasks</div>
                <div class="text-h6 font-weight-bold">{{ totalTasks }}</div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="text-caption">Estimated Time</div>
                <div class="text-h6 font-weight-bold">{{ formattedTotalTime }}</div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="text-caption">Rooms</div>
                <div class="text-h6 font-weight-bold">{{ totalRooms }}</div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="text-caption">Frequency</div>
                <div class="text-h6 font-weight-bold">{{ checklist.clientInfo?.frequency || 'Not Set' }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Task Distribution by Category -->
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon size="small" class="mr-2">mdi-chart-pie</v-icon>
            Task Distribution
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col v-for="(category, name) in tasksByCategory" :key="name" cols="6" sm="4" md="3">
                <div class="text-center">
                  <div class="text-h6 font-weight-bold text-primary">{{ category.count }}</div>
                  <div class="text-caption">{{ name }}</div>
                  <div class="text-caption text-medium-emphasis">{{ formatTime(category.time) }}</div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Time by Room Breakdown -->
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1">
            <v-icon size="small" class="mr-2">mdi-clock-outline</v-icon>
            Time by Room
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col v-for="room in roomTimeBreakdown" :key="room.name" cols="6" sm="4" md="3">
                <div class="text-center">
                  <v-icon size="small" color="primary">{{ getRoomIcon(room.name) }}</v-icon>
                  <div class="text-subtitle-2 mt-1">{{ room.name }}</div>
                  <div class="text-h6 font-weight-bold">{{ formatTime(room.time) }}</div>
                  <div class="text-caption text-medium-emphasis">{{ room.taskCount }} tasks</div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Client Information -->
        <v-expansion-panels v-model="expandedPanels" multiple class="mb-4">
          <v-expansion-panel value="client">
            <v-expansion-panel-title>
              <v-icon class="mr-2">mdi-account</v-icon>
              Client Information
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list density="compact">
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon size="small">mdi-account</v-icon>
                  </template>
                  <v-list-item-title>{{ checklist.clientInfo?.name || 'Not provided' }}</v-list-item-title>
                  <v-list-item-subtitle>Client Name</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item v-if="checklist.clientInfo?.address">
                  <template v-slot:prepend>
                    <v-icon size="small">mdi-map-marker</v-icon>
                  </template>
                  <v-list-item-title>{{ checklist.clientInfo.address }}</v-list-item-title>
                  <v-list-item-subtitle>Address</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item v-if="checklist.clientInfo?.phone">
                  <template v-slot:prepend>
                    <v-icon size="small">mdi-phone</v-icon>
                  </template>
                  <v-list-item-title>{{ checklist.clientInfo.phone }}</v-list-item-title>
                  <v-list-item-subtitle>Phone</v-list-item-subtitle>
                </v-list-item>
                
                <v-list-item v-if="checklist.clientInfo?.email">
                  <template v-slot:prepend>
                    <v-icon size="small">mdi-email</v-icon>
                  </template>
                  <v-list-item-title>{{ checklist.clientInfo.email }}</v-list-item-title>
                  <v-list-item-subtitle>Email</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Property Details -->
          <v-expansion-panel value="property">
            <v-expansion-panel-title>
              <v-icon class="mr-2">mdi-home</v-icon>
              Property Details
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-title>{{ checklist.industry }}</v-list-item-title>
                  <v-list-item-subtitle>Industry Type</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>{{ checklist.propertySize }} m²</v-list-item-title>
                  <v-list-item-subtitle>Property Size</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>{{ checklist.numberOfFloors }} floor(s)</v-list-item-title>
                  <v-list-item-subtitle>Number of Floors</v-list-item-subtitle>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>
                    Difficulty: {{ checklist.difficulty }} | 
                    Expectations: {{ checklist.expectations }} | 
                    Challenges: {{ checklist.challenges }}
                  </v-list-item-title>
                  <v-list-item-subtitle>Modifiers ({{ totalMultiplier }}x time)</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Selected Rooms & Tasks -->
          <v-expansion-panel value="tasks">
            <v-expansion-panel-title>
              <v-icon class="mr-2">mdi-format-list-checks</v-icon>
              Selected Tasks by Room
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list class="task-review-list">
                <template v-for="(room, roomIndex) in selectedRoomsWithTasks" :key="roomIndex">
                  <v-list-subheader class="room-header">
                    <v-icon size="small" class="mr-2">{{ getRoomIcon(room.name) }}</v-icon>
                    <span class="font-weight-medium">{{ room.name }}</span>
                    <v-spacer></v-spacer>
                    <v-chip size="small" variant="tonal" color="primary" class="mr-2">
                      {{ room.tasks.length }} tasks
                    </v-chip>
                    <v-chip size="small" variant="tonal">
                      {{ formatTime(room.totalTime) }}
                    </v-chip>
                  </v-list-subheader>
                  <v-list-item
                    v-for="(task, taskIndex) in room.tasks"
                    :key="`${roomIndex}-${taskIndex}`"
                    class="task-review-item ml-4 mb-1"
                  >
                    <template v-slot:prepend>
                      <v-icon size="small" color="primary">mdi-checkbox-marked-circle</v-icon>
                    </template>
                    <v-list-item-title class="text-body-1">
                      {{ task.name }}
                    </v-list-item-title>
                    <template v-slot:append>
                      <v-chip size="small" variant="text" color="primary">
                        {{ formatTime(task.adjustedTime) }}
                      </v-chip>
                    </template>
                  </v-list-item>
                  <v-divider v-if="roomIndex < selectedRoomsWithTasks.length - 1" class="my-3"></v-divider>
                </template>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Chemicals & Equipment -->
          <v-expansion-panel value="supplies">
            <v-expansion-panel-title>
              <v-icon class="mr-2">mdi-beaker</v-icon>
              Required Supplies
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row>
                <v-col cols="12" md="6">
                  <div class="text-subtitle-2 mb-2">Chemicals Needed</div>
                  <v-chip
                    v-for="chemical in uniqueChemicals"
                    :key="chemical"
                    size="small"
                    class="ma-1"
                    variant="outlined"
                  >
                    {{ chemical }}
                  </v-chip>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="text-subtitle-2 mb-2">Tools & Equipment</div>
                  <v-chip
                    v-for="tool in uniqueTools"
                    :key="tool"
                    size="small"
                    class="ma-1"
                    variant="outlined"
                  >
                    {{ tool }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- Action Buttons -->
        <v-row class="mt-4">
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="checklistName"
              label="Checklist Name"
              placeholder="e.g., Smith Office Weekly Cleaning"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-tag"
              :rules="[v => !!v || 'Name is required']"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              v-model="saveOption"
              :items="saveOptions"
              label="Save As"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-content-save"
            />
          </v-col>
        </v-row>

        <!-- Preview Actions -->
        <v-card variant="outlined" class="mt-4">
          <v-card-text>
            <v-row align="center">
              <v-col>
                <div class="text-body-2 text-medium-emphasis">
                  Ready to save your checklist?
                </div>
              </v-col>
              <v-col cols="auto">
                <v-btn
                  color="primary"
                  variant="tonal"
                  prepend-icon="mdi-file-pdf-box"
                  @click="generatePDF"
                  class="mr-2"
                >
                  Preview PDF
                </v-btn>
                <v-btn
                  color="success"
                  variant="flat"
                  prepend-icon="mdi-check"
                  @click="saveChecklist"
                  :loading="saving"
                >
                  Save Checklist
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useChecklistsStore } from '@/stores/checklistStore'
import { useRouter } from 'vue-router'

const checklistStore = useChecklistsStore()
const router = useRouter()

const expandedPanels = ref(['client', 'property', 'tasks'])
const checklistName = ref('')
const saveOption = ref('checklist')
const saving = ref(false)

const saveOptions = [
  { title: 'Save as Checklist', value: 'checklist' },
  { title: 'Save as Template', value: 'template' },
  { title: 'Save as Both', value: 'both' }
]

// Get current checklist data
const checklist = computed(() => checklistStore.currentChecklist || {})

// Calculate totals
const totalTasks = computed(() => {
  return checklist.value.selectedTasks?.length || 0
})

const totalRooms = computed(() => {
  const rooms = new Set()
  checklist.value.selectedTasks?.forEach(task => {
    if (task.room) rooms.add(task.room)
  })
  return rooms.size
})

const totalTime = computed(() => {
  return checklist.value.selectedTasks?.reduce((total, task) => {
    return total + (task.adjustedTime || task.estimatedTime || 0)
  }, 0) || 0
})

const formattedTotalTime = computed(() => {
  return formatTime(totalTime.value)
})

const totalMultiplier = computed(() => {
  return checklistStore.getTimeMultiplier().toFixed(2)
})

// Group tasks by room
const selectedRoomsWithTasks = computed(() => {
  const rooms = {}
  
  checklist.value.selectedTasks?.forEach(task => {
    const roomName = task.room || 'General'
    if (!rooms[roomName]) {
      rooms[roomName] = {
        name: roomName,
        tasks: [],
        totalTime: 0
      }
    }
    rooms[roomName].tasks.push(task)
    rooms[roomName].totalTime += task.adjustedTime || task.estimatedTime || 0
  })
  
  return Object.values(rooms)
})

// Task breakdown by category
const tasksByCategory = computed(() => {
  const categories = {}
  
  checklist.value.selectedTasks?.forEach(task => {
    const category = task.category || 'Uncategorized'
    if (!categories[category]) {
      categories[category] = {
        count: 0,
        time: 0
      }
    }
    categories[category].count++
    categories[category].time += task.adjustedTime || task.estimatedTime || 0
  })
  
  return categories
})

// Time breakdown by room
const roomTimeBreakdown = computed(() => {
  const rooms = {}
  
  checklist.value.selectedTasks?.forEach(task => {
    const roomName = task.room || 'General'
    if (!rooms[roomName]) {
      rooms[roomName] = {
        name: roomName,
        time: 0,
        taskCount: 0
      }
    }
    rooms[roomName].time += task.adjustedTime || task.estimatedTime || 0
    rooms[roomName].taskCount++
  })
  
  return Object.values(rooms).sort((a, b) => b.time - a.time)
})

// Get unique chemicals and tools
const uniqueChemicals = computed(() => {
  const chemicals = new Set()
  checklist.value.selectedTasks?.forEach(task => {
    task.chemicals?.forEach(chem => chemicals.add(chem))
  })
  return Array.from(chemicals).sort()
})

const uniqueTools = computed(() => {
  const tools = new Set()
  checklist.value.selectedTasks?.forEach(task => {
    task.tools?.forEach(tool => tools.add(tool))
  })
  return Array.from(tools).sort()
})

// Helper functions
const formatTime = (minutes) => {
  if (!minutes) return '0 min'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h ${mins}min`
  }
  return `${mins} min`
}

const getRoomIcon = (roomName) => {
  const icons = {
    'Lobby': 'mdi-door-open',
    'Office': 'mdi-desk',
    'Restroom': 'mdi-toilet',
    'Kitchen': 'mdi-silverware-fork-knife',
    'Conference Room': 'mdi-presentation',
    'Bedroom': 'mdi-bed',
    'Living Room': 'mdi-sofa',
    'Bathroom': 'mdi-shower',
    'Dining Room': 'mdi-table-chair',
    'Patient Room': 'mdi-hospital-bed',
    'Operating Room': 'mdi-medical-bag',
    'Guest Room': 'mdi-bed-king',
    'Restaurant': 'mdi-food'
  }
  return icons[roomName] || 'mdi-door'
}

// Generate PDF preview
const generatePDF = () => {
  try {
    // Import PDF service dynamically
    import('@/services/pdfService').then((module) => {
      const pdfService = module.default
      const pdf = pdfService.generateChecklistPDF(checklist.value)
      const filename = `${checklistName.value || 'checklist'}_preview.pdf`
      pdf.save(filename)
      checklistStore.showNotification('PDF generated successfully!', 'success')
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    checklistStore.showNotification('Failed to generate PDF', 'error')
  }
}

// Save checklist
const saveChecklist = async () => {
  saving.value = true
  
  try {
    // Set the checklist name
    checklistStore.updateChecklistName(checklistName.value)
    
    // Save based on option
    if (saveOption.value === 'checklist' || saveOption.value === 'both') {
      await checklistStore.saveChecklist()
    }
    
    if (saveOption.value === 'template' || saveOption.value === 'both') {
      await checklistStore.saveAsTemplate(checklistName.value)
    }
    
    // Show success message
    checklistStore.showNotification('Checklist saved successfully!', 'success')
    
    // Navigate to checklists page
    router.push('/checklists')
  } catch (error) {
    console.error('Error saving checklist:', error)
    checklistStore.showNotification('Error saving checklist', 'error')
  } finally {
    saving.value = false
  }
}

// Set default checklist name on mount
onMounted(() => {
  if (checklist.value.clientInfo?.name) {
    const frequency = checklist.value.clientInfo.frequency || 'Cleaning'
    checklistName.value = `${checklist.value.clientInfo.name} - ${frequency}`
  }
})
</script>

<style scoped>
.v-expansion-panel {
  margin-bottom: 8px;
}

.v-list-subheader {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
}

.v-chip {
  margin: 2px;
}

.task-review-list {
  padding: 8px 0;
}

.room-header {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 12px 16px !important;
  margin: 8px 0;
  display: flex;
  align-items: center;
}

.task-review-item {
  padding: 8px 16px;
  min-height: 48px;
  transition: background-color 0.2s;
}

.task-review-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
}
</style>
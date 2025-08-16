<template>
  <v-card>
    <v-card-title>
      <v-icon class="mr-2">mdi-map-marker-path</v-icon>
      Optimized Cleaning Route
      <v-spacer />
      <v-btn
        size="small"
        variant="text"
        @click="showSettings = !showSettings"
      >
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-card-title>

    <!-- Settings Panel -->
    <v-expand-transition>
      <v-card-text v-show="showSettings" class="pb-0">
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="optimizationMode"
              :items="optimizationModes"
              label="Optimize By"
              density="compact"
              variant="outlined"
              @update:model-value="recalculateRoute"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="startRoom"
              :items="availableRooms"
              label="Start Room"
              density="compact"
              variant="outlined"
              @update:model-value="recalculateRoute"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-switch
              v-model="groupByFloor"
              label="Group by Floor"
              density="compact"
              @update:model-value="recalculateRoute"
            />
          </v-col>
        </v-row>
        <v-divider class="mt-2" />
      </v-card-text>
    </v-expand-transition>

    <v-card-text>
      <!-- Route Summary -->
      <v-alert
        :type="efficiencyAlertType"
        variant="tonal"
        density="compact"
        class="mb-4"
      >
        <div class="d-flex justify-space-between align-center">
          <div>
            <div class="text-subtitle-2">Route Efficiency</div>
            <div class="text-h5">{{ route?.metrics?.efficiency || 0 }}%</div>
          </div>
          <v-divider vertical class="mx-3" />
          <div>
            <div class="text-subtitle-2">Total Time</div>
            <div class="text-h5">{{ route?.summary?.estimatedTime || '0 min' }}</div>
          </div>
          <v-divider vertical class="mx-3" />
          <div>
            <div class="text-subtitle-2">Rooms</div>
            <div class="text-h5">{{ route?.metrics?.roomCount || 0 }}</div>
          </div>
          <v-divider vertical class="mx-3" />
          <div>
            <div class="text-subtitle-2">Tasks</div>
            <div class="text-h5">{{ route?.metrics?.taskCount || 0 }}</div>
          </div>
        </div>
      </v-alert>

      <!-- Visual Route Display -->
      <div class="route-visualization">
        <!-- Timeline View -->
        <v-timeline
          v-if="viewMode === 'timeline'"
          side="end"
          density="compact"
        >
          <v-timeline-item
            v-for="(room, index) in route?.tasks"
            :key="index"
            :dot-color="getRoomColor(room.room)"
            size="large"
          >
            <template v-slot:icon>
              <span class="font-weight-bold">{{ index + 1 }}</span>
            </template>
            
            <v-card>
              <v-card-title class="text-h6 pb-2">
                <v-icon start>{{ getRoomIcon(room.room) }}</v-icon>
                {{ room.room }}
                <v-chip size="small" class="ml-2">
                  {{ formatTime(room.totalTime) }}
                </v-chip>
              </v-card-title>
              
              <v-card-text>
                <div class="mb-2">
                  <strong>{{ room.tasks.length }} tasks</strong>
                </div>
                
                <!-- Task List -->
                <v-list density="compact" class="pa-0">
                  <v-list-item
                    v-for="(task, taskIndex) in room.tasks.slice(0, showAllTasks ? undefined : 3)"
                    :key="taskIndex"
                    class="px-0"
                  >
                    <template v-slot:prepend>
                      <v-icon size="x-small">mdi-checkbox-marked-circle-outline</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">
                      {{ task.name }}
                      <v-chip size="x-small" variant="text">
                        {{ task.estimatedTime }} min
                      </v-chip>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
                
                <v-btn
                  v-if="room.tasks.length > 3"
                  size="x-small"
                  variant="text"
                  @click="showAllTasks = !showAllTasks"
                  class="mt-1"
                >
                  {{ showAllTasks ? 'Show less' : `Show ${room.tasks.length - 3} more` }}
                </v-btn>
                
                <!-- Chemicals Used -->
                <div v-if="getUniqueChemicals(room.tasks).length > 0" class="mt-2">
                  <div class="text-caption text-grey mb-1">Chemicals needed:</div>
                  <v-chip
                    v-for="chemical in getUniqueChemicals(room.tasks)"
                    :key="chemical"
                    size="x-small"
                    variant="outlined"
                    class="mr-1"
                  >
                    <v-icon start size="x-small">mdi-flask</v-icon>
                    {{ chemical }}
                  </v-chip>
                </div>
              </v-card-text>
              
              <!-- Travel to Next -->
              <v-card-actions v-if="index < route.tasks.length - 1">
                <v-icon size="small">mdi-arrow-down</v-icon>
                <span class="text-caption text-grey">
                  Move to {{ route.tasks[index + 1].room }}
                </span>
              </v-card-actions>
            </v-card>
          </v-timeline-item>
        </v-timeline>

        <!-- Flow Chart View -->
        <div v-else-if="viewMode === 'flow'" class="flow-view">
          <v-row>
            <v-col
              v-for="(room, index) in route?.tasks"
              :key="index"
              cols="12"
              md="3"
            >
              <v-card
                :color="getRoomColor(room.room)"
                variant="outlined"
                class="text-center"
              >
                <v-card-text>
                  <v-avatar size="40" :color="getRoomColor(room.room)">
                    <span class="text-white font-weight-bold">{{ index + 1 }}</span>
                  </v-avatar>
                  <div class="text-h6 mt-2">{{ room.room }}</div>
                  <div class="text-caption">
                    {{ room.tasks.length }} tasks • {{ formatTime(room.totalTime) }}
                  </div>
                </v-card-text>
              </v-card>
              
              <div
                v-if="index < route.tasks.length - 1"
                class="text-center my-2"
              >
                <v-icon>mdi-arrow-down</v-icon>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- List View -->
        <v-list v-else>
          <v-list-item
            v-for="(room, index) in route?.tasks"
            :key="index"
          >
            <template v-slot:prepend>
              <v-avatar :color="getRoomColor(room.room)">
                {{ index + 1 }}
              </v-avatar>
            </template>
            
            <v-list-item-title>
              {{ room.room }}
            </v-list-item-title>
            
            <v-list-item-subtitle>
              {{ room.tasks.length }} tasks • {{ formatTime(room.totalTime) }}
            </v-list-item-subtitle>
            
            <template v-slot:append>
              <v-btn
                icon
                size="small"
                variant="text"
                @click="expandedRooms[index] = !expandedRooms[index]"
              >
                <v-icon>
                  {{ expandedRooms[index] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                </v-icon>
              </v-btn>
            </template>
          </v-list-item>
          
          <v-expand-transition>
            <div v-show="expandedRooms[index]" :key="`expand-${index}`">
              <v-list density="compact" class="ml-10">
                <v-list-item
                  v-for="(task, taskIndex) in room.tasks"
                  :key="taskIndex"
                >
                  <v-list-item-title class="text-body-2">
                    {{ task.name }}
                  </v-list-item-title>
                  <template v-slot:append>
                    <span class="text-caption">{{ task.estimatedTime }} min</span>
                  </template>
                </v-list-item>
              </v-list>
            </div>
          </v-expand-transition>
        </v-list>
      </div>

      <!-- Metrics -->
      <v-divider class="my-4" />
      <v-row>
        <v-col cols="6" md="3">
          <div class="text-center">
            <v-icon size="large" color="primary">mdi-map-marker-distance</v-icon>
            <div class="text-h6">{{ route?.metrics?.totalDistance || 0 }}</div>
            <div class="text-caption">Travel Units</div>
          </div>
        </v-col>
        <v-col cols="6" md="3">
          <div class="text-center">
            <v-icon size="large" color="orange">mdi-flask</v-icon>
            <div class="text-h6">{{ route?.metrics?.chemicalSwitches || 0 }}</div>
            <div class="text-caption">Chemical Switches</div>
          </div>
        </v-col>
        <v-col cols="6" md="3">
          <div class="text-center">
            <v-icon size="large" color="blue">mdi-stairs</v-icon>
            <div class="text-h6">{{ route?.metrics?.floorChanges || 0 }}</div>
            <div class="text-caption">Floor Changes</div>
          </div>
        </v-col>
        <v-col cols="6" md="3">
          <div class="text-center">
            <v-icon size="large" color="green">mdi-speedometer</v-icon>
            <div class="text-h6">{{ route?.metrics?.efficiency || 0 }}%</div>
            <div class="text-caption">Efficiency</div>
          </div>
        </v-col>
      </v-row>

      <!-- Recommendations -->
      <div v-if="route?.summary?.recommendations?.length > 0" class="mt-4">
        <v-divider class="mb-4" />
        <div class="text-subtitle-1 mb-2">
          <v-icon start>mdi-lightbulb</v-icon>
          Optimization Suggestions
        </div>
        <v-alert
          v-for="(rec, index) in route.summary.recommendations"
          :key="index"
          type="info"
          variant="tonal"
          density="compact"
          class="mb-2"
        >
          {{ rec }}
        </v-alert>
      </div>
    </v-card-text>

    <!-- Actions -->
    <v-card-actions>
      <v-btn-toggle
        v-model="viewMode"
        mandatory
        density="compact"
        variant="outlined"
      >
        <v-btn value="timeline" size="small">
          <v-icon start>mdi-timeline</v-icon>
          Timeline
        </v-btn>
        <v-btn value="flow" size="small">
          <v-icon start>mdi-sitemap</v-icon>
          Flow
        </v-btn>
        <v-btn value="list" size="small">
          <v-icon start>mdi-format-list-bulleted</v-icon>
          List
        </v-btn>
      </v-btn-toggle>
      
      <v-spacer />
      
      <v-btn
        variant="text"
        @click="exportRoute"
      >
        <v-icon start>mdi-export</v-icon>
        Export
      </v-btn>
      
      <v-btn
        color="primary"
        variant="elevated"
        @click="applyRoute"
      >
        <v-icon start>mdi-check</v-icon>
        Apply Route
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { routeOptimizer } from '@/services/routeOptimizer'

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['apply-route', 'export-route'])

// State
const route = ref(null)
const viewMode = ref('timeline')
const showSettings = ref(false)
const showAllTasks = ref(false)
const expandedRooms = ref({})
const optimizationMode = ref('balanced')
const startRoom = ref('Entry')
const groupByFloor = ref(true)

// Options
const optimizationModes = [
  { title: 'Balanced', value: 'balanced' },
  { title: 'Minimize Distance', value: 'distance' },
  { title: 'Minimize Chemical Switches', value: 'chemicals' },
  { title: 'Optimize Time', value: 'time' }
]

// Computed
const availableRooms = computed(() => {
  const rooms = new Set()
  props.tasks.forEach(task => {
    if (task.room) rooms.add(task.room)
  })
  return ['Entry', ...Array.from(rooms).sort()]
})

const efficiencyAlertType = computed(() => {
  const efficiency = route.value?.metrics?.efficiency || 0
  if (efficiency >= 80) return 'success'
  if (efficiency >= 60) return 'info'
  if (efficiency >= 40) return 'warning'
  return 'error'
})

// Methods
const calculateRoute = () => {
  if (!props.tasks || props.tasks.length === 0) return
  
  const options = {
    startRoom: startRoom.value,
    optimizeBy: optimizationMode.value,
    groupByFloor: groupByFloor.value,
    minimizeChemicalSwitches: true,
    prioritizeHighFrequency: true
  }
  
  route.value = routeOptimizer.optimizeRoute(props.tasks, options)
}

const recalculateRoute = () => {
  calculateRoute()
}

const formatTime = (minutes) => {
  if (!minutes) return '0 min'
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}

const getRoomColor = (room) => {
  const colors = {
    'Entry': 'grey',
    'Living Room': 'blue',
    'Kitchen': 'orange',
    'Bedroom': 'purple',
    'Bathroom': 'teal',
    'Office': 'brown',
    'Dining Room': 'green'
  }
  return colors[room] || 'grey'
}

const getRoomIcon = (room) => {
  const icons = {
    'Entry': 'mdi-door',
    'Living Room': 'mdi-sofa',
    'Kitchen': 'mdi-silverware-fork-knife',
    'Bedroom': 'mdi-bed',
    'Bathroom': 'mdi-shower',
    'Office': 'mdi-desk',
    'Dining Room': 'mdi-table-chair',
    'Garage': 'mdi-garage',
    'Basement': 'mdi-home-floor-b',
    'Attic': 'mdi-home-roof'
  }
  return icons[room] || 'mdi-door'
}

const getUniqueChemicals = (tasks) => {
  const chemicals = new Set()
  tasks.forEach(task => {
    if (task.chemicals) {
      task.chemicals.forEach(chem => chemicals.add(chem))
    }
  })
  return Array.from(chemicals).slice(0, 3) // Show max 3 chemicals
}

const applyRoute = () => {
  if (route.value) {
    emit('apply-route', route.value)
  }
}

const exportRoute = () => {
  if (route.value) {
    const exportData = routeOptimizer.exportRoute(route.value)
    emit('export-route', exportData)
  }
}

// Watch for task changes
watch(() => props.tasks, () => {
  calculateRoute()
}, { deep: true })

// Initialize
onMounted(() => {
  calculateRoute()
})
</script>

<style scoped>
.route-visualization {
  min-height: 400px;
}

.flow-view {
  padding: 20px 0;
}
</style>
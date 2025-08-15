<template>
  <v-container fluid class="pa-0">
    <v-card flat>
      <v-card-title class="text-h5 font-weight-bold">
        <v-icon class="mr-2">mdi-floor-plan</v-icon>
        Select Rooms to Clean
      </v-card-title>
      
      <v-card-subtitle>
        Choose which rooms need cleaning for {{ industryName }}
      </v-card-subtitle>

      <v-card-text>
        <!-- Quick Actions -->
        <v-row class="mb-4">
          <v-col cols="auto">
            <v-btn
              variant="outlined"
              size="small"
              @click="selectAll"
            >
              <v-icon start>mdi-checkbox-multiple-marked</v-icon>
              Select All
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              variant="outlined"
              size="small"
              @click="deselectAll"
            >
              <v-icon start>mdi-checkbox-multiple-blank-outline</v-icon>
              Deselect All
            </v-btn>
          </v-col>
          <v-col>
            <v-chip color="primary" variant="flat">
              {{ selectedRooms.length }} rooms selected
            </v-chip>
          </v-col>
        </v-row>

        <!-- Room Selection Cards -->
        <v-row>
          <v-col
            v-for="room in availableRooms"
            :key="room.name"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card
              :variant="isRoomSelected(room.name) ? 'flat' : 'outlined'"
              :color="isRoomSelected(room.name) ? 'primary' : undefined"
              class="cursor-pointer"
              @click="toggleRoom(room)"
            >
              <v-card-text>
                <v-row align="center" no-gutters>
                  <v-col cols="auto">
                    <v-checkbox-btn
                      :model-value="isRoomSelected(room.name)"
                      :color="isRoomSelected(room.name) ? 'white' : 'primary'"
                    />
                  </v-col>
                  <v-col>
                    <div :class="isRoomSelected(room.name) ? 'text-white' : ''">
                      <div class="font-weight-medium">{{ room.name }}</div>
                      <div class="text-caption">
                        {{ room.tasks.length }} tasks • 
                        {{ calculateRoomTime(room.tasks) }} min
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Custom Room Addition -->
        <v-card variant="outlined" class="mt-4">
          <v-card-text>
            <v-row align="center">
              <v-col>
                <v-text-field
                  v-model="customRoomName"
                  label="Add Custom Room"
                  variant="outlined"
                  density="compact"
                  hide-details
                  @keyup.enter="addCustomRoom"
                />
              </v-col>
              <v-col cols="auto">
                <v-btn
                  color="primary"
                  variant="tonal"
                  :disabled="!customRoomName.trim()"
                  @click="addCustomRoom"
                >
                  <v-icon>mdi-plus</v-icon>
                  Add Room
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Custom Rooms List -->
        <div v-if="customRooms.length > 0" class="mt-4">
          <div class="text-subtitle-2 mb-2">Custom Rooms</div>
          <v-chip
            v-for="room in customRooms"
            :key="room"
            class="ma-1"
            closable
            @click:close="removeCustomRoom(room)"
          >
            {{ room }}
          </v-chip>
        </div>

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
              :disabled="selectedRooms.length === 0 && customRooms.length === 0"
              @click="handleNext"
            >
              Next: Select Tasks
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
import { getRoomsByIndustry, calculateRoomTime as calcTime } from '@/data/templates'

const emit = defineEmits(['next', 'back'])
const checklistStore = useChecklistStore()

// Get industry info
const industry = computed(() => checklistStore.currentChecklist?.industry)
const industryName = computed(() => {
  const names = {
    office: 'Office Cleaning',
    residential: 'Residential Cleaning',
    medical: 'Medical Facility',
    hospitality: 'Hotel/Hospitality',
    restaurant: 'Restaurant',
    retail: 'Retail Store'
  }
  return names[industry.value] || 'Cleaning Service'
})

// Available rooms for selected industry
const availableRooms = computed(() => {
  return getRoomsByIndustry(industry.value)
})

// Selected rooms
const selectedRooms = ref([])
const customRooms = ref([])
const customRoomName = ref('')

// Load existing selections
onMounted(() => {
  const existing = checklistStore.currentChecklist?.selectedRooms
  if (existing) {
    selectedRooms.value = existing.filter(r => !r.isCustom)
    customRooms.value = existing.filter(r => r.isCustom).map(r => r.name)
  }
})

// Check if room is selected
const isRoomSelected = (roomName) => {
  return selectedRooms.value.some(r => r.name === roomName)
}

// Toggle room selection
const toggleRoom = (room) => {
  const index = selectedRooms.value.findIndex(r => r.name === room.name)
  if (index > -1) {
    selectedRooms.value.splice(index, 1)
  } else {
    selectedRooms.value.push(room)
  }
}

// Select all rooms
const selectAll = () => {
  selectedRooms.value = [...availableRooms.value]
}

// Deselect all rooms
const deselectAll = () => {
  selectedRooms.value = []
}

// Calculate room time with multiplier
const calculateRoomTime = (tasks) => {
  const baseTime = calcTime(tasks)
  const multiplier = checklistStore.getTimeMultiplier()
  return Math.round(baseTime * multiplier)
}

// Add custom room
const addCustomRoom = () => {
  const name = customRoomName.value.trim()
  if (name && !customRooms.value.includes(name)) {
    customRooms.value.push(name)
    customRoomName.value = ''
  }
}

// Remove custom room
const removeCustomRoom = (room) => {
  const index = customRooms.value.indexOf(room)
  if (index > -1) {
    customRooms.value.splice(index, 1)
  }
}

// Handle next step
const handleNext = () => {
  // Combine selected rooms with custom rooms
  const allRooms = [
    ...selectedRooms.value,
    ...customRooms.value.map(name => ({
      name,
      tasks: [],
      isCustom: true
    }))
  ]
  
  // Update store
  checklistStore.updateSelectedRooms(allRooms)
  
  emit('next')
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
  transition: all 0.2s;
}

.cursor-pointer:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
</style>
<template>
  <v-container fluid class="pa-0">
    <v-card flat>
      <v-card-title class="text-h5 font-weight-bold">
        <v-icon class="mr-2">mdi-floor-plan</v-icon>
        Select Rooms to Clean
      </v-card-title>
      
      <v-card-subtitle>
        Choose rooms for your cleaning checklist
      </v-card-subtitle>

      <v-card-text>
        <!-- Search Bar -->
        <v-text-field
          v-model="searchQuery"
          label="Search rooms..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="comfortable"
          clearable
          class="mb-4"
        />

        <!-- Quick Actions -->
        <v-row class="mb-4">
          <v-col cols="auto">
            <v-btn
              variant="outlined"
              size="small"
              @click="selectAll"
            >
              <v-icon start>mdi-checkbox-multiple-marked</v-icon>
              Select All Visible
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              variant="outlined"
              size="small"
              @click="deselectAll"
            >
              <v-icon start>mdi-checkbox-multiple-blank-outline</v-icon>
              Clear Selection
            </v-btn>
          </v-col>
          <v-col>
            <v-chip color="primary" variant="flat">
              {{ selectedRooms.length }} rooms selected
            </v-chip>
          </v-col>
        </v-row>

        <!-- Category Tabs -->
        <v-tabs
          v-model="selectedCategory"
          color="primary"
          class="mb-4"
          show-arrows
        >
          <v-tab value="all">All Rooms</v-tab>
          <v-tab 
            v-for="category in categories" 
            :key="category"
            :value="category"
          >
            {{ category }}
          </v-tab>
        </v-tabs>

        <!-- Room Selection Grid -->
        <v-row>
          <v-col
            v-for="room in filteredRooms"
            :key="room.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card
              :variant="isRoomSelected(room.id) ? 'flat' : 'outlined'"
              :color="isRoomSelected(room.id) ? 'primary' : undefined"
              class="cursor-pointer room-card"
              @click="toggleRoom(room)"
            >
              <v-card-text class="pa-3">
                <v-row align="center" no-gutters>
                  <v-col cols="auto">
                    <v-checkbox-btn
                      :model-value="isRoomSelected(room.id)"
                      :color="isRoomSelected(room.id) ? 'white' : 'primary'"
                    />
                  </v-col>
                  <v-col>
                    <div :class="isRoomSelected(room.id) ? 'text-white' : ''">
                      <div class="d-flex align-center">
                        <v-icon 
                          size="small" 
                          class="mr-1"
                          :color="isRoomSelected(room.id) ? 'white' : 'grey'"
                        >
                          {{ room.icon || 'mdi-door' }}
                        </v-icon>
                        <div class="font-weight-medium">{{ room.name }}</div>
                      </div>
                      <div class="text-caption">
                        {{ room.category }}
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Custom Room Addition -->
        <v-card variant="outlined" class="mt-6">
          <v-card-title class="text-subtitle-1">
            <v-icon size="small" class="mr-2">mdi-plus-circle</v-icon>
            Add Custom Rooms
          </v-card-title>
          <v-card-text>
            <v-row align="center">
              <v-col>
                <v-text-field
                  v-model="customRoomName"
                  label="Enter custom room name"
                  variant="outlined"
                  density="compact"
                  hide-details
                  @keyup.enter="addCustomRoom"
                  placeholder="e.g., Wine Cellar, Studio, etc."
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
          <div class="text-subtitle-2 mb-2">Custom Rooms Added</div>
          <v-chip
            v-for="room in customRooms"
            :key="room"
            class="ma-1"
            color="secondary"
            closable
            @click:close="removeCustomRoom(room)"
          >
            <v-icon start size="small">mdi-home-plus</v-icon>
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
import { useChecklistStore } from '@/stores/checklistStore'
import { COMMON_ROOMS, getRoomCategories, searchRooms } from '@/data/commonRooms'

const emit = defineEmits(['next', 'back'])
const checklistStore = useChecklistStore()

// Search and filtering
const searchQuery = ref('')
const selectedCategory = ref('all')

// Get all categories
const categories = getRoomCategories()

// Selected rooms
const selectedRooms = ref([])
const customRooms = ref([])
const customRoomName = ref('')

// Filter rooms based on search and category
const filteredRooms = computed(() => {
  let rooms = [...COMMON_ROOMS]
  
  // Filter by category
  if (selectedCategory.value !== 'all') {
    rooms = rooms.filter(room => room.category === selectedCategory.value)
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    rooms = rooms.filter(room => 
      room.name.toLowerCase().includes(query) ||
      room.category.toLowerCase().includes(query)
    )
  }
  
  return rooms
})

// Load existing selections
onMounted(() => {
  const existing = checklistStore.currentChecklist?.selectedRooms
  if (existing) {
    selectedRooms.value = existing.filter(r => !r.isCustom)
    customRooms.value = existing.filter(r => r.isCustom).map(r => r.name)
  }
})

// Check if room is selected
const isRoomSelected = (roomId) => {
  return selectedRooms.value.some(r => r.id === roomId)
}

// Toggle room selection
const toggleRoom = (room) => {
  const index = selectedRooms.value.findIndex(r => r.id === room.id)
  if (index > -1) {
    selectedRooms.value.splice(index, 1)
  } else {
    selectedRooms.value.push({
      id: room.id,
      name: room.name,
      category: room.category,
      icon: room.icon,
      isCustom: false
    })
  }
}

// Select all visible rooms
const selectAll = () => {
  filteredRooms.value.forEach(room => {
    if (!isRoomSelected(room.id)) {
      selectedRooms.value.push({
        id: room.id,
        name: room.name,
        category: room.category,
        icon: room.icon,
        isCustom: false
      })
    }
  })
}

// Deselect all rooms
const deselectAll = () => {
  selectedRooms.value = []
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
      id: `custom-${name.toLowerCase().replace(/\s+/g, '-')}`,
      name,
      category: 'Custom',
      isCustom: true
    }))
  ]
  
  // Update store
  checklistStore.setSelectedRooms(allRooms)
  
  emit('next')
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
  transition: all 0.2s;
}

.room-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.v-tabs {
  border-bottom: 1px solid rgba(0,0,0,0.12);
}
</style>
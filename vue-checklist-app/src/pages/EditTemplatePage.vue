<template>
  <MainLayout :title="`Edit Template: ${template?.name || 'Loading...'}`">
    <v-container class="pa-4">
      <v-card v-if="template" elevation="2">
        <v-card-title>
          <v-icon left class="mr-2">mdi-pencil</v-icon>
          Edit Template
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid">
            <!-- Template Name -->
            <v-text-field
              v-model="template.name"
              label="Template Name"
              :rules="[v => !!v || 'Template name is required']"
              required
              prepend-icon="mdi-file-document"
              class="mb-4"
            />

            <!-- Category -->
            <v-select
              v-model="template.category"
              label="Category"
              :items="categories"
              prepend-icon="mdi-folder"
              class="mb-4"
            />

            <!-- Description -->
            <v-textarea
              v-model="template.description"
              label="Description"
              rows="3"
              prepend-icon="mdi-text"
              class="mb-4"
            />

            <!-- Icon and Color -->
            <v-row>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="template.icon"
                  label="Icon"
                  :items="availableIcons"
                  prepend-icon="mdi-shape"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-icon>{{ item.value }}</v-icon>
                      </template>
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{ item }">
                    <v-icon class="mr-2">{{ item.value }}</v-icon>
                    {{ item.title }}
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="template.color"
                  label="Color"
                  :items="availableColors"
                  prepend-icon="mdi-palette"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-icon :color="item.value">mdi-circle</v-icon>
                      </template>
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </template>
                  <template v-slot:selection="{ item }">
                    <v-icon :color="item.value" class="mr-2">mdi-circle</v-icon>
                    {{ item.title }}
                  </template>
                </v-select>
              </v-col>
            </v-row>

            <!-- Rooms and Time -->
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="template.rooms"
                  label="Number of Rooms"
                  type="number"
                  prepend-icon="mdi-door"
                  :rules="[v => v > 0 || 'Must have at least 1 room']"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="template.estimatedTime"
                  label="Estimated Time (minutes)"
                  type="number"
                  prepend-icon="mdi-clock-outline"
                  :rules="[v => v > 0 || 'Time must be greater than 0']"
                />
              </v-col>
            </v-row>

            <!-- Tasks Section -->
            <v-divider class="my-4" />
            <h3 class="text-h6 mb-3">
              <v-icon left>mdi-checkbox-marked-outline</v-icon>
              Template Tasks
            </h3>
            
            <v-alert type="info" variant="tonal" class="mb-4">
              Define the tasks that will be included when this template is used.
              You can add rooms and specific tasks for each room.
            </v-alert>

            <!-- Room Management -->
            <v-card variant="outlined" class="mb-4">
              <v-card-text>
                <div class="d-flex align-center mb-3">
                  <v-text-field
                    v-model="newRoomName"
                    label="Add Room"
                    variant="outlined"
                    density="compact"
                    hide-details
                    @keyup.enter="addRoom"
                  />
                  <v-btn
                    color="primary"
                    class="ml-2"
                    @click="addRoom"
                    :disabled="!newRoomName"
                  >
                    Add Room
                  </v-btn>
                </div>

                <!-- Room List -->
                <v-expansion-panels v-if="template.tasksByRoom && Object.keys(template.tasksByRoom).length">
                  <v-expansion-panel
                    v-for="(tasks, room) in template.tasksByRoom"
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
                      <!-- Tasks for this room -->
                      <div class="d-flex align-center mb-2">
                        <v-text-field
                          v-model="newTaskByRoom[room]"
                          :label="`Add task to ${room}`"
                          variant="outlined"
                          density="compact"
                          hide-details
                          @keyup.enter="addTaskToRoom(room)"
                        />
                        <v-btn
                          size="small"
                          color="primary"
                          class="ml-2"
                          @click="addTaskToRoom(room)"
                          :disabled="!newTaskByRoom[room]"
                        >
                          Add
                        </v-btn>
                      </div>
                      
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
                              @click="removeTaskFromRoom(room, index)"
                            >
                              <v-icon size="small" color="error">mdi-delete</v-icon>
                            </v-btn>
                          </template>
                        </v-list-item>
                      </v-list>
                      
                      <v-btn
                        color="error"
                        variant="text"
                        size="small"
                        class="mt-2"
                        @click="removeRoom(room)"
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
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="cancel"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            @click="saveTemplate"
            :disabled="!valid"
          >
            Save Template
          </v-btn>
        </v-card-actions>
      </v-card>

      <!-- Loading State -->
      <v-card v-else elevation="2" class="pa-8 text-center">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        />
        <v-card-title class="mt-4">
          Loading template...
        </v-card-title>
      </v-card>
    </v-container>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useChecklistStore } from '@/stores/checklistStore'
import MainLayout from '@/layouts/MainLayout.vue'

const router = useRouter()
const route = useRoute()
const checklistStore = useChecklistStore()

// State
const template = ref(null)
const valid = ref(false)
const form = ref(null)
const newRoomName = ref('')
const newTaskByRoom = reactive({})

// Available options
const categories = ref([
  'Residential',
  'Commercial',
  'Deep Clean',
  'Special',
  'Maintenance',
  'Custom'
])

const availableIcons = ref([
  { title: 'Home', value: 'mdi-home' },
  { title: 'Office', value: 'mdi-office-building' },
  { title: 'Kitchen', value: 'mdi-silverware-fork-knife' },
  { title: 'Bathroom', value: 'mdi-shower' },
  { title: 'Bedroom', value: 'mdi-bed' },
  { title: 'Living Room', value: 'mdi-sofa' },
  { title: 'Truck', value: 'mdi-truck' },
  { title: 'Lightning', value: 'mdi-lightning-bolt' },
  { title: 'Star', value: 'mdi-star' },
  { title: 'Check', value: 'mdi-check-circle' }
])

const availableColors = ref([
  { title: 'Primary', value: 'primary' },
  { title: 'Blue', value: 'blue' },
  { title: 'Green', value: 'green' },
  { title: 'Orange', value: 'orange' },
  { title: 'Red', value: 'red' },
  { title: 'Purple', value: 'purple' },
  { title: 'Cyan', value: 'cyan' },
  { title: 'Yellow', value: 'yellow-darken-3' },
  { title: 'Teal', value: 'teal' },
  { title: 'Indigo', value: 'indigo' }
])

// Sample template data - in a real app, this would come from a store or API
const templateData = {
  '1': {
    id: '1',
    name: 'Standard House Cleaning',
    category: 'Residential',
    description: 'Complete house cleaning checklist for regular maintenance',
    icon: 'mdi-home',
    color: 'primary',
    rooms: 8,
    estimatedTime: 120,
    tasksByRoom: {
      'Living Room': [
        'Dust all surfaces',
        'Vacuum carpet',
        'Clean windows',
        'Organize items'
      ],
      'Kitchen': [
        'Clean countertops',
        'Wipe down appliances',
        'Mop floor',
        'Empty trash'
      ],
      'Bathroom': [
        'Clean toilet',
        'Scrub shower/tub',
        'Clean mirror',
        'Mop floor'
      ],
      'Bedroom': [
        'Make bed',
        'Dust furniture',
        'Vacuum floor',
        'Organize closet'
      ]
    }
  },
  '2': {
    id: '2',
    name: 'Deep Clean - Kitchen',
    category: 'Deep Clean',
    description: 'Thorough kitchen deep cleaning including appliances',
    icon: 'mdi-silverware-fork-knife',
    color: 'orange',
    rooms: 1,
    estimatedTime: 90,
    tasksByRoom: {
      'Kitchen': [
        'Clean inside oven',
        'Defrost and clean refrigerator',
        'Clean microwave thoroughly',
        'Descale coffee maker',
        'Clean dishwasher',
        'Scrub sink and faucet',
        'Clean cabinet fronts',
        'Wipe down backsplash',
        'Deep clean floor'
      ]
    }
  }
}

// Methods
const loadTemplate = () => {
  const templateId = route.params.id
  // In a real app, load from store or API
  const loadedTemplate = templateData[templateId]
  
  if (loadedTemplate) {
    template.value = { ...loadedTemplate }
    if (!template.value.tasksByRoom) {
      template.value.tasksByRoom = {}
    }
  } else {
    // If template not found, redirect back
    router.push('/templates')
  }
}

const addRoom = () => {
  if (newRoomName.value && template.value) {
    if (!template.value.tasksByRoom) {
      template.value.tasksByRoom = {}
    }
    if (!template.value.tasksByRoom[newRoomName.value]) {
      template.value.tasksByRoom[newRoomName.value] = []
      newTaskByRoom[newRoomName.value] = ''
    }
    newRoomName.value = ''
  }
}

const removeRoom = (room) => {
  if (template.value && template.value.tasksByRoom) {
    delete template.value.tasksByRoom[room]
    delete newTaskByRoom[room]
  }
}

const addTaskToRoom = (room) => {
  if (newTaskByRoom[room] && template.value && template.value.tasksByRoom[room]) {
    template.value.tasksByRoom[room].push(newTaskByRoom[room])
    newTaskByRoom[room] = ''
  }
}

const removeTaskFromRoom = (room, index) => {
  if (template.value && template.value.tasksByRoom[room]) {
    template.value.tasksByRoom[room].splice(index, 1)
  }
}

const saveTemplate = () => {
  if (form.value.validate()) {
    // In a real app, save to store or API
    console.log('Saving template:', template.value)
    
    // Show success message
    // You could use a snackbar or notification here
    
    // Navigate back to templates page
    router.push('/templates')
  }
}

const cancel = () => {
  router.push('/templates')
}

// Lifecycle
onMounted(() => {
  loadTemplate()
})
</script>

<style scoped>
.v-expansion-panel-title {
  padding: 12px 16px;
}

.v-expansion-panel-text {
  padding: 16px;
}
</style>
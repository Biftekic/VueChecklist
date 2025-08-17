<template>
  <v-dialog
    v-model="dialog"
    max-width="900"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        color="success"
        variant="tonal"
        prepend-icon="mdi-clipboard-check"
        block
      >
        Quality Inspection
      </v-btn>
    </template>

    <v-card>
      <v-toolbar color="primary" dark>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Quality Assurance Inspection</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="saveInspection">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-0">
        <!-- Progress Header -->
        <v-card flat class="ma-3 mb-2">
          <v-card-text>
            <div class="d-flex justify-space-between align-center mb-2">
              <h3 class="text-h6">Inspection Progress</h3>
              <v-chip :color="getOverallStatusColor()" variant="tonal">
                {{ getOverallStatus() }}
              </v-chip>
            </div>
            <v-progress-linear
              :model-value="inspectionProgress"
              height="8"
              rounded
              :color="getOverallStatusColor()"
            />
            <div class="d-flex justify-space-between mt-2">
              <span class="text-caption">{{ completedItems }}/{{ totalItems }} items checked</span>
              <span class="text-caption font-weight-bold">{{ qualityScore }}% Quality Score</span>
            </div>
          </v-card-text>
        </v-card>

        <!-- Inspection Categories -->
        <v-expansion-panels
          v-model="expandedPanels"
          multiple
          class="mx-3"
        >
          <v-expansion-panel
            v-for="(category, index) in inspectionCategories"
            :key="index"
          >
            <v-expansion-panel-title>
              <div class="d-flex align-center" style="width: 100%">
                <v-icon :color="getCategoryColor(category)" class="mr-3">
                  {{ category.icon }}
                </v-icon>
                <div class="flex-grow-1">
                  <div class="font-weight-medium">{{ category.name }}</div>
                  <div class="text-caption text-medium-emphasis">
                    {{ getCategoryProgress(category) }}
                  </div>
                </div>
                <v-chip size="small" :color="getCategoryStatusColor(category)" variant="tonal">
                  {{ getCategoryScore(category) }}%
                </v-chip>
              </div>
            </v-expansion-panel-title>

            <v-expansion-panel-text>
              <!-- Room/Area Tabs -->
              <v-tabs v-model="category.activeRoom" class="mb-3">
                <v-tab v-for="room in category.rooms" :key="room.id" :value="room.id">
                  {{ room.name }}
                  <v-badge
                    v-if="getRoomIssueCount(category, room) > 0"
                    :content="getRoomIssueCount(category, room)"
                    color="error"
                    class="ml-2"
                  />
                </v-tab>
              </v-tabs>

              <!-- Inspection Items -->
              <v-window v-model="category.activeRoom">
                <v-window-item v-for="room in category.rooms" :key="room.id" :value="room.id">
                  <v-list density="compact">
                    <v-list-item
                      v-for="item in room.inspectionItems"
                      :key="item.id"
                      class="px-0"
                    >
                      <v-list-item-title>
                        <div class="d-flex align-center">
                          <v-checkbox
                            v-model="item.status"
                            :true-value="'pass'"
                            :false-value="'pending'"
                            hide-details
                            density="compact"
                            class="flex-shrink-0"
                            @update:model-value="updateItemStatus(item)"
                          />
                          <div class="flex-grow-1 mx-2">
                            <div>{{ item.name }}</div>
                            <div class="text-caption text-medium-emphasis">
                              {{ item.description }}
                            </div>
                          </div>
                          <div class="d-flex gap-1">
                            <!-- Pass/Fail Buttons -->
                            <v-btn
                              icon="mdi-check"
                              size="small"
                              :color="item.status === 'pass' ? 'success' : 'grey'"
                              variant="text"
                              @click="setItemStatus(item, 'pass')"
                            />
                            <v-btn
                              icon="mdi-close"
                              size="small"
                              :color="item.status === 'fail' ? 'error' : 'grey'"
                              variant="text"
                              @click="setItemStatus(item, 'fail')"
                            />
                            <!-- Photo Button -->
                            <v-btn
                              icon="mdi-camera"
                              size="small"
                              :color="item.photos?.length > 0 ? 'primary' : 'grey'"
                              variant="text"
                              @click="openPhotoDialog(item)"
                            >
                              <v-badge
                                v-if="item.photos?.length > 0"
                                :content="item.photos.length"
                                color="primary"
                              />
                            </v-btn>
                            <!-- Issue Button -->
                            <v-btn
                              icon="mdi-alert"
                              size="small"
                              :color="item.issue ? 'warning' : 'grey'"
                              variant="text"
                              @click="openIssueDialog(item)"
                            />
                          </div>
                        </div>
                      </v-list-item-title>

                      <!-- Issue Display -->
                      <v-alert
                        v-if="item.issue"
                        type="warning"
                        density="compact"
                        class="mt-2"
                        closable
                        @click:close="item.issue = null"
                      >
                        <div class="text-caption">
                          <strong>{{ item.issue.severity }}:</strong> {{ item.issue.description }}
                        </div>
                      </v-alert>

                      <!-- Photo Thumbnails -->
                      <div v-if="item.photos?.length > 0" class="d-flex gap-1 mt-2">
                        <v-img
                          v-for="(photo, idx) in item.photos"
                          :key="idx"
                          :src="photo.url"
                          width="60"
                          height="60"
                          cover
                          rounded
                          class="border"
                          @click="viewPhoto(photo)"
                        />
                      </div>
                    </v-list-item>
                  </v-list>
                </v-window-item>
              </v-window>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- Customer Sign-off Section -->
        <v-card flat class="ma-3 mt-4">
          <v-card-title>Customer Sign-off</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="signOff.customerName"
                  label="Customer Name"
                  prepend-icon="mdi-account"
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-rating
                  v-model="signOff.satisfaction"
                  hover
                  half-increments
                  color="amber"
                  class="mt-2"
                />
                <div class="text-caption text-center">Satisfaction Rating</div>
              </v-col>
            </v-row>
            <v-textarea
              v-model="signOff.comments"
              label="Comments"
              rows="3"
              variant="outlined"
              density="compact"
              class="mt-2"
            />
            <v-card flat class="border mt-3 pa-3">
              <div class="text-center">
                <v-icon size="x-large" color="grey-lighten-1">mdi-draw-pen</v-icon>
                <div class="text-caption text-medium-emphasis mt-2">
                  Digital Signature Area
                </div>
                <v-btn
                  variant="outlined"
                  size="small"
                  class="mt-2"
                  @click="captureSignature"
                >
                  Capture Signature
                </v-btn>
              </div>
            </v-card>
          </v-card-text>
        </v-card>

        <!-- Summary Actions -->
        <v-card flat class="ma-3">
          <v-card-actions>
            <v-btn
              color="success"
              variant="flat"
              prepend-icon="mdi-check-all"
              block
              :disabled="!isInspectionComplete"
              @click="completeInspection"
            >
              Complete Inspection
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card-text>
    </v-card>

    <!-- Photo Documentation Dialog -->
    <v-dialog v-model="photoDialog" max-width="600">
      <v-card>
        <v-card-title>Photo Documentation</v-card-title>
        <v-card-text>
          <div v-if="selectedItem">
            <h4 class="text-subtitle-1 mb-3">{{ selectedItem.name }}</h4>
            
            <!-- Photo Upload -->
            <v-file-input
              v-model="photoFiles"
              label="Upload Photos"
              multiple
              accept="image/*"
              prepend-icon="mdi-camera"
              variant="outlined"
              density="compact"
              @update:model-value="handlePhotoUpload"
            />

            <!-- Photo Grid -->
            <div class="photo-grid mt-3">
              <div
                v-for="(photo, index) in selectedItem.photos"
                :key="index"
                class="photo-item"
              >
                <v-img
                  :src="photo.url"
                  height="150"
                  cover
                  class="rounded"
                />
                <v-text-field
                  v-model="photo.annotation"
                  label="Annotation"
                  density="compact"
                  variant="outlined"
                  class="mt-2"
                />
                <v-btn
                  icon="mdi-delete"
                  size="x-small"
                  color="error"
                  variant="text"
                  class="photo-delete"
                  @click="removePhoto(selectedItem, index)"
                />
              </div>
            </div>

            <!-- Before/After Toggle -->
            <v-switch
              v-model="beforeAfterMode"
              label="Before/After Comparison"
              color="primary"
              density="compact"
              class="mt-3"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="photoDialog = false">Close</v-btn>
          <v-btn color="primary" variant="flat" @click="savePhotos">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Issue Reporting Dialog -->
    <v-dialog v-model="issueDialog" max-width="500">
      <v-card>
        <v-card-title>Report Issue</v-card-title>
        <v-card-text>
          <div v-if="selectedItem">
            <h4 class="text-subtitle-1 mb-3">{{ selectedItem.name }}</h4>
            
            <v-select
              v-model="issueForm.category"
              :items="issueCategories"
              label="Issue Category"
              variant="outlined"
              density="compact"
            />

            <v-select
              v-model="issueForm.severity"
              :items="severityLevels"
              label="Severity Level"
              variant="outlined"
              density="compact"
              class="mt-3"
            />

            <v-textarea
              v-model="issueForm.description"
              label="Issue Description"
              rows="3"
              variant="outlined"
              density="compact"
              class="mt-3"
            />

            <v-checkbox
              v-model="issueForm.requiresFollowUp"
              label="Requires Follow-up"
              density="compact"
            />

            <v-text-field
              v-if="issueForm.requiresFollowUp"
              v-model="issueForm.followUpDate"
              label="Follow-up Date"
              type="date"
              variant="outlined"
              density="compact"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="issueDialog = false">Cancel</v-btn>
          <v-btn color="warning" variant="flat" @click="saveIssue">Report Issue</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useChecklistStore } from '@/stores/checklistStore'

const props = defineProps({
  checklistId: {
    type: String,
    required: true
  }
})

const checklistStore = useChecklistStore()

// Dialog states
const dialog = ref(false)
const photoDialog = ref(false)
const issueDialog = ref(false)
const expandedPanels = ref([0])

// Selected items
const selectedItem = ref(null)
const photoFiles = ref([])
const beforeAfterMode = ref(false)

// Issue form
const issueForm = ref({
  category: '',
  severity: 'Low',
  description: '',
  requiresFollowUp: false,
  followUpDate: ''
})

// Sign-off data
const signOff = ref({
  customerName: '',
  satisfaction: 0,
  comments: '',
  signature: null
})

// Issue categories and severity levels
const issueCategories = [
  'Cleaning Quality',
  'Missed Area',
  'Damage',
  'Supply Issue',
  'Time Constraint',
  'Access Problem',
  'Safety Concern',
  'Other'
]

const severityLevels = [
  { title: 'Low', value: 'Low' },
  { title: 'Medium', value: 'Medium' },
  { title: 'High', value: 'High' },
  { title: 'Critical', value: 'Critical' }
]

// Inspection categories with templates
const inspectionCategories = ref([
  {
    name: 'General Cleanliness',
    icon: 'mdi-broom',
    activeRoom: null,
    rooms: [
      {
        id: 'living-room',
        name: 'Living Room',
        inspectionItems: [
          {
            id: 'dust-surfaces',
            name: 'Dust-free surfaces',
            description: 'All surfaces should be free of dust and debris',
            status: 'pending',
            photos: [],
            issue: null
          },
          {
            id: 'floor-clean',
            name: 'Floor cleanliness',
            description: 'Floors vacuumed/mopped, no visible dirt or stains',
            status: 'pending',
            photos: [],
            issue: null
          },
          {
            id: 'windows-clean',
            name: 'Windows and mirrors',
            description: 'Streak-free, no fingerprints or smudges',
            status: 'pending',
            photos: [],
            issue: null
          }
        ]
      },
      {
        id: 'kitchen',
        name: 'Kitchen',
        inspectionItems: [
          {
            id: 'countertops',
            name: 'Countertops sanitized',
            description: 'Clean and disinfected, no stains or residue',
            status: 'pending',
            photos: [],
            issue: null
          },
          {
            id: 'appliances',
            name: 'Appliances cleaned',
            description: 'Inside and outside of appliances clean',
            status: 'pending',
            photos: [],
            issue: null
          },
          {
            id: 'sink-faucets',
            name: 'Sink and faucets',
            description: 'Shining, no water spots or soap scum',
            status: 'pending',
            photos: [],
            issue: null
          }
        ]
      },
      {
        id: 'bathroom',
        name: 'Bathroom',
        inspectionItems: [
          {
            id: 'toilet-clean',
            name: 'Toilet thoroughly cleaned',
            description: 'Inside, outside, and behind toilet clean and sanitized',
            status: 'pending',
            photos: [],
            issue: null
          },
          {
            id: 'shower-tub',
            name: 'Shower/tub condition',
            description: 'No soap scum, mildew, or water stains',
            status: 'pending',
            photos: [],
            issue: null
          },
          {
            id: 'bathroom-floor',
            name: 'Floor and baseboards',
            description: 'Clean, including corners and behind toilet',
            status: 'pending',
            photos: [],
            issue: null
          }
        ]
      }
    ]
  },
  {
    name: 'Organization',
    icon: 'mdi-folder-outline',
    activeRoom: null,
    rooms: [
      {
        id: 'all-rooms',
        name: 'All Rooms',
        inspectionItems: [
          {
            id: 'items-organized',
            name: 'Items properly organized',
            description: 'Everything in its designated place',
            status: 'pending',
            photos: [],
            issue: null
          },
          {
            id: 'trash-removed',
            name: 'Trash removed',
            description: 'All trash bins emptied and bags replaced',
            status: 'pending',
            photos: [],
            issue: null
          },
          {
            id: 'supplies-restocked',
            name: 'Supplies restocked',
            description: 'Paper products, soap, etc. replenished',
            status: 'pending',
            photos: [],
            issue: null
          }
        ]
      }
    ]
  },
  {
    name: 'Safety & Compliance',
    icon: 'mdi-shield-check',
    activeRoom: null,
    rooms: [
      {
        id: 'safety-check',
        name: 'Safety Check',
        inspectionItems: [
          {
            id: 'no-hazards',
            name: 'No safety hazards',
            description: 'No wet floors, loose items, or trip hazards',
            status: 'pending',
            photos: [],
            issue: null
          },
          {
            id: 'chemicals-stored',
            name: 'Chemicals properly stored',
            description: 'All cleaning products secured and labeled',
            status: 'pending',
            photos: [],
            issue: null
          },
          {
            id: 'equipment-condition',
            name: 'Equipment in good condition',
            description: 'All tools and equipment functioning properly',
            status: 'pending',
            photos: [],
            issue: null
          }
        ]
      }
    ]
  }
])

// Initialize active rooms
inspectionCategories.value.forEach(category => {
  if (category.rooms.length > 0) {
    category.activeRoom = category.rooms[0].id
  }
})

// Computed properties
const totalItems = computed(() => {
  let count = 0
  inspectionCategories.value.forEach(category => {
    category.rooms.forEach(room => {
      count += room.inspectionItems.length
    })
  })
  return count
})

const completedItems = computed(() => {
  let count = 0
  inspectionCategories.value.forEach(category => {
    category.rooms.forEach(room => {
      room.inspectionItems.forEach(item => {
        if (item.status !== 'pending') {
          count++
        }
      })
    })
  })
  return count
})

const inspectionProgress = computed(() => {
  if (totalItems.value === 0) return 0
  return Math.round((completedItems.value / totalItems.value) * 100)
})

const qualityScore = computed(() => {
  if (completedItems.value === 0) return 0
  let passCount = 0
  inspectionCategories.value.forEach(category => {
    category.rooms.forEach(room => {
      room.inspectionItems.forEach(item => {
        if (item.status === 'pass') {
          passCount++
        }
      })
    })
  })
  return Math.round((passCount / completedItems.value) * 100)
})

const isInspectionComplete = computed(() => {
  return completedItems.value === totalItems.value && signOff.value.customerName
})

// Methods
const getOverallStatus = () => {
  if (inspectionProgress.value === 0) return 'Not Started'
  if (inspectionProgress.value === 100) {
    if (qualityScore.value >= 90) return 'Excellent'
    if (qualityScore.value >= 75) return 'Good'
    if (qualityScore.value >= 60) return 'Acceptable'
    return 'Needs Improvement'
  }
  return 'In Progress'
}

const getOverallStatusColor = () => {
  if (inspectionProgress.value === 100) {
    if (qualityScore.value >= 90) return 'success'
    if (qualityScore.value >= 75) return 'light-green'
    if (qualityScore.value >= 60) return 'warning'
    return 'error'
  }
  return 'primary'
}

const getCategoryProgress = (category) => {
  let total = 0
  let completed = 0
  category.rooms.forEach(room => {
    total += room.inspectionItems.length
    room.inspectionItems.forEach(item => {
      if (item.status !== 'pending') {
        completed++
      }
    })
  })
  return `${completed}/${total} items checked`
}

const getCategoryScore = (category) => {
  let completed = 0
  let passed = 0
  category.rooms.forEach(room => {
    room.inspectionItems.forEach(item => {
      if (item.status !== 'pending') {
        completed++
        if (item.status === 'pass') {
          passed++
        }
      }
    })
  })
  if (completed === 0) return 0
  return Math.round((passed / completed) * 100)
}

const getCategoryColor = (category) => {
  const score = getCategoryScore(category)
  if (score >= 90) return 'success'
  if (score >= 75) return 'light-green'
  if (score >= 60) return 'warning'
  if (score > 0) return 'error'
  return 'grey'
}

const getCategoryStatusColor = (category) => {
  const score = getCategoryScore(category)
  if (score >= 90) return 'success'
  if (score >= 75) return 'light-green'
  if (score >= 60) return 'warning'
  if (score > 0) return 'error'
  return 'grey'
}

const getRoomIssueCount = (category, room) => {
  return room.inspectionItems.filter(item => item.issue !== null).length
}

const setItemStatus = (item, status) => {
  item.status = status
}

const updateItemStatus = (item) => {
  // Auto-update status based on checkbox
  if (item.status === 'pending') {
    item.status = 'pass'
  } else if (item.status === 'pass') {
    item.status = 'pending'
  }
}

const openPhotoDialog = (item) => {
  selectedItem.value = item
  if (!item.photos) {
    item.photos = []
  }
  photoDialog.value = true
}

const openIssueDialog = (item) => {
  selectedItem.value = item
  if (item.issue) {
    issueForm.value = { ...item.issue }
  } else {
    issueForm.value = {
      category: '',
      severity: 'Low',
      description: '',
      requiresFollowUp: false,
      followUpDate: ''
    }
  }
  issueDialog.value = true
}

const handlePhotoUpload = (files) => {
  if (!files || !selectedItem.value) return
  
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      selectedItem.value.photos.push({
        url: e.target.result,
        annotation: '',
        timestamp: new Date().toISOString(),
        type: beforeAfterMode.value ? 'after' : 'before'
      })
    }
    reader.readAsDataURL(file)
  })
  
  photoFiles.value = []
}

const removePhoto = (item, index) => {
  item.photos.splice(index, 1)
}

const savePhotos = () => {
  photoDialog.value = false
  selectedItem.value = null
}

const saveIssue = () => {
  if (selectedItem.value) {
    selectedItem.value.issue = { ...issueForm.value }
    selectedItem.value.status = 'fail'
  }
  issueDialog.value = false
  selectedItem.value = null
}

const viewPhoto = (photo) => {
  // Implement photo viewer
  console.log('View photo:', photo)
}

const captureSignature = () => {
  // Implement signature capture
  console.log('Capture signature')
  // This would typically open a signature pad dialog
  signOff.value.signature = 'signature-captured'
}

const saveInspection = () => {
  const inspectionData = {
    checklistId: props.checklistId,
    categories: inspectionCategories.value,
    signOff: signOff.value,
    qualityScore: qualityScore.value,
    completedAt: new Date().toISOString()
  }
  
  // Save to store or database
  console.log('Saving inspection:', inspectionData)
  
  // Show success message
  dialog.value = false
}

const completeInspection = () => {
  if (isInspectionComplete.value) {
    saveInspection()
  }
}
</script>

<style scoped>
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.photo-item {
  position: relative;
}

.photo-delete {
  position: absolute;
  top: 4px;
  right: 4px;
}

.v-expansion-panel-text :deep(.v-expansion-panel-text__wrapper) {
  padding: 8px 0;
}
</style>
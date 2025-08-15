<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="900"
    scrollable
  >
    <v-card>
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>Task Template Library</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="$emit('update:modelValue', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-0">
        <v-container fluid>
          <!-- Search and Filters -->
          <v-row class="mb-3">
            <v-col cols="12" md="6">
              <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                label="Search templates..."
                variant="outlined"
                density="compact"
                clearable
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedCategory"
                :items="categories"
                label="Category"
                variant="outlined"
                density="compact"
                clearable
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedRoom"
                :items="rooms"
                label="Room"
                variant="outlined"
                density="compact"
                clearable
                hide-details
              />
            </v-col>
          </v-row>

          <!-- View Toggle -->
          <v-tabs v-model="viewTab" density="compact" class="mb-3">
            <v-tab value="all">
              <v-icon start>mdi-view-grid</v-icon>
              All Templates
            </v-tab>
            <v-tab value="popular">
              <v-icon start>mdi-star</v-icon>
              Popular
            </v-tab>
            <v-tab value="recent">
              <v-icon start>mdi-clock-outline</v-icon>
              Recent
            </v-tab>
            <v-tab value="custom">
              <v-icon start>mdi-account</v-icon>
              My Templates
            </v-tab>
          </v-tabs>

          <!-- Actions Bar -->
          <div class="d-flex justify-space-between align-center mb-3">
            <v-chip-group v-if="selectedTemplates.length > 0">
              <v-chip color="primary" variant="elevated">
                {{ selectedTemplates.length }} selected
              </v-chip>
            </v-chip-group>
            
            <div>
              <v-btn
                v-if="selectedTemplates.length > 0"
                color="primary"
                variant="tonal"
                size="small"
                @click="addSelectedToChecklist"
                class="mr-2"
              >
                <v-icon start>mdi-plus</v-icon>
                Add to Checklist
              </v-btn>
              
              <v-btn
                color="secondary"
                variant="outlined"
                size="small"
                @click="createNewTemplate"
              >
                <v-icon start>mdi-plus-circle</v-icon>
                Create Template
              </v-btn>
            </div>
          </div>

          <!-- Templates Grid -->
          <v-row v-if="loading">
            <v-col cols="12" class="text-center">
              <v-progress-circular indeterminate color="primary" />
            </v-col>
          </v-row>

          <v-row v-else-if="filteredTemplates.length === 0">
            <v-col cols="12">
              <v-alert type="info" variant="tonal">
                No templates found. Try adjusting your filters or create a new template.
              </v-alert>
            </v-col>
          </v-row>

          <v-row v-else>
            <v-col
              v-for="template in filteredTemplates"
              :key="template.id"
              cols="12"
              md="6"
              lg="4"
            >
              <v-card
                variant="outlined"
                :class="{ 'border-primary': isTemplateSelected(template.id) }"
                @click="toggleTemplateSelection(template.id)"
                style="cursor: pointer;"
              >
                <v-card-text>
                  <!-- Header -->
                  <div class="d-flex justify-space-between align-start mb-2">
                    <div class="flex-grow-1">
                      <h4 class="text-subtitle-1 font-weight-bold">
                        {{ template.name }}
                      </h4>
                      <div class="text-caption text-grey">
                        {{ template.category }} • {{ template.room }}
                      </div>
                    </div>
                    <v-checkbox
                      :model-value="isTemplateSelected(template.id)"
                      @click.stop
                      @update:model-value="toggleTemplateSelection(template.id)"
                      hide-details
                      density="compact"
                    />
                  </div>

                  <!-- Description -->
                  <p v-if="template.description" class="text-body-2 mb-2">
                    {{ template.description }}
                  </p>

                  <!-- Details -->
                  <div class="mb-2">
                    <v-chip
                      v-if="template.frequency"
                      size="x-small"
                      :color="getFrequencyColor(template.frequency)"
                      variant="tonal"
                      class="mr-1"
                    >
                      {{ template.frequency }}
                    </v-chip>
                    <v-chip size="x-small" variant="tonal">
                      <v-icon start size="x-small">mdi-clock-outline</v-icon>
                      {{ template.estimatedTime }} min
                    </v-chip>
                    <v-chip
                      v-if="template.usageCount > 0"
                      size="x-small"
                      variant="tonal"
                      class="ml-1"
                    >
                      <v-icon start size="x-small">mdi-counter</v-icon>
                      Used {{ template.usageCount }}x
                    </v-chip>
                  </div>

                  <!-- Tags -->
                  <div v-if="template.tags && template.tags.length > 0" class="mb-2">
                    <v-chip
                      v-for="tag in template.tags.slice(0, 3)"
                      :key="tag"
                      size="x-small"
                      variant="text"
                      color="grey"
                      class="mr-1"
                    >
                      #{{ tag }}
                    </v-chip>
                  </div>

                  <!-- Actions -->
                  <v-divider class="my-2" />
                  <div class="d-flex justify-space-between">
                    <v-btn
                      size="x-small"
                      variant="text"
                      @click.stop="viewTemplateDetails(template)"
                    >
                      <v-icon start size="small">mdi-eye</v-icon>
                      View
                    </v-btn>
                    <v-btn
                      size="x-small"
                      variant="text"
                      @click.stop="editTemplate(template)"
                      v-if="!template.isShared"
                    >
                      <v-icon start size="small">mdi-pencil</v-icon>
                      Edit
                    </v-btn>
                    <v-btn
                      size="x-small"
                      variant="text"
                      color="primary"
                      @click.stop="addTemplateToChecklist(template)"
                    >
                      <v-icon start size="small">mdi-plus</v-icon>
                      Add
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>

    <!-- Template Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="600" scrollable>
      <v-card v-if="selectedTemplate">
        <v-toolbar color="primary" dark flat density="compact">
          <v-toolbar-title>{{ selectedTemplate.name }}</v-toolbar-title>
          <v-spacer />
          <v-btn icon size="small" @click="detailsDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        
        <v-card-text>
          <!-- Basic Info -->
          <div class="mb-4">
            <div class="text-overline">Details</div>
            <v-list density="compact">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon size="small">mdi-shape</v-icon>
                </template>
                <v-list-item-title>Category: {{ selectedTemplate.category }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon size="small">mdi-door</v-icon>
                </template>
                <v-list-item-title>Room: {{ selectedTemplate.room }}</v-list-item-title>
              </v-list-item>
              <v-list-item v-if="selectedTemplate.frequency">
                <template v-slot:prepend>
                  <v-icon size="small">mdi-calendar-repeat</v-icon>
                </template>
                <v-list-item-title>Frequency: {{ selectedTemplate.frequency }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon size="small">mdi-clock-outline</v-icon>
                </template>
                <v-list-item-title>
                  Time: {{ selectedTemplate.estimatedTime }} min
                  <span v-if="selectedTemplate.minTime && selectedTemplate.maxTime" class="text-caption">
                    ({{ selectedTemplate.minTime }}-{{ selectedTemplate.maxTime }} min)
                  </span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </div>

          <!-- Steps -->
          <div v-if="selectedTemplate.steps && selectedTemplate.steps.length > 0" class="mb-4">
            <div class="text-overline">Steps</div>
            <v-list density="compact">
              <v-list-item
                v-for="(step, index) in selectedTemplate.steps"
                :key="index"
              >
                <template v-slot:prepend>
                  <v-avatar size="20" color="primary" variant="tonal">
                    {{ index + 1 }}
                  </v-avatar>
                </template>
                <v-list-item-title>{{ step }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>

          <!-- Chemicals & Tools -->
          <v-row>
            <v-col cols="12" md="6" v-if="selectedTemplate.chemicals && selectedTemplate.chemicals.length > 0">
              <div class="text-overline">Chemicals</div>
              <v-chip
                v-for="chemical in selectedTemplate.chemicals"
                :key="chemical"
                size="small"
                variant="outlined"
                class="mr-1 mb-1"
              >
                <v-icon start size="small">mdi-flask</v-icon>
                {{ chemical }}
              </v-chip>
            </v-col>
            <v-col cols="12" md="6" v-if="selectedTemplate.tools && selectedTemplate.tools.length > 0">
              <div class="text-overline">Tools</div>
              <v-chip
                v-for="tool in selectedTemplate.tools"
                :key="tool"
                size="small"
                variant="outlined"
                class="mr-1 mb-1"
              >
                <v-icon start size="small">mdi-tools</v-icon>
                {{ tool }}
              </v-chip>
            </v-col>
          </v-row>

          <!-- Quality Standards -->
          <div v-if="selectedTemplate.qualityStandards && selectedTemplate.qualityStandards.length > 0" class="mt-4">
            <div class="text-overline">Quality Standards</div>
            <v-list density="compact">
              <v-list-item
                v-for="(standard, index) in selectedTemplate.qualityStandards"
                :key="index"
              >
                <template v-slot:prepend>
                  <v-icon size="small" color="success">mdi-check</v-icon>
                </template>
                <v-list-item-title>{{ standard }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="detailsDialog = false">
            Close
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            @click="addTemplateToChecklist(selectedTemplate)"
          >
            <v-icon start>mdi-plus</v-icon>
            Add to Checklist
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Create/Edit Template Dialog -->
    <CustomTaskModal
      v-model="editDialog"
      :task="editingTemplate"
      :is-template="true"
      @save="handleTemplateSave"
    />
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { taskTemplateService } from '@/services/taskTemplateService'
import CustomTaskModal from './CustomTaskModal.vue'

const props = defineProps({
  modelValue: Boolean,
  room: String
})

const emit = defineEmits(['update:modelValue', 'add-tasks'])

// State
const loading = ref(false)
const templates = ref([])
const selectedTemplates = ref([])
const searchQuery = ref('')
const selectedCategory = ref(null)
const selectedRoom = ref(null)
const viewTab = ref('all')
const detailsDialog = ref(false)
const selectedTemplate = ref(null)
const editDialog = ref(false)
const editingTemplate = ref(null)

// Load templates
const loadTemplates = async () => {
  loading.value = true
  try {
    templates.value = await taskTemplateService.getAllTemplates()
  } catch (error) {
    console.error('Failed to load templates:', error)
  } finally {
    loading.value = false
  }
}

// Computed
const categories = computed(() => {
  const cats = new Set()
  templates.value.forEach(t => {
    if (t.category) cats.add(t.category)
  })
  return ['All', ...Array.from(cats).sort()]
})

const rooms = computed(() => {
  const roomSet = new Set()
  templates.value.forEach(t => {
    if (t.room) roomSet.add(t.room)
  })
  return ['All', ...Array.from(roomSet).sort()]
})

const filteredTemplates = computed(() => {
  let filtered = [...templates.value]
  
  // Filter by view tab
  if (viewTab.value === 'popular') {
    filtered = filtered.sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0)).slice(0, 12)
  } else if (viewTab.value === 'recent') {
    filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 12)
  } else if (viewTab.value === 'custom') {
    filtered = filtered.filter(t => !t.isShared)
  }
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(t => 
      t.name.toLowerCase().includes(query) ||
      t.description?.toLowerCase().includes(query) ||
      t.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // Category filter
  if (selectedCategory.value && selectedCategory.value !== 'All') {
    filtered = filtered.filter(t => t.category === selectedCategory.value)
  }
  
  // Room filter
  if (selectedRoom.value && selectedRoom.value !== 'All') {
    filtered = filtered.filter(t => t.room === selectedRoom.value)
  }
  
  return filtered
})

// Methods
const getFrequencyColor = (frequency) => {
  const colors = {
    'DAILY': 'red',
    'WEEKLY': 'orange',
    'MONTHLY': 'blue',
    'QUARTERLY': 'purple'
  }
  return colors[frequency] || 'grey'
}

const isTemplateSelected = (templateId) => {
  return selectedTemplates.value.includes(templateId)
}

const toggleTemplateSelection = (templateId) => {
  const index = selectedTemplates.value.indexOf(templateId)
  if (index > -1) {
    selectedTemplates.value.splice(index, 1)
  } else {
    selectedTemplates.value.push(templateId)
  }
}

const viewTemplateDetails = (template) => {
  selectedTemplate.value = template
  detailsDialog.value = true
}

const editTemplate = (template) => {
  editingTemplate.value = { ...template }
  editDialog.value = true
}

const createNewTemplate = () => {
  editingTemplate.value = null
  editDialog.value = true
}

const handleTemplateSave = async (templateData) => {
  try {
    if (editingTemplate.value?.id) {
      // Update existing template
      await taskTemplateService.updateTemplate(editingTemplate.value.id, templateData)
    } else {
      // Create new template
      await taskTemplateService.createTemplate(templateData)
    }
    
    // Reload templates
    await loadTemplates()
    editDialog.value = false
  } catch (error) {
    console.error('Failed to save template:', error)
  }
}

const addTemplateToChecklist = async (template) => {
  try {
    const task = await taskTemplateService.applyTemplateToChecklist(
      template.id,
      props.room || template.room
    )
    emit('add-tasks', [task])
    
    // Close dialogs
    detailsDialog.value = false
    emit('update:modelValue', false)
  } catch (error) {
    console.error('Failed to add template to checklist:', error)
  }
}

const addSelectedToChecklist = async () => {
  try {
    const tasks = []
    for (const templateId of selectedTemplates.value) {
      const task = await taskTemplateService.applyTemplateToChecklist(
        templateId,
        props.room
      )
      tasks.push(task)
    }
    
    emit('add-tasks', tasks)
    selectedTemplates.value = []
    emit('update:modelValue', false)
  } catch (error) {
    console.error('Failed to add templates to checklist:', error)
  }
}

// Initialize
onMounted(() => {
  loadTemplates()
})

// Set default room filter if provided
watch(() => props.room, (newRoom) => {
  if (newRoom) {
    selectedRoom.value = newRoom
  }
}, { immediate: true })
</script>

<style scoped>
.border-primary {
  border-color: rgb(var(--v-theme-primary)) !important;
  border-width: 2px !important;
}
</style>
<template>
  <div class="virtual-task-list">
    <!-- Search and Filter Bar -->
    <v-card flat class="mb-2">
      <v-card-text class="pb-2 pt-2">
        <v-row align="center">
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              label="Search tasks..."
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="6" sm="3">
            <v-select
              v-model="filterRoom"
              :items="roomOptions"
              label="Room"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="6" sm="3">
            <v-select
              v-model="filterStatus"
              :items="statusOptions"
              label="Status"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    
    <!-- Virtual Scrolling Container -->
    <v-card flat>
      <div 
        ref="scrollingContainer"
        class="virtual-scroll-container"
        :style="{ height: containerHeight + 'px' }"
      >
        <div 
          ref="virtualizer"
          class="virtual-list"
        >
          <!-- Task Count Header -->
          <div class="task-count-header pa-3">
            <span class="text-subtitle-1">
              {{ filteredTasks.length }} tasks
              <span v-if="searchQuery || filterRoom || filterStatus" class="text-medium-emphasis">
                (filtered)
              </span>
            </span>
          </div>
          
          <!-- Virtual List Items -->
          <div
            v-for="task in visibleTasks"
            :key="task.id"
            class="task-item"
            :style="{ transform: `translateY(${task.offset}px)` }"
          >
            <v-list-item
              class="px-4"
              :class="{ 'task-completed': task.completed }"
            >
              <template #prepend>
                <v-checkbox
                  :model-value="task.completed"
                  @update:model-value="$emit('toggle-task', task)"
                  color="primary"
                  hide-details
                  density="compact"
                />
              </template>
              
              <v-list-item-title>
                {{ task.name }}
                <v-chip 
                  v-if="task.roomId"
                  size="x-small"
                  class="ml-2"
                  variant="tonal"
                >
                  {{ task.roomId }}
                </v-chip>
              </v-list-item-title>
              
              <v-list-item-subtitle v-if="task.description">
                {{ task.description }}
              </v-list-item-subtitle>
              
              <template #append>
                <div class="d-flex align-center gap-2">
                  <v-chip 
                    v-if="task.priority" 
                    :color="getPriorityColor(task.priority)"
                    size="small"
                    variant="tonal"
                  >
                    {{ task.priority }}
                  </v-chip>
                  <span class="text-caption text-medium-emphasis">
                    {{ task.adjustedTime || task.estimatedTime }} min
                  </span>
                </div>
              </template>
            </v-list-item>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <v-card-text v-if="filteredTasks.length === 0" class="text-center py-8">
        <v-icon size="64" color="grey-lighten-1">mdi-clipboard-text-outline</v-icon>
        <p class="text-h6 mt-4">No tasks found</p>
        <p class="text-body-2 text-grey">
          {{ searchQuery || filterRoom || filterStatus ? 'Try adjusting your filters' : 'No tasks available' }}
        </p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { Task } from '@/stores/checklistStore'

const props = defineProps<{
  tasks: Task[]
  containerHeight?: number
}>()

const emit = defineEmits<{
  'toggle-task': [task: Task]
}>()

// Virtual scrolling configuration
const ITEM_HEIGHT = 72 // Approximate height of each task item
const BUFFER_SIZE = 5 // Number of items to render outside visible area

// Refs
const scrollingContainer = ref<HTMLElement>()
const virtualizer = ref<HTMLElement>()
const scrollTop = ref(0)
const containerHeightInternal = ref(props.containerHeight || 600)

// Filter state
const searchQuery = ref('')
const filterRoom = ref('')
const filterStatus = ref('')

// Computed
const roomOptions = computed(() => {
  const rooms = [...new Set(props.tasks.map(t => t.roomId).filter(Boolean))]
  return ['All Rooms', ...rooms]
})

const statusOptions = ['All', 'Pending', 'Completed']

const filteredTasks = computed(() => {
  let tasks = [...props.tasks]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    tasks = tasks.filter(task => 
      task.name.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query) ||
      task.category?.toLowerCase().includes(query)
    )
  }
  
  // Apply room filter
  if (filterRoom.value && filterRoom.value !== 'All Rooms') {
    tasks = tasks.filter(task => task.roomId === filterRoom.value)
  }
  
  // Apply status filter
  if (filterStatus.value && filterStatus.value !== 'All') {
    const isCompleted = filterStatus.value === 'Completed'
    tasks = tasks.filter(task => task.completed === isCompleted)
  }
  
  return tasks
})

const visibleTasks = computed(() => {
  const containerH = containerHeightInternal.value
  const startIndex = Math.floor(scrollTop.value / ITEM_HEIGHT) - BUFFER_SIZE
  const endIndex = Math.ceil((scrollTop.value + containerH) / ITEM_HEIGHT) + BUFFER_SIZE
  
  const start = Math.max(0, startIndex)
  const end = Math.min(filteredTasks.value.length, endIndex)
  
  return filteredTasks.value.slice(start, end).map((task, index) => ({
    ...task,
    offset: (start + index) * ITEM_HEIGHT + 50 // Add header offset
  }))
})

const totalHeight = computed(() => {
  return filteredTasks.value.length * ITEM_HEIGHT + 50 // Add header height
})

// Methods
function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high': return 'error'
    case 'medium': return 'warning'
    case 'low': return 'success'
    default: return 'default'
  }
}

function handleScroll(event: Event) {
  const target = event.target as HTMLElement
  scrollTop.value = target.scrollTop
}

function updateContainerHeight() {
  if (scrollingContainer.value) {
    const windowHeight = window.innerHeight
    const containerTop = scrollingContainer.value.getBoundingClientRect().top
    containerHeightInternal.value = Math.min(
      props.containerHeight || 600,
      windowHeight - containerTop - 100
    )
  }
}

// Lifecycle
onMounted(() => {
  if (scrollingContainer.value) {
    scrollingContainer.value.addEventListener('scroll', handleScroll)
  }
  updateContainerHeight()
  window.addEventListener('resize', updateContainerHeight)
})

onUnmounted(() => {
  if (scrollingContainer.value) {
    scrollingContainer.value.removeEventListener('scroll', handleScroll)
  }
  window.removeEventListener('resize', updateContainerHeight)
})

// Watch for container height prop changes
watch(() => props.containerHeight, (newHeight) => {
  if (newHeight) {
    containerHeightInternal.value = newHeight
  }
})

// Set virtualizer height
watch(totalHeight, (height) => {
  if (virtualizer.value) {
    virtualizer.value.style.height = `${height}px`
  }
}, { immediate: true })
</script>

<style scoped>
.virtual-task-list {
  width: 100%;
}

.virtual-scroll-container {
  overflow-y: auto;
  position: relative;
}

.virtual-list {
  position: relative;
  width: 100%;
}

.task-count-header {
  position: sticky;
  top: 0;
  background: rgb(var(--v-theme-surface));
  z-index: 1;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.task-item {
  position: absolute;
  width: 100%;
  left: 0;
}

.task-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.task-completed {
  opacity: 0.6;
}

.task-completed .v-list-item-title {
  text-decoration: line-through;
}
</style>
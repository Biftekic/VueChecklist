<template>
  <MainLayout title="My Checklists">
    <v-container class="pa-4">
      <!-- Search Bar -->
      <v-text-field
        v-model="searchQuery"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search checklists..."
        variant="outlined"
        density="compact"
        clearable
        class="mb-4"
        hide-details
      />

      <!-- Filter Chips -->
      <div class="mb-4">
        <v-chip-group
          v-model="selectedFilter"
          mandatory
          selected-class="text-primary"
        >
          <v-chip value="all" size="small">All</v-chip>
          <v-chip value="today" size="small">Today</v-chip>
          <v-chip value="week" size="small">This Week</v-chip>
          <v-chip value="month" size="small">This Month</v-chip>
        </v-chip-group>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center pa-8">
        <v-progress-circular
          indeterminate
          color="primary"
          size="48"
        />
        <p class="text-body-2 mt-4 text-medium-emphasis">Loading checklists...</p>
      </div>

      <!-- Empty State -->
      <v-card
        v-else-if="filteredChecklists.length === 0"
        flat
        class="pa-8 text-center"
        color="grey-lighten-4"
      >
        <v-icon size="64" color="grey-lighten-1" class="mb-4">
          mdi-clipboard-text-outline
        </v-icon>
        <h3 class="text-h6 mb-2">
          {{ searchQuery ? 'No matching checklists' : 'No checklists yet' }}
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          {{ searchQuery ? 'Try adjusting your search' : 'Create your first checklist to get started' }}
        </p>
        <v-btn
          v-if="!searchQuery"
          color="primary"
          @click="createNewChecklist"
        >
          Create Checklist
        </v-btn>
      </v-card>

      <!-- Checklists List -->
      <div v-else>
        <p class="text-caption text-medium-emphasis mb-3">
          {{ filteredChecklists.length }} checklist{{ filteredChecklists.length !== 1 ? 's' : '' }}
        </p>
        
        <v-list lines="two" class="pa-0">
          <v-list-item
            v-for="checklist in filteredChecklists"
            :key="checklist.id"
            @click="openChecklist(checklist)"
            class="mb-2 pa-0"
          >
            <v-card flat elevation="1" class="w-100">
              <v-card-text class="pa-3">
                <div class="d-flex justify-space-between align-start mb-2">
                  <div class="flex-grow-1">
                    <h4 class="text-body-1 font-weight-medium">
                      {{ checklist.name || 'Unnamed Checklist' }}
                    </h4>
                    <p class="text-caption text-medium-emphasis mb-0">
                      {{ checklist.templateName || 'Custom Template' }}
                    </p>
                  </div>
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        v-bind="props"
                        @click.stop
                      >
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list density="compact">
                      <v-list-item @click="openChecklist(checklist)">
                        <v-list-item-title>
                          <v-icon size="small" class="mr-2">mdi-eye</v-icon>
                          View
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="exportPDF(checklist)">
                        <v-list-item-title>
                          <v-icon size="small" class="mr-2">mdi-file-pdf-box</v-icon>
                          Export PDF
                        </v-list-item-title>
                      </v-list-item>
                      <v-divider />
                      <v-list-item @click="deleteChecklist(checklist)" class="text-error">
                        <v-list-item-title>
                          <v-icon size="small" class="mr-2">mdi-delete</v-icon>
                          Delete
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>

                <!-- Client Info -->
                <div v-if="checklist.clientName" class="mb-2">
                  <v-icon size="14" class="mr-1">mdi-account</v-icon>
                  <span class="text-caption">{{ checklist.clientName }}</span>
                </div>

                <!-- Time and Date -->
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <v-icon size="14" class="mr-1">mdi-clock-outline</v-icon>
                    <span class="text-caption text-medium-emphasis">
                      {{ formatDate(checklist.createdAt) }}
                    </span>
                  </div>
                  <div v-if="checklist.totalTime">
                    <v-chip size="x-small" color="primary" variant="tonal">
                      {{ checklist.totalTime.min }}-{{ checklist.totalTime.max }} min
                    </v-chip>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-list-item>
        </v-list>
      </div>
    </v-container>

    <!-- FAB for creating new checklist -->
    <v-btn
      color="primary"
      icon
      size="large"
      position="fixed"
      location="bottom right"
      class="fab-button"
      @click="createNewChecklist"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Delete Checklist?</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ checklistToDelete?.name || 'this checklist' }}"? 
          This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChecklistsStore } from '@/stores/checklists'
import { useAppStore } from '@/stores/app'
import MainLayout from '@/layouts/MainLayout.vue'

const router = useRouter()
const checklistsStore = useChecklistsStore()
const appStore = useAppStore()

const searchQuery = ref('')
const selectedFilter = ref('all')
const isLoading = ref(false)
const deleteDialog = ref(false)
const checklistToDelete = ref(null)

const checklists = computed(() => checklistsStore.checklistsList)

const filteredChecklists = computed(() => {
  let filtered = checklists.value

  // Apply date filter
  if (selectedFilter.value !== 'all') {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    filtered = filtered.filter(checklist => {
      const checklistDate = new Date(checklist.createdAt)
      
      switch (selectedFilter.value) {
        case 'today':
          return checklistDate >= today
        case 'week':
          const weekAgo = new Date(today)
          weekAgo.setDate(weekAgo.getDate() - 7)
          return checklistDate >= weekAgo
        case 'month':
          const monthAgo = new Date(today)
          monthAgo.setMonth(monthAgo.getMonth() - 1)
          return checklistDate >= monthAgo
        default:
          return true
      }
    })
  }

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(checklist => {
      return (
        (checklist.name && checklist.name.toLowerCase().includes(query)) ||
        (checklist.clientName && checklist.clientName.toLowerCase().includes(query)) ||
        (checklist.templateName && checklist.templateName.toLowerCase().includes(query))
      )
    })
  }

  // Sort by date (newest first)
  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

onMounted(async () => {
  await loadChecklists()
})

async function loadChecklists() {
  isLoading.value = true
  try {
    await checklistsStore.loadChecklists()
  } catch (error) {
    console.error('Error loading checklists:', error)
    appStore.showSnackbar('Failed to load checklists', 'error')
  } finally {
    isLoading.value = false
  }
}

function createNewChecklist() {
  router.push('/checklists/create')
}

function openChecklist(checklist) {
  router.push(`/checklists/${checklist.id}`)
}

function exportPDF(checklist) {
  // TODO: Implement PDF export
  appStore.showSnackbar('PDF export coming soon!', 'info')
}

function deleteChecklist(checklist) {
  checklistToDelete.value = checklist
  deleteDialog.value = true
}

async function confirmDelete() {
  if (!checklistToDelete.value) return
  
  try {
    await checklistsStore.deleteChecklist(checklistToDelete.value.id)
    appStore.showSnackbar('Checklist deleted successfully', 'success')
    deleteDialog.value = false
    checklistToDelete.value = null
  } catch (error) {
    console.error('Error deleting checklist:', error)
    appStore.showSnackbar('Failed to delete checklist', 'error')
  }
}

function formatDate(date) {
  if (!date) return 'Unknown'
  const d = new Date(date)
  const now = new Date()
  const diffTime = Math.abs(now - d)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}
</script>

<style scoped>
.fab-button {
  bottom: 72px !important; /* Above bottom navigation */
  right: 16px !important;
}

.v-list-item {
  cursor: pointer;
}

.v-card {
  transition: all 0.2s ease;
}

.v-list-item:hover .v-card {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.12) !important;
}
</style>
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

      <!-- Loading State with Skeletons -->
      <div v-if="isLoading">
        <ChecklistSkeleton v-for="i in 5" :key="i" />
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

      <!-- Virtual Scroll List for Large Lists -->
      <div v-else>
        <p class="text-caption text-medium-emphasis mb-3">
          {{ filteredChecklists.length }} checklist{{ filteredChecklists.length !== 1 ? 's' : '' }}
        </p>
        
        <!-- Use Virtual Scroll for performance -->
        <VirtualScrollList
          v-if="filteredChecklists.length > 20"
          :items="filteredChecklists"
          :item-height="120"
          :height="600"
          :buffer="3"
          key-field="id"
          @scroll-end="loadMoreChecklists"
        >
          <template #default="{ item: checklist }">
            <ChecklistCard
              :checklist="checklist"
              @click="openChecklist(checklist)"
              @export="exportPDF(checklist)"
              @delete="deleteChecklist(checklist)"
            />
          </template>
        </VirtualScrollList>

        <!-- Regular list for small datasets -->
        <v-list v-else lines="two" class="pa-0">
          <v-list-item
            v-for="checklist in filteredChecklists"
            :key="checklist.id"
            class="mb-2 pa-0"
          >
            <ChecklistCard
              :checklist="checklist"
              @click="openChecklist(checklist)"
              @export="exportPDF(checklist)"
              @delete="deleteChecklist(checklist)"
            />
          </v-list-item>
        </v-list>
      </div>
    </v-container>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Delete Checklist</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ checklistToDelete?.name || 'this checklist' }}"? 
          This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
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
import { useChecklistStore } from '@/stores/checklistsNormalized'
import { useFuzzySearch } from '@/composables/useFuzzySearch'
import { useLoading } from '@/composables/useLoading'
import { dbOperations } from '@/services/database'
import MainLayout from '@/layouts/MainLayout.vue'
import VirtualScrollList from '@/components/common/VirtualScrollList.vue'
import ChecklistCard from '@/components/checklist/ChecklistCard.vue'
import ChecklistSkeleton from '@/components/skeletons/ChecklistSkeleton.vue'
import { exportToPDF } from '@/services/pdfService'

const router = useRouter()
const checklistsStore = useChecklistStore()
const { isLoading, withLoading } = useLoading()

// State
const searchQuery = ref('')
const selectedFilter = ref('all')
const deleteDialog = ref(false)
const checklistToDelete = ref(null)
const currentPage = ref(1)
const itemsPerPage = 50

// Initialize fuzzy search
const { results: searchResults } = useFuzzySearch(
  computed(() => checklistsStore.all),
  searchQuery,
  ['name', 'clientName', 'templateName']
)

// Computed
const filteredChecklists = computed(() => {
  let checklists = searchQuery.value ? searchResults.value : checklistsStore.all

  // Apply time filter
  const now = new Date()
  switch (selectedFilter.value) {
    case 'today':
      checklists = checklists.filter(c => {
        const created = new Date(c.createdAt)
        return created.toDateString() === now.toDateString()
      })
      break
    case 'week':
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      checklists = checklists.filter(c => new Date(c.createdAt) >= weekAgo)
      break
    case 'month':
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      checklists = checklists.filter(c => new Date(c.createdAt) >= monthAgo)
      break
  }

  return checklists
})

// Methods
const loadChecklists = async () => {
  await withLoading(async () => {
    await checklistsStore.fetchChecklists()
  })
}

const loadMoreChecklists = async () => {
  // Implement pagination if needed
  currentPage.value++
  // Load more items from the database
}

const createNewChecklist = () => {
  router.push('/create')
}

const openChecklist = (checklist) => {
  router.push(`/checklist/${checklist.id}`)
}

const exportPDF = async (checklist) => {
  await withLoading(async () => {
    await exportToPDF(checklist)
  }, 'Generating PDF...')
}

const deleteChecklist = (checklist) => {
  checklistToDelete.value = checklist
  deleteDialog.value = true
}

const confirmDelete = async () => {
  if (!checklistToDelete.value) return

  await withLoading(async () => {
    await checklistsStore.deleteChecklist(checklistToDelete.value.id)
    deleteDialog.value = false
    checklistToDelete.value = null
  }, 'Deleting checklist...')
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Lifecycle
onMounted(() => {
  loadChecklists()
})
</script>

<style scoped>
/* Custom styles for optimized performance */
</style>
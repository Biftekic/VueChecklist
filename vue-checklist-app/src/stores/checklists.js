import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dbOperations } from '@/services/db'

export const useChecklistsStore = defineStore('checklists', () => {
  // State
  const checklists = ref(new Map())
  const activeChecklist = ref(null)
  const filters = ref({
    search: '',
    industry: '',
    dateRange: [null, null]
  })
  const isLoading = ref(false)
  
  // Current checklist being created
  const newChecklist = ref({
    templateId: null,
    name: '',
    client: {
      name: '',
      address: '',
      phone: '',
      email: '',
      frequency: ''
    },
    modifiers: {
      difficulty: 'average',
      expectations: 'average',
      challenges: 'average'
    },
    propertyDetails: {
      size: '',
      floors: '',
      rooms: ''
    },
    rooms: [],
    totalTime: { min: 0, max: 0 }
  })
  
  // Computed
  const checklistsList = computed(() => Array.from(checklists.value.values()))
  
  const filteredChecklists = computed(() => {
    let result = checklistsList.value
    
    // Apply search filter
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      result = result.filter(checklist => 
        checklist.name?.toLowerCase().includes(search) ||
        checklist.client?.name?.toLowerCase().includes(search) ||
        checklist.client?.address?.toLowerCase().includes(search)
      )
    }
    
    // Apply industry filter
    if (filters.value.industry) {
      result = result.filter(checklist => 
        checklist.industry === filters.value.industry
      )
    }
    
    // Apply date range filter
    if (filters.value.dateRange[0] && filters.value.dateRange[1]) {
      const [start, end] = filters.value.dateRange
      result = result.filter(checklist => {
        const created = new Date(checklist.createdAt)
        return created >= start && created <= end
      })
    }
    
    // Sort by creation date (newest first)
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    return result
  })
  
  const recentChecklists = computed(() => {
    return filteredChecklists.value.slice(0, 5)
  })
  
  // Actions
  async function loadChecklists() {
    isLoading.value = true
    try {
      const dbChecklists = await dbOperations.getAllChecklists()
      dbChecklists.forEach(checklist => {
        checklists.value.set(checklist.id, checklist)
      })
    } catch (error) {
      console.error('Error loading checklists:', error)
    } finally {
      isLoading.value = false
    }
  }
  
  async function createChecklist(data) {
    try {
      const id = await dbOperations.saveChecklist(data)
      data.id = id
      checklists.value.set(id, data)
      return id
    } catch (error) {
      console.error('Error creating checklist:', error)
      return null
    }
  }
  
  async function updateChecklist(id, data) {
    try {
      await dbOperations.updateChecklist(id, data)
      const existing = checklists.value.get(id)
      if (existing) {
        checklists.value.set(id, { ...existing, ...data })
      }
      return true
    } catch (error) {
      console.error('Error updating checklist:', error)
      return false
    }
  }
  
  async function deleteChecklist(id) {
    try {
      await dbOperations.deleteChecklist(id)
      checklists.value.delete(id)
      return true
    } catch (error) {
      console.error('Error deleting checklist:', error)
      return false
    }
  }
  
  async function getChecklistById(id) {
    // Check memory first
    if (checklists.value.has(id)) {
      return checklists.value.get(id)
    }
    
    // Load from database
    try {
      const checklist = await dbOperations.getChecklistById(id)
      if (checklist) {
        checklists.value.set(id, checklist)
        return checklist
      }
    } catch (error) {
      console.error('Error getting checklist:', error)
    }
    
    return null
  }
  
  function setActiveChecklist(checklist) {
    activeChecklist.value = checklist
  }
  
  function clearActiveChecklist() {
    activeChecklist.value = null
  }
  
  function updateNewChecklist(updates) {
    newChecklist.value = { ...newChecklist.value, ...updates }
  }
  
  function resetNewChecklist() {
    newChecklist.value = {
      templateId: null,
      name: '',
      client: {
        name: '',
        address: '',
        phone: '',
        email: '',
        frequency: ''
      },
      modifiers: {
        difficulty: 'average',
        expectations: 'average',
        challenges: 'average'
      },
      propertyDetails: {
        size: '',
        floors: '',
        rooms: ''
      },
      rooms: [],
      totalTime: { min: 0, max: 0 }
    }
  }
  
  function calculateTotalTime() {
    let totalMin = 0
    let totalMax = 0
    
    newChecklist.value.rooms.forEach(room => {
      if (room.totalTime) {
        totalMin += room.totalTime.min
        totalMax += room.totalTime.max
      }
    })
    
    newChecklist.value.totalTime = { min: totalMin, max: totalMax }
    return newChecklist.value.totalTime
  }
  
  return {
    // State
    checklists,
    activeChecklist,
    filters,
    isLoading,
    newChecklist,
    
    // Computed
    checklistsList,
    filteredChecklists,
    recentChecklists,
    
    // Actions
    loadChecklists,
    createChecklist,
    updateChecklist,
    deleteChecklist,
    getChecklistById,
    setActiveChecklist,
    clearActiveChecklist,
    updateNewChecklist,
    resetNewChecklist,
    calculateTotalTime
  }
})
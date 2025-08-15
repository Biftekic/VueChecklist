import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { databaseService } from '@/services/database'
import { useAppStore } from './app'

export const useChecklistStore = defineStore('checklist', () => {
  // State
  const checklists = ref([])
  const currentChecklist = ref({
    industry: null,
    propertySize: null,
    numberOfFloors: null,
    difficulty: 'Average',
    expectations: 'Reasonable',
    challenges: 'Moderate',
    selectedRooms: [],
    selectedTasks: [],
    clientInfo: null,
    name: null
  })
  const isLoading = ref(false)
  
  // Getters
  const totalChecklists = computed(() => checklists.value.length)
  const activeChecklists = computed(() => 
    checklists.value.filter(c => c.status === 'active')
  )
  
  // Time multiplier calculation
  const getTimeMultiplier = () => {
    const difficultyMultipliers = {
      'Light': 0.8,
      'Average': 1.0,
      'Heavy': 1.3
    }
    
    const expectationsMultipliers = {
      'Very Reasonable': 0.9,
      'Reasonable': 1.0,
      'Demanding': 1.2,
      'Very Demanding': 1.4
    }
    
    const challengesMultipliers = {
      'Very Easy': 0.8,
      'Easy': 0.9,
      'Moderate': 1.0,
      'Hard': 1.15,
      'Very Hard': 1.3
    }
    
    const difficulty = currentChecklist.value.difficulty || 'Average'
    const expectations = currentChecklist.value.expectations || 'Reasonable'
    const challenges = currentChecklist.value.challenges || 'Moderate'
    
    return (
      difficultyMultipliers[difficulty] *
      expectationsMultipliers[expectations] *
      challengesMultipliers[challenges]
    )
  }
  
  // Actions
  const loadChecklists = async () => {
    isLoading.value = true
    try {
      checklists.value = await databaseService.getAllChecklists()
    } catch (error) {
      console.error('Error loading checklists:', error)
      const appStore = useAppStore()
      appStore.showNotification('Error loading checklists', 'error')
    } finally {
      isLoading.value = false
    }
  }
  
  const createChecklist = (data) => {
    currentChecklist.value = {
      ...currentChecklist.value,
      ...data,
      createdAt: new Date().toISOString(),
      status: 'draft'
    }
  }
  
  const updatePropertyDetails = (details) => {
    currentChecklist.value = {
      ...currentChecklist.value,
      ...details
    }
  }
  
  const updateSelectedRooms = (rooms) => {
    currentChecklist.value.selectedRooms = rooms
  }
  
  const updateSelectedTasks = (tasks) => {
    const multiplier = getTimeMultiplier()
    currentChecklist.value.selectedTasks = tasks.map(task => ({
      ...task,
      adjustedTime: Math.round(task.estimatedTime * multiplier)
    }))
  }
  
  const updateClientInfo = (info) => {
    currentChecklist.value.clientInfo = info
  }
  
  const updateChecklistName = (name) => {
    currentChecklist.value.name = name
  }
  
  const saveChecklist = async () => {
    try {
      const checklistData = {
        ...currentChecklist.value,
        clientName: currentChecklist.value.clientInfo?.name,
        frequency: currentChecklist.value.clientInfo?.frequency
      }
      
      const id = await databaseService.saveChecklist(checklistData)
      
      // Save tasks
      if (currentChecklist.value.selectedTasks?.length > 0) {
        await databaseService.saveTasks(currentChecklist.value.selectedTasks, id)
      }
      
      // Save client if new
      if (currentChecklist.value.clientInfo?.name) {
        await databaseService.saveClient(currentChecklist.value.clientInfo)
      }
      
      // Reload checklists
      await loadChecklists()
      
      // Clear current checklist
      resetCurrentChecklist()
      
      return id
    } catch (error) {
      console.error('Error saving checklist:', error)
      throw error
    }
  }
  
  const saveAsTemplate = async (name) => {
    try {
      const templateData = {
        name,
        industry: currentChecklist.value.industry,
        rooms: currentChecklist.value.selectedRooms,
        tasks: currentChecklist.value.selectedTasks
      }
      
      const id = await databaseService.saveTemplate(templateData)
      
      // Save tasks
      if (currentChecklist.value.selectedTasks?.length > 0) {
        await databaseService.saveTasks(currentChecklist.value.selectedTasks, null, id)
      }
      
      return id
    } catch (error) {
      console.error('Error saving template:', error)
      throw error
    }
  }
  
  const deleteChecklist = async (id) => {
    try {
      await databaseService.deleteChecklist(id)
      await loadChecklists()
    } catch (error) {
      console.error('Error deleting checklist:', error)
      const appStore = useAppStore()
      appStore.showNotification('Error deleting checklist', 'error')
    }
  }
  
  const resetCurrentChecklist = () => {
    currentChecklist.value = {
      industry: null,
      propertySize: null,
      numberOfFloors: null,
      difficulty: 'Average',
      expectations: 'Reasonable',
      challenges: 'Moderate',
      selectedRooms: [],
      selectedTasks: [],
      clientInfo: null,
      name: null
    }
  }
  
  const showNotification = (message, type = 'info') => {
    const appStore = useAppStore()
    appStore.showNotification(message, type)
  }
  
  return {
    checklists,
    currentChecklist,
    isLoading,
    totalChecklists,
    activeChecklists,
    getTimeMultiplier,
    loadChecklists,
    createChecklist,
    updatePropertyDetails,
    updateSelectedRooms,
    updateSelectedTasks,
    updateClientInfo,
    updateChecklistName,
    saveChecklist,
    saveAsTemplate,
    deleteChecklist,
    resetCurrentChecklist,
    showNotification
  }
})
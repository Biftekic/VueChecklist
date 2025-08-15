import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dbOperations } from '@/services/db'

export const useTemplatesStore = defineStore('templates', () => {
  // State
  const templates = ref(new Map())
  const industries = ref([
    'office',
    'residential',
    'medical',
    'hospitality',
    'restaurant',
    'retail',
    'airbnb',
    'moveinout',
    'postconstruction',
    'lawncare'
  ])
  const activeTemplate = ref(null)
  const isLoading = ref(false)
  
  // Computed
  const templatesList = computed(() => Array.from(templates.value.values()))
  
  const templatesByIndustry = computed(() => {
    const grouped = {}
    templatesList.value.forEach(template => {
      if (!grouped[template.industry]) {
        grouped[template.industry] = []
      }
      grouped[template.industry].push(template)
    })
    return grouped
  })
  
  // Actions
  async function loadTemplates() {
    isLoading.value = true
    try {
      const dbTemplates = await dbOperations.getAllTemplates()
      dbTemplates.forEach(template => {
        templates.value.set(template.id, template)
      })
    } catch (error) {
      console.error('Error loading templates:', error)
    } finally {
      isLoading.value = false
    }
  }
  
  async function selectTemplate(id) {
    const template = templates.value.get(id)
    if (template) {
      activeTemplate.value = template
      return template
    }
    
    // Try loading from database if not in memory
    try {
      const dbTemplate = await dbOperations.getTemplateById(id)
      if (dbTemplate) {
        templates.value.set(id, dbTemplate)
        activeTemplate.value = dbTemplate
        return dbTemplate
      }
    } catch (error) {
      console.error('Error selecting template:', error)
    }
    
    return null
  }
  
  async function updateTemplate(id, data) {
    try {
      await dbOperations.updateTemplate(id, data)
      const existing = templates.value.get(id)
      if (existing) {
        templates.value.set(id, { ...existing, ...data })
      }
      return true
    } catch (error) {
      console.error('Error updating template:', error)
      return false
    }
  }
  
  async function createCustomTemplate(data) {
    try {
      const id = await dbOperations.saveTemplate(data)
      data.id = id
      templates.value.set(id, data)
      return id
    } catch (error) {
      console.error('Error creating template:', error)
      return null
    }
  }
  
  function clearActiveTemplate() {
    activeTemplate.value = null
  }
  
  function getIndustryColor(industry) {
    const colors = {
      office: '#2196F3',
      residential: '#4CAF50',
      medical: '#F44336',
      hospitality: '#9C27B0',
      restaurant: '#FF9800',
      retail: '#00BCD4',
      airbnb: '#FF5252',
      moveinout: '#795548',
      postconstruction: '#607D8B',
      lawncare: '#8BC34A'
    }
    return colors[industry] || '#757575'
  }
  
  function getIndustryIcon(industry) {
    const icons = {
      office: 'mdi-office-building',
      residential: 'mdi-home',
      medical: 'mdi-hospital',
      hospitality: 'mdi-bed',
      restaurant: 'mdi-silverware',
      retail: 'mdi-store',
      airbnb: 'mdi-key',
      moveinout: 'mdi-truck',
      postconstruction: 'mdi-hammer',
      lawncare: 'mdi-grass'
    }
    return icons[industry] || 'mdi-help-circle'
  }
  
  return {
    // State
    templates,
    industries,
    activeTemplate,
    isLoading,
    
    // Computed
    templatesList,
    templatesByIndustry,
    
    // Actions
    loadTemplates,
    selectTemplate,
    updateTemplate,
    createCustomTemplate,
    clearActiveTemplate,
    getIndustryColor,
    getIndustryIcon
  }
})
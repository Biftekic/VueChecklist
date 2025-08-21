import { logger } from "@/services/logger"
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { dbOperations } from '@/services/db'

export interface Template {
  id: string
  name: string
  industry: string
  rooms?: any[]
  tasks?: any[]
  createdAt?: Date
  updatedAt?: Date
  isCustom?: boolean
  description?: string
}

export interface TemplatesByIndustry {
  [key: string]: Template[]
}

export const useTemplatesStore = defineStore('templates', () => {
  // State
  const templates: Ref<Map<string, Template>> = ref(new Map())
  const industries: Ref<string[]> = ref([
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
  const activeTemplate: Ref<Template | null> = ref(null)
  const isLoading: Ref<boolean> = ref(false)
  
  // Computed
  const templatesList: ComputedRef<Template[]> = computed(() => Array.from(templates.value.values()))
  
  const templatesByIndustry: ComputedRef<TemplatesByIndustry> = computed(() => {
    const grouped: TemplatesByIndustry = {}
    templatesList.value.forEach(template => {
      if (!grouped[template.industry]) {
        grouped[template.industry] = []
      }
      grouped[template.industry].push(template)
    })
    return grouped
  })
  
  // Actions
  async function loadTemplates(): Promise<void> {
    isLoading.value = true
    try {
      const dbTemplates = await dbOperations.getAllTemplates()
      dbTemplates.forEach((template) => {
        if (template.id) {
          const storeTemplate: Template = {
            id: template.id,
            name: template.name,
            industry: template.industry,
            createdAt: template.createdAt,
            updatedAt: template.updatedAt
          }
          templates.value.set(template.id, storeTemplate)
        }
      })
    } catch (error) {
      logger.error('Error loading templates:', error)
    } finally {
      isLoading.value = false
    }
  }
  
  async function selectTemplate(id: string): Promise<Template | null> {
    const template = templates.value.get(id)
    if (template) {
      activeTemplate.value = template
      return template
    }
    
    // Try loading from database if not in memory
    try {
      const dbTemplate = await dbOperations.getTemplateById(id)
      if (dbTemplate && dbTemplate.id) {
        const storeTemplate: Template = {
          id: dbTemplate.id,
          name: dbTemplate.name,
          industry: dbTemplate.industry,
          createdAt: dbTemplate.createdAt,
          updatedAt: dbTemplate.updatedAt
        }
        templates.value.set(id, storeTemplate)
        activeTemplate.value = storeTemplate
        return storeTemplate
      }
    } catch (error) {
      logger.error('Error selecting template:', error)
    }
    
    return null
  }
  
  async function updateTemplate(id: string, data: Partial<Template>): Promise<boolean> {
    try {
      await dbOperations.updateTemplate(id, data)
      const existing = templates.value.get(id)
      if (existing) {
        templates.value.set(id, { ...existing, ...data })
      }
      return true
    } catch (error) {
      logger.error('Error updating template:', error)
      return false
    }
  }
  
  async function createCustomTemplate(data: Omit<Template, 'id'>): Promise<string | null> {
    try {
      const id = await dbOperations.saveTemplate(data)
      const newTemplate: Template = { ...data, id }
      templates.value.set(id, newTemplate)
      return id
    } catch (error) {
      logger.error('Error creating template:', error)
      return null
    }
  }
  
  function clearActiveTemplate(): void {
    activeTemplate.value = null
  }
  
  function getIndustryColor(industry: string): string {
    const colors: Record<string, string> = {
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
  
  function getIndustryIcon(industry: string): string {
    const icons: Record<string, string> = {
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
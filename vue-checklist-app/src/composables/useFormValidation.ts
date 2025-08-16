import { ref, reactive, computed, watch } from 'vue'
import type { Ref, ComputedRef } from 'vue'

export interface ValidationRule {
  required?: boolean | string
  min?: number | string
  max?: number | string
  minLength?: number | string
  maxLength?: number | string
  email?: boolean | string
  phone?: boolean | string
  pattern?: RegExp | string
  custom?: (value: any, form?: any) => boolean | string
}

export interface ValidationRules {
  [field: string]: ValidationRule | ValidationRule[]
}

export interface ValidationError {
  field: string
  message: string
  rule: string
}

export interface UseFormValidationReturn<T> {
  form: T
  errors: Ref<Record<keyof T, string>>
  isValid: ComputedRef<boolean>
  isDirty: Ref<boolean>
  isSubmitting: Ref<boolean>
  validate: () => Promise<boolean>
  validateField: (field: keyof T) => boolean
  clearErrors: () => void
  clearFieldError: (field: keyof T) => void
  reset: () => void
  setFieldValue: (field: keyof T, value: any) => void
  submit: (handler: (form: T) => Promise<void>) => Promise<void>
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  rules: ValidationRules = {}
): UseFormValidationReturn<T> {
  // State
  const form = reactive<T>({ ...initialValues })
  const errors = ref<Record<keyof T, string>>({} as Record<keyof T, string>)
  const isDirty = ref(false)
  const isSubmitting = ref(false)
  const touched = ref<Set<keyof T>>(new Set())

  // Computed
  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0 && 
           Object.keys(rules).every(field => validateFieldInternal(field as keyof T))
  })

  // Watch for changes
  watch(
    () => form,
    () => {
      isDirty.value = true
      // Auto-validate touched fields
      touched.value.forEach(field => {
        validateField(field)
      })
    },
    { deep: true }
  )

  // Validation logic
  const validateFieldInternal = (field: keyof T): boolean => {
    const value = form[field]
    const fieldRules = rules[field as string]
    
    if (!fieldRules) return true

    const rulesArray = Array.isArray(fieldRules) ? fieldRules : [fieldRules]
    
    for (const rule of rulesArray) {
      // Required validation
      if (rule.required) {
        const isEmpty = value === undefined || value === null || value === '' || 
                       (Array.isArray(value) && value.length === 0)
        if (isEmpty) {
          const message = typeof rule.required === 'string' 
            ? rule.required 
            : `${String(field)} is required`
          errors.value[field] = message
          return false
        }
      }

      // Skip other validations if value is empty and not required
      if (!value && !rule.required) {
        delete errors.value[field]
        return true
      }

      // Email validation
      if (rule.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(String(value))) {
          const message = typeof rule.email === 'string'
            ? rule.email
            : `${String(field)} must be a valid email`
          errors.value[field] = message
          return false
        }
      }

      // Phone validation
      if (rule.phone) {
        const phoneRegex = /^[\d\s+\-()]+$/
        if (!phoneRegex.test(String(value))) {
          const message = typeof rule.phone === 'string'
            ? rule.phone
            : `${String(field)} must be a valid phone number`
          errors.value[field] = message
          return false
        }
      }

      // Min length validation
      if (rule.minLength !== undefined) {
        const minLength = typeof rule.minLength === 'string' 
          ? parseInt(rule.minLength) 
          : rule.minLength
        if (String(value).length < minLength) {
          const message = typeof rule.minLength === 'string'
            ? rule.minLength
            : `${String(field)} must be at least ${minLength} characters`
          errors.value[field] = message
          return false
        }
      }

      // Max length validation
      if (rule.maxLength !== undefined) {
        const maxLength = typeof rule.maxLength === 'string'
          ? parseInt(rule.maxLength)
          : rule.maxLength
        if (String(value).length > maxLength) {
          const message = typeof rule.maxLength === 'string'
            ? rule.maxLength
            : `${String(field)} must be at most ${maxLength} characters`
          errors.value[field] = message
          return false
        }
      }

      // Min value validation
      if (rule.min !== undefined) {
        const min = typeof rule.min === 'string' ? parseFloat(rule.min) : rule.min
        if (Number(value) < min) {
          const message = typeof rule.min === 'string'
            ? rule.min
            : `${String(field)} must be at least ${min}`
          errors.value[field] = message
          return false
        }
      }

      // Max value validation
      if (rule.max !== undefined) {
        const max = typeof rule.max === 'string' ? parseFloat(rule.max) : rule.max
        if (Number(value) > max) {
          const message = typeof rule.max === 'string'
            ? rule.max
            : `${String(field)} must be at most ${max}`
          errors.value[field] = message
          return false
        }
      }

      // Pattern validation
      if (rule.pattern) {
        const pattern = rule.pattern instanceof RegExp 
          ? rule.pattern 
          : new RegExp(rule.pattern)
        if (!pattern.test(String(value))) {
          const message = typeof rule.pattern === 'string'
            ? rule.pattern
            : `${String(field)} format is invalid`
          errors.value[field] = message
          return false
        }
      }

      // Custom validation
      if (rule.custom) {
        const result = rule.custom(value, form)
        if (result !== true) {
          errors.value[field] = typeof result === 'string' 
            ? result 
            : `${String(field)} is invalid`
          return false
        }
      }
    }

    // Clear error if validation passes
    delete errors.value[field]
    return true
  }

  // Public methods
  const validateField = (field: keyof T): boolean => {
    touched.value.add(field)
    return validateFieldInternal(field)
  }

  const validate = async (): Promise<boolean> => {
    errors.value = {} as Record<keyof T, string>
    let isFormValid = true

    for (const field of Object.keys(form)) {
      touched.value.add(field as keyof T)
      const isFieldValid = validateFieldInternal(field as keyof T)
      if (!isFieldValid) {
        isFormValid = false
      }
    }

    return isFormValid
  }

  const clearErrors = () => {
    errors.value = {} as Record<keyof T, string>
  }

  const clearFieldError = (field: keyof T) => {
    delete errors.value[field]
  }

  const reset = () => {
    Object.assign(form, initialValues)
    errors.value = {} as Record<keyof T, string>
    isDirty.value = false
    touched.value.clear()
  }

  const setFieldValue = (field: keyof T, value: any) => {
    form[field] = value
    if (touched.value.has(field)) {
      validateField(field)
    }
  }

  const submit = async (handler: (form: T) => Promise<void>): Promise<void> => {
    isSubmitting.value = true
    
    try {
      const isFormValid = await validate()
      if (!isFormValid) {
        throw new Error('Form validation failed')
      }
      
      await handler(form)
      reset()
    } catch (error) {
      console.error('Form submission error:', error)
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    form,
    errors,
    isValid,
    isDirty,
    isSubmitting,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
    reset,
    setFieldValue,
    submit
  }
}
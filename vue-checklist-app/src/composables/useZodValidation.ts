import { ref, computed, type Ref } from 'vue'
import { z, type ZodSchema, type ZodError } from 'zod'

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  success: boolean
  data?: any
  errors?: ValidationError[]
}

/**
 * Composable for form validation using Zod schemas
 */
export function useZodValidation<T extends ZodSchema>(schema: T) {
  const errors = ref<Map<string, string>>(new Map())
  const isValid = ref(true)
  const isDirty = ref(false)
  
  // Computed property for formatted errors
  const formattedErrors = computed(() => {
    const errorObj: Record<string, string> = {}
    errors.value.forEach((message, field) => {
      errorObj[field] = message
    })
    return errorObj
  })
  
  // Get error message for a specific field
  const getError = (field: string): string | undefined => {
    return errors.value.get(field)
  }
  
  // Check if a specific field has an error
  const hasError = (field: string): boolean => {
    return errors.value.has(field)
  }
  
  // Clear all errors
  const clearErrors = () => {
    errors.value.clear()
    isValid.value = true
  }
  
  // Clear error for a specific field
  const clearFieldError = (field: string) => {
    errors.value.delete(field)
    isValid.value = errors.value.size === 0
  }
  
  // Validate entire form data
  const validate = (data: unknown): ValidationResult => {
    clearErrors()
    isDirty.value = true
    
    try {
      const validatedData = schema.parse(data)
      isValid.value = true
      return {
        success: true,
        data: validatedData
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: ValidationError[] = []
        
        error.errors.forEach((err) => {
          const field = err.path.join('.')
          const message = err.message
          errors.value.set(field, message)
          validationErrors.push({ field, message })
        })
        
        isValid.value = false
        return {
          success: false,
          errors: validationErrors
        }
      }
      
      throw error
    }
  }
  
  // Validate a single field
  const validateField = (fieldName: string, value: unknown, parentData?: unknown): boolean => {
    isDirty.value = true
    
    try {
      // If we have parent data, validate the entire object but only update the specific field error
      if (parentData) {
        schema.parse(parentData)
      } else {
        // Try to validate just the field if possible
        const fieldSchema = getFieldSchema(schema, fieldName)
        if (fieldSchema) {
          fieldSchema.parse(value)
        }
      }
      
      clearFieldError(fieldName)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(err => 
          err.path.join('.') === fieldName || 
          err.path[0] === fieldName
        )
        
        if (fieldError) {
          errors.value.set(fieldName, fieldError.message)
          isValid.value = false
        } else {
          clearFieldError(fieldName)
        }
      }
      
      return false
    }
  }
  
  // Helper to get field schema from parent schema
  const getFieldSchema = (parentSchema: ZodSchema, fieldName: string): ZodSchema | null => {
    if (parentSchema instanceof z.ZodObject) {
      const shape = parentSchema.shape
      return shape[fieldName] || null
    }
    return null
  }
  
  // Create Vuetify-compatible validation rules
  const createRules = (fieldName: string, required = true) => {
    return [
      (value: any) => {
        if (!isDirty.value) return true
        
        // Check if field is required
        if (required && !value) {
          return getError(fieldName) || 'This field is required'
        }
        
        // Check for validation errors
        const error = getError(fieldName)
        return error ? error : true
      }
    ]
  }
  
  // Reset validation state
  const reset = () => {
    clearErrors()
    isDirty.value = false
  }
  
  return {
    errors,
    formattedErrors,
    isValid,
    isDirty,
    validate,
    validateField,
    getError,
    hasError,
    clearErrors,
    clearFieldError,
    createRules,
    reset
  }
}

/**
 * Create a field validator for use with v-model
 */
export function createFieldValidator<T>(
  schema: ZodSchema,
  fieldName: string,
  modelValue: Ref<T>,
  emit: (event: string, value: T) => void
) {
  const { validateField, getError, clearFieldError } = useZodValidation(schema)
  
  const error = computed(() => getError(fieldName))
  
  const updateValue = (value: T) => {
    emit('update:modelValue', value)
    
    // Validate after a short delay to allow for typing
    setTimeout(() => {
      validateField(fieldName, value)
    }, 300)
  }
  
  const onBlur = () => {
    validateField(fieldName, modelValue.value)
  }
  
  const onFocus = () => {
    clearFieldError(fieldName)
  }
  
  return {
    error,
    updateValue,
    onBlur,
    onFocus
  }
}
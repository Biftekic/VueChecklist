import { describe, it, expect } from 'vitest'
import { useFormValidation, type ValidationRules } from './useFormValidation'

describe('useFormValidation', () => {
  const initialValues = {
    name: '',
    email: '',
    age: 0,
    phone: ''
  }

  const validationRules: ValidationRules = {
    name: { required: 'Name is required' },
    email: { 
      required: 'Email is required',
      email: 'Invalid email'
    },
    age: { 
      min: 18,
      custom: (value) => value >= 18 || 'Must be at least 18'
    },
    phone: { required: false }
  }

  describe('Validation Logic', () => {
    it('should validate a valid form', async () => {
      const { form, validate, errors } = useFormValidation(initialValues, validationRules)
      
      form.name = 'John Doe'
      form.email = 'john@example.com'
      form.age = 25
      form.phone = '555-1234'

      const isValid = await validate()
      expect(isValid).toBe(true)
      expect(errors.value).toEqual({})
    })

    it('should detect validation errors', async () => {
      const { form, validate, errors } = useFormValidation(initialValues, validationRules)
      
      form.name = ''
      form.email = 'invalid-email'
      form.age = 16

      const isValid = await validate()
      expect(isValid).toBe(false)
      expect(errors.value.name).toBeDefined()
      expect(errors.value.email).toBeDefined()
      expect(errors.value.age).toBeDefined()
    })

    it('should clear errors when clearErrors is called', async () => {
      const { form, validate, errors, clearErrors } = useFormValidation(initialValues, validationRules)
      
      form.name = ''
      form.email = 'invalid'

      await validate()
      expect(Object.keys(errors.value).length).toBeGreaterThan(0)

      clearErrors()
      expect(errors.value).toEqual({})
    })

    it('should validate individual fields', () => {
      const { form, validateField, errors } = useFormValidation(initialValues, validationRules)
      
      form.name = ''
      form.email = 'john@example.com'

      validateField('name')
      expect(errors.value.name).toBeDefined()

      form.name = 'John'
      validateField('name')
      expect(errors.value.name).toBeUndefined()

      validateField('email')
      expect(errors.value.email).toBeUndefined()
    })

    it('should clear specific field errors', async () => {
      const { form, validate, errors, clearFieldError } = useFormValidation(initialValues, validationRules)
      
      form.name = ''
      form.email = 'invalid'

      await validate()
      expect(errors.value.name).toBeDefined()
      expect(errors.value.email).toBeDefined()

      clearFieldError('name')
      expect(errors.value.name).toBeUndefined()
      expect(errors.value.email).toBeDefined()
    })
  })

  describe('Form State Management', () => {
    it('should track dirty state', () => {
      const { form, isDirty, setFieldValue } = useFormValidation(initialValues, validationRules)
      
      expect(isDirty.value).toBe(false)

      setFieldValue('name', 'John')
      expect(isDirty.value).toBe(true)
    })

    it('should reset form to initial values', async () => {
      const { form, reset, isDirty, errors } = useFormValidation(initialValues, validationRules)
      
      form.name = 'John'
      form.email = 'john@example.com'
      expect(isDirty.value).toBe(true)

      reset()
      expect(form.name).toBe('')
      expect(form.email).toBe('')
      expect(isDirty.value).toBe(false)
      expect(errors.value).toEqual({})
    })

    it('should handle form submission', async () => {
      const { form, submit } = useFormValidation(initialValues, validationRules)
      
      form.name = 'John Doe'
      form.email = 'john@example.com'
      form.age = 25

      let submittedData: any = null
      await submit(async (data) => {
        submittedData = data
      })

      expect(submittedData).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
        phone: ''
      })
    })

    it('should prevent submission with invalid data', async () => {
      const { form, submit } = useFormValidation(initialValues, validationRules)
      
      form.name = ''
      form.email = 'invalid'

      let submittedData: any = null
      await submit(async (data) => {
        submittedData = data
      })

      expect(submittedData).toBeNull()
    })

    it('should track submission state', async () => {
      const { form, submit, isSubmitting } = useFormValidation(initialValues, validationRules)
      
      form.name = 'John'
      form.email = 'john@example.com'
      form.age = 25

      expect(isSubmitting.value).toBe(false)

      const submitPromise = submit(async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
      })

      expect(isSubmitting.value).toBe(true)
      await submitPromise
      expect(isSubmitting.value).toBe(false)
    })
  })

  describe('Custom Validation Rules', () => {
    it('should validate with custom rules', () => {
      const customRules: ValidationRules = {
        password: {
          required: 'Password is required',
          minLength: 8,
          pattern: /[A-Z]/,
          custom: (value) => {
            if (!value.includes('!')) {
              return 'Password must contain at least one special character'
            }
            return true
          }
        }
      }

      const { form, validateField, errors } = useFormValidation(
        { password: '' },
        customRules
      )

      form.password = 'abc'
      validateField('password')
      expect(errors.value.password).toBeDefined()

      form.password = 'abcdefgh'
      validateField('password')
      expect(errors.value.password).toBeDefined() // No uppercase

      form.password = 'Abcdefgh'
      validateField('password')
      expect(errors.value.password).toBeDefined() // No special char

      form.password = 'Abcdefgh!'
      validateField('password')
      expect(errors.value.password).toBeUndefined()
    })

    it('should validate email format', () => {
      const emailRules: ValidationRules = {
        email: { email: 'Invalid email format' }
      }

      const { form, validateField, errors } = useFormValidation(
        { email: '' },
        emailRules
      )

      const invalidEmails = ['invalid', 'test@', '@test.com', 'test@.com']
      invalidEmails.forEach(email => {
        form.email = email
        validateField('email')
        expect(errors.value.email).toBeDefined()
      })

      const validEmails = ['test@example.com', 'user+tag@domain.co.uk']
      validEmails.forEach(email => {
        form.email = email
        validateField('email')
        expect(errors.value.email).toBeUndefined()
      })
    })

    it('should validate min and max values', () => {
      const rangeRules: ValidationRules = {
        quantity: {
          min: 1,
          max: 100
        }
      }

      const { form, validateField, errors } = useFormValidation(
        { quantity: 0 },
        rangeRules
      )

      form.quantity = 0
      validateField('quantity')
      expect(errors.value.quantity).toBeDefined()

      form.quantity = 101
      validateField('quantity')
      expect(errors.value.quantity).toBeDefined()

      form.quantity = 50
      validateField('quantity')
      expect(errors.value.quantity).toBeUndefined()
    })
  })

  describe('Computed Validation State', () => {
    it('should compute overall form validity', async () => {
      const { form, isValid, validate } = useFormValidation(initialValues, validationRules)
      
      expect(isValid.value).toBe(false)

      form.name = 'John'
      form.email = 'john@example.com'
      form.age = 21

      await validate()
      expect(isValid.value).toBe(true)

      form.email = 'invalid'
      await validate()
      expect(isValid.value).toBe(false)
    })
  })
})
/**
 * Reusable form validation rules
 */

export const useFormRules = () => {
  // Common validation rules
  const required = (message = 'This field is required') => {
    return (v: any) => !!v || message
  }

  const minLength = (min: number, message?: string) => {
    return (v: string) => {
      if (!v) return true
      return v.length >= min || message || `Must be at least ${min} characters`
    }
  }

  const maxLength = (max: number, message?: string) => {
    return (v: string) => {
      if (!v) return true
      return v.length <= max || message || `Must be less than ${max} characters`
    }
  }

  const email = (message = 'Invalid email address') => {
    return (v: string) => {
      if (!v) return true
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return pattern.test(v) || message
    }
  }

  const phone = (message = 'Invalid phone number') => {
    return (v: string) => {
      if (!v) return true
      const pattern = /^[\d\s\-\+\(\)]+$/
      return pattern.test(v) || message
    }
  }

  const url = (message = 'Invalid URL') => {
    return (v: string) => {
      if (!v) return true
      try {
        new URL(v)
        return true
      } catch {
        return message
      }
    }
  }

  const numeric = (message = 'Must be a number') => {
    return (v: any) => {
      if (!v) return true
      return !isNaN(Number(v)) || message
    }
  }

  const minValue = (min: number, message?: string) => {
    return (v: any) => {
      if (!v) return true
      return Number(v) >= min || message || `Must be at least ${min}`
    }
  }

  const maxValue = (max: number, message?: string) => {
    return (v: any) => {
      if (!v) return true
      return Number(v) <= max || message || `Must be at most ${max}`
    }
  }

  const dateNotInPast = (message = 'Date cannot be in the past') => {
    return (v: string) => {
      if (!v) return true
      const selectedDate = new Date(v)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate >= today || message
    }
  }

  const dateInRange = (minDate: Date, maxDate: Date, message?: string) => {
    return (v: string) => {
      if (!v) return true
      const date = new Date(v)
      return (date >= minDate && date <= maxDate) || 
        message || `Date must be between ${minDate.toLocaleDateString()} and ${maxDate.toLocaleDateString()}`
    }
  }

  // Combine multiple rules
  const combine = (...rules: Array<(v: any) => boolean | string>) => {
    return (v: any) => {
      for (const rule of rules) {
        const result = rule(v)
        if (result !== true) return result
      }
      return true
    }
  }

  return {
    required,
    minLength,
    maxLength,
    email,
    phone,
    url,
    numeric,
    minValue,
    maxValue,
    dateNotInPast,
    dateInRange,
    combine
  }
}
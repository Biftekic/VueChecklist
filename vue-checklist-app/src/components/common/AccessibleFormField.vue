<template>
  <div class="accessible-form-field">
    <label
      :for="inputId"
      :class="{ 'required': required, 'sr-only': hideLabel }"
    >
      {{ label }}
      <span v-if="required" aria-label="required">*</span>
    </label>
    
    <v-text-field
      v-if="type !== 'select' && type !== 'textarea'"
      :id="inputId"
      v-model="internalValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :error="!!error"
      :error-messages="error"
      :aria-label="hideLabel ? label : undefined"
      :aria-describedby="ariaDescribedBy"
      :aria-invalid="!!error"
      :aria-required="required"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
    >
      <template v-if="$slots.prepend" #prepend>
        <slot name="prepend" />
      </template>
      <template v-if="$slots.append" #append>
        <slot name="append" />
      </template>
    </v-text-field>
    
    <v-select
      v-else-if="type === 'select'"
      :id="inputId"
      v-model="internalValue"
      :items="options"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :error="!!error"
      :error-messages="error"
      :aria-label="hideLabel ? label : undefined"
      :aria-describedby="ariaDescribedBy"
      :aria-invalid="!!error"
      :aria-required="required"
      @blur="handleBlur"
      @focus="handleFocus"
      @update:model-value="handleInput"
    />
    
    <v-textarea
      v-else-if="type === 'textarea'"
      :id="inputId"
      v-model="internalValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :rows="rows"
      :error="!!error"
      :error-messages="error"
      :aria-label="hideLabel ? label : undefined"
      :aria-describedby="ariaDescribedBy"
      :aria-invalid="!!error"
      :aria-required="required"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
    />
    
    <span
      v-if="helpText && !error"
      :id="`${inputId}-help`"
      class="help-text text-caption text-medium-emphasis"
    >
      {{ helpText }}
    </span>
    
    <div
      v-if="error"
      :id="`${inputId}-error`"
      role="alert"
      aria-live="polite"
      class="error-message text-error text-caption"
    >
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

interface Props {
  modelValue: any
  label: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'select' | 'textarea'
  placeholder?: string
  helpText?: string
  error?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  hideLabel?: boolean
  options?: Array<{ text: string; value: any }>
  rows?: number
  validator?: (value: any) => string | null
  autocomplete?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  readonly: false,
  hideLabel: false,
  rows: 3
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  'blur': [event: FocusEvent]
  'focus': [event: FocusEvent]
  'input': [value: any]
  'validation-error': [error: string]
}>()

// Generate unique ID for accessibility
const inputId = `field-${Math.random().toString(36).substr(2, 9)}`
const internalValue = ref(props.modelValue)

// Compute aria-describedby
const ariaDescribedBy = computed(() => {
  const ids = []
  if (props.helpText) ids.push(`${inputId}-help`)
  if (props.error) ids.push(`${inputId}-error`)
  return ids.length > 0 ? ids.join(' ') : undefined
})

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue
})

// Handle input changes
const handleInput = (value: any) => {
  internalValue.value = value
  emit('update:modelValue', value)
  emit('input', value)
  
  // Run validation if validator provided
  if (props.validator) {
    const error = props.validator(value)
    if (error) {
      emit('validation-error', error)
    }
  }
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
  announceFieldInfo()
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
  
  // Validate on blur
  if (props.validator) {
    const error = props.validator(internalValue.value)
    if (error) {
      emit('validation-error', error)
    }
  }
}

// Announce field information to screen readers
const announceFieldInfo = () => {
  if (props.required && !internalValue.value) {
    announceToScreenReader('This field is required')
  }
}

const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', 'polite')
  announcement.className = 'sr-only'
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Set autocomplete attribute on mount
onMounted(() => {
  if (props.autocomplete) {
    const input = document.getElementById(inputId) as HTMLInputElement
    if (input) {
      input.setAttribute('autocomplete', props.autocomplete)
    }
  }
})
</script>

<style scoped>
.accessible-form-field {
  margin-bottom: 1rem;
}

.required {
  font-weight: 500;
}

.required::after {
  content: ' *';
  color: var(--v-error-base);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.help-text {
  display: block;
  margin-top: 0.25rem;
}

.error-message {
  display: block;
  margin-top: 0.25rem;
}
</style>
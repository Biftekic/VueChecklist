<template>
  <v-btn
    v-bind="$attrs"
    :disabled="disabled || loading"
    :loading="loading"
    :aria-label="ariaLabel || label"
    :aria-pressed="pressed !== undefined ? String(pressed) : undefined"
    :aria-expanded="expanded !== undefined ? String(expanded) : undefined"
    :aria-describedby="ariaDescribedBy"
    :role="role"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <slot>{{ label }}</slot>
  </v-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  disabled?: boolean
  loading?: boolean
  pressed?: boolean
  expanded?: boolean
  role?: string
  preventDoubleClick?: boolean
  announceOnClick?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  loading: false,
  preventDoubleClick: true
})

const emit = defineEmits<{
  click: [event: MouseEvent | KeyboardEvent]
}>()

// Prevent double click
let lastClickTime = 0
const DOUBLE_CLICK_THRESHOLD = 500

const handleClick = (event: MouseEvent | KeyboardEvent) => {
  if (props.preventDoubleClick) {
    const now = Date.now()
    if (now - lastClickTime < DOUBLE_CLICK_THRESHOLD) {
      event.preventDefault()
      return
    }
    lastClickTime = now
  }
  
  // Announce to screen readers if specified
  if (props.announceOnClick) {
    announceToScreenReader(props.announceOnClick)
  }
  
  emit('click', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  // Handle Enter and Space for button activation
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleClick(event)
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
</script>
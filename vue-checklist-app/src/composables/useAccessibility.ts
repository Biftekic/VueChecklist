/**
 * Accessibility Composable
 * Provides utilities for WCAG compliance and keyboard navigation
 */

import { ref, onMounted, onUnmounted } from 'vue'

export interface UseAccessibilityOptions {
  trapFocus?: boolean
  escapeKey?: boolean
  arrowNavigation?: boolean
  announcements?: boolean
}

export function useAccessibility(options: UseAccessibilityOptions = {}) {
  const announcement = ref('')
  const focusTrapElements = ref<HTMLElement[]>([])
  const currentFocusIndex = ref(0)

  /**
   * Announce message to screen readers
   */
  function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (!options.announcements) return
    
    const announcer = document.createElement('div')
    announcer.setAttribute('role', 'status')
    announcer.setAttribute('aria-live', priority)
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    announcer.textContent = message
    
    document.body.appendChild(announcer)
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer)
    }, 1000)
  }

  /**
   * Setup focus trap within a container
   */
  function setupFocusTrap(container: HTMLElement) {
    if (!options.trapFocus) return
    
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    
    focusTrapElements.value = Array.from(focusableElements)
    
    if (focusTrapElements.value.length > 0) {
      focusTrapElements.value[0].focus()
    }
  }

  /**
   * Handle keyboard navigation
   */
  function handleKeydown(event: KeyboardEvent) {
    // Escape key handling
    if (options.escapeKey && event.key === 'Escape') {
      document.dispatchEvent(new CustomEvent('escape-pressed'))
      return
    }
    
    // Tab key handling for focus trap
    if (options.trapFocus && event.key === 'Tab') {
      if (focusTrapElements.value.length === 0) return
      
      event.preventDefault()
      
      if (event.shiftKey) {
        // Move focus backward
        currentFocusIndex.value--
        if (currentFocusIndex.value < 0) {
          currentFocusIndex.value = focusTrapElements.value.length - 1
        }
      } else {
        // Move focus forward
        currentFocusIndex.value++
        if (currentFocusIndex.value >= focusTrapElements.value.length) {
          currentFocusIndex.value = 0
        }
      }
      
      focusTrapElements.value[currentFocusIndex.value].focus()
    }
    
    // Arrow key navigation
    if (options.arrowNavigation) {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault()
          focusPrevious()
          break
        case 'ArrowDown':
          event.preventDefault()
          focusNext()
          break
        case 'ArrowLeft':
          event.preventDefault()
          focusPrevious()
          break
        case 'ArrowRight':
          event.preventDefault()
          focusNext()
          break
        case 'Home':
          event.preventDefault()
          focusFirst()
          break
        case 'End':
          event.preventDefault()
          focusLast()
          break
      }
    }
  }

  /**
   * Focus navigation helpers
   */
  function focusNext() {
    if (focusTrapElements.value.length === 0) return
    
    currentFocusIndex.value++
    if (currentFocusIndex.value >= focusTrapElements.value.length) {
      currentFocusIndex.value = 0
    }
    focusTrapElements.value[currentFocusIndex.value].focus()
  }

  function focusPrevious() {
    if (focusTrapElements.value.length === 0) return
    
    currentFocusIndex.value--
    if (currentFocusIndex.value < 0) {
      currentFocusIndex.value = focusTrapElements.value.length - 1
    }
    focusTrapElements.value[currentFocusIndex.value].focus()
  }

  function focusFirst() {
    if (focusTrapElements.value.length === 0) return
    
    currentFocusIndex.value = 0
    focusTrapElements.value[0].focus()
  }

  function focusLast() {
    if (focusTrapElements.value.length === 0) return
    
    currentFocusIndex.value = focusTrapElements.value.length - 1
    focusTrapElements.value[currentFocusIndex.value].focus()
  }

  /**
   * Setup keyboard event listeners
   */
  onMounted(() => {
    if (options.trapFocus || options.escapeKey || options.arrowNavigation) {
      document.addEventListener('keydown', handleKeydown)
    }
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    announcement,
    announce,
    setupFocusTrap,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast
  }
}

/**
 * Skip Links Composable
 */
export function useSkipLinks() {
  const skipToMain = () => {
    const main = document.querySelector('#main-content, main, [role="main"]')
    if (main instanceof HTMLElement) {
      main.focus()
      main.scrollIntoView()
    }
  }

  const skipToNavigation = () => {
    const nav = document.querySelector('nav, [role="navigation"]')
    if (nav instanceof HTMLElement) {
      nav.focus()
      nav.scrollIntoView()
    }
  }

  const skipToSearch = () => {
    const search = document.querySelector('[role="search"], [type="search"], #search')
    if (search instanceof HTMLElement) {
      search.focus()
      search.scrollIntoView()
    }
  }

  return {
    skipToMain,
    skipToNavigation,
    skipToSearch
  }
}

/**
 * ARIA Helpers
 */
export function useAriaHelpers() {
  /**
   * Generate unique ID for ARIA relationships
   */
  function generateAriaId(prefix: string = 'aria'): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Set up ARIA describedby relationship
   */
  function setAriaDescribedBy(element: HTMLElement, description: string): string {
    const id = generateAriaId('description')
    const descElement = document.createElement('span')
    descElement.id = id
    descElement.className = 'sr-only'
    descElement.textContent = description
    element.appendChild(descElement)
    element.setAttribute('aria-describedby', id)
    return id
  }

  /**
   * Set up ARIA labelledby relationship
   */
  function setAriaLabelledBy(element: HTMLElement, labelElement: HTMLElement): void {
    if (!labelElement.id) {
      labelElement.id = generateAriaId('label')
    }
    element.setAttribute('aria-labelledby', labelElement.id)
  }

  /**
   * Update live region
   */
  function updateLiveRegion(
    regionId: string,
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
  ): void {
    const region = document.getElementById(regionId)
    if (region) {
      region.setAttribute('aria-live', priority)
      region.textContent = message
    }
  }

  return {
    generateAriaId,
    setAriaDescribedBy,
    setAriaLabelledBy,
    updateLiveRegion
  }
}

/**
 * Keyboard Navigation Composable
 */
export function useKeyboardNavigation(items: Ref<HTMLElement[]>) {
  const currentIndex = ref(0)

  function handleKeyNavigation(event: KeyboardEvent) {
    if (!items.value.length) return

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault()
        currentIndex.value = (currentIndex.value + 1) % items.value.length
        items.value[currentIndex.value].focus()
        break
        
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault()
        currentIndex.value = currentIndex.value === 0 
          ? items.value.length - 1 
          : currentIndex.value - 1
        items.value[currentIndex.value].focus()
        break
        
      case 'Home':
        event.preventDefault()
        currentIndex.value = 0
        items.value[0].focus()
        break
        
      case 'End':
        event.preventDefault()
        currentIndex.value = items.value.length - 1
        items.value[currentIndex.value].focus()
        break
        
      case 'Enter':
      case ' ':
        event.preventDefault()
        items.value[currentIndex.value].click()
        break
    }
  }

  function setFocus(index: number) {
    if (index >= 0 && index < items.value.length) {
      currentIndex.value = index
      items.value[index].focus()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyNavigation)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyNavigation)
  })

  return {
    currentIndex,
    setFocus
  }
}
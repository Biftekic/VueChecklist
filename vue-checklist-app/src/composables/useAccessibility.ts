import { ref, nextTick } from 'vue'

export function useAccessibility() {
  const ariaLiveRegion = ref<string>('')
  const ariaLiveMode = ref<'polite' | 'assertive'>('polite')

  const announce = async (message: string, mode: 'polite' | 'assertive' = 'polite') => {
    ariaLiveMode.value = mode
    ariaLiveRegion.value = ''
    await nextTick()
    ariaLiveRegion.value = message
  }

  const announcePolite = (message: string) => announce(message, 'polite')
  const announceAssertive = (message: string) => announce(message, 'assertive')

  const getFocusTrapOptions = () => ({
    initialFocus: false,
    fallbackFocus: 'body',
    escapeDeactivates: true,
    clickOutsideDeactivates: true,
    returnFocusOnDeactivate: true,
    allowOutsideClick: true
  })

  const getSkipLinkTarget = (targetId: string) => {
    return () => {
      const element = document.getElementById(targetId)
      if (element) {
        element.focus()
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  const describedById = (baseId: string, ...suffixes: string[]) => {
    return suffixes.map(suffix => `${baseId}-${suffix}`).join(' ')
  }

  const generateId = (prefix: string) => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  }

  return {
    ariaLiveRegion,
    ariaLiveMode,
    announce,
    announcePolite,
    announceAssertive,
    getFocusTrapOptions,
    getSkipLinkTarget,
    describedById,
    generateId
  }
}

export const ARIA_LABELS = {
  navigation: {
    main: 'Main navigation',
    breadcrumb: 'Breadcrumb navigation',
    pagination: 'Pagination navigation',
    sidebar: 'Sidebar navigation'
  },
  buttons: {
    close: 'Close',
    save: 'Save changes',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add new item',
    remove: 'Remove item',
    expand: 'Expand',
    collapse: 'Collapse',
    menu: 'Open menu',
    settings: 'Open settings',
    help: 'Get help',
    search: 'Search',
    filter: 'Filter results',
    sort: 'Sort items'
  },
  forms: {
    required: 'Required field',
    optional: 'Optional field',
    error: 'Error:',
    success: 'Success:',
    info: 'Information:',
    warning: 'Warning:'
  },
  status: {
    loading: 'Loading, please wait',
    complete: 'Operation complete',
    error: 'An error occurred',
    saving: 'Saving changes',
    saved: 'Changes saved successfully',
    deleting: 'Deleting item',
    deleted: 'Item deleted successfully'
  }
}

export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown'
}
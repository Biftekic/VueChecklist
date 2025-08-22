import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notificationStore'

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  description: string
  action: () => void
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const router = useRouter()
  const notificationStore = useNotificationStore()

  const handleKeydown = (event: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey
      const altMatch = shortcut.alt ? event.altKey : !event.altKey
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey

      if (
        event.key.toLowerCase() === shortcut.key.toLowerCase() &&
        ctrlMatch &&
        altMatch &&
        shiftMatch
      ) {
        event.preventDefault()
        shortcut.action()
        break
      }
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })

  return {
    shortcuts
  }
}

export function useGlobalKeyboardShortcuts() {
  const router = useRouter()
  const notificationStore = useNotificationStore()

  const globalShortcuts: KeyboardShortcut[] = [
    {
      key: 'h',
      ctrl: true,
      description: 'Go to Home',
      action: () => router.push('/')
    },
    {
      key: 'n',
      ctrl: true,
      alt: true,
      description: 'Create new checklist',
      action: () => router.push('/checklist/create')
    },
    {
      key: 't',
      ctrl: true,
      alt: true,
      description: 'Go to Templates',
      action: () => router.push('/templates')
    },
    {
      key: '/',
      ctrl: true,
      description: 'Show keyboard shortcuts',
      action: () => {
        const message = globalShortcuts.map(s => 
          `${s.ctrl ? 'Ctrl+' : ''}${s.alt ? 'Alt+' : ''}${s.shift ? 'Shift+' : ''}${s.key.toUpperCase()}: ${s.description}`
        ).join('\n')
        notificationStore.showInfo(message, 10000) // Show for 10 seconds
      }
    }
  ]

  return useKeyboardShortcuts(globalShortcuts)
}
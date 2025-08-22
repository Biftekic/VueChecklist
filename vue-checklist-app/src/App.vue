<template>
  <v-app>
    <!-- Skip to main content link for screen readers -->
    <a 
      href="#main-content" 
      class="skip-link"
      @click.prevent="skipToMain"
    >
      Skip to main content
    </a>

    <!-- ARIA live region for screen reader announcements -->
    <div 
      class="sr-only"
      :aria-live="ariaLiveMode"
      aria-atomic="true"
    >
      {{ ariaLiveRegion }}
    </div>

    <!-- Main application content -->
    <main id="main-content" role="main">
      <router-view></router-view>
    </main>

    <!-- Keyboard shortcuts help dialog -->
    <v-dialog v-model="showKeyboardHelp" max-width="600">
      <v-card>
        <v-card-title>
          <span class="text-h5">Keyboard Shortcuts</span>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="shortcut in shortcuts"
              :key="shortcut.key"
              :title="shortcut.description"
            >
              <template #prepend>
                <v-chip size="small" class="mr-2">
                  {{ formatShortcut(shortcut) }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text="Close"
            @click="showKeyboardHelp = false"
            aria-label="Close keyboard shortcuts dialog"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGlobalKeyboardShortcuts, type KeyboardShortcut } from '@/composables/useKeyboardShortcuts'
import { useAccessibility } from '@/composables/useAccessibility'

// Accessibility setup
const { ariaLiveRegion, ariaLiveMode, getSkipLinkTarget } = useAccessibility()

// Keyboard shortcuts
const showKeyboardHelp = ref(false)
const { shortcuts } = useGlobalKeyboardShortcuts()

// Add help dialog shortcut
shortcuts.push({
  key: '?',
  shift: true,
  description: 'Show keyboard shortcuts help',
  action: () => {
    showKeyboardHelp.value = true
  }
})

// Skip to main content
const skipToMain = getSkipLinkTarget('main-content')

// Format shortcut for display
const formatShortcut = (shortcut: KeyboardShortcut) => {
  let keys = []
  if (shortcut.ctrl) keys.push('Ctrl')
  if (shortcut.alt) keys.push('Alt')
  if (shortcut.shift) keys.push('Shift')
  keys.push(shortcut.key.toUpperCase())
  return keys.join('+')
}
</script>

<style scoped>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
  border-radius: 0 0 4px 0;
}

.skip-link:focus {
  top: 0;
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
</style>
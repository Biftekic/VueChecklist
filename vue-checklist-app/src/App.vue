<template>
  <v-app>
    <v-main id="main-content" role="main">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
    
    <!-- Global notification snackbar -->
    <v-snackbar
      v-model="showNotification"
      :color="notification?.type"
      :timeout="notification?.duration || 3000"
      location="bottom"
      rounded="pill"
      role="alert"
      aria-live="assertive"
    >
      {{ notification?.message }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          aria-label="Close notification"
          @click="clearNotification"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    
    <!-- Offline indicator -->
    <v-banner
      v-if="!isOnline"
      color="warning"
      sticky
      role="status"
      aria-live="polite"
      data-testid="offline-notification"
    >
      You're offline. Changes will sync when connection is restored.
    </v-banner>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const isOnline = computed(() => appStore.isOnline)
const notification = computed(() => appStore.notification)
const showNotification = computed({
  get: () => !!appStore.notification,
  set: () => appStore.clearNotification()
})

const clearNotification = () => {
  appStore.clearNotification()
}
</script>

<style>
/* Global styles for screen reader only content */
.sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

/* Focus visible for better keyboard navigation */
:focus-visible {
  outline: 2px solid var(--v-primary-base) !important;
  outline-offset: 2px !important;
}
</style>

<style scoped>
/* Page transition styles */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
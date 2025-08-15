<template>
  <v-app>
    <v-main>
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
      :timeout="notification?.duration"
      location="bottom"
      rounded="pill"
    >
      {{ notification?.message }}
      <template v-slot:actions>
        <v-btn
          variant="text"
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
      icon="mdi-wifi-off"
      sticky
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

<style scoped>
/* Page transition styles are in main.scss */
</style>
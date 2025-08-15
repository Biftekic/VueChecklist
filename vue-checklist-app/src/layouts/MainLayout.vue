<template>
  <div class="main-layout">
    <!-- App Header -->
    <v-app-bar
      color="primary"
      density="comfortable"
      elevation="0"
    >
      <v-app-bar-nav-icon
        v-if="showBackButton"
        @click="goBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-app-bar-nav-icon>
      
      <v-app-bar-title>
        {{ title }}
      </v-app-bar-title>
      
      <template v-slot:append>
        <slot name="actions"></slot>
      </template>
    </v-app-bar>
    
    <!-- Main Content -->
    <v-container fluid class="pa-0">
      <slot></slot>
    </v-container>
    
    <!-- Bottom Navigation -->
    <v-bottom-navigation
      v-model="activeTab"
      color="primary"
      grow
      mandatory
    >
      <v-btn
        value="home"
        @click="navigateTo('/')"
      >
        <v-icon>mdi-home</v-icon>
        <span>Home</span>
      </v-btn>
      
      <v-btn
        value="templates"
        @click="navigateTo('/templates')"
      >
        <v-icon>mdi-file-document-multiple</v-icon>
        <span>Templates</span>
      </v-btn>
      
      <v-btn
        value="create"
        @click="navigateTo('/create')"
      >
        <v-icon>mdi-plus-circle</v-icon>
        <span>Create</span>
      </v-btn>
      
      <v-btn
        value="checklists"
        @click="navigateTo('/checklists')"
      >
        <v-icon>mdi-format-list-checks</v-icon>
        <span>Lists</span>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    default: 'Cleaning Checklist Pro'
  },
  showBackButton: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const route = useRoute()

// Map routes to bottom nav values
const routeToTab = {
  '/': 'home',
  '/templates': 'templates',
  '/create': 'create',
  '/checklists': 'checklists'
}

const activeTab = ref('home')

// Update active tab based on current route
watch(
  () => route.path,
  (path) => {
    activeTab.value = routeToTab[path] || 'home'
  },
  { immediate: true }
)

const navigateTo = (path) => {
  router.push(path)
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.v-container {
  flex: 1;
  padding-bottom: 56px !important; /* Space for bottom nav */
}

.v-bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
}
</style>
<template>
  <div class="main-layout">
    <!-- App Header -->
    <v-app-bar
      color="primary"
      density="comfortable"
      elevation="2"
      class="app-header"
    >
      <v-app-bar-nav-icon
        v-if="showBackButton"
        @click="goBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-app-bar-nav-icon>
      
      <v-app-bar-title class="font-weight-bold">
        <v-icon class="mr-2">mdi-clipboard-check-outline</v-icon>
        {{ title }}
      </v-app-bar-title>
      
      <template v-slot:append>
        <!-- Temporarily removed ThemeToggle to fix blank screen issue -->
        <!-- <ThemeToggle class="mr-2" /> -->
        <slot name="actions"></slot>
      </template>
    </v-app-bar>
    
    <!-- Main Content -->
    <v-main class="main-content">
      <v-container fluid class="pa-0 fill-height">
        <slot></slot>
      </v-container>
    </v-main>
    
    <!-- Bottom Navigation -->
    <v-bottom-navigation
      v-model="activeTab"
      color="primary"
      grow
      mandatory
      elevation="8"
      class="bottom-nav"
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
// Temporarily removed ThemeToggle import
// import ThemeToggle from '@/components/common/ThemeToggle.vue'

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

// Update active tab based on route
watch(() => route.path, (newPath) => {
  activeTab.value = routeToTab[newPath] || 'home'
}, { immediate: true })

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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-header {
  backdrop-filter: blur(10px);
}

.main-content {
  flex: 1;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px 20px 0 0;
  margin-top: -20px;
  padding-top: 20px;
}

.bottom-nav {
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.v-container {
  flex: 1;
  padding-bottom: 76px; /* Account for bottom navigation with extra padding */
}
</style>
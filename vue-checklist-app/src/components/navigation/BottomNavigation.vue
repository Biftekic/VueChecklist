<template>
  <v-bottom-navigation
    v-model="activeTab"
    grow
    class="bottom-nav"
    elevation="8"
  >
    <v-btn
      v-for="item in navigationItems"
      :key="item.value"
      :value="item.value"
      @click="navigateTo(item.route)"
    >
      <v-icon>{{ item.icon }}</v-icon>
      <span class="text-caption">{{ item.label }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const navigationItems = [
  {
    value: 'home',
    label: 'Home',
    icon: 'mdi-home',
    route: '/'
  },
  {
    value: 'templates',
    label: 'Templates',
    icon: 'mdi-file-document-outline',
    route: '/templates'
  },
  {
    value: 'checklists',
    label: 'Checklists',
    icon: 'mdi-format-list-checks',
    route: '/checklists'
  },
  {
    value: 'settings',
    label: 'Settings',
    icon: 'mdi-cog',
    route: '/settings'
  }
]

const activeTab = ref('home')

// Update active tab based on current route
watch(() => route.path, (path) => {
  if (path === '/') {
    activeTab.value = 'home'
  } else if (path.startsWith('/templates')) {
    activeTab.value = 'templates'
  } else if (path.startsWith('/checklists')) {
    activeTab.value = 'checklists'
  } else if (path.startsWith('/settings')) {
    activeTab.value = 'settings'
  }
}, { immediate: true })

const navigateTo = (route) => {
  router.push(route)
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.v-btn {
  height: 56px !important;
}

.v-btn span {
  font-size: 10px;
}
</style>
<template>
  <v-app>
    <v-app-bar color="primary" app>
      <v-app-bar-title>
        Vue Checklist App
        <span v-if="currentPath !== '/'" class="text-caption ml-2">
          ({{ currentPath }})
        </span>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="goHome" v-if="currentPath !== '/'">
        <v-icon>mdi-home</v-icon>
      </v-btn>
    </v-app-bar>
    
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
    
    <!-- Bottom Navigation -->
    <v-bottom-navigation grow>
      <v-btn @click="navigateTo('/')">
        <v-icon>mdi-home</v-icon>
        <span>Home</span>
      </v-btn>
      <v-btn @click="navigateTo('/templates')">
        <v-icon>mdi-file-document</v-icon>
        <span>Templates</span>
      </v-btn>
      <v-btn @click="navigateTo('/create')">
        <v-icon>mdi-plus</v-icon>
        <span>Create</span>
      </v-btn>
      <v-btn @click="navigateTo('/checklists')">
        <v-icon>mdi-clipboard-list</v-icon>
        <span>Lists</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const currentPath = computed(() => route.path)

const navigateTo = (path) => {
  console.log('App navigating to:', path)
  router.push(path)
}

const goHome = () => {
  router.push('/')
}

console.log('App.vue loaded with navigation')
</script>
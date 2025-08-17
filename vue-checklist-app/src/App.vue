<template>
  <v-app>
    <v-app-bar color="primary" app>
      <v-app-bar-title>Vue Checklist App</v-app-bar-title>
    </v-app-bar>
    
    <v-main>
      <v-container>
        <h1>Welcome to Vue Checklist App</h1>
        <p>If you can see this, the app is working!</p>
        
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
console.log('App.vue loaded successfully')
</script>
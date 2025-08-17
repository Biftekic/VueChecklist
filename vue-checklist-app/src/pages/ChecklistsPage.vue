<template>
  <div class="checklists-page pa-4">
    <v-container>
      <h1 class="text-h3 mb-4">My Checklists</h1>
      
      <v-card class="pa-4">
        <v-card-title>Your Checklists</v-card-title>
        <v-card-text>
          <p>You have no checklists yet.</p>
          <v-btn color="primary" @click="goToCreate" class="mt-3">
            Create Your First Checklist
          </v-btn>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToCreate = () => {
  router.push('/create')
}

console.log('ChecklistsPage loaded')
</script>
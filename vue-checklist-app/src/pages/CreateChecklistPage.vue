<template>
  <div class="create-page pa-4">
    <v-container>
      <h1 class="text-h3 mb-4">Create New Checklist</h1>
      
      <v-card class="pa-4">
        <v-card-text>
          <v-text-field
            label="Checklist Name"
            placeholder="Enter checklist name"
            variant="outlined"
            class="mb-4"
          ></v-text-field>
          
          <v-textarea
            label="Description"
            placeholder="Enter description"
            variant="outlined"
            rows="3"
            class="mb-4"
          ></v-textarea>
          
          <v-select
            label="Category"
            :items="['Office', 'Home', 'Restaurant', 'Medical', 'Other']"
            variant="outlined"
            class="mb-4"
          ></v-select>
          
          <v-btn color="primary" block @click="saveChecklist">
            Create Checklist
          </v-btn>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const saveChecklist = () => {
  console.log('Saving checklist...')
  // After save, navigate to checklists
  router.push('/checklists')
}

console.log('CreateChecklistPage loaded')
</script>
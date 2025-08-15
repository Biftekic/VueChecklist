<template>
  <div>
    <h2 class="mb-4">Review & Save</h2>
    <p>Checklist review will be implemented here</p>
    
    <div class="d-flex gap-2">
      <v-btn @click="$emit('back')" variant="outlined">Back</v-btn>
      <v-btn @click="$emit('save')" color="success">Save Checklist</v-btn>
    </div>
  </div>
</template>

<script setup>
defineEmits(['save', 'back'])
</script>
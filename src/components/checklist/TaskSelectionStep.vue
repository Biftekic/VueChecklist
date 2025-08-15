<template>
  <div>
    <h2 class="mb-4">Select Tasks</h2>
    <p>Task selection will be implemented here</p>
    
    <div class="d-flex gap-2">
      <v-btn @click="$emit('back')" variant="outlined">Back</v-btn>
      <v-btn @click="$emit('next')" color="primary">Continue</v-btn>
    </div>
  </div>
</template>

<script setup>
defineEmits(['next', 'back'])
</script>
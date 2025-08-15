<template>
  <div>
    <h2 class="mb-4">Property Details</h2>
    
    <v-form ref="form" @submit.prevent="handleNext">
      <!-- Property Size -->
      <v-text-field
        v-model="propertyDetails.size"
        label="Property Size (m²)"
        type="number"
        variant="outlined"
        class="mb-4"
        :rules="[rules.required, rules.number]"
      />
      
      <!-- Number of Floors -->
      <v-text-field
        v-model="propertyDetails.floors"
        label="Number of Floors"
        type="number"
        variant="outlined"
        class="mb-4"
        :rules="[rules.required, rules.number]"
      />
      
      <!-- Number of Rooms -->
      <v-text-field
        v-model="propertyDetails.rooms"
        label="Number of Rooms"
        type="number"
        variant="outlined"
        class="mb-4"
        :rules="[rules.required, rules.number]"
      />
      
      <!-- Difficulty -->
      <div class="mb-4">
        <label class="text-body-2 mb-2 d-block">Difficulty</label>
        <v-radio-group
          v-model="modifiers.difficulty"
          inline
        >
          <v-radio label="Light" value="light" />
          <v-radio label="Average" value="average" />
          <v-radio label="Heavy" value="heavy" />
        </v-radio-group>
      </div>
      
      <!-- Expectations -->
      <div class="mb-4">
        <label class="text-body-2 mb-2 d-block">Expectations</label>
        <v-radio-group
          v-model="modifiers.expectations"
          inline
        >
          <v-radio label="Very Reasonable" value="very_reasonable" />
          <v-radio label="Reasonable" value="reasonable" />
          <v-radio label="Average" value="average" />
          <v-radio label="Demanding" value="demanding" />
          <v-radio label="Very Demanding" value="very_demanding" />
        </v-radio-group>
      </div>
      
      <!-- Challenges -->
      <div class="mb-4">
        <label class="text-body-2 mb-2 d-block">Challenges</label>
        <v-radio-group
          v-model="modifiers.challenges"
          inline
        >
          <v-radio label="Very Easy" value="very_easy" />
          <v-radio label="Easy" value="easy" />
          <v-radio label="Average" value="average" />
          <v-radio label="Hard" value="hard" />
          <v-radio label="Very Hard" value="very_hard" />
        </v-radio-group>
      </div>
      
      <!-- Continue Button -->
      <v-btn
        type="submit"
        color="primary"
        size="large"
        block
        rounded="pill"
      >
        Continue
      </v-btn>
    </v-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useChecklistsStore } from '@/stores/checklists'

const emit = defineEmits(['next'])
const checklistsStore = useChecklistsStore()

const form = ref(null)

const propertyDetails = reactive({
  size: checklistsStore.newChecklist.propertyDetails?.size || '',
  floors: checklistsStore.newChecklist.propertyDetails?.floors || '',
  rooms: checklistsStore.newChecklist.propertyDetails?.rooms || ''
})

const modifiers = reactive({
  difficulty: checklistsStore.newChecklist.modifiers?.difficulty || 'average',
  expectations: checklistsStore.newChecklist.modifiers?.expectations || 'average',
  challenges: checklistsStore.newChecklist.modifiers?.challenges || 'average'
})

const rules = {
  required: v => !!v || 'This field is required',
  number: v => !isNaN(v) && v > 0 || 'Must be a positive number'
}

const handleNext = async () => {
  const { valid } = await form.value.validate()
  
  if (valid) {
    // Save to store
    checklistsStore.updateNewChecklist({
      propertyDetails,
      modifiers
    })
    
    // Proceed to next step
    emit('next')
  }
}
</script>

<style scoped>
label {
  font-weight: 500;
}
</style>
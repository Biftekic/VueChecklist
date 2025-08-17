<template>
  <div class="templates-page pa-4">
    <v-container>
      <h1 class="text-h3 mb-4">Checklist Templates</h1>
      
      <v-row>
        <v-col cols="12" md="6" lg="4">
          <v-card class="pa-4">
            <v-card-title>Office Cleaning</v-card-title>
            <v-card-text>
              Standard office cleaning checklist template
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" variant="text">Use Template</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="6" lg="4">
          <v-card class="pa-4">
            <v-card-title>Home Cleaning</v-card-title>
            <v-card-text>
              Residential cleaning checklist template
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" variant="text">Use Template</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="6" lg="4">
          <v-card class="pa-4">
            <v-card-title>Restaurant</v-card-title>
            <v-card-text>
              Restaurant cleaning checklist template
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" variant="text">Use Template</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
console.log('TemplatesPage loaded')
</script>
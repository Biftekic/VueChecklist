<template>
  <v-container>
    <v-row>
      <v-col>
        <h3>Icon Test Component</h3>
        <p>Testing various icon formats:</p>
        
        <!-- Test basic icons -->
        <div class="mb-4">
          <h4>Basic Icons:</h4>
          <v-icon>mdi-home</v-icon>
          <v-icon>mdi-account</v-icon>
          <v-icon>mdi-check</v-icon>
          <v-icon>mdi-close</v-icon>
          <v-icon>mdi-plus</v-icon>
          <v-icon>mdi-delete</v-icon>
        </div>

        <!-- Test icons with colors -->
        <div class="mb-4">
          <h4>Colored Icons:</h4>
          <v-icon color="primary">mdi-home</v-icon>
          <v-icon color="success">mdi-check-circle</v-icon>
          <v-icon color="error">mdi-alert-circle</v-icon>
          <v-icon color="warning">mdi-alert</v-icon>
        </div>

        <!-- Test icons in buttons -->
        <div class="mb-4">
          <h4>Icons in Buttons:</h4>
          <v-btn>
            <v-icon start>mdi-plus</v-icon>
            Add
          </v-btn>
          <v-btn color="primary">
            <v-icon start>mdi-pencil</v-icon>
            Edit
          </v-btn>
          <v-btn color="error">
            <v-icon start>mdi-delete</v-icon>
            Delete
          </v-btn>
        </div>

        <!-- Test prepend/append icons -->
        <div class="mb-4">
          <h4>Icons in Text Fields:</h4>
          <v-text-field
            label="Search"
            prepend-icon="mdi-magnify"
          ></v-text-field>
          <v-text-field
            label="Email"
            prepend-icon="mdi-email"
          ></v-text-field>
        </div>

        <!-- Test icon sizes -->
        <div class="mb-4">
          <h4>Icon Sizes:</h4>
          <v-icon size="x-small">mdi-home</v-icon>
          <v-icon size="small">mdi-home</v-icon>
          <v-icon>mdi-home</v-icon>
          <v-icon size="large">mdi-home</v-icon>
          <v-icon size="x-large">mdi-home</v-icon>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Test component to verify icons are working
</script>
<template>
  <v-container>
    <v-card>
      <v-card-title>Records</v-card-title>

      <v-card-text>
        <div class="d-flex">
          <v-btn @click="null" color="yellow" prepend-icon="mdi-refresh" variant="text">Refresh</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="openDialog('Add')" color="green" prepend-icon="mdi-plus" variant="text">Add</v-btn>
          <v-btn class="ml-2" @click="doDelete" color="red" :disabled="!selected.length" prepend-icon="mdi-trash-can" variant="text">Delete</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
  import { ref } from 'vue';

  /**
   * VARIABLES
   */

  // Page
  const selected = ref([]);

  const doDelete = () => {

  }

  const openDialog = () => {
    
  }

</script>
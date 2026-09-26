<template>
  <v-container :class="{ 'pa-0' : mobile }">
    <v-card>
      <v-card-title>Records</v-card-title>

      <v-card-text>
        <div class="d-flex" :class="{ 'mb-2': mobile }">
          <v-btn @click="null" color="amber" icon="mdi-refresh" size="x-small" variant="tonal"></v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="openDialog('Add')" color="green" icon="mdi-plus" size="x-small" variant="tonal"></v-btn>
          <v-btn class="ml-3" @click="doDelete" color="red" :disabled="!selected.length" icon="mdi-trash-can" size="x-small" variant="tonal"></v-btn>
        </div>

        <v-data-table v-model="selected"
          :headers="HEADERS" :items="items"
        >
          <!-- Common -->
          <template #no-data>
            <div class="text-no-data text-grey-darknen-1" @click="openDialog('Add')">Add record</div>
          </template>
          <template #bottom></template>

        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
  import { ref } from 'vue';
  import { useDisplay } from 'vuetify';

  /**
   * VARIABLES
   */
  // Imports
  const { mobile } = useDisplay();

  // Page
  const items = ref([]);
  const selected = ref([]);

  /**
   * CONSTANTS
   */
  const HEADERS = [
    { key: 'date', title: 'Date' },
    { key: 'exercises', title: 'Exercises', sortable: false }
  ];

  const doDelete = () => {

  }

  const openDialog = () => {
    
  }
</script>

<style>
  .text-no-data:hover {
    cursor: pointer;
    color: green;
  }
</style>
<template>
  <v-container :class="{ 'pa-0' : mobile }">
    <v-card elevation="0" :rounded="!mobile && 15">
      <v-card-title class="bg-orange-lighten-2">Records</v-card-title>

      <v-card-text class="px-0">
        <div class="bg-orange-lighten-5 d-flex pa-1" :class="{ 'mb-2': mobile }">
          <v-btn @click="null" color="amber" icon="mdi-refresh" size="x-small" variant="flat"></v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="openDialog('Add')" color="green" icon="mdi-plus" size="x-small" variant="flat"></v-btn>
          <v-btn class="ml-3" @click="doDelete" color="red" :disabled="!selected.length" icon="mdi-trash-can" size="x-small" variant="flat"></v-btn>
        </div>

        <v-data-table v-model="selected"
          :headers="HEADERS" :items="items"
          :loading="StoreCommon.loading" :mobile="mobile"
          show-select
        >
          <!-- Common -->
          <template #no-data>
            <div class="text-no-data text-grey-darken-1" @click="openDialog('Add')">Add record</div>
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
  import { useCommonStore } from '@/store/StoreCommon.js';

  /**
   * VARIABLES
   */
  // Imports
  const StoreCommon = useCommonStore();
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
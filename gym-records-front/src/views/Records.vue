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

  <v-dialog v-model="dialog" :fullscreen="mobile" no-click-animation scrollable persistent scrim="grey" width="600">
    <v-card :rounded="!mobile && 15">
      <v-card-title class="bg-orange-lighten-2">{{ action }} record</v-card-title>
      <div style="position: absolute; top: 8px; right: 8px;">
        <v-btn v-if="action === 'Edit'" @click="doDelete" color="red" icon="mdi-trash-icon" size="x-small" variant="flat"></v-btn>
      </div>
      
      <v-card-text>
        <PartsTextField label="Date" type="date" v-model="inputItem.date"></PartsTextField>
        <div class="mb-4">
          <div>Exercises</div>
          <template v-for="exercise in inputItem.exercises" :key="exercise.name"></template>
          <v-btn class="mt-2" @click="addExercise" color="green" prepend-icon="mdi-plus" variant="flat" width="100%"> Add exercise</v-btn>
        </div>
        <PartsTextArea label="Notes" v-model="inputItem.notes"></PartsTextArea>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="dialog = false" color="red" variant="flat" width="6em">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="action === 'Add'"
          @click="doAction" color="green" prepend-icon="mdi-plus" variant="flat" width="6em">Add</v-btn>
        <v-btn v-if="action === 'Edit'"
          @click="doAction" color="blue" prepend-icon="mdi-pencil" variant="flat"
          width="6em">Edit</v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue';
  import { useDisplay } from 'vuetify';
  import { useCommonStore } from '@/store/StoreCommon.js';
  import * as ComDbUtils from '@/common/ComDbUtils.js';

  import PartsTextField from '@/components/PartsTextField.vue';
  import PartsTextArea from '@/components/PartsTextArea.vue';

  /**
   * VARIABLES
   */
  // Imports
  const StoreCommon = useCommonStore();
  const { mobile } = useDisplay();

  // Page
  const items = ref([]);
  const selected = ref([]);

  // Dialog
  const action = ref();
  const dialog = ref(false);
  const exercises = computed(() => StoreCommon.exercises.map(exercise => exercise.name));
  const inputItem = ref({});

  /**
   * CONSTANTS
   */
  const HEADERS = [
    { key: 'date', title: 'Date' },
    { key: 'exercises', title: 'Exercises', sortable: false }
  ];

  /**
   * EVENTS
   */
  onMounted(async () => {
    // Update records list
    if (StoreCommon.records.length === 0) {
      await getList();
    }
    else {
      items.value = StoreCommon.records;
    }

    // Update exercises list (for Exercises pull down)
    if (StoreCommon.exercises.length === 0) {
      StoreCommon.exercises = await ComDbUtils.selectTable('m_gym_exercises');
    }
  });

  const doAction = async () => {
    await getList();
    dialog.value = false;
  }

  const doDelete = () => {
    const proceed = confirm('Are you sure you want to delete selected?');
    if (!proceed) return;
  }

  const getList = async () => {

  }

  // Dialog
  const openDialog = (p_action, p_item) => {
    if (p_action === 'Add') {
      resetItem();
    }
    else if (p_action === 'Edit') {
      inputItem.value = JSON.parse(JSON.stringify(p_item));
    }

    action.value = p_action;

    dialog.value = true;
  }

  const resetItem = () => {
    inputItem.value.date = '';
    inputItem.value.exercises = [{ name: '' }];
    inputItem.value.notes = '';
  }

  // Exercises
  const addExercise = () => {
    inputItem.value.exercises = [];
  }
</script>

<style>
  .text-no-data:hover {
    cursor: pointer;
    color: green;
  }
</style>
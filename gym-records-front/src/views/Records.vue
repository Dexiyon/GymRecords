<template>
  <v-container :class="{ 'pa-0' : mobile }" style="min-width: 100%;">
    <v-card elevation="0" :rounded="!mobile && 15">
      <v-card-title class="bg-orange-lighten-2">Records</v-card-title>

      <v-card-text class="px-0">
        <div class="bg-orange-lighten-5 d-flex pa-1" :class="{ 'mb-2': mobile }">
          <v-btn @click="getList" color="amber" icon="mdi-refresh" size="x-small" variant="flat"></v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="openDialog('Add')" color="green" icon="mdi-plus" size="x-small" variant="flat"></v-btn>
          <v-btn class="ml-3" @click="doDelete" :color="!selected.length ? 'grey' : 'red'" :disabled="!selected.length" icon="mdi-trash-can" size="x-small" variant="flat"></v-btn>
        </div>

        <v-data-table v-model="selected"
          :headers="HEADERS" :items="items"
          :loading="StoreCommon.loading" :mobile="mobile"
          show-select :sort-by="[{ key: 'date', order: 'asc' }]"
        >
          <!-- Common -->
          <template #no-data>
            <div class="text-no-data text-grey-darken-1" @click="openDialog('Add')">Add record</div>
          </template>
          <template #bottom></template>

          <!-- PC -->
          <template #[`item.date`]="{ item }">
            <div class="d-flex align-center">
              <div>{{ ComUtils.formatDate(item.date, 'fullDateWithWeekday') }}</div>
              <v-spacer></v-spacer>
              <v-btn @click="openDialog('Edit', item)" color="blue" icon="mdi-pencil" variant="text"></v-btn>
            </div>
          </template>
          <template #[`item.exercises`]="{ item }">
            <div v-if="item.exercises.length > 0" class="my-4">
              <div v-for="exercise in item.exercises" :key="exercise.name"
                class="align-center d-flex my-1">
                <v-chip v-if="!ComUtils.isEmptyString(exercise.category)"
                  class="mr-2" :color="exercise.category === 'weights' ? 'red' : 'blue'" density="compact" variant="flat">{{ exercise.category }}</v-chip>
                <span class="mr-2">{{ exercise.name }}</span>
                <span v-if="exercise.category === 'weights'" class="text-grey-darken-1">{{ ComGymUtils.getSetsSummary(exercise.sets)  }}</span>
                <span v-if="exercise.category === 'cardio'" class="text-grey-darken-1">{{ exercise.minutes }} mins</span>
              </div>
            </div>
            <div v-else class="text-grey-darken-1">None</div>
          </template>

          <!-- Mobile -->
          <template v-if="mobile" #item="{ internalItem, isSelected, toggleSelect }">
            <v-card class="border-b mb-1 mobile-card" :class="{ 'bg-orange-lighten-4' : isSelected(internalItem) }" elevation="0" rounded="15">
              <v-card-text class="">
                <div class="d-flex align-start">
                  <v-checkbox-btn class="mr-4" :model-value="isSelected(internalItem)" @update:model-value="toggleSelect(internalItem)" style="max-width: max-content;"
                  ></v-checkbox-btn>
                  <div class="w-100" @click="openDialog('Edit', internalItem.raw)">
                    <div class="d-flex mb-2">
                      <div class="text-title-large">{{ ComUtils.formatDate(internalItem.raw.date, 'fullDateWithWeekday') }}</div>
                      <v-icon color="blue" size="x-large" style="position: absolute; right: 20px;">mdi-pencil</v-icon>
                    </div>
                    <div v-if="internalItem.raw.exercises.length > 0">
                      <div v-for="exercise in internalItem.raw.exercises" :key="exercise.name" class="my-1">
                        <div class="d-flex">
                          <v-chip v-if="!ComUtils.isEmptyString(exercise.category)"
                            class="mr-2" :color="exercise.category === 'weights' ? 'red' : 'blue'" density="compact" variant="flat">{{ exercise.category }}</v-chip>
                          <span class="mr-2">{{ exercise.name }}</span>
                        </div>
                        <div v-if="exercise.category === 'weights'" class="text-grey-darken-1">{{ ComGymUtils.getSetsSummary(exercise.sets)  }}</div>
                        <div v-if="exercise.category === 'cardio'" class="text-grey-darken-1">{{ exercise.minutes }} mins</div>
                      </div>
                    </div>
                    <div v-else class="text-grey-darken-1">None</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </template>
           
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>

  <v-dialog v-model="dialog" :fullscreen="mobile" no-click-animation scrollable persistent scrim="grey" width="600">
    <v-card :rounded="!mobile && 15">
      <v-card-title class="bg-orange-lighten-2">{{ action }} record</v-card-title>
      <div style="position: absolute; top: 8px; right: 8px;">
        <v-btn v-if="action === 'Edit'" @click="doDelete" color="red" icon="mdi-trash-can" size="x-small" variant="flat"></v-btn>
      </div>
      
      <v-card-text>
        <div>
          <div class="mb-2 text-red" style="font-size: 0.8em;">※Only Date is required</div>
          <PartsTextDate centered label="Date" v-model="inputItem.date"></PartsTextDate>
        </div>

        <div class="mb-4">
          <div>Exercises</div>
          <v-card v-for="exercise in inputItem.exercises" :key="exercise.id"
            class="mb-2 pa-3" elevation="0" rounded="15" style="border: solid 1px grey;">
            <div class="d-flex">
              <div>{{ exercise.id }}</div>
              <PartsTextSelect class="mb-4 mx-2" centered :items="exercises.map(exercise => exercise.name).sort((a, b) => a.localeCompare(b))" v-model="exercise.name"></PartsTextSelect>
              <v-icon @click="deleteExercise(exercise)" color="red">mdi-trash-can</v-icon>
            </div>
            <template v-if="!ComUtils.isEmptyString(exercise.name)">
              <template v-for="selExercise in exercises.filter(e => e.name === exercise.name)" :key="selExercise.name">
                <PartsWeightsSets v-if="selExercise.category === 'weights'" class="mb-4" color="orange-accent-3" v-model="selExercise.sets"></PartsWeightsSets>
                <PartsCardioMinutes v-if="selExercise.category === 'cardio'" v-model="selExercise.minutes"></PartsCardioMinutes>
              </template>
            </template>
          </v-card>
          <v-btn class="mt-2" @click="addExercise" color="green" prepend-icon="mdi-plus" variant="outlined" width="100%"> Add exercise</v-btn>
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
  import { useCommonStore } from '@/store/StoreCommon.js';
  import { useDisplay } from 'vuetify';
  import { useRouter } from 'vue-router';
  import * as ComDbUtils from '@/common/ComDbUtils.js';
  import * as ComGymUtils from '@/common/ComGymUtils.js';
  import * as ComUtils from '@/common/ComUtils.js';

  import PartsCardioMinutes from '@/components/PartsCardioMinutes.vue';
  import PartsTextArea from '@/components/PartsTextArea.vue';
  import PartsTextDate from '@/components/PartsTextDate.vue';
  import PartsTextSelect from '@/components/PartsTextSelect.vue';
  import PartsWeightsSets from '@/components/PartsWeightsSets.vue';

  /**
   * VARIABLES
   */
  // Imports
  const router = useRouter();
  const StoreCommon = useCommonStore();
  const { mobile } = useDisplay();

  // Page
  const items = ref([]);
  const selected = ref([]);

  // Dialog
  const action = ref();
  const dialog = ref(false);
  const exercises = ref([]);
  const inputItem = ref({});

  /**
   * CONSTANTS
   */
  const HEADERS = [
    { key: 'date', title: 'Date', width: "25%" },
    { key: 'exercises', title: 'Exercises', sortable: false, width: "75%" }
  ];
  const TABLE_NAME = 't_gym_records';

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
    exercises.value = JSON.parse(JSON.stringify(StoreCommon.exercises));
  });

  const doAction = async () => {
    if (ComUtils.isEmptyString(inputItem.value.date)) {
      alert('Date cannot be empty');
      return;
    }
    if (action.value === 'Add' && items.value.some(item => new Date(item.date).toDateString() === new Date(inputItem.value.date).toDateString())) {
      alert(ComUtils.formatDate(inputItem.value.date, 'fullDateWithWeekday') + ' is already in the list');
      return;
    }

    inputItem.value.exercises.forEach(exercise => {
      const displayExercise = exercises.value.filter(e => e.name === exercise.name)[0];
      exercise.category = displayExercise.category;
      exercise.sets = displayExercise.sets;
      exercise.minutes = displayExercise.minutes;
    });

    if (action.value === 'Add') {
      await ComDbUtils.insertTable(TABLE_NAME, { data: inputItem.value });
    }
    else if (action.value === 'Edit') {
      await ComDbUtils.updateTable(TABLE_NAME, inputItem.value.id, { data: inputItem.value });
    }

    await getList();
    dialog.value = false;
  }

  const doDelete = async () => {
    const proceed = confirm('Are you sure you want to delete selected?');
    if (!proceed) return;

    let arr_id = [];
    if (dialog.value) {
      arr_id.push(inputItem.value.id);
      await ComDbUtils.deleteTable(TABLE_NAME, arr_id);
      dialog.value = false;
    }
    else {
      await ComDbUtils.deleteTable(TABLE_NAME, selected.value);
      selected.value = [];
    }

    await getList();
  }

  const getList = async () => {
    items.value = await ComDbUtils.selectTable(TABLE_NAME);
    StoreCommon.records = items.value;
  }

  // Dialog
  const openDialog = (p_action, p_item) => {
    if (p_action === 'Add') {
      resetItem();
    }
    else if (p_action === 'Edit') {
      inputItem.value = JSON.parse(JSON.stringify(p_item));
      exercises.value.forEach(displayExercise => {
        const exercise = inputItem.value.exercises.filter(e => e.name === displayExercise.name)[0];
        if (ComUtils.isEmptyArray(exercise)) return;
        displayExercise.sets = exercise.sets;
        displayExercise.minutes = exercise.minutes;
      });
    }

    action.value = p_action;

    dialog.value = true;
  }

  const resetItem = () => {
    inputItem.value.date = new Date();
    inputItem.value.exercises = [];
    inputItem.value.notes = '';
  }

  // Exercises
  const addExercise = () => {
    if (exercises.value.length === 0) {
      alert('No exercises found.\nAdd exercises from the Exercises menu first.');
      router.push({ name: 'exercises' });
    };

    let maxId = 1;
    if (inputItem.value.exercises.length > 0) {
      maxId = Math.max(...inputItem.value.exercises.map(exercise => exercise.id)) + 1;
    }
    inputItem.value.exercises.push({ id: maxId, name: '' });
  }

  const deleteExercise = (p_exercise) => {
    const newExercises = inputItem.value.exercises.filter(exercise => exercise.id !== p_exercise.id);
    if (newExercises.length > 0) {
      let id = 1;
      newExercises.forEach(exercise => exercise.id = id++);
    }
    inputItem.value.exercises = newExercises;
  }
</script>

<style>
  .text-no-data:hover {
    cursor: pointer;
    color: green;
  }
</style>
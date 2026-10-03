<template>
  <v-container :class="{ 'pa-0' : mobile }">
    <v-card elevation="0" :rounded="!mobile && 15">
      <v-card-title class="bg-orange-lighten-2">Exercises</v-card-title>

      <v-card-text class="px-0">
        <div class="bg-orange-lighten-5 d-flex pa-1" :class="{ 'mb-2' : mobile }">
          <v-btn @click="getList" color="amber" icon="mdi-refresh" size="x-small" variant="flat"></v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="openDialog('Add')" color="green" icon="mdi-plus" size="x-small" variant="flat"></v-btn>
          <v-btn class="ml-3" @click="doDelete" :color="!selected.length ? 'grey' : 'red'" :disabled="!selected.length" icon="mdi-trash-can" size="x-small" variant="flat"></v-btn>
        </div>

        <v-data-table v-model="selected"
          :headers="HEADERS" :items="items" item-value="id"
          :loading="StoreCommon.loading" :mobile="mobile"
          show-select :sort-by="[{ key: 'name', order: 'asc' }]">

          <!-- Common -->
          <template #no-data>
            <div class="text-no-data text-grey-darken-1" @click="openDialog('Add')">Start by adding an exercise</div>
          </template>
          <template #bottom></template>

          <!-- PC -->
          <template #[`item.category`]="{ item }">
            <div class="d-flex align-center">
              <v-chip class="mr-2" :color="item.category === 'weights' ? 'red' : 'blue'" variant="flat">{{ item.category }}</v-chip>
              <div v-if="item.category === 'weights' && item.sets?.length > 0">{{ getSetsSummary(item) }}</div>
              <div v-if="item.category === 'cardio' && item.minutes > 0">{{ item.minutes }} mins</div>
            </div>
          </template>
          <template #[`item.notes`]="{ item }">
            <div class="text-grey-darken-1" style="white-space: pre-wrap;" v-html="item.notes" ></div>
          </template>
          <template #[`item.edit`]="{ item }">
            <v-btn @click="openDialog('Edit', item)" color="blue" icon="mdi-pencil" variant="text"></v-btn>
          </template>

          <!-- Mobile -->
          <template v-if="mobile" #item="{ internalItem, isSelected, toggleSelect }">
            <v-card class="border-b mb-1" :class="{ 'bg-orange-lighten-4' : isSelected(internalItem) }" elevation="0" rounded="15">
              <v-card-text class="d-flex align-center" @click="toggleSelect(internalItem)">
                <section style="width: 15%;">
                  <v-checkbox-btn
                    :model-value="isSelected(internalItem)"
                    @update:model-value="toggleSelect(internalItem)"
                    style="max-width: max-content;"
                  ></v-checkbox-btn>
                </section>
                <section style="width: 70%;">
                  <div style="width: 100%;">
                    <div class="align-center d-flex">
                      <v-chip class="mr-2" :color="internalItem.raw.category === 'weights' ? 'red' : 'blue'" variant="flat">{{ internalItem.raw.category }}</v-chip>
                      <div class="d-flex text-title-large">{{ internalItem.raw.name }}</div>
                    </div>
                    <div v-if="internalItem.raw.category === 'weights' && internalItem.raw.sets?.length > 0"
                      class="d-flex text-grey-darken-1">{{ getSetsSummary(internalItem.raw) }}</div>
                    <div v-if="internalItem.raw.category === 'cardio' && internalItem.raw.minutes > 0"
                      class="d-flex text-grey-darken-1">{{ internalItem.raw.minutes }} mins</div>
                    <div v-html="internalItem.raw.notes" class="d-flex text-grey-darken-1" style="white-space: pre-wrap;"></div>
                  </div>
                </section>
                <section style="width: 15%;" class="d-flex justify-end">
                  <v-btn @click.stop="openDialog('Edit', internalItem.raw)" color="blue" icon="mdi-pencil" style="font-size: 1.2em;" variant="text"></v-btn>
                </section>
              </v-card-text>
            </v-card>
          </template>

        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>

  <!-- Add/Edit Dialog -->
  <v-dialog v-model="dialog" :fullscreen="mobile" no-click-animation scrollable persistent scrim="grey" width="600">
    <v-card :rounded="!mobile && 15" >
      <v-card-title class="bg-orange-lighten-2">{{ action }} exercise</v-card-title>
      <div style="position: absolute; top: 8px; right: 8px;">
        <v-btn v-if="action === 'Edit'" @click="doDelete" color="red" icon="mdi-trash-can" size="x-small" variant="flat"></v-btn>
      </div>

      <v-card-text>
        <div>
          <div class="mb-2 text-red" style="font-size: 0.8em;">※Only Name is required</div>
          <PartsTextField label="Name" v-model="inputItem.name"></PartsTextField>
        </div>

        <div>
          <div>Category</div>
          <PartsRadioGroup button color="orange-accent-1" :items="CATEGORIES" v-model="inputItem.category"></PartsRadioGroup>
        </div>
        <v-data-table class="mb-4 table-sets" v-if="inputItem.category === 'weights'"
          :headers="HEADERS_WEIGHTS" :items="inputItem.sets">
          <template #headers v-if="!inputItem.sets?.length"></template>
          <template #no-data></template>
          <template #[`item.weight`]="{ item }">
            <PartsCounter color="orange-accent-3" :increment="5" unit="kgs" v-model="item.weight"></PartsCounter>
          </template>
          <template #[`item.reps`]="{ item }">
            <PartsCounter color="orange-accent-3" unit="rep" v-model="item.reps"></PartsCounter>
          </template>
          <template #[`item.sets`]="{ item }">
            <PartsCounter color="orange-accent-3" unit="set" v-model="item.sets"></PartsCounter>
          </template>
          <template #[`item.delete`]="{ item }">
            <v-icon @click="deleteSet(item)" color="red">mdi-trash-can</v-icon>
          </template>
          <template #bottom>
            <v-btn class="mt-2" @click="addSet" color="green" prepend-icon="mdi-plus" variant="flat" width="100%">Add set</v-btn>
          </template>
        </v-data-table>
        <template v-if="inputItem.category === 'cardio'">
          <PartsTextField @click="setMinutes" centered label="Minutes" readonly type="number" v-model="inputItem.minutes"></PartsTextField>
          <template>
            <PartsCounter :increment="5" unit="mins" ref="refMinutes" v-model="inputItem.minutes"></PartsCounter>
          </template>
        </template>

        <PartsTextArea label="Notes" v-model="inputItem.notes"></PartsTextArea>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="dialog = false" color="red" variant="flat" width="6em">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="action === 'Add'" @click="doAction" color="green" :disabled="ComUtils.isEmptyString(inputItem.name)" prepend-icon="mdi-plus" variant="flat" width="6em">Add</v-btn>
        <v-btn v-if="action === 'Edit'" @click="doAction" color="blue" :disabled="ComUtils.isEmptyString(inputItem.name)" prepend-icon="mdi-pencil" variant="flat" width="6em">Edit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { onMounted, nextTick, ref } from 'vue';
  import { useDisplay } from 'vuetify'
  import * as ComDbUtils from '@/common/ComDbUtils';
  import * as ComUtils from '@/common/ComUtils.js';
  import { useCommonStore } from '@/store/StoreCommon.js';

  import PartsCounter from '@/components/PartsCounter.vue';
  import PartsRadioGroup from '@/components/PartsRadioGroup.vue';
  import PartsTextArea from '@/components/PartsTextArea.vue';
  import PartsTextField from '@/components/PartsTextField.vue';

  /**
   * VARIABLES
   */
  // Refs, Imports
  const refMinutes = ref(null);
  const StoreCommon = useCommonStore();
  const { mobile } = useDisplay();

  // Page
  const items = ref([]);
  const selected = ref([]);

  // Dialog
  const action = ref();
  const dialog = ref(false);
  const inputItem = ref({});

  /**
   * CONSTANTS
   */
  const CATEGORIES = [
    { label: 'Weights', value: 'weights' },
    { label: 'Cardio', value: 'cardio' }
  ]
  const HEADERS = [
    { key: 'name', title: 'Name' },
    { key: 'category', title: 'Category', sortable: false },
    { key: 'notes', title: 'Notes', sortable: false },
    { key: 'edit', title: '', sortable: false, align: 'end' }
  ];
  const HEADERS_WEIGHTS = [
    { key: 'id', title: '', sortable: false },
    { key: 'weight', title: 'kgs', sortable: false },
    { key: 'reps', title: 'reps', sortable: false },
    { key: 'sets', title: 'sets', sortable: false },
    { key: 'delete', title: '', sortable: false }
  ]
  const TABLE_NAME = 'm_gym_exercises';

  /**
   * EVENTS
   */
  onMounted(async () => {
    if (StoreCommon.exercises.length === 0) {
      await getList();
    }
    else {
      items.value = StoreCommon.exercises;
    }
  });

  const getList = async () => {
    items.value = await ComDbUtils.selectTable(TABLE_NAME, 'data->>name desc');
    StoreCommon.exercises = items.value;
  }

  const getSetsSummary = (item) => {
    let summary = '';
    item.sets.forEach((set, index) => {
      summary += `${ set.sets } sets of ${ set.weight } kgs`;
      if (index + 1 < item.sets.length) {
        summary += ', ';
      }
    });
    return summary;
  }

  const doAction = async () => {
    if (ComUtils.isEmptyString(inputItem.value.name)) {
      alert('Name cannot be empty');
      return;
    }
    if (action.value === 'Add' && items.value.some(item => item.name.localeCompare(inputItem.value.name, undefined, { sensitivity: 'base' }) === 0)) {
      alert(inputItem.value.name + ' is already in the list');
      return;
    }

    if (inputItem.value.category === 'weights') {
      inputItem.value.minutes = 0;
    }
    if (inputItem.value.category === 'cardio') {
      inputItem.value.sets = [];
    }

    if (action.value === 'Add') {
      await ComDbUtils.insertTable(TABLE_NAME, { data: inputItem.value });
    }
    else if (action.value === 'Edit') {
      await ComDbUtils.updateTable(TABLE_NAME, inputItem.value.id, { data: inputItem.value });
    }

    getList();
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

  const openDialog = (p_action, p_item) => {
    if (p_action === 'Add') {
      resetItem();
    }
    else if (p_action === 'Edit') {
      inputItem.value = JSON.parse(JSON.stringify(p_item));
    }

    action.value = p_action;

    dialog.value = true;
    // if (p_action === 'Add') {
    //   nextTick(() => refName.value?.focus());
    // }
  }

  const resetItem = () => {
    inputItem.value = Object.fromEntries(HEADERS.map(header => [header.key, '']));
    inputItem.value.sets = [];
    inputItem.value.minutes = 30;
  }

  // Weights
  const addSet = () => {
    let maxId = 1;
    if (ComUtils.isEmptyArray(inputItem.value.sets)) {
      inputItem.value.sets = [];
    }
    else {
      maxId = Math.max(...inputItem.value.sets.map(item => item.id)) + 1;
    }
    inputItem.value.sets.push({ id: maxId, weight: 10, reps: 12, sets: 3 });
  }
  
  const deleteSet = (item) => {
    const newSets = inputItem.value.sets.filter(set => set.id !== item.id);
    if (newSets.length > 0) {
      let id = 1;
      newSets.forEach(set => set.id = id++);
    }
    inputItem.value.sets = newSets;
  }

  // Cardio
  const setMinutes = () => {
    refMinutes.value.openDialog();
  }
</script>

<style>
  .table-sets tr.v-data-table-rows-no-data {
    display: none;
  }
  .text-no-data:hover {
    cursor: pointer;
    color: green;
  }
</style>
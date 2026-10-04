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
              <v-card-text class="d-flex align-center">
                <v-checkbox-btn
                  class="mr-4"
                  :model-value="isSelected(internalItem)"
                  @update:model-value="toggleSelect(internalItem)"
                  style="max-width: max-content;"
                ></v-checkbox-btn>
                <div class="d-flex align-center w-100" @click="openDialog('Edit', internalItem.raw)">
                  <div>
                    <div class="d-flex">
                      <v-chip class="mr-2" :color="internalItem.raw.category === 'weights' ? 'red' : 'blue'" variant="flat">{{ internalItem.raw.category }}</v-chip>
                      <span class="text-title-large">{{ internalItem.raw.name }}</span>
                    </div>
                    <div v-if="internalItem.raw.category === 'weights' && internalItem.raw.sets?.length > 0"
                      class="text-grey-darken-1">{{ getSetsSummary(internalItem.raw) }}</div>
                    <div v-if="internalItem.raw.category === 'cardio' && internalItem.raw.minutes > 0"
                      class="text-grey-darken-1">{{ internalItem.raw.minutes }} mins</div>
                    <div v-html="internalItem.raw.notes" class="d-flex text-grey-darken-1" style="white-space: pre-wrap;"></div>
                  </div>
                  <v-icon color="blue" size="x-large" style="position: absolute; right: 20px;">mdi-pencil</v-icon>
                </div>
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
        <PartsWeightsSets v-if="inputItem.category === 'weights'" class="mb-4" color="orange-accent-3" v-model="inputItem.sets"></PartsWeightsSets>
        <PartsCardioMinutes v-if="inputItem.category === 'cardio'" v-model="inputItem.minutes"></PartsCardioMinutes>

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
  import { useCommonStore } from '@/store/StoreCommon.js';
  import * as ComDbUtils from '@/common/ComDbUtils';
  import * as ComUtils from '@/common/ComUtils.js';

  import PartsCardioMinutes from '@/components/PartsCardioMinutes.vue';
  import PartsCounter from '@/components/PartsCounter.vue';
  import PartsRadioGroup from '@/components/PartsRadioGroup.vue';
  import PartsTextArea from '@/components/PartsTextArea.vue';
  import PartsTextField from '@/components/PartsTextField.vue';
  import PartsWeightsSets from '@/components/PartsWeightsSets.vue';

  /**
   * VARIABLES
   */
  // Refs, Imports
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
</script>

<style scoped>
  .table-sets tr.v-data-table-rows-no-data {
    display: none;
  }
  .text-no-data:hover {
    cursor: pointer;
    color: green;
  }
</style>
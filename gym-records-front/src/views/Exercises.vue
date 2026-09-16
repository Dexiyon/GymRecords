<template>
  <v-container>
    <v-card>
      <v-card-title>Exercises</v-card-title>

      <v-card-text>
        <div class="d-flex">
          <v-btn @click="getList" color="yellow" prepend-icon="mdi-refresh" variant="text">Refresh</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="openDialog('Add')" color="green" prepend-icon="mdi-plus" variant="text">Add</v-btn>
          <v-btn class="ml-2" @click="doDelete" color="red" :disabled="!selected.length" prepend-icon="mdi-trash-can" variant="text">Delete</v-btn>
        </div>
        <v-data-table v-model="selected"
          :headers="HEADERS" :items="items" item-value="id"
          :loading="StoreCommon.loading" :mobile="mobile"
          show-select :sort-by="[{ key: 'name', order: 'asc' }]">

          <!-- Common -->
          <template #no-data>
            <div class="text-no-data text-grey" @click="openDialog('Add')">Start by adding an exercise</div>
          </template>
          <template #bottom></template>

          <!-- PC -->
          <template #[`item.notes`]="{ item }">
            <div class="text-grey" style="font-size: 0.8em; white-space: pre-wrap;" v-html="item.notes" ></div>
          </template>
          <template #[`item.edit`]="{ item }">
            <v-btn @click="openDialog('Edit', item)" color="blue" prepend-icon="mdi-pencil" variant="text">Edit</v-btn>
          </template>

          <!-- Mobile -->
          <template v-if="mobile" #item="{ internalItem, isSelected, toggleSelect }">
            <v-card>
              <v-card-text class="d-flex">
                <v-checkbox-btn
                  :model-value="isSelected(internalItem)"
                  @update:model-value="toggleSelect(internalItem)"
                  style="max-width: max-content;"
                ></v-checkbox-btn>
                <div class="pl-2 d-flex">
                  <div @click="toggleSelect(internalItem)">
                    <div class="text-title-large">{{ internalItem.raw.name }}</div>
                    <div>Current limit: {{ internalItem.raw.limit }} {{ internalItem.raw.category }}</div>
                    <div v-html="internalItem.raw.notes" class="text-grey" style="white-space: pre-wrap;"></div>
                  </div>
                  <v-btn @click="openDialog('Edit', internalItem.raw)" color="blue" prepend-icon="mdi-pencil" style="position: absolute; right: 0;" variant="text">Edit</v-btn>
                </div>
              </v-card-text>
            </v-card>
          </template>

        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>

  <v-dialog v-model="dialog" no-click-animation persistent width="600">
    <v-card>
      <v-card-title>{{ action }} exercise</v-card-title>
      <div style="position: absolute; top: 8px; right: 8px;">
        <v-btn v-if="action === 'Edit'" @click="doDelete" color="red" prepend-icon="mdi-trash-can" variant="text">Delete</v-btn>
      </div>

      <v-card-text>
        <div>
          <div class="text-red" style="font-size: 0.8em;">※Only Name is required</div>
          <v-text-field v-model="inputItem.name" label="Name" ref="refName"></v-text-field>
        </div>
        <div>
          <div>Category</div>
          <v-radio-group v-model="inputItem.category" inline>
            <v-radio label="Weights" value="kgs"></v-radio>
            <v-radio label="Cardio" value="mins"></v-radio>
          </v-radio-group>
        </div>
        <v-text-field v-model="inputItem.limit" label="Current limit" type="number"></v-text-field>
        <v-textarea v-model="inputItem.notes" label="Notes"></v-textarea>
      </v-card-text>

      <v-card-actions>
        <v-btn v-if="action === 'Add'" @click="doAction" color="green" prepend-icon="mdi-plus" variant="text">Add</v-btn>
        <v-btn v-if="action === 'Edit'" @click="doAction" color="blue" prepend-icon="mdi-pencil" variant="text">{{ action }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="dialog = false" variant="text">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { onMounted, nextTick, ref } from 'vue';
  import { useDisplay } from 'vuetify'
  import * as ComDbUtils from '@/common/ComDbUtils';
  import * as ComUtils from '@/common/ComUtils.js';
  import { useCommonStore } from '../store/StoreCommon';

  /**
   * VARIABLES
   */
  // Refs, Imports
  const refName = ref(null);
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
  const TABLE_NAME = 'm_gym_exercises';
  const HEADERS = [
    { key: 'name', title: 'Name' },
    { key: 'limit', title: 'Current limit' },
    { key: 'category', title: '', sortable: false },
    { key: 'notes', title: 'Notes', sortable: false },
    { key: 'edit', title: '', sortable: false }
  ]

  /**
   * EVENTS
   */
  onMounted(async () => {
    await getList();
  });

  const getList = async () => {
    items.value = await ComDbUtils.selectTable(TABLE_NAME, 'data->>name desc');
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
    if (p_action === 'Add') {
      nextTick(() => refName.value?.focus());
    }
  }

  const resetItem = () => {
    inputItem.value = Object.fromEntries(HEADERS.map(header => [header.key, '']));
  }
</script>

<style>
  .text-no-data:hover {
    cursor: pointer;
    color: green;
  }
</style>
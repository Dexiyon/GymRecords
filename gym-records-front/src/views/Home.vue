<template>
  <v-container :class="{ 'pa-0' : mobile }" style="min-width: 100%;">
    <v-card elevation="0" :rounded="!mobile && 15" width="100%">
      <v-card-title :class="{ 'd-flex justify-center' : mobile }">Today is {{ ComUtils.formatDate(new Date(), 'fullDateWithWeekday') }}</v-card-title>
      <v-card-text>
        <div :class="{ 'd-flex justify-center' : mobile }">
          <v-btn @click="addRecord" color="green" size="x-large" variant="flat">Add Record Today</v-btn>
        </div>

        <div class="mt-4">
          <div class="text-title-large" :class="{ 'd-flex justify-center' : mobile }">Latest Record</div>
          <v-card v-if="!ComUtils.isEmptyObject(latestRecord)"
            color="bg-orange-lighten-5" elevation="0" rounded="15" :width="mobile ? '' : '600'">
            <v-card-title class="bg-orange-lighten-2">{{ ComUtils.formatDate(latestRecord.date, 'fullDateWithWeekday') }}</v-card-title>
            <v-card-text>
              <div class="mt-4">
                <PartsRecordsSummary :exercises="latestRecord.exercises"></PartsRecordsSummary>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-card-text>
    </v-card>

    <v-card v-if="StoreCommon.loginid === 'yon'"
      class="mt-4" elevation="0" :rounded="!mobile && 15" width="100%">
      <v-card-title>To Do List</v-card-title>
      <v-card-text>
        <v-list :items="TODO_LIST"></v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
  import { onMounted, ref } from 'vue';
  import { useCommonStore } from '@/store/StoreCommon';
  import { useDisplay } from 'vuetify';
  import { useRouter } from 'vue-router';
  import * as ComDbUtils from '@/common/ComDbUtils.js';
  import * as ComUtils from '@/common/ComUtils.js';

  import PartsRecordsSummary from '@/components/PartsRecordsSummary.vue';

  /**
   * IMPORTS
   */
  const router = useRouter();
  const StoreCommon = useCommonStore();
  const { mobile } = useDisplay();

  /**
   * CONSTANTS
   */
  const TODO_LIST = [
    { type: 'subheader', title: 'MUST' },
    { value: 'must1', title: '▶️ Records menu (List, calendar view)' },
    { value: 'must2', title: '🔴 Fix records edit (separate origin data for display and select exercises)' },
    { value: 'must3', title: '🔴 Home screen (summary for the month, add record for the day, last record)' },
    { value: 'must4', title: '▶️ Add users' },
    { value: 'must5', title: '🔴 Login screen' },
    { value: 'must6', title: '▶️ Add body weight category' },

    { type: 'subheader', title: 'MIGHT' },
    { value: 'might1', title: '🔴 Add floating operation buttons (add, delete, etc)' },
  ];

  /**
   * VARIABLES
   */
  const latestRecord = ref({});

  /**
   * EVENTS
   */
  onMounted(async () => {
    await getLatestRecord();
  });

  const addRecord = () => {
    StoreCommon.addRecord = true;
    router.push({ name: 'records' });
  }

  const getLatestRecord = async () => {
    let records = StoreCommon.records;
    if (ComUtils.isEmptyArray(records)) {
      StoreCommon.records = await ComDbUtils.selectTableByLogin('t_gym_records', StoreCommon);
      records = StoreCommon.records;
    }
    latestRecord.value = records.sort((a, b) => b.date.localeCompare(a.date))[0];
  }
</script>

<style>
  .v-list-item-title {
    white-space: normal !important;
  }
</style>
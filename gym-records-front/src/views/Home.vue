<template>
  <v-container :class="{ 'pa-0' : mobile }" style="min-width: 100%;">
    <v-card elevation="0" :rounded="!mobile && 15" width="100%">
      <v-card-title>Today is {{ ComUtils.formatDate(new Date(), 'fullDateWithWeekday') }}</v-card-title>
      <v-card-text>
        
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
  import * as ComUtils from '@/common/ComUtils.js';
  import { useDisplay } from 'vuetify';
  import { useCommonStore } from '@/store/StoreCommon';

  /**
   * IMPORTS
   */
  const StoreCommon = useCommonStore();
  const { mobile } = useDisplay();

  /**
   * CONSTANTS
   */
  const TODO_LIST = [
    { type: 'subheader', title: 'MUST' },
    { value: 'must1', title: '▶️ Records menu (List, calendar view)' },
    { value: 'must2', title: '🔴 Fix records edit (separate origin data for display and select exercises)' },
    { value: 'must3', title: '🔴 Home screen (summary for the month, add record for the day)' },
    { value: 'must4', title: '🔴 Add users' },
    { value: 'must5', title: '🔴 Login screen' },

    { type: 'subheader', title: 'MIGHT' },
    { value: 'might1', title: '🔴 Add floating operation buttons (add, delete, etc)' },
  ];
</script>

<style>
  .v-list-item-title {
    white-space: normal !important;
  }
</style>
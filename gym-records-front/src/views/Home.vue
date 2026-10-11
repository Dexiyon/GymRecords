<template>
  <v-container>
    <v-card>
      <v-card-title>To Do List</v-card-title>
      <v-card-text>
        <v-list :items="TODO_LIST"></v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
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
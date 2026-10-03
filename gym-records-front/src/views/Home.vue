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
    { value: 1, title: '✅ Find a free online PostgreSQL database' },
    { value: 6, title: '✅ Read master data once then save in store' },
    { value: 4, title: '▶️ Records menu (List, calendar view)' },
    { value: 3, title: '🔴 Home screen (summary for the month, add record for the day)' },
    { value: 5, title: '🔴 Add users' },

    { type: 'subheader', title: 'MIGHT' },
    { value: 7, title: '🔴 Add floating operation buttons (add, delete, etc)' },
    { value: 8, title: '🔴 Make categories, exercises into chips' },
  ];

</script>

<style>
  .v-list-item-title {
    white-space: normal !important;
  }
</style>
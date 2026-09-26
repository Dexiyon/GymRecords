<template>
  <v-radio-group
    class="equal-width-group"
    density="comfortable"
    inline
    v-model="model"
  >
    <v-radio v-for="item in items" :key="item.value" :label="item.label" :value="item.value"></v-radio>
  </v-radio-group>
</template>

<script setup>
  const model = defineModel();
  const props = defineProps({
    items: Array
  });
</script>

<style scoped>
  .equal-width-group :deep(.v-radio) {
    flex: 1 1 0%;
  }
</style>
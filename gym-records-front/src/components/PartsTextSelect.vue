<template>
  <v-select
    :class="{ 'align-input-center' : props.centered }"
    density="comfortable"
    hide-details
    :items="props.items"
    rounded="15"
    variant="outlined"
    v-model="model"
  ></v-select>
</template>

<script setup>
  const model = defineModel();
  const props = defineProps({
    centered: { type: Boolean, default: false },
    items: { type: Array, default: [] }
  });
</script>

<style scoped>
  .align-input-center :deep(.v-field__input) {
    justify-content: center;
    text-align: center !important;
  }
</style>
<template>
  <v-text-field
    :class="{ 'align-input-center' : props.centered }"
    density="comfortable"
    :label="props.label"
    :readonly="props.readonly"
    rounded="15"
    :type="props.type"
    variant="outlined"
    v-model="model"
  ></v-text-field>
</template>

<script setup>
import { readonly } from 'vue';

  const model = defineModel();
  const props = defineProps({
    centered: { type: Boolean, default: false },
    label: { type: String, default: null },
    readonly: { type: Boolean, default: false },
    type: { type: String, default: 'text' },
  });
</script>

<style scoped>
  .align-input-center :deep(input) {
    text-align: center !important;
  }
</style>
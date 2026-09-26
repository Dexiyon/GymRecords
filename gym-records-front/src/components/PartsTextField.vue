<template>
  <v-text-field
    density="comfortable"
    :label="props.label"
    rounded="15"
    :type="props.type !== undefined ? props.type : 'text'"
    variant="outlined"
    v-model="model"
  ></v-text-field>
</template>

<script setup>
  const model = defineModel();
  const props = defineProps({
    label: String,
    type: String,
  });
</script>
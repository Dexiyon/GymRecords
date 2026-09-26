<template>
  <v-textarea
    density="comfortable"
    :label="props.label"
    rounded="15"
    variant="outlined"
    v-model="model"
  ></v-textarea>
</template>

<script setup>
  const model = defineModel();
  const props = defineProps({
    label: String
  });
</script>
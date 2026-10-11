<template>
  <v-date-input
    :class="{ 'align-input-center' : props.centered }"
    density="comfortable"
    display-format="fullDateWithWeekday"
    inputmode="none"
    :label="props.label"
    location="bottom center"
    prepend-icon=""
    prepend-inner-icon="$calendar"
    rounded="15"
    variant="outlined"
    v-model="model"
  ></v-date-input>
</template>

<script setup>
  const model = defineModel();
  const props = defineProps({
    centered: { type: Boolean, default: false },
    label: { type:String, default: null }
  });
</script>

<style scoped>
  .align-input-center :deep(input) {
    justify-content: center;
    text-align: center !important;
  }
</style>
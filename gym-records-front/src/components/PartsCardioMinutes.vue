<template>
  <PartsTextField @click="set" centered label="Minutes" readonly type="number" v-model="model"></PartsTextField>
  <template>
    <PartsCounter :increment="5" unit="mins" ref="refMinutes" v-model="model"></PartsCounter>
  </template>
</template>

<script setup>
  import { ref } from 'vue';
  import PartsCounter from '@/components/PartsCounter.vue';
  import PartsTextField from '@/components/PartsTextField.vue';

  const refMinutes = ref(null);
  const model = defineModel();

  const set = () => {
    refMinutes.value.openDialog();
  }
</script>
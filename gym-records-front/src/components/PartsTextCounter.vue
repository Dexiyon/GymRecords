<template>
  <PartsTextField @click="set" centered :label="props.label" readonly type="number" v-model="model"></PartsTextField>
  <template>
    <PartsCounter :increment="props.increment" :unit="props.unit" ref="refCounter" v-model="model"></PartsCounter>
  </template>
</template>

<script setup>
  import { ref } from 'vue';
  import PartsCounter from '@/components/PartsCounter.vue';
  import PartsTextField from '@/components/PartsTextField.vue';

  const refCounter = ref(null);
  const model = defineModel();
  const props = defineProps({
    increment: { type: Number, default: 1 },
    label: { type: String, default: null },
    unit: { type: String, default: null }
  })

  const set = () => {
    refCounter.value.openDialog();
  }
</script>
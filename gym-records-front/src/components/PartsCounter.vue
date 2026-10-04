<template>
  <v-btn @click="openDialog" :color="props.color" variant="tonal">{{ model }}</v-btn>
  <v-dialog v-model="dialog" width="250">
    <v-card>
      <v-card-text class="">
        <v-btn @click="model = Number(model) + props.increment" color="green" prepend-icon="mdi-plus" variant="flat" width="100%">{{ props.increment }} {{ props.unit }}</v-btn>
        <PartsTextField class="pt-6 pb-2" centered type="number" v-model="model"></PartsTextField>
        <v-btn @click="subtract" :color="isDisabled ? 'grey' : 'red'" :disabled="isDisabled" prepend-icon="mdi-minus" variant="flat" width="100%">{{ props.increment }} {{ props.unit }}</v-btn>
      </v-card-text>
    </v-card>
    <v-text-field class="d-none" v-model="model"></v-text-field>
  </v-dialog>
</template>

<script setup>
  import { computed, ref } from 'vue';
  import PartsTextField from '@/components/PartsTextField.vue';

  const model = defineModel();
  const props = defineProps({
    color: { type: String, default: 'light-blue' },
    increment: { type: Number, default: 1 },
    min: { type: Number, default: 0 },
    unit: { type: String, default: '' }
  });

  /**
   * VARIABLES
   */
  const dialog = ref(false);
  const isDisabled = computed(() => model.value <= props.min);

  /**
   * EVENTS
   */
  const subtract = () => {
    if (model.value > props.min) {
      model.value -= props.increment;
    }
  }

  /**
   * EXPOSED
   */
  const openDialog = () => {
    dialog.value = true;
  }

  defineExpose({
    openDialog
  });
</script>

<style scoped>
  :deep(input) {
    font-size: 2.5em;
  }
</style>
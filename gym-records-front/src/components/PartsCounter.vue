<template>
  <v-btn @click="dialog = true" :color="props.color" variant="tonal">{{ model }}</v-btn>
  <v-dialog v-model="dialog" width="250">
    <v-card>
      <v-card-text class="">
        <v-btn @click="model += props.increment" color="green" prepend-icon="mdi-plus" width="100%">{{ props.increment }} {{ props.unit }}</v-btn>
        <div class="d-flex justify-center py-4 text-display-small">{{ model }}</div>
        <v-btn @click="subtract" color="red" prepend-icon="mdi-minus" width="100%">{{ props.increment }} {{ props.unit }}</v-btn>
      </v-card-text>
    </v-card>
    <v-text-field class="d-none" v-model="model"></v-text-field>
  </v-dialog>
</template>

<script setup>
  import { ref } from 'vue';

  const model = defineModel();
  const props = defineProps({
    color: { type: String, default: 'light-blue' },
    increment: { type: Number, default: 1 },
    min: { type: Number, default: 0 },
    unit: { type: String, default: '' }
  });

  const dialog = ref(false);

  /**
   * EVENTS
   */
  const subtract = () => {
    if (model.value > props.min) {
      model.value -= props.increment;
    }
  }
</script>

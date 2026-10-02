<template>
  <!-- Custom radio buttons -->
  <div v-if="props.button">
    <div class="d-flex mb-2 mx-n1 py-2">
      <div 
        class="d-flex cursor-pointer custom-radio justify-center mx-1 py-2"
        :class="[( model === item.value ) ? 'bg-' + props.color : '' ]" @click="model = item.value"
        v-for="item in items" :key="item.value" style="flex: 1 1 0%;">
        <v-icon class="mr-2" :icon="model === item.value ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank'"></v-icon>{{ item.label }}
      </div>
    </div>
  </div>

  <!-- Normal radio buttons -->
  <v-radio-group v-else
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
    button: { type: Boolean, default: false },
    color: { type: String, default: 'light-blue-accent-1' },
    items: { type: Array, default: [] },
  });
</script>

<style scoped>
  .custom-radio {
    border: solid 1px rgb(128, 128, 128, 70%);
    border-radius: 12px;
    transition: background-color 0.3s ease;
  }
  .equal-width-group :deep(.v-radio) {
    flex: 1 1 0%;
  }
  @media screen and (min-width: 600px) {
  .custom-radio:hover {
    border: solid 1.5px;
    /* border: solid 1px black;
    background: rgb(255, 235, 59, 30%); */
  }
}
</style>
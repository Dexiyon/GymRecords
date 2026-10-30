<template>
  <!-- Custom radio buttons -->
  <div v-if="props.button">
    <div class="mb-2 mx-n1 py-2" :class="{ 'd-flex' : props.inline }">
      <div 
        class="d-flex cursor-pointer custom-radio justify-center mx-1 py-2"
        :class="[
          ( model === item.value ) ? getSelectedColor(item) : '',
          props.inline ? '' : 'my-2'
        ]"
        @click="model = item.value"
        v-for="item in items" :key="item.value" style="flex: 1 1 0%;">
        <div class="d-flex" :class="{ 'w-50' : !props.inline }">
          <v-icon :class="{ 'mr-2' : props.inline }" :icon="( model === item.value ) ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank'"></v-icon>
          <div class="d-flex justify-center" style="width: 100%;">{{ item.label }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Normal radio buttons -->
  <v-radio-group v-else
    class="equal-width-group"
    density="comfortable"
    :inline="props.inline"
    v-model="model"
  >
    <v-radio v-for="item in items" :key="item.value" :label="item.label" :value="item.value"></v-radio>
  </v-radio-group>
</template>

<script setup>
  import * as ComUtils from '@/common/ComUtils.js';

  const model = defineModel();
  const props = defineProps({
    button: { type: Boolean, default: false },
    color: { type: String, default: 'light-blue-accent-1' },
    inline: { type: Boolean, default: true },
    items: { type: Array, default: [] },
  });

  const getSelectedColor = (p_item) => {
    return 'select bg-' + ( ComUtils.isEmptyString(p_item.color) ? props.color : p_item.color );
  }
</script>

<style scoped>
  .custom-radio {
    border: solid 1px rgb(128, 128, 128, 70%);
    border-radius: 12px;
    transition: background-color 0.3s ease;
  }
  .custom-radio.selected {
    border: none;
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
<template>
  <v-data-table :headers="HEADERS" :items="model">
    <template #headers v-if="!model.length"></template>
    <template #[`item.weight`]="{ item }">
      <PartsCounter :color="props.color" :increment="5" unit="kgs" v-model="item.weight"></PartsCounter>
    </template>
    <template #[`item.reps`]="{ item }">
      <PartsCounter :color="props.color" unit="rep" v-model="item.reps"></PartsCounter>
    </template>
    <template #[`item.sets`]="{ item }">
      <PartsCounter :color="props.color" unit="set" v-model="item.sets"></PartsCounter>
    </template>
    <template #[`item.delete`]="{ item }">
      <v-icon @click="doDelete(item)" color="red">mdi-trash-can</v-icon>
    </template>
    <template #bottom>
      <v-btn class="mt-2" @click="doAdd" color="green" prepend-icon="mdi-plus" variant="flat" width="100%">Add set</v-btn>
    </template>
  </v-data-table>
</template>

<script setup>
  import PartsCounter from '@/components/PartsCounter.vue';

  const emit = defineEmits([ 'update' ]);
  const model = defineModel();
  const props = defineProps({
    color: { type: String, default: 'light-blue-accent-3' },
    items: { type: Array, default: [] }
  });

  const HEADERS = [
    { key: 'id', title: '', sortable: false },
    { key: 'weight', title: 'kgs', sortable: false },
    { key: 'reps', title: 'reps', sortable: false },
    { key: 'sets', title: 'sets', sortable: false },
    { key: 'delete', title: '', sortable: false }
  ];

  const doAdd = () => {
    let maxId = 1;
    if (model.value.length > 0) {
      maxId = Math.max(...model.value.map(item => item.id)) + 1;
    }
    model.value.push({ id: maxId, weight: 10, reps: 12, sets: 3 });
  }

  const doDelete = (p_item) => {
    const newItems = model.value.filter(set => set.id !== p_item.id);
    if (newItems.length > 0) {
      let id = 1;
      newItems.forEach(set => set.id = id++);
    }
    model.value = newItems;
  }
</script>

<style scoped>
  :deep(tr.v-data-table-rows-no-data) {
    display: none;
  }
</style>
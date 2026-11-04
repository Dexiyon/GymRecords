<template>
  <!-- PC -->
  <template v-if="!mobile">
    <div v-for="exercise in props.exercises" :key="exercise.name"
      class="align-center d-flex my-1">
      <v-chip v-if="!ComUtils.isEmptyString(exercise.category)"
        class="mr-2" :color="ComGymUtils.getCategoryColor(exercise.category)" density="compact" variant="flat">{{ exercise.category }}</v-chip>
        <span class="mr-2">{{ exercise.name }}</span>
        <span v-if="ComGymUtils.isCategoryBody(exercise.category)"
          class="text-grey-darken-1">{{ ComGymUtils.getSetsSummaryBody(exercise.sets) }}</span>
        <span v-if="ComGymUtils.isCategoryCardio(exercise.category)"
          class="text-grey-darken-1">{{ exercise.minutes }} mins</span>
        <span v-if="ComGymUtils.isCategoryWeights(exercise.category)"
          class="text-grey-darken-1">{{ ComGymUtils.getSetsSummaryWeights(exercise.sets) }}</span>
    </div>
  </template>
  
  <!-- Mobile -->
  <template v-if="mobile">
    <div v-for="exercise in props.exercises" :key="exercise.name"
      class="my-1">
      <div class="d-flex">
        <v-chip v-if="!ComUtils.isEmptyString(exercise.category)"
          class="mr-2" :color="ComGymUtils.getCategoryColor(exercise.category)" density="compact" variant="flat">{{ exercise.category }}</v-chip>
        <span class="mr-2">{{ exercise.name }}</span>
      </div>
      <div v-if="ComGymUtils.isCategoryBody(exercise.category)"
        class="text-grey-darken-1">{{ ComGymUtils.getSetsSummaryBody(exercise.sets) }}</div>
      <div v-if="ComGymUtils.isCategoryCardio(exercise.category)"
        class="text-grey-darken-1">{{ exercise.minutes }} mins</div>
      <div v-if="ComGymUtils.isCategoryWeights(exercise.category)"
        class="text-grey-darken-1">{{ ComGymUtils.getSetsSummaryWeights(exercise.sets) }}</div>
    </div>
  </template>
</template>

<script setup>
  import { useDisplay } from 'vuetify';
  import * as ComGymUtils from '@/common/ComGymUtils.js';
  import * as ComUtils from '@/common/ComUtils.js';

  const { mobile } = useDisplay();
  const props = defineProps({
    exercises: { type: Array, default: [] }
  });
</script>
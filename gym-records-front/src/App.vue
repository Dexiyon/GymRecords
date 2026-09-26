<template>
  <v-overlay class="align-center justify-center" :model-value="StoreCommon.loading">
    <v-progress-circular color="orange" indeterminate size="100" width="15"></v-progress-circular>
  </v-overlay>
  <v-app>
    <v-app-bar class="text-white" color="orange">
      <template #prepend>
        <v-icon class="pl-2" @click="router.push('/')" size="x-large">mdi-weight-lifter</v-icon>
      </template>
      <v-app-bar-title>
        <div @click="router.push('/')" style="cursor: pointer; user-select: none; max-width: max-content;">Gym Records</div>
      </v-app-bar-title>
      <template #append>
        <v-switch class="pr-2" false-icon="mdi-white-balance-sunny" hide-details inset true-icon="mdi-moon-waning-crescent" v-model="toggleTheme"></v-switch>
        <template v-if="mobile">
          <v-app-bar-nav-icon @click="toggleNav = !toggleNav"></v-app-bar-nav-icon>
        </template>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="toggleNav" :expand-on-hover="!mobile" :location="mobile ? 'right' : 'left'" :permanent="smAndUp">
      <v-list-item v-for="item in NAVLIST" :key="item.title"
        @click="router.push({ name: item.title })"
        class="py-3"
        :prepend-icon="item.icon"
        :title="ComUtils.capitalize(item.title)"></v-list-item>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
  import { onMounted, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useDisplay, useTheme } from 'vuetify';
  import * as ComUtils from '@/common/ComUtils.js';
  import { useCommonStore } from './store/StoreCommon';

  /**
   * VARIABLES
   */
  // Imports
  const router = useRouter();
  const StoreCommon = useCommonStore();
  const theme = useTheme();
  const { mobile, smAndUp } = useDisplay();

  const toggleNav = ref(true);
  const toggleTheme = ref(true);

  /**
   * CONSTANTS
   */
  const NAVLIST = ref([
    { title: 'home', icon: 'mdi-home' },
    { title: 'records', icon: 'mdi-list-status' },
    { title: 'exercises', icon: 'mdi-dumbbell' }
  ]);

  /**
   * EVENTS
   */
  onMounted(() => {
    toggleNav.value = !mobile.value;
  });

  watch(toggleTheme, () => theme.global.name.value = toggleTheme.value ? 'dark' : 'light');
</script>


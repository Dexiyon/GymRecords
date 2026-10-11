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
      <v-list-item class="py-3" @click="setUser" prepend-icon="mdi-account">{{ StoreCommon.loginname }}</v-list-item>
      <v-divider></v-divider>
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

  <v-dialog v-model="dialog" no-click-animation :persistent="ComUtils.isEmptyString(StoreCommon.loginid)" scrim="grey" width="200">
    <v-card :rounded="!mobile && 15">
      <v-card-title class="bg-orange-lighten-2">Select user</v-card-title>
      <v-card-text>
        <PartsTextSelect :items="StoreCommon.users.map(user => { return { title: user.name, value: user.id } })" v-model="loginid"></PartsTextSelect>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { nextTick, onMounted, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useDisplay, useTheme } from 'vuetify';
  import { useCommonStore } from './store/StoreCommon';
  import * as ComDbUtils from '@/common/ComDbUtils.js';
  import * as ComUtils from '@/common/ComUtils.js';

  import PartsTextSelect from '@/components/PartsTextSelect.vue';

  /**
   * VARIABLES
   */
  // Imports
  const router = useRouter();
  const StoreCommon = useCommonStore();
  const theme = useTheme();
  const { mobile, smAndUp } = useDisplay();

  const toggleNav = ref(true);
  const toggleTheme = ref(false);

  // Dialog
  const dialog = ref(false);
  const loginid = ref();

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
  onMounted(async () => {
    toggleNav.value = !mobile.value;

    // Get users
    if (StoreCommon.users.length === 0) {
      StoreCommon.users = await ComDbUtils.selectTable('m_common_users'); 
    }

    // Set user
    if (ComUtils.isEmptyString(StoreCommon.loginid)) {
      dialog.value = true;
    }

    theme.change(StoreCommon.theme);
    toggleTheme.value = StoreCommon.theme === 'dark';
  });

  const setUser = () => {
    console.log('set user');
    loginid.value = StoreCommon.loginid;
    dialog.value = true;
  }

  watch(loginid, () => {
    StoreCommon.setUser(loginid.value);
    theme.change(StoreCommon.theme);
    toggleTheme.value = StoreCommon.theme === 'dark';
    dialog.value = false;
  });
  watch(toggleTheme, () => theme.change(toggleTheme.value ? 'dark' : 'light'));
</script>


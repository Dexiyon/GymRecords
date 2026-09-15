<template>
  <v-app>
    <v-app-bar>
      <template v-if="mobile" #prepend>
        <v-app-bar-nav-icon @click="toggleNav = !toggleNav"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>Gym Records</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="toggleNav" :expand-on-hover="!mobile" permanent>
      <v-list-item v-for="item in listNav" :key="item.title"
        @click="router.push({ name: item.title })"
        :prepend-icon="item.icon"
        :title="ComUtils.capitalize(item.title)"></v-list-item>
    </v-navigation-drawer>

    <v-main @click="toggleNav = false">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import * as ComUtils from '@/common/ComUtils.js'

const router = useRouter()
const { mobile } = useDisplay()

const toggleNav = ref(true);

const listNav = ref([
  { title: 'home', icon: 'mdi-home' },
  { title: 'exercises', icon: 'mdi-dumbbell' }
])

onMounted(() => {
  toggleNav.value = !mobile.value;
})

</script>


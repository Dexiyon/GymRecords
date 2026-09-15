<template>
  <v-app>
    <v-app-bar>
      <template v-if="mobile" #append>
        <v-app-bar-nav-icon @click="toggleNav = !toggleNav"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>Gym Records</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="toggleNav" :expand-on-hover="!mobile" :location="mobile ? 'right' : 'left'" :permanent="smAndUp">
      <v-list-item v-for="item in listNav" :key="item.title"
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
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useDisplay } from 'vuetify'
  import * as ComUtils from '@/common/ComUtils.js'

  const router = useRouter()
  const { mobile, smAndUp } = useDisplay()

  const toggleNav = ref(true);

  const listNav = ref([
    { title: 'home', icon: 'mdi-home' },
    { title: 'exercises', icon: 'mdi-dumbbell' }
  ])

  onMounted(() => {
    toggleNav.value = !mobile.value;
  })
</script>


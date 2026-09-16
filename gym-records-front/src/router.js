import { createRouter, createWebHashHistory } from "vue-router";
import { components } from "vuetify/dist/vuetify.js";

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/records',
    name: 'records',
    component: () => import('@/views/Records.vue')
  },
  {
    path: '/exercises',
    name: 'exercises',
    component: () => import('@/views/Exercises.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router
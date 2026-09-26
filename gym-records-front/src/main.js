import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue';
import '@/assets/common.css';

// Vue-Router
import router from './router';

// Vuetify
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

import { createVuetify } from 'vuetify';
import { VProgress } from 'vuetify/labs/VProgress';
const vuetify = createVuetify({
  components: {
    // VProgress
  },
  theme: {
    defaultTheme: 'system'
  }
});

// Pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(pinia);
app.mount('#app');

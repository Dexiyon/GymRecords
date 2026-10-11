import { defineStore } from "pinia";
import { useTheme } from "vuetify";

export const useCommonStore = defineStore('StoreCommon', {

  state: () => ({

    /**
     * Login
     */
    loginid: '',
    loginname: '',
    theme: 'light',

    /**
     * Common
     */
    loading: false,

    /**
     * Pages
     */
    exercises: [],
    records: [],
    users: [],

  }),

  actions: {
    setUser (p_loginid) {
      this.loginid = p_loginid;
      const userData = this.users.filter(user => user.id === p_loginid)[0];
      this.loginname = userData.name;
      this.theme = userData.theme;
    }
  },
  
  persist: {
    storage: sessionStorage
  }

});
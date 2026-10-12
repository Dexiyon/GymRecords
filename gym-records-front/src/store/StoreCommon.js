import { defineStore } from "pinia";

export const useCommonStore = defineStore('StoreCommon', {

  state: () => ({

    /**
     * Login
     */
    loginid: '',
    userdata: {
      name: 'guest',
      theme: 'system'
    },

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
      this.userdata = this.users.filter(user => user.id === p_loginid)[0];
    }
  },
  
  persist: {
    storage: sessionStorage
  }

});
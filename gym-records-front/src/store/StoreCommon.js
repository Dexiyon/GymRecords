import { defineStore } from "pinia";

export const useCommonStore = defineStore('StoreCommon', {

  state: () => ({

    /**
     * Login/Users
     */
    loginid: '',
    userdata: {
      name: 'guest',
      theme: 'system'
    },
    users: [],

    /**
     * Common
     */
    loading: false,

    /**
     * Exercises
     */
    exercises: [],

    /**
     * Records
     */
    addRecord: false,
    records: []

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
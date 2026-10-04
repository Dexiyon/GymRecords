import { defineStore } from "pinia";

export const useCommonStore = defineStore('StoreCommon', {

  state: () => ({

    /**
     * Common
     */
    loading: false,

    /**
     * Pages
     */
    exercises: [],
    records: []

  }),

  actions: {

  },
  
  persist: {
    storage: sessionStorage
  }

});
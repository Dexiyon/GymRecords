import { defineStore } from "pinia";

export const useCommonStore = defineStore('StoreCommon', {

  state: () => ({

    loading: false

  })

});
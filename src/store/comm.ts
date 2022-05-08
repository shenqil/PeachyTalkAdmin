import { defineStore } from 'pinia';

export interface ICommState {
  fileServer: string
}

export const useCommStore = defineStore('comm', {
  state: ():ICommState => ({
    fileServer: `${window.location.origin}/files/files/`,
  }),
  getters: {
  },
  actions: {
  },
});

// store/draft.js
import { defineStore } from 'pinia'

export const useDraftStore = defineStore('draft', {
  persist: true,
  state: () => ({
    draft: false
  }),
  actions: {
    setDraft(val) {
      this.draft = val
    }
  }
})
// store/draft.js
import { defineStore } from 'pinia'

export const useDraftStore = defineStore('draft', {
  persist: {
  	enabled: true,
  	strategies: [{
  		key: 'draft', // 本地存储的 key
  		storage: {
  			getItem: (key) => uni.getStorageSync(key),
  			setItem: (key, value) => uni.setStorageSync(key, value),
  			removeItem: (key) => uni.removeStorageSync(key),
  		}
  	}]
  },
  state: () => ({
    draft: false
  }),
  actions: {
    setDraft(val) {
      this.draft = val
    }
  }
})
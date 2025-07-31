// store/system.js
import {
	defineStore
} from 'pinia'

export const useSystemStore = defineStore('system', {
	persist: {
		enabled: true,
		strategies: [{
			key: 'system', // 本地存储的 key
			storage: {
				getItem: (key) => uni.getStorageSync(key),
				setItem: (key, value) => uni.setStorageSync(key, value),
				removeItem: (key) => uni.removeStorageSync(key),
			}
		}]
	},
	state: () => ({
		flush: 0
	}),
	actions: {
		setFlush(val) {
			this.flush = val
		}
	}
})
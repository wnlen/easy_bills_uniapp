// store/guide.js
import {
	defineStore
} from 'pinia'

export const useGuideStore = defineStore('guide', {
	persist: {
		enabled: true,
		strategies: [{
			key: 'guide', // 本地存储的 key
			storage: {
				getItem: (key) => uni.getStorageSync(key),
				setItem: (key, value) => uni.setStorageSync(key, value),
				removeItem: (key) => uni.removeStorageSync(key),
			}
		}]
	},
	state: () => ({
		guidanceD: null,
		guidanceR: null,
		guidance: 0,
		draft: false
	}),
	actions: {
		setDraft(val) {
			this.draft = val
		},
		setGuidance(type, val) {
			if (type === 'D') this.guidanceD = val
			else if (type === 'R') this.guidanceR = val
			else this.guidance = val
		}
	}
})
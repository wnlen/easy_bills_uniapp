// store/user.js
import {
	defineStore
} from 'pinia'

export const useUserStore = defineStore('user', {
	persist: {
		enabled: true,
		strategies: [{
			key: 'user', // 本地存储的 key
			storage: {
				getItem: (key) => uni.getStorageSync(key),
				setItem: (key, value) => uni.setStorageSync(key, value),
				removeItem: (key) => uni.removeStorageSync(key),
			}
		}]
	},
	state: () => ({
		user: {
			workData: {},
			data: {},
			ac: {},
			phone: null
		},
		token: '',
		userRole: 'D',
		work: '',
		password: '',
		announcement: ''
	}),
	actions: {
		setToken(token) {
			this.token = token
		},
		setUser(user) {
			this.user = user
		}
	}
})
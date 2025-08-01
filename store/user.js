// store/user.js
import {
	defineStore
} from 'pinia'

export const useUserStore = defineStore('user', {
	persist: {
	  enabled: true,
	  strategies: [{
	    key: 'user',
	    storage: {
	      getItem: (key) => {
	        const value = uni.getStorageSync(key);
	        console.log('[getItem]', key, value);
	        return value;
	      },
	      setItem: (key, value) => {
	        console.log('[setItem]', key, value); // 关键调试
	        uni.setStorageSync(key, value);
	      },
	      removeItem: (key) => {
	        console.log('[removeItem]', key);
	        uni.removeStorageSync(key);
	      }
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
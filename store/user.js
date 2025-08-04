// store/user.js
import {
	defineStore
} from 'pinia'

export const useUserStore = defineStore('user', {
	unistorage: true, // 开启后对 state 的数据读写都将持久化
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
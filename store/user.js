// store/user.js
import {
	defineStore
} from 'pinia';

export const useUserStore = defineStore('user', {
	unistorage: true, // 开启后对 state 的数据读写都将持久化
	state: () => ({
		user: {
			workData: {},
			user: {},
			ac: {},
			phone: null,
			password: ''
		},
		token: '',
		userRole: 'D',
		work: '',
		announcement: '',
		customized: false,
	}),
	actions: {
		setToken(token) {
			this.token = token;
		},
		setUser(user) {
			this.user = user;
		}
	}
});
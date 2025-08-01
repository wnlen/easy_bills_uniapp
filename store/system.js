// store/system.js
import {
	defineStore
} from 'pinia'

export const useSystemStore = defineStore('system', {
	persist: true,
	state: () => ({
		flush: 0
	}),
	actions: {
		setFlush(val) {
			this.flush = val
		}
	}
})
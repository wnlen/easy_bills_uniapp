// store/guide.js
import {
	defineStore
} from 'pinia'

export const useGuideStore = defineStore('guide', {
	unistorage: true, // 开启后对 state 的数据读写都将持久化
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
// store/guide.js
import {
	defineStore
} from 'pinia'

export const useGuideStore = defineStore('guide', {
	persist: true,
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
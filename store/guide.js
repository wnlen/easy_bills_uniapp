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
		setGuidanceD(val) {
			this.guidanceD = val
		},
		setGuidanceR(val) {
			this.guidanceD = val
		}
	}
})
// store/guide.js
import {
	defineStore
} from 'pinia';

export const useGuideStore = defineStore('guide', {
	unistorage: true, // 开启后对 state 的数据读写都将持久化
	state: () => ({
		guidanceD: null,
		guidanceR: null,
		guidanceGoods: null,
		unreceivedReminder: false, //不再弹出未签收提醒弹窗开关(默认false关闭)
		guidance: 0,
		draft: false
	}),
	actions: {
		setDraft(val) {
			this.draft = val;
		},
		setGuidanceD(val) {
			this.guidanceD = val;
		},
		setGuidanceR(val) {
			this.guidanceD = val;
		},
		setGuidanceGoods(val) {
			this.guidanceGoods = val;
		}
	}
});
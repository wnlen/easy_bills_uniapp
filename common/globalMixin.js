// common/globalMixin.js
import {
	useUserStore
} from '@/store/user';
import {
	useGlobalStore
} from '@/store/global';
import {
	formatAmount
} from '@/common/format.js';

export default {
	methods: {
		formatAmount
	},
	computed: {
		pinia_user() {
			const store = useUserStore();
			return {
				...store.user
			};
		},
		pinia_userRole() {
			return useUserStore().userRole || 'D';
		},
		pinia_token() {
			return useUserStore().token || '';
		},
		pinia_work() {
			return useUserStore().work || '';
		},
		ImgUrl() {
			return useGlobalStore().ImgUrl || '';
		},
		announcement() {
			return useUserStore().announcement || {};
		}
	}
};
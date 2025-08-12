// common/globalMixin.js
import { useUserStore } from '@/store/user';
import { useGlobalStore } from '@/store/global';
import { formatAmount } from '@/common/format.js';

export default {
	methods: {
		formatAmount
	},
	computed: {
		vuex_user() {
			const store = useUserStore();
			return {
				phone: '',
				data: {
					headPortrait: '',
					name: '',
					work: ''
				},
				ac: {
					enterpriseName: ''
				},
				workData: {},
				...store.user
			};
		},
		vuex_userRole() {
			return useUserStore().userRole || 'D';
		},
		vuex_token() {
			console.log('useUserStore().token', useUserStore().token);
			return useUserStore().token || '';
		},
		vuex_work() {
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

// common/globalMixin.js
import {
	useUserStore
} from '@/store/user'
import {
	formatAmount
} from '@/common/format.js';

export default {
	methods: {
		formatAmount
	},
	computed: {
		vuex_user() {
		  const store = useUserStore()
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
		  }
		},
		vuex_userRole() {
			return useUserStore().vuex_userRole || 'D'
		},
		vuex_token() {
			return useUserStore().vuex_token || ''
		},
		vuex_work() {
			return useUserStore().vuex_work || ''
		},
		ImgUrl() {
			return useUserStore().ImgUrl || ''
		},
		announcement() {
			return useUserStore().announcement || {}
		},
		headPortrait() {
			return useUserStore().vuex_user?.data?.headPortrait || ''
		}
	}
}
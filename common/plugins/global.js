// common/plugins/global.js
import {
	nav
} from '@/utils/nav.ts'

export default {
	install(app) {
		// 挂载导航系统
		uni.$nav = nav
		//兼容组件中this.$nav
		app.config.globalProperties.$nav = nav
	}
};
// common/plugins/global.js
import {
	prePage,
	goPath,
	goTab
} from '@/utils/nav.js';
import {
	nav
} from '@/utils/nav.ts'

export default {
	install(app) {
		app.config.globalProperties.$prePage = prePage;
		app.config.globalProperties.$goPath = goPath;
		app.config.globalProperties.$goTab = goTab;

		// 挂载新版导航系统
		uni.$nav = nav
		//兼容组件中this.$nav
		app.config.globalProperties.$nav = nav
	}
};
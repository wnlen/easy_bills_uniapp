// common/plugins/global.js
import {
	prePage,
	goPath,
	goTab
} from '@/utils/nav.js';

export default {
	install(app) {
		app.config.globalProperties.$prePage = prePage;
		app.config.globalProperties.$goPath = goPath;
		app.config.globalProperties.$goTab = goTab;
	}
};
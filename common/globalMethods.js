import { prePage, goPath, goTab } from '@/utils/nav.js';

export default {
	install(Vue) {
		Vue.prototype.prePage = prePage;
		Vue.prototype.goPath = function(path) {
			goPath(path, this);
		};
		Vue.prototype.goTab = goTab;
	}
};

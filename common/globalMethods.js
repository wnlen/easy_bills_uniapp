// 用于挂载 this.goPath, this.prePage 等，仅 JS 内使用
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

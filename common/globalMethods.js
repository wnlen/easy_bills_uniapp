// 用于挂载 this.goPath, this.prePage 等，仅 JS 内使用
import { prePage, goPath, goTab } from '@/utils/nav.js';

export default {
    install(app) {
        app.config.globalProperties.prePage = prePage;
        app.config.globalProperties.goPath = function (path) {
            goPath(path, this);
        };
        app.config.globalProperties.goTab = goTab;
    }
};

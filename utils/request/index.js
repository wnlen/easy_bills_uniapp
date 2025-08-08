// util/request/index.js
import config from '@/common/config';
import { requestInterceptors, responseInterceptors } from './interceptors';
import { http } from '@/uni_modules/uview-plus';

const initRequest = (app) => {
    http.setConfig((defaultConfig) => {
        defaultConfig.baseURL = config.baseUrl || 'https://wxapi.elist.com.cn/test';
        return defaultConfig;
    });

    requestInterceptors();
    responseInterceptors();
};

export { initRequest };

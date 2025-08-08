// util/request/interceptors.js
import { http, toast } from '@/uni_modules/uview-plus';
import store from '@/store';

const requestInterceptors = () => {
    http.interceptors.request.use(
        (config) => {
            const lifeData = uni.getStorageSync('lifeData') || {};

            // 自动附加 token 等信息
            if (config?.custom?.auth) {
                config.header = {
                    ...config.header,
                    token: lifeData.vuex_token || '',
                    userRole: lifeData.vuex_userRole || '',
                    phone: lifeData.vuex_user?.phone || ''
                };
            }

            return config;
        },
        (err) => Promise.reject(err)
    );
};

const responseInterceptors = () => {
    http.interceptors.response.use(
        (response) => {
            const data = response.data;
            const custom = response.config?.custom;

            if (data.code !== 200) {
                if (custom?.toast !== false) {
                    toast(data.message || '请求失败');
                }
                if (custom?.catch) {
                    return Promise.reject(data);
                }
                return new Promise(() => {}); // 阻止错误自动进入 .then
            }

            return data.data || {};
        },
        (err) => Promise.reject(err)
    );
};

export { requestInterceptors, responseInterceptors };

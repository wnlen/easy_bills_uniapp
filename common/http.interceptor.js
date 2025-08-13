// common/http.interceptor.js
import Request from 'luch-request'; // 下载的插件
import {
	useUserStore
} from '@/store/user';
let hasRedirectedToLogin = false;

function isWhiteListedPath(url = '') {
	const noAuthUrls = ['/edo/advert/get', '/rest/v1/login', '/rest/v1/register'];
	const whitePrefixList = ['/public/'];
	const cleanUrl = url.split('?')[0];
	return noAuthUrls.includes(cleanUrl) || whitePrefixList.some((prefix) => cleanUrl.startsWith(prefix));
}

export const initRequest = () => {
	const http = new Request();

	if (!http || typeof http.setConfig !== 'function') {
		console.warn('[拦截器未注册] uni.$u.http 不可用，跳过安装');
		return null;
	}

	const _rawGet = http.get.bind(http)
	http.get = function(url, dataOrOptions = {}, options = {}) {
		// 如果第二个参数看起来是“纯数据对象”，而不是包含 params 的 options，就包一层 params
		const hasParamsField = dataOrOptions && typeof dataOrOptions === 'object' && 'params' in dataOrOptions
		const finalOptions = hasParamsField ? dataOrOptions : {
			params: dataOrOptions,
			...options
		}
		return _rawGet(url, finalOptions)
	}

	http.setConfig((config) => {
		// config.baseURL = 'https://wxapi.elist.com.cn/'
		config.baseURL = 'https://wxapi.elist.com.cn/test/';
		// config.baseURL = 'http://192.168.124.2:8081/test/';
		config.showLoading = true;
		config.loadingText = '加载中~';
		config.loadingTime = 800;
		config.originalData = true;
		return config;
	});

	http.interceptors.request.use((config) => {
		const userStore = useUserStore();

		const isWhite = isWhiteListedPath(config.url);
		const skipAuth = config.custom?.noAuth;

		if (!isWhite && !skipAuth) {
			const token = userStore.token
			config.header = {
				...config.header,
				Authorization: `Bearer ${token}`,
				token: userStore.token || '',
				// userRole: userStore.userRole || '',
				phone: userStore.user?.phone || '',
				// work: userStore.work || '',
				// boss: userStore.user?.workData?.bossNumber || '0'
			};
		}

		return config;
	});

	http.interceptors.response.use((res) => {
		if (res?.data?.code === 401 && !hasRedirectedToLogin) {
			hasRedirectedToLogin = true;
			setTimeout(() => (hasRedirectedToLogin = false), 2000);

			uni.navigateTo({
				url: '/pages/subUser/login'
			});
		}
		return res;
	});
	return http;
};
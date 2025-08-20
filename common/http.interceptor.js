// common/http.interceptor.js
import Request from 'luch-request'; // 下载的插件
import {
	useUserStore
} from '@/store/user';
let hasRedirectedToLogin = false;

function isWhiteListedPath(url = '') {
	const noAuthUrls = [
		'advert/get',
		'rest/v1/login',
		'rest/v1/register',
		'rest/v1/refresh',
		'rest/v1/phone',
		'rest/v1/auth/mp-weixin/login',
		"rest/v1/auth/app-weixin/login",
		"rest/v1/auth/app-yijian/login",
		"rest/v1/auth/app-phone/login",
		"rest/v1/auth/app-pwd/login",
		"rest/v1/auth/app-apple/login",
		"rest/v1/auth/refresh",
		"rest/v1/auth/logout"
	];
	const whitePrefixList = ['/public/'];
	const cleanUrl = url.split('?')[0];
	return noAuthUrls.includes(cleanUrl) || whitePrefixList.some((prefix) => cleanUrl.startsWith(prefix));
}

function goLoginOnce() {
	if (hasRedirectedToLogin) return
	hasRedirectedToLogin = true
	// 1 秒内防抖，避免并发多次跳转
	setTimeout(() => (hasRedirectedToLogin = false), 1000)
	uni.navigateTo({
		url: '/pages/subUser/login'
	})
}

export const initRequest = () => {
	const http = new Request();

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
		// config.baseURL = 'https://wxapi.elist.com.cn/edo/'
		config.baseURL = 'https://wxapi.elist.com.cn/test/edo/';
		// config.baseURL = 'http://192.168.124.2:8081/test/edo/';
		config.showLoading = true;
		config.loadingText = '加载中~';
		config.loadingTime = 800;
		config.originalData = true;
		return config;
	});

	// ===== 核心：请求前拦截，无 token 就取消并跳转 =====
	http.interceptors.request.use((config) => {
		console.log('config', config);
		const userStore = useUserStore()
		const isWhite = isWhiteListedPath(config.url)
		const skipAuth = config.custom?.noAuth === true

		if (!isWhite && !skipAuth) {
			const token = (userStore.token || '').trim()
			if (!token) {
				// 先关掉 loading（否则会一直在转）
				uni.hideLoading()
				goLoginOnce()
				// 取消本次请求（不发到服务器）
				return Promise.reject({
					code: 200,
					message: '请登录'
				})
			}

			// 有 token 才加头
			config.header = {
				...config.header,
				Authorization: `Bearer ${token}`,
				token,
				phone: userStore.user?.phone || '',
				boss: userStore.user?.workData?.bossNumber || '0'
				// userRole: userStore.userRole || '',
				// work: userStore.work || '',
			}
		}

		return config
	})

	// ===== 收到响应后的统一处理（token 过期等） =====
	http.interceptors.response.use((res) => {
		// 注意：luch 在小程序端一般用 res.statusCode，H5 用 res.status；保险起见都判断一下
		const httpCode = res?.statusCode ?? res?.status
		const bizCode = res?.data?.code

		if (httpCode === 401 || bizCode === 401) {
			uni.hideLoading()
			goLoginOnce()
			// 抛错给业务，避免错误被吃掉
			return Promise.reject(res)
		}

		return res
	})
	return http;
};
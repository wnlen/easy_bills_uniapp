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
		'rest/v1/auth/app-weixin/login',
		'rest/v1/auth/app-yijian/login',
		'rest/v1/auth/app-phone/login',
		'rest/v1/auth/app-pwd/login',
		'rest/v1/auth/app-apple/login',
		'rest/v1/auth/refresh',
		'rest/v1/auth/logout'
	];
	const whitePrefixList = ['public/']; // 统一为不带前导斜杠

	let clean = url.split('?')[0] || '';
	// 提取 pathname
	try {
		if (/^https?:\/\//i.test(clean)) {
			clean = new URL(clean).pathname || '';
		}
	} catch (e) {}
	// 去掉前导斜杠 & 去掉开头可能的 '/test/edo/'
	clean = clean.replace(/^\/+/, '').replace(/^test\/edo\/+/, '');

	// 完整匹配 & 前缀匹配
	if (noAuthUrls.includes(clean)) return true;
	return whitePrefixList.some(prefix => clean.startsWith(prefix));
}

function goLoginOnce() {
	if (hasRedirectedToLogin) return
	hasRedirectedToLogin = true
	// 2 秒内防抖，避免并发多次跳转
	setTimeout(() => (hasRedirectedToLogin = false), 2000)
	uni.redirectTo({
		url: '/pages/subUser/login'
	})
}

export const initRequest = () => {
	const http = new Request();

	const _rawGet = http.get.bind(http)
	http.get = function(url, dataOrOptions = {}, options = {}) {
		let finalOptions;
		if (dataOrOptions && typeof dataOrOptions === 'object' && ('params' in dataOrOptions || 'header' in
				dataOrOptions || 'custom' in dataOrOptions)) {
			// 第二参就是 options：和第三参 merge（第三参优先生效）
			finalOptions = {
				...dataOrOptions,
				...options
			};
		} else {
			// 第二参是纯查询对象：塞进 params，并与第三参合并（第三参优先）
			finalOptions = {
				params: dataOrOptions,
				...options
			};
		}
		return _rawGet(url, finalOptions);
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
		const userStore = useUserStore()
		const isWhite = isWhiteListedPath(config.url)
		const skipAuth = config.custom?.noAuth === true

		if (!isWhite && !skipAuth) {
			const token = (userStore.token || '').trim()
			if (!token) {
				// 先关掉 loading
				uni.hideLoading()
				goLoginOnce()
				// 取消本次请求（不发到服务器）
				return Promise.reject({
					statusCode: 401, // 或者 status: 401
					data: {
						code: 401,
						message: '请登录'
					}
				});
			}

			const hdr = {
				...config.header
			};
			hdr.Authorization = `Bearer ${token}`, hdr.token = token;
			hdr.phone = userStore.user.phone || '';
			hdr.boss = userStore.user.workData.bossNumber || '0';
			config.header = hdr;
		}

		return config
	})

	// ===== 收到响应后的统一处理（token 过期等） =====
	http.interceptors.response.use((res) => {
		// 注意：luch 在小程序端一般用 res.statusCode，H5 用 res.status；保险起见都判断一下
		return res
	}, (error) => {
		console.log('响应错误:', error);
		const httpCode = error?.statusCode ?? error?.status
		const bizCode = error?.data?.code
		if (httpCode === 401 || bizCode === 401) {
			uni.$u.setPinia({
				user: {
					token: '',
					user: {
						phone: undefined
					}
				}
			})
			uni.hideLoading()
			goLoginOnce()
			// 抛错给业务，避免错误被吃掉
			return Promise.reject(error)
		}
		if (!httpCode && !bizCode) {
			uni.hideLoading();
			uni.showToast({
				title: '网络异常，请检查连接',
				icon: 'none'
			});
			return Promise.reject(error);
		}
		// 其它错误都要 reject 出去，避免被吃掉
		return Promise.reject(error);
	})
	return http;
};
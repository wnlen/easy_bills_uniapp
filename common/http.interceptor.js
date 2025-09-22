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

	setTimeout(() => {
		uni.redirectTo({
			url: '/pages/subUser/login'
		})
	}, 1500)
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
		config.baseURL = 'https://wxapi.elist.com.cn/edo/'
		// config.baseURL = 'https://wxapi.elist.com.cn/test/edo/';
		// config.baseURL = 'http://192.168.124.2:8081/test/edo/';
		config.showLoading = true;
		config.loadingText = '加载中~';
		config.loadingTime = 800;
		config.originalData = true;
		return config;
	});

	// ===== 请求拦截：无 token 直接拦截，不发给后端 =====
	http.interceptors.request.use((config) => {
		const userStore = useUserStore()
		const isWhite = isWhiteListedPath(config.url)
		const skipAuth = config.custom?.noAuth === true

		if (!isWhite && !skipAuth) {
			const token = (userStore.token || '').trim()
			if (!token) {
				goLoginOnce()
				return Promise.reject({
					statusCode: 401,
					data: {
						code: '40101',
						message: '请登录'
					},
					__from__: 'client-short-circuit'
				})
			}
			const hdr = {
				...config.header
			}
			hdr.Authorization = `Bearer ${token}`
			hdr.token = token // 兼容老后端
			hdr.phone = userStore.user?.phone || ''
			hdr.boss = userStore.user?.workData?.bossNumber || '0'
			config.header = hdr
		}

		return config
	})

	// ===== 响应拦截：细分 401 场景，不要误清 token =====
	http.interceptors.response.use(
		(res) => res,
		async (error) => {


			const httpCode = error?.statusCode ?? error?.status
			const data = error?.data || {}
			// 兼容后端把业务码放 header（推荐做法）
			const hdrCode = error?.header?.['X-Auth-Error-Code'] || error?.headers?.['X-Auth-Error-Code']
			const bizCode = String(data?.code || hdrCode || '')

			// --- 网络层异常（如断网、超时、DNS），既没有 httpCode 也没有 bizCode ---
			if (!httpCode && !bizCode) {
				uni.showToast({
					title: '网络异常，请检查连接',
					icon: 'none'
				})
				return Promise.reject(error)
			}

			// --- 会话/Redis 等服务端异常：HTTP 503 + 业务码 50001 -> 不清 token，只提示 ---
			if (httpCode === 503 || bizCode == '50001') {

				uni.showToast({
					title: error.data.message,
					icon: 'none'
				})
				// 可选：对幂等 GET 请求做一次轻量重试，避免偶发抖动
				// if (error?.config && error.config.method?.toUpperCase() === 'GET' && !error.config.__retried) {
				//   error.config.__retried = true
				//   return http.request(error.config)
				// }
				return Promise.reject(error)
			}

			// --- 鉴权相关：只在确认为“失效/冲突/缺失”时清 token ---
			const shouldLogout =
				httpCode === 401 || ['40101', '40102', '40103', 401].includes(bizCode)


			if (shouldLogout) {

				// 40101 未带/格式错；40102 过期；40103 被挤下线
				uni.$u.setPinia({
					user: {
						token: '',
						user: {
							phone: undefined
						}
					}
				})

				// 针对 40103 友好提示
				if (bizCode === '40103') {

					uni.showToast({
						title: error.data.message,
						icon: 'none'
					})
				}
				goLoginOnce()
				return Promise.reject(error)
			}

			// 其它错误，交给业务层
			return Promise.reject(error)
		}
	)
	return http;
};
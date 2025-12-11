// common/http.interceptor.js
import Request from 'luch-request'; // 下载的插件
import {
	debuggerEnabled,
	debuggerModule
} from '@/uni_modules/imengyu-IMDebuggerWindow/common/debuggerExtern.js'

import {
	useUserStore
} from '@/store/user';
let hasRedirectedToLogin = false;

export const initRequest = () => {
	const http = new Request();
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



	// ===== 请求拦截：无 token 直接拦截，不发给后端 =====
	http.interceptors.request.use((config) => {
		const userStore = useUserStore()
		const isWhite = isWhiteListedPath(config.url)
		const skipAuth = config.custom?.noAuth === true

		const net = uni.$u.getPinia('system.NET_CONNECTED');
		//断网检测
		if (!net) {
			uni.getNetworkType({
				success(res) {
					const connected = res.networkType !== 'none';

					if (!connected) {
						uni.showToast({
							title: '网络已断开，请检查连接',
							icon: 'none'
						})
					} else {
						uni.$u.setPinia({
							system: {
								NET_CONNECTED: connected
							}
						});
					}
				},
				fail() {
					uni.showToast({
						title: '网络状态异常，请检查连接',
						icon: 'none'
					})
				}
			})
		}

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
			// hdr.token = token // 兼容老后端
			hdr.phone = userStore.user?.phone || ''
			hdr.boss = userStore.user?.workData?.bossNumber || '0'
			config.header = hdr
		}

		return config
	})

	// ===== 响应拦截：细分 401 场景，不要误清 token =====
	http.interceptors.response.use(
		(res) => {
			// ========= 调试插件：网络日志（成功 + 业务错误都记录） =========
			if (debuggerEnabled()) {
				try {
					// luch-request 的 res 结构：res.config / res.data / res.statusCode
					debuggerModule.addNetworkLog({
							url: res?.config?.url,
							method: res?.config?.method || 'GET',
							sourceUrl: res?.config?.url,
							status: res?.statusCode, // 插件要的是 status 字段，这里用 HTTP 状态码
						},
						res.config, // 请求数据：显示在 Option
						res.data // 响应数据：显示在 Data
					)
				} catch (e) {
					// 避免调试模块异常影响正常请求
					console.warn('IMDebuggerWindow addNetworkLog error', e)
				}
			}

			// 后端所有成功都是 { code:200, success:true }
			const body = res?.data || {}
			if (body.success === false || body.code && String(body.code) !== '200') {
				// 业务错误也统一走 error 分支，让业务层处理
				return Promise.reject({
					...res,
					data: body,
					statusCode: res.statusCode,
					_fromBizError: true
				})
			}
			return res
		},
		async (error) => {
			const httpCode = error?.statusCode ?? error?.status
			const body = error?.data || {}
			const hdrCode =
				error?.header?.['X-Auth-Error-Code'] ||
				error?.headers?.['X-Auth-Error-Code']

			const bizCode = String(body?.code || hdrCode || '')
			const reqUrl = error?.config?.url || ''

			// ========= 调试插件：错误日志 =========
			if (debuggerEnabled()) {
				try {
					// 直接把 error 丢进去，错误窗口会显示
					debuggerModule.addAppErr(error)
				} catch (e) {
					console.warn('IMDebuggerWindow addAppErr error', e)
				}
			}

			// ============ 1. 特殊接口白名单（避免 UI 抖动） ============
			const SILENT_API_WHITELIST = ['orderDel/get', 'inform/all', 'dev/client-error-log']
			const isSilentApi = SILENT_API_WHITELIST.some((p) =>
				reqUrl.includes(p)
			)

			// ============ 2. 服务端异常：不要误清 token ============
			// 场景：Redis 抖动、网关 502/503、服务重启
			if ([502, 503, 504].includes(httpCode) || bizCode === '50001') {
				!isSilentApi &&
					uni.showToast({
						title: body.message || '系统繁忙，请稍后再试',
						icon: 'none'
					})
				return Promise.reject(error)
			}

			// ============ 3. 鉴权失效：明确业务码才清 token ============
			const isAuthFailed =
				httpCode === 401 || ['40101', '40102', '40103'].includes(bizCode)

			if (isAuthFailed) {
				// 清除本地 token
				uni.$u.setPinia({
					user: {
						token: '',
						user: {
							phone: undefined
						}
					}
				})

				// 40103（被挤下线）提示
				if (bizCode === '40103') {
					uni.showToast({
						title: body.message || '您的账号在其他设备登录',
						icon: 'none'
					})
				}

				goLoginOnce()
				return Promise.reject(error)
			}

			// ============ 4. 其它普通业务错误 ============
			if (!isSilentApi) {
				if (uni.$http.config.baseURL === 'https://wxapi.elist.com.cn/test/edo/') {
					//上报error
					uni.$api.err.posterrorlog({
						kind: 'NO_ERROR_MESSAGE',
						url: reqUrl,
						httpCode,
						bizCode,
						body
					})
				}
			}

			return Promise.reject(error)
		}
	)
	return http;
};

function isWhiteListedPath(url = '') {
	const noAuthUrls = [
		'advert/get',
		'rest/v1/login',
		'rest/v1/register',
		'rest/v1/refresh',
		'rest/v1/phone',
		'rest/v1/auth/mp-weixin/login',
		'rest/v1/auth/app-weixin/login',
		'rest/v1/auth/app-weixin/bind-with-phone',
		'rest/v1/auth/app-yijian/login',
		'rest/v1/auth/app-phone/login',
		'rest/v1/auth/app-pwd/login',
		'rest/v1/auth/app-apple/login',
		'rest/v1/auth/refresh',
		'rest/v1/auth/logout',
		'user/getSmsCode', //发送短信
		'user/comparisonCode', //验证短信

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
	// 登录页错误不再跳转登录页
	const pages = getCurrentPages();
	const currentPage = pages[pages.length - 1];
	const route = currentPage.route; // 获取本页路径
	if (route == 'pages/subUser/login') {
		return
	}
	// 2 秒内防抖，避免并发多次跳转
	setTimeout(() => (hasRedirectedToLogin = false), 2000)

	setTimeout(() => {
		uni.redirectTo({
			url: '/pages/subUser/login'
		})
	}, 1500)
}
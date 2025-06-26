const install = (Vue, vm) => {
	Vue.prototype.$u.http.setConfig({
		// baseUrl: 'https://wxapi.elist.com.cn',
		baseUrl: 'http://localhost:8080/test',
		showLoading: true,
		loadingText: '加载中~',
		loadingTime: 800,
		originalData: true
	});
	// 白名单接口路径（无需 token 的接口）
	const noAuthUrls = [
		'/edo/advert/get',
		'/rest/v1/login',
		'/rest/v1/register'
	];
	//白名单前缀接口
	const whitePrefixList = [
		'/public/'
	];
	let hasRedirectedToLogin = false;
	
	// 请求拦截器
	Vue.prototype.$u.http.interceptor.request = (config) => {
		const isWhiteListed = isWhiteListedPath(config.url);
		const skipAuth = config.custom?.noAuth;

		if (!isWhiteListed && !skipAuth) {
			const lifeData = uni.getStorageSync('lifeData') || {};
			config.header = config.header || {};

			config.header.token = lifeData.vuex_token || '';
			config.header.userRole = lifeData.vuex_userRole || '';
			config.header.phone = lifeData.vuex_user?.phone || '';
			config.header.work = lifeData.vuex_work || '';
			config.header.boss = lifeData.vuex_user?.workData?.bossNumber || '0';
		}

		return config;
	};

	// 响应拦截器
	Vue.prototype.$u.http.interceptor.response = (response) => {
		const { config, data } = response;
		const isWhiteListed = isWhiteListedPath(config.url);
		const skipAuth = config.custom?.noAuth;
		console.log('响应拦截器',response)
		if (data.code === 401 && !isWhiteListed && !skipAuth && !hasRedirectedToLogin) {
			console.warn('401 未授权，执行清理并跳转登录页');
			hasRedirectedToLogin = true;
			setTimeout(() => (hasRedirectedToLogin = false), 2000); // 防止多次跳转
			
			Vue.prototype.$u.vuex('vuex_token', '');
			Vue.prototype.$u.vuex('vuex_userRole', 'D');
			Vue.prototype.$u.vuex('vuex_user', { phone: undefined });

			uni.navigateTo({
				url: '/pages/subUser/login'
			});
		}

		return response;
	};
	
};
// 白名单判断封装函数
function isWhiteListedPath(url = '') {
	const cleanUrl = url.split('?')[0]; // 去掉 ? 后面的参数
	return (
		noAuthUrls.includes(cleanUrl) ||
		whitePrefixList.some(prefix => cleanUrl.startsWith(prefix))
	);
}
export default {
	install
};

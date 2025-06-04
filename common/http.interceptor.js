const install = (Vue, vm) => {
	Vue.prototype.$u.http.setConfig({
		baseUrl: 'https://wxapi.elist.com.cn',
		// baseUrl: 'https://wxapi.elist.com.cn/test',
		// baseUrl: 'http://192.168.8.110:8080/test',
		// baseUrl: 'http://192.168.8.110:8183',
		// baseUrl: 'http://localhost:8183',
		// baseUrl: 'http://localhost:8080/test',
		showLoading: true,
		loadingText: '加载中~',
		loadingTime: 800,
		originalData: true
	});

	// 请求拦截，配置Token等参数
	//#ifdef MP-WEIXIN
	
	Vue.prototype.$u.http.interceptor.request = (config) => {
		const lifeData = uni.getStorageSync('lifeData') || {};
		console.log('本地缓存',vm)
		config.header.token = lifeData.vuex_token || '';
		config.header.userRole = lifeData.vuex_userRole || '';
		config.header.phone = lifeData.vuex_user?.phone || '';
		config.header.work = lifeData.vuex_work || '';
		config.header.boss = lifeData.vuex_user?.workData?.bossNumber || '0';
		return config;
	}
	//#endif
	
	
	//#ifdef APP
	Vue.prototype.$u.http.interceptor.request = (config) => {
		config.header.token = vm.vuex_token;
		config.header.userRole = vm.vuex_userRole;
		config.header.phone = vm.vuex_user.phone+"-app";
		config.header.work = vm.vuex_work;
		config.header.boss = vm.vuex_user.workData ? vm.vuex_user.workData.bossNumber ? vm.vuex_user.workData.bossNumber : '0' : '0';
		return config;
	}
	//#endif
	
	Vue.prototype.$u.http.interceptor.response = (response) => {
		const {
			code
		} = response.data;
		// console.log("======>请求状态码", code);
		if (code === 999) {
			vm.$u.vuex('vuex_token', '');
			vm.$u.vuex('vuex_userRole', 'D');
			vm.$u.vuex('vuex_user', {
				'phone': undefined
			});
			console.error('===err===>返回码为 999，token过期 或者权限异常 请重新登录');
			if (vm.vuex_user.phone==undefined) {
				vm.$u.toast("请登录查看更多");
			}else{
				vm.$u.toast("请求异常");
			}
		}
		return response;
	};



}

export default {
	install
}
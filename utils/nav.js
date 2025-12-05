// 获取上一个页面实例
export function prePage() {
	const pages = getCurrentPages();
	const pre = pages[pages.length - 2];
	return typeof pre.$vm !== 'undefined' ? pre.$vm : pre;
}

// 路由跳转（判断是否登录）
export function goPath(path, vm) {
	// uni.setStorageSync('1003', '0');
	if (this.pinia_token) {
		uni.navigateTo({
			url: path
		});
	} else {
		// #ifndef APP
		uni.navigateTo({
			url: '/pages/subUser/login'
		});
		// #endif
		// #ifdef APP
		this.$univerify()
		// #endif
	}
}

// Tab 切换
export function goTab(path) {
	uni.switchTab({
		url: path
	});
}
// nav.ts
// 易单据项目统一导航工具（节流 + 登录检查 + 端内差异处理）

/**
 * 使用示例
 * uni.nav.to('/pages/subUser/login')
 * uni.nav.to('/pages/order/detail', { id: orderId, from: 'list' })
 */

let isNavigating = false;
const NAV_LOCK_TIMEOUT = 350;

// =============== 工具 ===============
function lock() {
	if (isNavigating) return false;
	isNavigating = true;
	setTimeout(() => (isNavigating = false), NAV_LOCK_TIMEOUT);
	return true;
}

function buildUrl(url: string, params?: Record<string, any>) {
	if (!params) return url;
	const query = Object.entries(params)
		.map(([k, v]) => `${k}=${encodeURIComponent(String(v ?? ''))}`)
		.join('&');
	return query ? `${url}?${query}` : url;
}

// 获取 pinia token
function getToken() {
	try {
		return this.$u.getPinia('user.token') || '';
	} catch {
		return '';
	}
}

// =============== 登录检查 ===============
function ensureLogin(): boolean {
	const token = getToken();
	return !!token;
}

// APP 专用的 uni-verify 登录
function doAppLogin() {
	// #ifdef APP
	uni.$univerify();
	// #endif

	// #ifndef APP
	uni.navigateTo({
		url: '/pages/subUser/login'
	});
	// #endif
}

// =============== 对外导航 API ===============
export const nav = {
	/** 普通跳转 navigateTo（自动判断登录 + 跳转节流） */
	to(url: string, params?: Record<string, any>) {
		if (!lock()) return;

		// 登录校验
		if (!ensureLogin()) {
			return doAppLogin();
		}

		return uni.navigateTo({
			url: buildUrl(url, params)
		});
	},

	/** tabBar 跳转（tab 页面不支持 query 参数） */
	tab(url: string) {
		if (!lock()) return;

		// tab 页面不强制登录
		// 如果要强制登录，这里加 ensureLogin() 判断即可

		return uni.switchTab({ url });
	},

	/** replace 替换当前页 */
	replace(url: string, params?: Record<string, any>) {
		if (!lock()) return;
		if (!ensureLogin()) return doAppLogin();

		return uni.redirectTo({
			url: buildUrl(url, params)
		});
	},

	/** launch 重启（退出登录常用） */
	launch(url: string, params?: Record<string, any>) {
		if (!lock()) return;

		return uni.reLaunch({
			url: buildUrl(url, params)
		});
	},

	/** 后退 */
	back(delta = 1) {
		if (!lock()) return;
		return uni.navigateBack({ delta });
	}
};

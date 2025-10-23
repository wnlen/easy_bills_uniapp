export default (http) => ({
	// 获取用户定制信息
	customizationBundle(params) {
		return http.get('customization/bundle', params);
	},
	// 获取定制版本号
	customizationUpdated(params) {
		return http.get('customization/max-updated-at', params);
	},
})
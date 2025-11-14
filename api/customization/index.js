export default (http) => ({
	// 获取用户定制信息
	customizationBundle(params) {
		return http.get('customization/bundle', params);
	},
	// 获取定制版本号
	customizationUpdated(params) {
		return http.get('customization/max-updated-at', params);
	},
	// 生成pdf
	customizationCreatePdf(params) {
		return http.post('order/pdf/createPdf', params);
	},
	// 打印单据
	customizationLookDzImg(params) {
		return http.post('printer/lookDzImg', params);
	},
})
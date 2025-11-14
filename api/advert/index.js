// api/advert/index.js
export default (http) => ({
	// 获取广告列表
	getAdvertList(params) {
		return http.get(`advert/get`, params);
	}
});
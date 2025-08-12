export default (http) => ({
	/**
	 * 添加商品至商品库
	 * 原始接口：/edo/library/add
	 */
	addCommodity(params) {
		return http.post('/edo/library/add', params);
	},

	/**
	 * 获取商品库列表（可带筛选条件）
	 * 原始接口：/edo/library/get
	 */
	getCommodityList(params) {
		return http.post('/edo/library/get', params);
	},

	/**
	 * 更新商品信息
	 * 原始接口：/edo/library/upd
	 */
	updateCommodity(params) {
		return http.post('/edo/library/upd', params);
	},

	/**
	 * 删除商品（从商品库中移除）
	 * 原始接口：/edo/library/del
	 */
	deleteCommodity(params) {
		return http.post('/edo/library/del', params);
	},
	/**
	 * 根据商品 ID 获取商品详情
	 * 原始接口：/edo/library/get/id
	 */
	getCommodityById(params) {
		return http.post('/edo/library/get/id', params);
	}
});

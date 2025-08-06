export default (http) => ({
	/**
	 * 添加草稿记录（开单暂存）
	 * 原始接口：/edo/draft/add
	 */
	addDraft(params) {
		return http.post('/edo/draft/add', params)
	},

	/**
	 * 编辑草稿信息（修改已有草稿）
	 * 原始接口：/edo/draft/edit
	 */
	editDraft(params) {
		return http.post('/edo/draft/edit', params)
	},

	/**
	 * 获取草稿列表（支持筛选）
	 * 原始接口：/edo/draft/getFilter
	 */
	getDraftList(params) {
		return http.post('/edo/draft/getFilter', params)
	},

	/**
	 * 删除草稿（通过 ID 或条件）
	 * 原始接口：/edo/draft/delById
	 */
	deleteDraftById(params) {
		return http.post('/edo/draft/delById', params)
	},

	/**
	 * 获取草稿总金额/数量汇总
	 * 原始接口：/edo/draft/amount
	 */
	getDraftAmount(params) {
		return http.post('/edo/draft/amount', params)
	},
	/**
	 * 根据草稿 ID 获取草稿详情
	 * 原始接口：/edo/draft/getById/{id}
	 */
	getDraftById(params) {
		return http.post(`/edo/draft/getById/${params.id}`, params)
	},
});
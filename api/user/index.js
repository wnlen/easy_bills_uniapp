export default (http) => ({
	// 获取用户最新信息（刷新用户数据）
	refreshUser(params) {
		return http.post('user/renewal', params);
	},
	// 获取用户最新信息（刷新用户数据）
	accessTokenRefresh(params) {
		return http.post('rest/v1/refresh', params);
	},
	/**
	 * 搜索用户（通过手机号）
	 * 原始接口：/edo/user/search
	 */
	searchUser(params) {
		return http.get('user/search', params);
	},
	/**
	 * 搜索Marke用户（通过手机号）
	 * 原始接口：/edo/user/search
	 */
	searchMarketUser(params) {
		return http.get('user/searchMarket', params);
	},
	/**
	 * 获取用户详情（通过手机号）
	 * 原始接口：/edo/user/details
	 */
	getUserDetails(params) {
		return http.post('user/details', params);
	},
	updateUserUp(params) {
		return http.post('user/up', params);
	},
	/**
	 * 用户引导操作（用于初次使用或引导页面）
	 * 原始接口：/edo/user/Guidance
	 */
	userGuidance(params) {
		return http.post('user/Guidance', params);
	},
	/**
	 * 查询下单时的用户信息（带状态、主账号、端口）
	 * 原始接口：/edo/user/searchAddOrder
	 */
	searchUserAddOrder(params) {
		return http.post('user/searchAddOrder', params);
	},
	/**
	 * 注销账号申请（提交手机和补填手机号）
	 * 原始接口：/edo/user/unsubscribe
	 */
	unsubscribeUser(params) {
		return http.post('user/unsubscribe', params);
	},
	/**
	 * 撤销注销申请
	 * 原始接口：/edo/user/revocation
	 */
	revokeUnsubscribe(params) {
		return http.post('user/revocation', params);
	},
	/**
	 * 校验验证码是否正确（手机号 + 验证码）
	 * 原始接口：/edo/user/comparisonCode
	 */
	verifyUnsubscribeCode(params) {
		return http.post('user/comparisonCode', params);
	},
	/**
	 * 获取注销验证码（手机号 + 类型）
	 * 原始接口：/edo/user/getUnsubscribeCode
	 */
	getUnsubscribeCode(params) {
		return http.post('user/getUnsubscribeCode', params);
	},
	/**
	 * 查找可收货的用户列表
	 * 原始接口：/edo/delivery/searchUser
	 */
	searchReceivableUsers(params) {
		return http.post('delivery/searchUser', params);
	},
	/**
	 * 添加备注信息
	 * 原始接口：/edo/remark/add
	 */
	addRemark(params) {
		return http.post('remark/add', params);
	},
	/**
	 * 修改收货备注（收货端添加或修改发货备注）
	 * 原始接口：/edo/delivery/remark
	 */
	updateDeliveryRemark(params) {
		return http.post('delivery/remark', params);
	},
	/**
	 * 删除客户
	 * 原始接口：/edo/client/del
	 */
	deleteClient(params) {
		return http.post('client/del', params);
	},

	/**
	 * 启用客户（或恢复状态）
	 * 原始接口：/edo/client/ok
	 */
	enableClient(params) {
		return http.post('client/ok', params);
	},
	/**
	 * 添加客户信息
	 * 原始接口：/edo/client/add
	 */
	addClient(params) {
		return http.post('client/add', params);
	},

	/**
	 * 获取客户列表（可按主账号、状态等筛选）
	 * 原始接口：/edo/client/get
	 */
	getClientList(params) {
		return http.post('client/get', params);
	},
	/**
	 * 删除员工账号与主账号的关联关系
	 * 原始接口：/edo/relation/del
	 */
	deleteRelation(params) {
		return http.post('relation/del', params);
	},

	/**
	 * 获取关联员工列表（通过主账号手机号）
	 * 原始接口：/edo/relation/get
	 */
	getRelationList(params) {
		return http.post('relation/get', params);
	},

	/**
	 * 删除员工的关联申请记录
	 * 原始接口：/edo/relationApply/del
	 */
	deleteRelationApply(params) {
		return http.post('relationApply/del', params);
	}

});
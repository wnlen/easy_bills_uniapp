export default (http) => ({
	/**
	 * 获取筛选条件下的订单总金额
	 * 原始接口：/edo/order/getFilterSum
	 */
	getFilteredOrderSum(params) {
		return http.post('order/getFilterSum', params);
	},
	/**
	 * 获取筛选条件下的订单总数量
	 * 原始接口：/edo/order/Quantity
	 */
	getFilteredOrderCount(params) {
		return http.post('order/Quantity', params);
	},
	/**
	 * 根据订单 ID 获取订单详情
	 * 原始接口：/edo/order/getById/{orderId}
	 */
	getOrderById(params) {
		return http.post(`order/getById/${params.orderId}`, params);
	},

	/**
	 * 获取订单筛选后的列表
	 * 原始接口：/edo/order/getFilter
	 */
	getFilteredOrders(params) {
		return http.post('order/getFilter', params);
	},

	/**
	 * 生成订单 PDF（用于打印或导出）
	 * 原始接口：/edo/order/pdf
	 */
	generateOrderPDF(params) {
		return http.post('order/pdf', params);
	},

	/**
	 * 确认签收订单
	 * 原始接口：/edo/order/signFor
	 */
	signForOrder(params) {
		return http.post('order/signFor', params);
	},
	/**
	 * 添加临时订单（草稿）
	 * 原始接口：/edo/orderDel/add
	 */
	addTemporaryOrder(params) {
		return http.post('orderDel/add', params);
	},

	/**
	 * 添加正式订单
	 * 原始接口：/edo/order/add
	 */
	addOrder(params) {
		return http.post('order/add', params);
	},

	/**
	 * 根据订单编号获取订单详情
	 * 原始接口：/edo/order/getByOrderNumber/{orderNumber}
	 */
	getOrderByNumber(params) {
		return http.post(`order/getByOrderNumber/${params.orderNumber}`, params);
	},

	/**
	 * 获取当前最新订单编号（如 SN20250001）
	 * 原始接口：/edo/order/getNumber{path}
	 */
	getNextOrderNumber(params) {
		return http.post(`order/getNumber${params.path || ''}`, params);
	},

	/**
	 * 编辑订单信息
	 * 原始接口：/edo/order/edit
	 */
	editOrder(params) {
		return http.post('order/edit', params);
	},

	/**
	 * 订单身份验证（用于收货前验证）
	 * 原始接口：/edo/order/authentication
	 */
	authenticateOrder(params) {
		return http.post('order/authentication', params);
	},
	/**
	 * 生成订单 PDF（带附加标识）
	 * 原始接口：/edo/order/pdf/idPlus
	 */
	generateOrderPDFWithId(params) {
		return http.post('order/pdf/idPlus', params);
	},

	/**
	 * 获取订单详情列表（可能是通用接口）
	 * 原始接口：/edo/order/get
	 */
	getOrders(params) {
		return http.post('order/get', params);
	},
	/**
	 * 获取账本统计信息（总支出、收入、结余等）
	 * 原始接口：/edo/ac/get
	 */
	getAccountStatistics(params) {
		return http.post('ac/get', params);
	},
	/**
	 * 添加账本记录（支出/收入）
	 * 原始接口：/edo/ac/add
	 */
	addAccountRecord(params) {
		return http.post('ac/add', params);
	},
	/**
	 * 获取历史订单数据
	 * 原始接口：/edo/order/old
	 */
	getOldOrders(params) {
		return http.post('order/old', params);
	},

	/**
	 * 获取市场订单信息（或市场分析）
	 * 原始接口：/edo/order/market
	 */
	getMarketOrders(params) {
		return http.post('order/market', params);
	},
	/**
	 * 编辑订单草稿
	 * 原始接口：/edo/orderDel/up
	 */
	updateOrderDraft(params) {
		return http.post('orderDel/up', params);
	},

	/**
	 * 获取系统消息列表
	 * 原始接口：/edo/orderDel/get
	 */
	getOrderDraftList(params) {
		return http.post('orderDel/get', params);
	},

	/**
	 * 获取待办事项列表
	 * 原始接口：/edo/getLimit
	 */
	getOrderDraftLimit(params) {
		return http.post('orderDel/getLimit', params);
	},

	/**
	 * 确认草稿为正式订单
	 * 原始接口：/edo/orderDel/ok
	 */
	confirmOrderDraft(params) {
		return http.post('orderDel/ok', params);
	},
	/**
	 * 根据订单 ID 获取记录列表（如签收、打印、审核记录）
	 * 原始接口：/edo/record/orderId
	 */
	getOrderRecords(params) {
		return http.post('record/orderId', params);
	},
	/**
	 * 获取发货订单列表（按发货端和收货端主账号筛选）
	 * 原始接口：/edo/delivery/get
	 */
	getDeliveryList(params) {
		return http.post(
			`delivery/get?sBossNumber=${params.sBossNumber}&eBossNumber=${params.eBossNumber}&port=${params.port}`,
			params);
	},

	/**
	 * 分享发货订单信息给收货端
	 * 原始接口：/edo/delivery/share
	 */
	shareDeliveryOrder(params) {
		return http.post('delivery/share', params);
	},

	/**
	 * 创建客户、供应商
	 * 原始接口：/edo/delivery/direct
	 */
	directDelivery(params) {
		return http.post('delivery/direct', params);
	},
	/**
	 * 创建客户、供应商
	 * 原始接口：/edo/order/del
	 */
	delOrder(params) {
		return http.post('order/del', params);
	}
});
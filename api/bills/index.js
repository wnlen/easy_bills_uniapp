export default (http) => ({
	/**
	 * 获取数量锁定后的开单总数
	 * 原始接口：/edo/bills/QuantityLock
	 */
	getLockedBillQuantity(params) {
		return http.post('bills/QuantityLock', params);
	},
	/**
	 * 获取筛选后的锁定开单列表
	 * 原始接口：/edo/bills/getFilterLock
	 */
	getFilteredLockedBills(params) {
		return http.post('bills/getFilterLock', params);
	},

	/**
	 * 获取筛选后的已勾选锁定开单列表
	 * 原始接口：/edo/bills/getFilterLockCheck
	 */
	getCheckedLockedBills(params) {
		return http.post('bills/getFilterLockCheck', params);
	},

	/**
	 * 校验所有锁定 ID（批量校验）
	 * 原始接口：/edo/bills/checkAllId
	 */
	checkAllLockedIds(params) {
		return http.post('bills/checkAllId', params);
	},

	/**
	 * 校验所有锁定项（状态检测）
	 * 原始接口：/edo/bills/checkAll
	 */
	checkAllLockedBills(params) {
		return http.post('bills/checkAll', params);
	},

	/**
	 * 获取锁定开单的总金额
	 * 原始接口：/edo/bills/getFilterLockPrice
	 */
	getLockedBillTotalPrice(params) {
		return http.post('bills/getFilterLockPrice', params);
	},

	/**
	 * 获取锁定开单总数量
	 * 原始接口：/edo/bills/Quantity
	 */
	getLockedBillQuantity(params) {
		return http.post('bills/Quantity', params);
	},

	/**
	 * 获取开单筛选列表（未锁定）
	 * 原始接口：/edo/bills/getFilter
	 */
	getFilteredBills(params) {
		return http.post('bills/getFilter', params);
	},

	/**
	 * 锁定指定开单记录
	 * 原始接口：/edo/bills/lock
	 */
	lockBills(params) {
		return http.post('bills/lock', params);
	},

	/**
	 * 获取所有筛选锁定记录的 ID
	 * 原始接口：/edo/bills/getFilterIdAll
	 */
	getAllFilteredLockedIds(params) {
		return http.post('bills/getFilterIdAll', params);
	},
	/**
	 * 获取一个新的账单编号（自动生成）
	 * 原始接口：/edo/bills/billNumber
	 */
	generateBillNumber(params) {
		return http.post('bills/billNumber', params);
	},

	/**
	 * 添加新的账单记录
	 * 原始接口：/edo/bills/addBill
	 */
	addBill(params) {
		return http.post('bills/addBill', params);
	},

	/**
	 * 查询账单（带筛选条件）
	 * 原始接口：/edo/bills/searchBill
	 */
	searchBills(params) {
		return http.post('bills/searchBill', params);
	},

	/**
	 * 批量申请开单（提交多个订单开单申请）
	 * 原始接口：/edo/bills/batchBillApply
	 */
	batchApplyBills(params) {
		return http.post('bills/batchBillApply', params);
	},

	/**
	 * 批量确认账单（用于收货端确认）
	 * 原始接口：/edo/bills/okBill
	 */
	confirmBills(params) {
		return http.post('bills/okBill', params);
	},

	/**
	 * 撤回已提交的账单申请
	 * 原始接口：/edo/bills/delApplyFor
	 */
	revokeBillApplication(params) {
		return http.post('bills/delApplyFor', params);
	},

	/**
	 * 删除账单记录
	 * 原始接口：/edo/bills/delBill
	 */
	deleteBill(params) {
		return http.post('bills/delBill', params);
	},

	/**
	 * 更新账单内容
	 * 原始接口：/edo/bills/updBill
	 */
	updateBill(params) {
		return http.post('bills/updBill', params);
	},

	/**
	 * 根据账单 ID 获取详情
	 * 原始接口：/edo/bills/billIdGet
	 */
	getBillById(params) {
		return http.post('bills/billIdGet', params);
	},

	/**
	 * 根据账单 ID 查询所关联订单（分页）
	 * 原始接口：/edo/bills/billsByIdGetOrder
	 */
	getBillOrdersByIds(params) {
		return http.post('bills/billsByIdGetOrder', params);
	},
	/**
	 * 添加开单申请（提交申请内容）
	 * 原始接口：/edo/apply/add
	 */
	addApply(params) {
		return http.post('apply/add', params);
	},

	/**
	 * 确认开单申请（用于发货端确认）
	 * 原始接口：/edo/apply/ok
	 */
	confirmApply(params) {
		return http.post('apply/ok', params);
	},

	/**
	 * 获取开单申请记录（列表或详情）
	 * 原始接口：/edo/apply/get
	 */
	getApplyList(params) {
		return http.post('apply/get', params);
	},
	/**
	 * 检查是否存在未完成序列（如未完成开单流程）
	 * 原始接口：/edo/sequence/getExist
	 */
	checkSequenceExistence(params) {
		return http.post('sequence/getExist', params);
	}
});

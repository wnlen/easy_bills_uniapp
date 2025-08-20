export default (http) => ({
	/**
	 * 添加发票记录
	 * 原始接口：/edo/invoice/add
	 */
	addInvoice(params) {
		return http.post('invoice/add', params);
	}
});

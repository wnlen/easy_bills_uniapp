export default (http) => ({
	/**
	 * 预览打印图片（生成预览图用于展示）
	 * 原始接口：/edo/printer/lookOverImg
	 */
	previewPrintImage(params) {
		return http.post('printer/lookOverImg', params);
	},

	/**
	 * 执行打印操作（调用打印服务）
	 * 原始接口：/edo/printer/print
	 */
	printDocument(params) {
		return http.post('printer/print', params);
	},
	/**
	 * 获取打印机列表（或默认打印机信息）
	 * 原始接口：/edo/printer/getPrinter
	 */
	getPrinterList(params) {
		return http.post('printer/getPrinter', params);
	},

	/**
	 * 设置默认打印机
	 * 原始接口：/edo/printer/printDef
	 */
	setDefaultPrinter(params) {
		return http.post('printer/printDef', params);
	},

	/**
	 * 修改打印机名称
	 * 原始接口：/edo/printer/printUpdateName
	 */
	updatePrinterName(params) {
		return http.post('printer/printUpdateName', params);
	}
});

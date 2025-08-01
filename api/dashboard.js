export default (http) => ({
	// 获取订单统计
	getDashboardOrderStatistics(targetPhone, portType = 0) {
		return http.get('/edo/dashboard/orderstatistics', {targetPhone,portType});
	}
});
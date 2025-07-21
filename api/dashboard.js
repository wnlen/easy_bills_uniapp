export default (http) => ({
	// 获取订单统计
	getDashboardOrderStatistics(targetPhone, portType = 0) {
		return uni.$u.http.get('/edo/dashboard/orderstatistics', {targetPhone,portType});
	}
});
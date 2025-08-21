// api/dashboard.js
export default (http) => ({
	// 获取订单统计
	getDashboardOrderStatistics(targetPhone, portType = 0) {
		return http.get('dashboard/orderstatistics', {
			targetPhone,
			portType
		});
	}
});
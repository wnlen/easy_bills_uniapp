// api/dashboard.js
export default (http) => ({
	// 获取统计对账
	getDashboardOrderStatistics(targetPhone, portType = 0) {
		return http.get('dashboard/orderstatistics', {
			targetPhone,
			portType
		});
	}
});
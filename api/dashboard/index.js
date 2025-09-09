// api/dashboard.js
export default (http) => ({
	// 获取统计对账
	getDashboardOrderStatistics(params) {
		return http.get('dashboard/orderstatistics', params);
	}
});
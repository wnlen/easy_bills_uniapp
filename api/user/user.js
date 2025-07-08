export default {
	// 获取用户最新信息（刷新用户数据）
	refreshUser(phone, role) {
		return uni.$u.post(`/edo/user/renewal?phone=${phone}&role=${role}`);
	},
	createOrder(data) {
		return uni.$u.post('/order/create', data);
	}
};
export default (http) => ({
	// 获取用户最新信息（刷新用户数据）
	refreshUser(phone, role) {
		return http.post(`/edo/user/renewal?phone=${phone}&role=${role}`);
	}
});
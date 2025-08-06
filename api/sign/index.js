// sign.js
export default (http) => ({
	//创建客户、供应商
	setDirect(param) {
		return http.post('edo/delivery/direct', param);
	}, 
	//供应商列表
	 getDirect(phone,port) {
	 	return http.post('edo/delivery/get?sBossNumber=' + phone + '&eBossNumber=' + phone + '&port=' + port);
	 }, 
	 // 邀请注册
	setShare(param) {
		return http.post('edo/delivery/share', param);
	}, 
});
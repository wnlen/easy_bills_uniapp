export default (http) => ({
	// 获取分享二维码、分享链接、邀请人数、是否可领取奖励
	getInviteOverview() {
		return http.get('/edo/invite/overview')
	},
	// 领取奖励
	claimInviteReward(type) {
		return http.post('/edo/invite/reward', { type });
	}
});
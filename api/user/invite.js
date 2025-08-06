export default (http) => ({
	// 获取分享二维码、分享链接、邀请人数、是否可领取奖励
	getInviteOverview() {
		return http.get('/edo/invite/overview')
	},
	// 邀请好友满足条件领取奖励
	claimInviteReward(params) {
		return http.post('/edo/invite/reward', params);
	},
	// 新手指引
	Guidance(params) {
	  return http.post('/edo/user/Guidance', params)
	}
});
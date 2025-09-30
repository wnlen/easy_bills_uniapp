export default (http) => ({
	/**
	 * 获取验证码（手机号 + 类型）
	 * 原始接口：/edo/user/getSmsCode
	 */
	getSmsCode(params) {
		return http.post('user/getSmsCode', params);
	},
	/**
	 * 校验验证码（手机号 + 验证码）
	 * 原始接口：/edo/user/comparisonCode
	 */
	verifyCode(params) {
		return http.post('user/comparisonCode', params);
	}
});
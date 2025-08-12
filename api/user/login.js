export default (http) => ({
	/**
	 * 小程序微信登录（新版接口）
	 * 原始接口：/edo/rest/app/v1/loginWX
	 */
	loginWithWX(params) {
		return http.post('/edo/rest/app/v1/loginWX', params);
	},

	/**
	 * APP 账号密码登录
	 * 原始接口：/edo/rest/app/v1/loginApp
	 */
	loginWithAppAccount(params) {
		return http.post('/edo/rest/app/v1/loginApp', params);
	},

	/**
	 * APP 手机号验证码登录
	 * 原始接口：/edo/rest/app/v1/loginAppPhone
	 */
	loginWithAppPhone(params) {
		return http.post('/edo/rest/app/v1/loginAppPhone', params);
	},

	/**
	 * 小程序微信一键登录（旧版接口）
	 * 原始接口：/edo/rest/v1/login
	 */
	loginWithWXOld(params) {
		return http.post('/edo/rest/v1/login', params);
	},

	/**
	 * 获取当前用户订单列表（分页+筛选）
	 * 原始接口：/edo/rest/v1/myOrderList
	 */
	getMyOrderList(params) {
		return http.post('/edo/rest/v1/myOrderList', params);
	},

	/**
	 * 微信绑定手机号码（授权手机号）
	 * 原始接口：/edo/rest/v1/phone
	 */
	bindPhoneNumber(params) {
		return http.post('/edo/rest/v1/phone', params);
	},
	/**
	 * 获取重置密码验证码
	 * 原始接口：/edo/rest/app/v1/passwordResetGetCode
	 */
	getPasswordResetCode(params) {
		return http.post('/edo/rest/app/v1/passwordResetGetCode', params);
	},

	/**
	 * 重置用户密码（通过验证码）
	 * 原始接口：/edo/rest/app/v1/passwordReset
	 */
	resetPassword(params) {
		return http.post('/edo/rest/app/v1/passwordReset', params);
	},

	/**
	 * 小程序登录后验证身份（验证是否已绑定/首次登录）
	 * 原始接口：/edo/rest/app/v1/loginWXVerifyId
	 */
	verifyLoginWXIdentity(params) {
		return http.post('/edo/rest/app/v1/loginWXVerifyId', params);
	}
});

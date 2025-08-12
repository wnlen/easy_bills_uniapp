export default (http) => ({
	/**
	 * 获取公众号验证码（如绑定/身份验证）
	 * 原始接口：/edo/gzh/v1/verificationCode
	 */
	getGzhVerificationCode(params) {
		return http.post('edo/gzh/v1/verificationCode', params);
	},

	/**
	 * 获取公众号文章内容（如公告或帮助页）
	 * 原始接口：/edo/gzh/article
	 */
	getGzhArticle(params) {
		return http.post('edo/gzh/article', params);
	}
});

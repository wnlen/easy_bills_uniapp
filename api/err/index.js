export default (http) => ({
	/**
	 * 错误上报接口
	 * 原始接口：/edo/user/getSmsCode
	 */
	posterrorlog(params) {
		return http.post('dev/client-error-log', params);
	}
});
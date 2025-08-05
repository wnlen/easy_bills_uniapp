// api/config.js
export default (http) => ({
	// 查询程序配置项
	queryProgramConfig() {
		return http.get(`edo/rest/v1/queryProgramConfig`);
	}
});
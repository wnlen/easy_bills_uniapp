export default (http) => ({
	//获取问卷数据
	getSurveyList(data) {
		return http.get('/edo/surveys/questions', data);
	}, 
});
// api/survey.js
export default (http) => ({
  //获取问卷数据
  getSurveyList(param) {
    return http.get("/edo/surveys/questions", param);
  },
  //提交问卷
  submitSurvey(param) {
    return http.post("/edo/surveys/submit", param);
  },
});

export default (http) => ({
    /**
     * 启动多人协作流程（传入列表）
     * 原始接口：/edo/rw/start
     */
    startRWFlow(params) {
        return http.post(`/edo/rw/start?list=${params.list}`, params);
    }
});

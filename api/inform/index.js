export default (http) => ({
    /**
     * 获取所有系统通知消息
     * 原始接口：/edo/inform/MesAll
     */
    getAllMessages(params) {
        return http.post('/edo/inform/MesAll', params);
    },
    /**
     * 删除指定的消息（用于已读或清理）
     * 原始接口：/edo/inform/renewDel
     */
    deleteInformItem(params) {
        return http.post('/edo/inform/renewDel', params);
    },

    /**
     * 批量刷新或标记消息状态为已读
     * 原始接口：/edo/inform/renew
     */
    refreshInformStatus(params) {
        return http.post('/edo/inform/renew', params);
    },
    /**
     * 获取当前用户全部通知（带筛选条件）
     * 原始接口：/edo/inform/all
     */
    getAllInformList(params) {
        return http.post('/edo/inform/all', params);
    },
    /**
     * 获取平台公告列表（支持分页或筛选）
     * 原始接口：/edo/CNotice/get
     */
    getNoticeList(params) {
        return http.post('/edo/CNotice/get', params);
    },
    /**
     * 获取系统通知列表（可筛选、分页）
     * 原始接口：/edo/SystemInform/get
     */
    getSystemInformList(params) {
        return http.post('/edo/SystemInform/get', params);
    },

    /**
     * 删除指定系统通知
     * 原始接口：/edo/SystemInform/InformDel
     */
    deleteSystemInform(params) {
        return http.post('/edo/SystemInform/InformDel', params);
    }
});

export default (http) => ({
    /**
     * 购买会员服务
     * 原始接口：/edo/vip/buy
     */
    buyVip(params) {
        return http.post('/edo/vip/buy', params);
    },
    /**
     * 获取当前账号的权限信息（套餐/功能）
     * 原始接口：/edo/jurisdiction/get
     */
    getUserJurisdiction(params) {
        return http.post('/edo/jurisdiction/get', params);
    },

    /**
     * 发起权限类订单（如购买套餐、扩容等）
     * 原始接口：/edo/jurisdiction/order
     */
    createJurisdictionOrder(params) {
        return http.post('/edo/jurisdiction/order', params);
    },

    /**
     * 获取权限续费信息（如剩余天数、是否可续费等）
     * 原始接口：/edo/jurisdiction/getRenew
     */
    getJurisdictionRenewInfo(params) {
        return http.post('/edo/jurisdiction/getRenew', params);
    },
    /**
     * 获取当前权限下的数据库用量信息
     * 原始接口：/edo/jurisdiction/getDatabase
     */
    getDatabaseUsage(params) {
        return http.post('edo/jurisdiction/getDatabase', params);
    },

    /**
     * 获取权限已开放的功能列表
     * 原始接口：/edo/jurisdiction/getJOpenJurisdiction
     */
    getOpenedPermissions(params) {
        return http.post('edo/jurisdiction/getJOpenJurisdiction', params);
    },

    /**
     * 获取当前可添加子账号的人数上限
     * 原始接口：/edo/jurisdiction/people
     */
    getSubUserLimit(params) {
        return http.post('edo/jurisdiction/people', params);
    },
    /**
     * 验证支付记录是否合法/有效
     * 原始接口：/edo/payTable/verify
     */
    verifyPayRecord(params) {
        return http.post('/edo/payTable/verify', params);
    },

    /**
     * 获取可用付费条目（套餐项/功能项）
     * 原始接口：/edo/playItem/get
     */
    getPayItems(params) {
        return http.post('edo/playItem/get', params);
    }
});

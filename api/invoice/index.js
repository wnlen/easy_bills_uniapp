export default (http) => ({
    /**
     * 添加发票记录
     * 原始接口：/edo/invoice/add
     */
    addInvoice(params) {
        return http.post('/edo/invoice/add', params);
    }
});

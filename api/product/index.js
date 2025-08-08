// product.js
export default (http) => ({
    /**
     * 获取当前用户的全部商品列表
     * 原始接口：/edo/productAll/get
     */
    getAllProducts(params) {
        return http.post(`edo/productAll/get?phone=${params.phone}`, params);
    }
});

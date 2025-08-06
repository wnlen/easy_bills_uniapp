export default (http) => ({
	/**
	   * 获取当前用户签名信息
	   * 原始接口：/edo/signature/get
	   */
	  getSignature(params) {
	    return http.post('/edo/signature/get', params)
	  },
	
	  /**
	   * 合并签名（用于多方签署合并）
	   * 原始接口：/edo/signature/merge
	   */
	  mergeSignature(params) {
	    return http.post('/edo/signature/merge', params)
	  },
	
	  /**
	   * 添加签名记录
	   * 原始接口：/edo/signature/add
	   */
	  addSignature(params) {
	    return http.post('/edo/signature/add', params)
	  },
	  /**
	     * 删除签名记录（通过签名 ID）
	     * 原始接口：/edo/signature/del
	     */
	    deleteSignature(params) {
	      return http.post('/edo/signature/del', params)
	    },
});
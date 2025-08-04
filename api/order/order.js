export default (http) => ({
	getProductAll(param) {
		return http.post('/edo/productAll/get', param)
	},
	postOrderFilter(param) {
		return http.post('/edo/order/getFilter', param)
	},
	postOrderQuantity(param) {
		return http.post('/edo/order/Quantity', param)
	},
	getOrderDelList(param) {
		return http.post('edo/orderDel/get', param)
	}
});
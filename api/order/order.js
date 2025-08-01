export default (http) => ({
	getProductAll(data) {
		return http.post('/edo/productAll/get', data)
	},
	postOrderFilter(data) {
		return http.post('/edo/order/getFilter', data)
	},
	postOrderQuantity(data) {
		return http.post('/edo/order/Quantity', data)
	}
});
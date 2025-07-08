export default {
	getProductAll(data) {
		return uni.$u.post('/edo/productAll/get', data);
	},
	createOrder(data) {
		return uni.$u.post('/order/create', data);
	}
};
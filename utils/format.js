// common/format.js
export function formatAmount(num) {
	// 处理非数字情况
	if (isNaN(Number(num))) {
		return "0.00";
	}

	// 将数字转换为浮点数并保留两位小数
	let number = parseFloat(num);
	let fixedNum = number.toFixed(2); // 确保保留两位小数

	// 分离整数部分和小数部分
	let parts = fixedNum.split('.');
	let integerPart = parts[0];
	let decimalPart = parts[1];

	// 处理负数
	let sign = '';
	if (integerPart.startsWith('-')) {
		sign = '-';
		integerPart = integerPart.slice(1);
	}

	// 整数部分添加千分位分隔符
	let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

	// 拼接结果
	return sign + formattedInteger + '.' + decimalPart;
}

export function previewImageAll(urlList, indicator) {
	// 预览图片
	uni.previewImage({
		urls: urlList,
		indicator: indicator //"default" - 底部圆点指示器； "number" - 顶部数字指示器； "none" - 不显示指示器。仅支持app
	});
}
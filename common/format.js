// common/format.js
export function formatAmount(num) {
	// if (isNaN(value)) return '0.00';
	// return (
	// 	'' +
	// 	Number(value).toLocaleString('en-US', {
	// 		minimumFractionDigits: 2,
	// 		maximumFractionDigits: 2
	// 	})
	// );
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
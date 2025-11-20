// utils/big.js
import Decimal from 'decimal.js'
// 加
export function addDecimal(a, b) {
	return new Decimal(a).plus(b).toNumber()
}
// 减
export function subtract(a, b) {
	return new Decimal(a).minus(b).toNumber()
}
// 乘
export function multiply(a, b) {
	return new Decimal(a).times(b).toNumber()
}
// 除
export function divide(a, b) {
	return new Decimal(a).div(b).toNumber()
}

export default {
	addDecimal,
	subtract,
	multiply,
	divide
}
// utils/big.js
import Decimal from 'decimal.js'

export const add = (a, b) => new Decimal(a).plus(b).toNumber()
export const sub = (a, b) => new Decimal(a).minus(b).toNumber()
export const mul = (a, b) => new Decimal(a).times(b).toNumber()
export const div = (a, b) => new Decimal(a).div(b).toNumber()
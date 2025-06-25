import { BigNumber } from 'bignumber.js'

/**
 * Cleans numeric string by removing thousand separators
 * @param amount - The amount to clean (string or number)
 */
export function cleanAmount(amount) {
  if (typeof amount === 'number') return amount.toString()
  return amount.replace(/,/g, '')
}

/**
 * Convert token amount to USD
 * @param {string|number} tokenAmount - The amount of tokens
 * @param {string|number} tokenPrice - The price of one token in USD
 * @returns {BigNumber} - The equivalent amount in USD
 */
export function convertTokenAmountToUSD(tokenAmount, tokenPrice, maxDecimals = 4) {
  if (!tokenAmount || !tokenPrice) return ''
  try {
    const amount = new BigNumber(cleanAmount(tokenAmount))
    const price = new BigNumber(cleanAmount(tokenPrice))
    return amount.multipliedBy(price).decimalPlaces(maxDecimals).toString()
  } catch {
    return ''
  }
}

/**
 * Convert USD to token amount
 * @param {string|number} usdAmount - The amount in USD
 * @param {string|number} tokenPrice - The price of one token in USD
 * @param {number} maxDecimals - The maximum number of decimals
 * @returns {BigNumber} - The equivalent amount of tokens
 */
export function convertUSDToTokenAmount(usdAmount, tokenPrice, maxDecimals) {
  if (!usdAmount || !tokenPrice || !maxDecimals) return '0'
  const amount = new BigNumber(cleanAmount(usdAmount))
  const price = new BigNumber(cleanAmount(tokenPrice))
  return amount.dividedBy(price).decimalPlaces(maxDecimals).toString()
}

export const calculateTotal24hChange = (tokensWithBalance, totalUSDAmount) => {
  let weightedChangeSum = 0
  for (const token of tokensWithBalance) {
    const tokenBalance = parseFloat(token.balance)
    const tokenValueUSD = tokenBalance * token.usdPrice
    const weightedChange = (tokenValueUSD / Number(totalUSDAmount)) * token.price24hChange
    weightedChangeSum += weightedChange
  }
  return weightedChangeSum
}

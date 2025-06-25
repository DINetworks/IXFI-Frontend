/* eslint-disable prefer-const */
import take from 'lodash/take'
import takeWhile from 'lodash/takeWhile'
import { formatUnits, parseUnits } from 'viem'
import { DEFAULT_LOCALE } from '../../core/constants'

// =====================================================
// NOTE: We wrap viem utility method here
// So that in the future we can change the implementation
// if we want to use something else than viem formatters
// =====================================================
/**
 * Parses a value to a bigint
 * @param value - The value to parse
 * @param decimals - The number of decimals
 * @returns The parsed bigint
 * @throws Error if parsing fails
 */
export const parseToBigInt = (value, decimals = 18) => {
  try {
    return parseUnits(value.toString(), decimals)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to parse value to BigInt: ${errorMessage}`)
  }
}

/**
 * Formats a value to a readable string
 * @param value - The value to format (bigint or string)
 * @param decimals - The number of decimals
 * @returns The formatted string
 * @throws Error if formatting fails
 */
export const formatBNToReadable = (value, decimals = 18) => {
  try {
    return formatUnits(BigInt(value), decimals)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to format value: ${errorMessage}`)
  }
}

export const roundNumericValue = (value = '0', precision = 2, useComaEvery3Digits = true, significantFigures = 0) => {
  let newValue = value
  const temp = newValue?.toString() ?? ''
  let [integers, decimals] = temp.split('.')
  // toLocaleString is supported on all modern browsers
  // We might monitor and have a polyfill if some people are not
  // Seeing the comas.
  if (useComaEvery3Digits && integers !== '0') {
    integers = parseInt(integers, 10).toLocaleString(DEFAULT_LOCALE).toString()
  }
  if (significantFigures && decimals) {
    const zeros = takeWhile(decimals?.toString(), c => c === '0').length
    return `${integers}.${take(decimals, zeros + significantFigures).join('')}`
  }
  return decimals ? `${integers}.${take(decimals, precision).join('')}` : integers
}

export function formatUnitsRounded(value, decimals, maxDecimalDigits) {
  const dc = decimals ?? 0
  try {
    const formatted = formatBNToReadable(BigInt(value), Number(dc))
    const [integerPart, fractionalPart] = formatted.split('.')
    if (fractionalPart && maxDecimalDigits !== undefined) {
      const roundedFractional =
        Math.round(Number(`0.${fractionalPart}`) * Math.pow(10, maxDecimalDigits)) / Math.pow(10, maxDecimalDigits)
      return (Number(integerPart) + roundedFractional).toFixed(maxDecimalDigits)
    }
    return formatted
  } catch (e) {
    return value
  }
}

const MAX_TOKEN_DECIMALS = 8
const TOKEN_EXACT_AMOUNT_FORMATTER = new Intl.NumberFormat(DEFAULT_LOCALE, {
  minimumFractionDigits: 0,
  maximumFractionDigits: MAX_TOKEN_DECIMALS
})

const TOKEN_ROUNDED_AMOUNT_FORMATTER = new Intl.NumberFormat(DEFAULT_LOCALE, {
  minimumFractionDigits: 0,
  maximumFractionDigits: MAX_TOKEN_DECIMALS,
  minimumSignificantDigits: 2,
  maximumSignificantDigits: 4
})

const TOKEN_SIMPLIFIED_AMOUNT_FORMATTER = new Intl.NumberFormat(DEFAULT_LOCALE, {
  maximumSignificantDigits: 2
})

export function formatTokenAmount(amount, { exact = true, simplified = false } = {}) {
  const numericAmount = parseFloat(amount || '0')
  if (numericAmount <= 0) {
    return '0'
  }

  // Check if numericAmount is less than the smallest displayable amount
  if (numericAmount < Math.pow(10, -MAX_TOKEN_DECIMALS)) {
    return `<${Math.pow(10, -MAX_TOKEN_DECIMALS).toFixed(MAX_TOKEN_DECIMALS)}`
  }

  if (simplified) {
    return TOKEN_SIMPLIFIED_AMOUNT_FORMATTER.format(numericAmount)
  }

  if (exact) {
    return TOKEN_EXACT_AMOUNT_FORMATTER.format(numericAmount)
  }

  return TOKEN_ROUNDED_AMOUNT_FORMATTER.format(numericAmount)
}

// For values below 100,000, use exact integer precision
// e.g 1,234.56, 98,765.43
const STANDARD_USD_INTL_FORMATTER = new Intl.NumberFormat(DEFAULT_LOCALE, {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

// For values above 100,000, use compact notation
// e.g $12,34K, $98,765.43M
const COMPACT_USD_INTL_FORMATTER = new Intl.NumberFormat(DEFAULT_LOCALE, {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  compactDisplay: 'short',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

// For small amounts where decimal precision is important
// e.g $0.00045, $1,231.3209, $57.00002
const PRECISE_USD_INTL_FORMATTER = new Intl.NumberFormat(DEFAULT_LOCALE, {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 5
})

const DECIMAL_PRECISION_THRESHOLD = 1

export function formatUsdAmount(amount = '0', { includeSign = true, decimalPrecision = false } = {}) {
  const parsedAmount = Number(amount)
  if (parsedAmount < 0.01 && parsedAmount > 0 && !decimalPrecision) {
    return includeSign ? '<$0.01' : '<0.01'
  }

  // Handle amounts 100,000 or above using compact notation
  if (parsedAmount >= 100_000) {
    return COMPACT_USD_INTL_FORMATTER.format(parsedAmount).replace(/^\$/, includeSign ? '$' : '')
  }

  // Handle small amounts with decimal precision
  // We don't care about decimal precision for big amounts
  if (decimalPrecision && parsedAmount < DECIMAL_PRECISION_THRESHOLD) {
    return PRECISE_USD_INTL_FORMATTER.format(parsedAmount).replace(/^\$/, includeSign ? '$' : '')
  }

  // Handle amounts less than 100,000 with exact integer precision
  return STANDARD_USD_INTL_FORMATTER.format(parsedAmount).replace(/^\$/, includeSign ? '$' : '')
}

export function trimExtraDecimals(value, maxDecimals) {
  const [integerPart, decimalPart] = value.split('.')
  // Return just the integer part if maxDecimals is zero
  if (maxDecimals === 0) {
    return integerPart
  }

  // Process decimals if present and maxDecimals is not zero
  if (decimalPart && maxDecimals !== undefined && decimalPart.length > maxDecimals) {
    return `${integerPart}.${decimalPart.slice(0, maxDecimals)}`
  }

  // Return the original value if there are no excess decimals or maxDecimals is undefined
  return value
}

export const getNumericValue = ({
  value,
  precision,
  useComaEvery3Digits = true,
  hideIfZero = false,
  currency,
  significantFigures,
  formatIfVerySmall,
  wrapInParens = false,
  isNegative = false
}) => {
  const roundedValue =
    value !== undefined && value !== ''
      ? roundNumericValue(value, precision, useComaEvery3Digits, significantFigures)
      : undefined
  if (hideIfZero && (value === '0' || value === '0.0')) {
    return null
  }

  const isVerySmall = formatIfVerySmall !== undefined && +(value ?? '0') !== 0 && +(value ?? '0') < formatIfVerySmall
  const prefix = `${isVerySmall ? '<' : ''}${
    currency && currency.symbol && currency.symbolPosition === 'before' ? currency.symbol : ''
  }`

  const suffix = `${currency && currency.symbol && currency.symbolPosition === 'after' ? currency.symbol : ''}`
  const formattedIfVerySmall = roundedValue && isVerySmall ? formatIfVerySmall?.toString() : roundedValue
  const finalValue = `${isNegative ? '-' : ''}${prefix}${formattedIfVerySmall}${suffix ? ` ${suffix}` : ''}`

  return wrapInParens ? `(${finalValue})` : finalValue
}

import { id, keccak256 } from 'ethers'
import { NETWORK_INFO } from 'src/configs/protocol'
import { formatNumber } from './format'

export const ZOOM_LEVELS = {
  [100 /* LOWEST */]: {
    initialMin: 0.999,
    initialMax: 1.001,
    min: 1e-5,
    max: 1.5
  },
  [500 /* LOW */]: {
    initialMin: 0.8,
    initialMax: 1.2,
    min: 1e-5,
    max: 20
  },
  [2500 /* MIDDLE */]: {
    initialMin: 0.3,
    initialMax: 1.8,
    min: 1e-5,
    max: 20
  },
  [3e3 /* MEDIUM */]: {
    initialMin: 0.3,
    initialMax: 1.8,
    min: 1e-5,
    max: 20
  },
  [1e4 /* HIGH */]: {
    initialMin: 0.1,
    initialMax: 2,
    min: 1e-5,
    max: 20
  }
}

export const chainIdToChain = {
  1: 'ethereum',
  137: 'polygon',
  56: 'bsc',
  42161: 'arbitrum',
  43114: 'avalanche',
  8453: 'base',
  81457: 'blast',
  250: 'fantom',
  5e3: 'mantle',
  10: 'optimism',
  534352: 'scroll',
  59144: 'linea',
  1101: 'polygon-zkevm',
  324: 'zksync'
}

export const DEFAULT_PRICE_RANGE = {
  LOW_POOL_FEE: 0.01,
  MEDIUM_POOL_FEE: 0.05,
  HIGH_POOL_FEE: 0.2
}

export const FULL_PRICE_RANGE = 'Full Range'

export const PRICE_RANGE = {
  LOW_POOL_FEE: [FULL_PRICE_RANGE, 0.01, 5e-3, 1e-3],
  MEDIUM_POOL_FEE: [FULL_PRICE_RANGE, 0.1, 0.05, 0.01],
  HIGH_POOL_FEE: [FULL_PRICE_RANGE, 0.3, 0.2, 0.1]
}

export const ERROR_MESSAGE = {
  CONNECT_WALLET: 'Connect wallet',
  WRONG_NETWORK: 'Switch network',
  SELECT_TOKEN_IN: 'Select token in',
  ENTER_MIN_PRICE: 'Enter min price',
  ENTER_MAX_PRICE: 'Enter max price',
  INVALID_PRICE_RANGE: 'Invalid price range',
  ENTER_AMOUNT: 'Enter amount for',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  INVALID_INPUT_AMOUNT: 'Invalid input amount'
}

export const PositionStatus = {
  IN_RANGE: 'IN_RANGE',
  OUT_RANGE: 'OUT_RANGE'
}

export const PRICE_FIXED_DIGITS = 8

const subscriptMap = {
  0: '\u2080',
  1: '\u2081',
  2: '\u2082',
  3: '\u2083',
  4: '\u2084',
  5: '\u2085',
  6: '\u2086',
  7: '\u2087',
  8: '\u2088',
  9: '\u2089'
}

export const formatDisplayNumber = (value, options) => {
  const { style = 'decimal', fallback = '--' } = options || {}
  const significantDigits = style === 'decimal' ? options?.significantDigits || 6 : options?.significantDigits
  const fractionDigits = style === 'currency' ? options?.fractionDigits || 2 : options?.fractionDigits
  const currency = style === 'currency' ? '$' : ''
  const percent = style === 'percent' ? '%' : ''
  const fallbackResult = `${currency}${fallback}${percent}`
  const v = Number(value?.toString())
  if (value === void 0 || value === null || Number.isNaN(value)) return fallbackResult
  if (v < 1) {
    const decimal = value.toString().split('.')[1] || '0'
    const numberOfLeadingZeros = -Math.floor(Math.log10(v) + 1)

    const slicedDecimal = decimal
      .replace(/^0+/, '')
      .slice(0, significantDigits ? significantDigits : 30)
      .slice(0, fractionDigits ? fractionDigits : 30)
      .replace(/0+$/, '')
    if (numberOfLeadingZeros > 3) {
      const subscripts = numberOfLeadingZeros
        .toString()
        .split('')
        .map(item => subscriptMap[item])
        .join('')
      return `${currency}0.0${subscripts}${slicedDecimal}${percent}`
    }
    return `${currency}0${slicedDecimal.length ? '.' + '0'.repeat(numberOfLeadingZeros) + slicedDecimal : ''}${percent}`
  }

  const formatter = Intl.NumberFormat('en-US', {
    notation: v >= 1e7 ? 'compact' : 'standard',
    style,
    currency: 'USD',
    minimumFractionDigits: fractionDigits ? 0 : void 0,
    maximumFractionDigits: fractionDigits,
    minimumSignificantDigits: significantDigits,
    maximumSignificantDigits: significantDigits
  })
  return formatter.format(v)
}

export function formatUnits2(value, decimals = 18) {
  const factor = BigInt(10) ** BigInt(decimals)
  const wholePart = BigInt(value) / factor
  const fractionalPart = BigInt(value) % factor
  const fractionalStr = fractionalPart.toString().padStart(Number(decimals), '0')
  const formattedFractionalStr = fractionalStr.replace(/0+$/, '')
  if (formattedFractionalStr === '') {
    return wholePart.toString()
  }
  return `${wholePart.toString()}.${formattedFractionalStr}`
}

export const formatWei = (value, decimals) => {
  if (value && decimals) return formatNumber(+formatUnits2(value, decimals).toString())
  return '--'
}

// ../utils/src/uniswapv3.ts
export const MaxUint256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

export const MIN_TICK = -887272

export const MAX_TICK = -MIN_TICK

export const MIN_SQRT_RATIO = 4295128739n

export const MAX_SQRT_RATIO = 1461446703485210103287273052203988822378723970342n

export const Q96 = 2n ** 96n

export const Q32 = 2n ** 32n

export const Q192 = Q96 ** 2n

export function mulShift(val, mulBy) {
  return (val * BigInt(mulBy)) >> 128n
}

export function getSqrtRatioAtTick(tick2) {
  if (tick2 < MIN_TICK || tick2 > MAX_TICK || !Number.isInteger(tick2)) {
    throw new Error(`TICK ${tick2}: must be within bounds MIN_TICK and MAX_TICK`)
  }
  const absTick = tick2 < 0 ? tick2 * -1 : tick2

  let ratio =
    (absTick & 1) != 0 ? BigInt('0xfffcb933bd6fad37aa2d162d1a594001') : BigInt('0x100000000000000000000000000000000')
  if ((absTick & 2) != 0) ratio = mulShift(ratio, '0xfff97272373d413259a46990580e213a')
  if ((absTick & 4) != 0) ratio = mulShift(ratio, '0xfff2e50f5f656932ef12357cf3c7fdcc')
  if ((absTick & 8) != 0) ratio = mulShift(ratio, '0xffe5caca7e10e4e61c3624eaa0941cd0')
  if ((absTick & 16) != 0) ratio = mulShift(ratio, '0xffcb9843d60f6159c9db58835c926644')
  if ((absTick & 32) != 0) ratio = mulShift(ratio, '0xff973b41fa98c081472e6896dfb254c0')
  if ((absTick & 64) != 0) ratio = mulShift(ratio, '0xff2ea16466c96a3843ec78b326b52861')
  if ((absTick & 128) != 0) ratio = mulShift(ratio, '0xfe5dee046a99a2a811c461f1969c3053')
  if ((absTick & 256) != 0) ratio = mulShift(ratio, '0xfcbe86c7900a88aedcffc83b479aa3a4')
  if ((absTick & 512) != 0) ratio = mulShift(ratio, '0xf987a7253ac413176f2b074cf7815e54')
  if ((absTick & 1024) != 0) ratio = mulShift(ratio, '0xf3392b0822b70005940c7a398e4b70f3')
  if ((absTick & 2048) != 0) ratio = mulShift(ratio, '0xe7159475a2c29b7443b29c7fa6e889d9')
  if ((absTick & 4096) != 0) ratio = mulShift(ratio, '0xd097f3bdfd2022b8845ad8f792aa5825')
  if ((absTick & 8192) != 0) ratio = mulShift(ratio, '0xa9f746462d870fdf8a65dc1f90e061e5')
  if ((absTick & 16384) != 0) ratio = mulShift(ratio, '0x70d869a156d2a1b890bb3df62baf32f7')
  if ((absTick & 32768) != 0) ratio = mulShift(ratio, '0x31be135f97d08fd981231505542fcfa6')
  if ((absTick & 65536) != 0) ratio = mulShift(ratio, '0x9aa508b5b7a84e1c677de54f3e99bc9')
  if ((absTick & 131072) != 0) ratio = mulShift(ratio, '0x5d6af8dedb81196699c329225ee604')
  if ((absTick & 262144) != 0) ratio = mulShift(ratio, '0x2216e584f5fa1ea926041bedfe98')
  if ((absTick & 524288) != 0) ratio = mulShift(ratio, '0x48a170391f7dc42444e8fa2')
  if (tick2 > 0) ratio = MaxUint256 / ratio
  return ratio % Q32 > 0n ? ratio / Q32 + 1n : ratio / Q32
}

const TWO = 2n

const POWERS_OF_2 = [128, 64, 32, 16, 8, 4, 2, 1].map(pow => [pow, TWO ** BigInt(pow)])

export function mostSignificantBit(x) {
  if (x <= 0) throw new Error('x must be greater than 0')
  if (x > MaxUint256) throw new Error('x must be less than MaxUint256')
  let msb = 0
  for (const [power, min] of POWERS_OF_2) {
    if (x >= min) {
      x = x >> BigInt(power)
      msb += power
    }
  }
  return msb
}

export function getTickAtSqrtRatio(sqrtRatioX96) {
  if (sqrtRatioX96 < MIN_SQRT_RATIO || sqrtRatioX96 > MAX_SQRT_RATIO) {
    throw new Error('SQRT_RATIO')
  }
  const sqrtRatioX128 = sqrtRatioX96 << 32n
  const msb = mostSignificantBit(sqrtRatioX128)
  let r
  if (BigInt(msb) >= 128n) {
    r = sqrtRatioX128 >> BigInt(msb - 127)
  } else {
    r = sqrtRatioX128 << BigInt(127 - msb)
  }
  let log_2 = (BigInt(msb) - 128n) << 64n
  for (let i = 0; i < 14; i++) {
    r = (r * r) >> 127n
    const f = r >> 128n
    log_2 = log_2 | (f << BigInt(63 - i))
    r = r >> f
  }
  const log_sqrt10001 = log_2 * 255738958999603826347141n

  const tickLow = Number((log_sqrt10001 - 3402992956809132418596140100660247210n) >> 128n)

  const tickHigh = Number((log_sqrt10001 + 291339464771989622907027621153398088495n) >> 128n)
  return tickLow === tickHigh ? tickLow : getSqrtRatioAtTick(tickHigh) <= sqrtRatioX96 ? tickHigh : tickLow
}

export function mulDivRoundingUp(a, b, denominator) {
  const product = a * b
  let result = product / denominator
  if (product % denominator !== 0n) result = result + 1n
  return result
}

export function getAmount0Delta(sqrtRatioAX96, sqrtRatioBX96, liquidity, roundUp) {
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    ;[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]
  }
  const numerator1 = liquidity << 96n
  const numerator2 = sqrtRatioBX96 - sqrtRatioAX96
  return roundUp
    ? mulDivRoundingUp(mulDivRoundingUp(numerator1, numerator2, sqrtRatioBX96), 1n, sqrtRatioAX96)
    : (numerator1 * numerator2) / sqrtRatioBX96 / sqrtRatioAX96
}

export function getToken0Amount(tickCurrent, tickLower, tickUpper, sqrtRatioX96, liquidity) {
  if (tickCurrent < tickLower) {
    return getAmount0Delta(getSqrtRatioAtTick(tickLower), getSqrtRatioAtTick(tickUpper), liquidity, false)
  }
  if (tickCurrent < tickUpper) {
    return getAmount0Delta(sqrtRatioX96, getSqrtRatioAtTick(tickUpper), liquidity, false)
  }
  return 0n
}

export function getAmount1Delta(sqrtRatioAX96, sqrtRatioBX96, liquidity, roundUp) {
  if (sqrtRatioAX96 > sqrtRatioBX96) {
    ;[sqrtRatioAX96, sqrtRatioBX96] = [sqrtRatioBX96, sqrtRatioAX96]
  }
  return roundUp
    ? mulDivRoundingUp(liquidity, sqrtRatioBX96 - sqrtRatioAX96, Q96)
    : (liquidity * (sqrtRatioBX96 - sqrtRatioAX96)) / Q96
}

export function getToken1Amount(tickCurrent, tickLower, tickUpper, sqrtRatioX96, liquidity) {
  if (tickCurrent < tickLower) {
    return 0n
  }
  if (tickCurrent < tickUpper) {
    return getAmount1Delta(getSqrtRatioAtTick(tickLower), sqrtRatioX96, liquidity, false)
  }
  return getAmount1Delta(getSqrtRatioAtTick(tickLower), getSqrtRatioAtTick(tickUpper), liquidity, false)
}

export function getPositionAmounts(tickCurrent, tickLower, tickUpper, sqrtRatioX96, liquidity) {
  return {
    amount0: getToken0Amount(tickCurrent, tickLower, tickUpper, sqrtRatioX96, liquidity),
    amount1: getToken1Amount(tickCurrent, tickLower, tickUpper, sqrtRatioX96, liquidity)
  }
}

export function decodePosition(rawData) {
  let hexData = rawData.slice(2)
  const nonce = decodeUint(hexData.slice(0, 64))
  const operator = decodeAddress(hexData.slice(64, 128))
  const token0 = decodeAddress(hexData.slice(128, 192))
  const token1 = decodeAddress(hexData.slice(192, 256))
  const fee = parseInt(hexData.slice(256, 320), 16)
  const tickLower = decodeInt24(hexData.slice(320, 384))
  const tickUpper = decodeInt24(hexData.slice(384, 448))
  const liquidity = decodeUint(hexData.slice(448, 512))
  const feeGrowthInside0LastX128 = decodeUint(hexData.slice(512, 576))
  const feeGrowthInside1LastX128 = decodeUint(hexData.slice(576, 640))
  const tokensOwed0 = decodeUint(hexData.slice(640, 704))
  const tokensOwed1 = decodeUint(hexData.slice(704, 768))
  return {
    nonce,
    operator,
    token0,
    token1,
    fee,
    tickLower,
    tickUpper,
    liquidity,
    feeGrowthInside0LastX128,
    feeGrowthInside1LastX128,
    tokensOwed0,
    tokensOwed1
  }
}

export function tickToPrice(tick2, baseDecimal, quoteDecimal, revert = false) {
  const sqrtRatioX96 = getSqrtRatioAtTick(tick2)
  const ratioX192 = sqrtRatioX96 * sqrtRatioX96
  const numerator = ratioX192 * 10n ** BigInt(baseDecimal)
  const denominator = Q192 * 10n ** BigInt(quoteDecimal)
  return revert ? divideBigIntToString(denominator, numerator, 18) : divideBigIntToString(numerator, denominator, 18)
}

export function sqrt(y) {
  if (y < 0n) {
    throw new Error('sqrt: negative value')
  }
  let z3 = 0n
  let x
  if (y > 3n) {
    z3 = y
    x = y / 2n + 1n
    while (x < z3) {
      z3 = x
      x = (y / x + x) / 2n
    }
  } else if (y !== 0n) {
    z3 = 1n
  }
  return z3
}

export function encodeSqrtRatioX96(amount1, amount0) {
  const numerator = BigInt(amount1) << 192n
  const denominator = BigInt(amount0)
  const ratioX192 = numerator / denominator
  return sqrt(ratioX192)
}

export function priceToClosestTick(value, token0Decimal, token1Decimal, revert = false) {
  if (!value.match(/^\d*\.?\d+$/)) {
    return void 0
  }
  const [whole, fraction] = value.split('.')
  const decimals = fraction?.length ?? 0
  const withoutDecimals = BigInt((whole ?? '') + (fraction ?? ''))
  const denominator = BigInt(10 ** decimals) * 10n ** BigInt(revert ? token1Decimal : token0Decimal)
  const numerator = withoutDecimals * 10n ** BigInt(revert ? token0Decimal : token1Decimal)
  const sqrtRatioX96 = !revert ? encodeSqrtRatioX96(numerator, denominator) : encodeSqrtRatioX96(denominator, numerator)
  let tick2 = getTickAtSqrtRatio(sqrtRatioX96)

  const nextTickPrice = tickToPrice(tick2 + 1, token0Decimal, token1Decimal, revert)
  if (!revert) {
    if (+value >= +nextTickPrice) {
      tick2++
    }
  } else if (+value <= +nextTickPrice) {
    tick2++
  }
  return tick2
}

export function nearestUsableTick(tick2, tickSpacing) {
  if (!Number.isInteger(tick2) || !Number.isInteger(tickSpacing)) throw new Error('INTEGERS')
  if (tickSpacing <= 0) throw new Error('TICK_SPACING')
  if (tick2 < MIN_TICK || tick2 > MAX_TICK) throw new Error('TICK_BOUND')
  const rounded = Math.round(tick2 / tickSpacing) * tickSpacing
  if (rounded < MIN_TICK) return rounded + tickSpacing
  if (rounded > MAX_TICK) return rounded - tickSpacing
  return rounded
}

export function divideBigIntToString(numerator, denominator, decimalPlaces) {
  const integerPart = numerator / denominator
  let remainder = numerator % denominator
  let decimalStr = ''
  for (let i = 0; i < decimalPlaces; i++) {
    remainder *= 10n
    const digit = remainder / denominator
    decimalStr += digit.toString()
    remainder %= denominator
  }
  return `${integerPart.toString()}.${decimalStr}`
}

export function toString(x) {
  if (Math.abs(x) < 1) {
    const e = parseInt(x.toString().split('e-')[1])
    if (e) {
      x *= Math.pow(10, e - 1)
      return x.toString().split('.')[0] + '.' + '0'.repeat(e - 1) + x.toString().split('.')[1]
    }
  } else {
    let e = parseInt(x.toString().split('+')[1])
    if (e > 20) {
      e -= 20
      x /= Math.pow(10, e)
      return x.toString() + '0'.repeat(e)
    }
  }
  return x.toString()
}

export function toRawString(amountInWei, decimals) {
  if (!amountInWei) {
    return '0'
  }

  if (typeof amountInWei !== 'bigint') {
    amountInWei = BigInt(amountInWei)
  }
  const factor = BigInt(10 ** decimals)
  const wholePart = amountInWei / factor
  const fractionalPart = amountInWei % factor
  const wholeStr = wholePart.toString()
  let fractionalStr = fractionalPart.toString().padStart(decimals, '0')
  fractionalStr = fractionalStr.replace(/0+$/, '')
  return fractionalStr ? `${wholeStr}.${fractionalStr}` : wholeStr
}

export function calculateGasMargin(value) {
  const defaultGasLimitMargin = 20000n
  const gasMargin = (value * 5000n) / 10000n
  return '0x' + (gasMargin < defaultGasLimitMargin ? value + defaultGasLimitMargin : value + gasMargin).toString(16)
}

export function parseUnits(value, decimals) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new Error('Value must be a string or number')
  }
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new Error('Decimals must be a non-negative integer')
  }
  value = value.toString()
  const parts = value.split('.')
  const integerPart = parts[0]
  let fractionalPart = parts[1] || ''
  fractionalPart = fractionalPart.slice(0, decimals)
  const normalizedFractional = fractionalPart.padEnd(decimals, '0')
  const fullValue = integerPart + normalizedFractional
  return fullValue.replace(/^0+(?=\d)|^$/, '0')
}

export const formatUnits = (value, decimals = 18) => {
  if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'bigint') {
    throw new Error('Value must be a string, number, or bigint')
  }

  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new Error('Decimals must be a non-negative integer')
  }

  const raw = BigInt(value).toString()

  // Pad with leading zeros if value is shorter than decimals
  if (raw.length <= decimals) {
    const padded = raw.padStart(decimals + 1, '0')
    const integerPart = '0'
    const fractionalPart = padded.slice(-decimals).replace(/0+$/, '')
    return fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart
  }

  const integerPart = raw.slice(0, -decimals)
  const fractionalPart = raw.slice(-decimals).replace(/0+$/, '')

  return fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart
}

export const countDecimals = value => {
  if (Math.floor(+value) === +value) return 0
  return value.toString().split('.')[1].length || 0
}

export function getEtherscanLink(chainId2, data, type) {
  const prefix = NETWORK_INFO[chainId2].scanLink
  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      if (chainId2 === 324 /* ZkSync */) return `${prefix}/address/${data}`
      return `${prefix}/token/${data}`
    }
    case 'block': {
      return `${prefix}/block/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

export function getFunctionSelector(signature) {
  const hash = id(signature)
  return hash.slice(2, 10)
}

var truncateFloatNumber = (num, maximumFractionDigits = 6) => {
  const [wholePart, fractionalPart] = String(num).split('.')
  if (!fractionalPart) {
    return wholePart
  }
  return `${wholePart}.${fractionalPart.slice(0, maximumFractionDigits)}`
}

var reverseValue = value => (!value ? void 0 : value === '0' ? '1' : '0')

var toK = num => {
  return (0, import_numeral.default)(num).format('0.[00]a')
}

var formatDollarFractionAmount = (num, digits) => {
  const formatter = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })
  return formatter.format(num)
}

const formatLongNumber = (num, usd) => {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })

  return usd ? `$${formatter.format(num)}` : formatter.format(num)
}

const formattedNum = (number, usd = false, fractionDigits = 5) => {
  if (number === 0 || number === '' || number === void 0) {
    return usd ? '$0' : '0'
  }
  const num = parseFloat(String(number))
  if (num > 5e8) {
    return (usd ? '$' : '') + toK(num.toFixed(0))
  }
  if (num >= 1e3) {
    return usd ? formatDollarFractionAmount(num, 0) : Number(num.toFixed(0)).toLocaleString()
  }
  if (num === 0) {
    if (usd) {
      return '$0'
    }
    return '0'
  }
  if (num < 1e-4) {
    return usd ? '< $0.0001' : '< 0.0001'
  }
  if (usd) {
    if (num < 0.1) {
      return formatDollarFractionAmount(num, 4)
    } else {
      return formatDollarFractionAmount(num, 2)
    }
  }
  return truncateFloatNumber(num, fractionDigits)
}

export const parseMarketTokenInfo = tokenInfo => {
  const NOT_AVAILABLE = '--'

  const listData = [
    {
      label: 'Price',
      value: tokenInfo?.price ? formattedNum(tokenInfo.price.toString(), true) : NOT_AVAILABLE
    },
    {
      label: 'Market Cap Rank',
      value: tokenInfo?.marketCapRank ? `#${formattedNum(tokenInfo.marketCapRank.toString())}` : NOT_AVAILABLE
    },
    {
      label: 'Trading Volume (24H)',
      value: tokenInfo?.tradingVolume ? formatLongNumber(tokenInfo.tradingVolume.toString(), true) : NOT_AVAILABLE
    },
    {
      label: 'Market Cap',
      value: tokenInfo?.marketCap ? formatLongNumber(tokenInfo.marketCap.toString(), true) : NOT_AVAILABLE
    },
    {
      label: 'All-Time High',
      value: tokenInfo?.allTimeHigh ? formattedNum(tokenInfo.allTimeHigh.toString(), true) : NOT_AVAILABLE
    },
    {
      label: 'All-Time Low',
      value: tokenInfo?.allTimeLow ? formattedNum(tokenInfo.allTimeLow.toString(), true) : NOT_AVAILABLE
    },
    {
      label: 'Circulating Supply',
      value: tokenInfo?.circulatingSupply ? formatLongNumber(tokenInfo.circulatingSupply.toString()) : NOT_AVAILABLE
    },
    {
      label: 'Total Supply',
      value: tokenInfo?.totalSupply ? formatLongNumber(tokenInfo.totalSupply.toString()) : NOT_AVAILABLE
    }
  ]
  return listData
}

export const RISKY_THRESHOLD = {
  RISKY: 0.05,
  WARNING: 0.01
}

export const isItemRisky = ({ value, isNumber, riskyReverse }) => {
  const isRisky =
    (!isNumber && value === '0') || (isNumber && (Number(value) >= RISKY_THRESHOLD.WARNING || value === ''))
  return value !== void 0 && (riskyReverse ? !isRisky : isRisky)
}

var calcTotalRiskFn = (total, item) => {
  if (isItemRisky(item)) {
    if (item.type === 0 /* RISKY */) total.totalRisk++
    else total.totalWarning++
  }
  return total
}

var calcTotalRisk = data => {
  return data.reduce(calcTotalRiskFn, {
    totalRisk: 0,
    totalWarning: 0
  })
}

export const getSecurityTokenInfo = data => {
  const contractData = [
    {
      label: `Open Source`,
      value: data?.is_open_source,
      type: 0 /* RISKY */
    },
    {
      label: `Proxy Contrac`,
      value: data?.is_proxy,
      type: 1 /* WARNING */,
      riskyReverse: true
    },
    {
      label: `Mint Function`,
      value: data?.is_mintable,
      type: 1 /* WARNING */,
      riskyReverse: true
    },
    {
      label: `Take Back Ownership`,
      value: data?.can_take_back_ownership,
      type: 0 /* RISKY */,
      riskyReverse: true
    },
    {
      label: `Can Change Balance`,
      value: data?.owner_change_balance,
      type: 0 /* RISKY */,
      riskyReverse: true
    },
    {
      label: `Self-destruc`,
      value: data?.selfdestruct,
      type: 0 /* RISKY */,
      riskyReverse: true
    },
    {
      label: `External Call`,
      value: data?.external_call,
      type: 0 /* RISKY */,
      riskyReverse: true
    },
    {
      label: `Gas Abuser`,
      value: data?.gas_abuse,
      type: 1 /* WARNING */,
      riskyReverse: true
    }
  ].filter(el => el.value !== void 0)

  const tradingData = [
    {
      label: `Buy Tax`,
      value: data?.buy_tax,
      type: 1 /* WARNING */,
      isNumber: true
    },
    {
      label: `Sell Tax`,
      value: data?.sell_tax,
      type: 1 /* WARNING */,
      isNumber: true
    },
    {
      label: `Modifiable Tax`,
      value: data?.slippage_modifiable,
      type: 1 /* WARNING */,
      riskyReverse: true
    },
    {
      label: `Honeypo`,
      value: data?.is_honeypot,
      type: 0 /* RISKY */,
      riskyReverse: true
    },
    {
      label: `Can be bough`,
      value: reverseValue(data?.cannot_buy),
      type: 0 /* RISKY */
    },
    {
      label: `Can sell all`,
      value: reverseValue(data?.cannot_sell_all),
      type: 0 /* RISKY */
    },
    {
      label: `Blacklisted Function`,
      value: data?.is_blacklisted,
      type: 1 /* WARNING */,
      riskyReverse: true
    },
    {
      label: `Whitelisted Function`,
      value: data?.is_whitelisted,
      type: 1 /* WARNING */,
      riskyReverse: true
    },
    {
      label: `Anti Whale`,
      value: data?.is_anti_whale,
      type: 1 /* WARNING */,
      riskyReverse: true
    },
    {
      label: `Modifiable Anti Whale`,
      value: data?.anti_whale_modifiable,
      type: 1 /* WARNING */,
      riskyReverse: true
    }
  ].filter(el => el.value !== void 0)

  const { totalRisk: totalRiskContract, totalWarning: totalWarningContract } = calcTotalRisk(contractData)
  const { totalRisk: totalRiskTrading, totalWarning: totalWarningTrading } = calcTotalRisk(tradingData)

  return {
    contractData,
    tradingData,
    totalRiskContract,
    totalWarningContract,
    totalWarningTrading,
    totalRiskTrading
  }
}

export const getPriceImpact = (pi, type, suggestedSlippage) => {
  if (pi === null || pi === void 0 || isNaN(pi))
    return {
      msg: `Unable to calculate ${type}`,
      level: 'INVALID' /* INVALID */,
      display: '--'
    }
  const piDisplay = pi < 0.01 ? '<0.01%' : pi.toFixed(2) + '%'
  const warningThreshold = (2 * suggestedSlippage * 100) / 1e4

  if (pi > 2 * warningThreshold) {
    return {
      msg:
        type === 'Swap Price Impact'
          ? 'The price impact for this swap is higher than usual, which may affect trade outcomes.'
          : "Overall zap price impact is higher than expected. Click 'Zap Anyway' if you wish to proceed in Degen Mode.",
      level: type === 'Swap Price Impact' ? 'HIGH' /* HIGH */ : 'VERY_HIGH' /* VERY_HIGH */,
      display: piDisplay
    }
  }

  if (pi > warningThreshold) {
    return {
      msg:
        type === 'Swap Price Impact'
          ? 'The price impact for this swap is higher than usual, which may affect trade outcomes.'
          : 'Overall zap price impact is higher than expected.',
      level: 'HIGH' /* HIGH */,
      display: piDisplay
    }
  }

  return {
    msg: '',
    level: 'NORMAL' /* NORMAL */,
    display: piDisplay
  }
}

export async function isTransactionSuccessful(rpcUrl, txHash) {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_getTransactionReceipt',
      params: [txHash],
      id: 1
    })
  })
  const result = await response.json()
  if (!result.result) {
    console.log('Transaction not mined yet or invalid transaction hash.')
    return false
  }
  return {
    status: result.result.status === '0x1'
  }
}

export async function getCurrentGasPrice(rpcUrl) {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_gasPrice',
      params: [],
      id: 1
    })
  })
  const result = await response.json()
  if (result.error) {
    throw new Error(result.error.message)
  }
  return parseInt(result.result, 16)
}

export async function estimateGas(rpcUrl, { from, to, value = '0x0', data = '0x' }) {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_estimateGas',
      params: [
        {
          from,
          to,
          value,
          // Optional if no ETH transfer
          data
          // Optional if no function call
        }
      ],
      id: 1
    })
  })
  const result = await response.json()
  if (result.error) {
    throw new Error(result.error.message)
  }
  return BigInt(result.result)
}

var rejectedPhrases = [
  'user rejected transaction',
  'User declined to send the transaction',
  'user denied transaction',
  'you must accept'
].map(phrase => phrase.toLowerCase())

export function didUserReject(error) {
  const message = String(
    typeof error === 'string' ? error : error?.message || error?.code || error?.errorMessage || ''
  ).toLowerCase()
  return (
    [4001 /* USER_REJECTED_REQUEST */, 'ACTION_REJECTED' /* ACTION_REJECTED */, -32050 /* ALPHA_WALLET_REJECTED_CODE */]
      .map(String)
      .includes(error?.code?.toString?.()) ||
    [
      4001 /* USER_REJECTED_REQUEST */,
      'Request rejected' /* ALPHA_WALLET_REJECTED */,
      'Error: User closed modal' /* WALLETCONNECT_MODAL_CLOSED */,
      'The transaction was cancelled' /* WALLETCONNECT_CANCELED */,
      'Error: User closed modal' /* WALLETCONNECT_MODAL_CLOSED */
    ]
      .map(String)
      .includes(message) ||
    rejectedPhrases.some(phrase => message?.includes?.(phrase))
  )
}

function capitalizeFirstLetter(str) {
  const string = str || ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function parseKnownPattern(text) {
  const error = text?.toLowerCase?.() || ''
  if (!error || error.includes('router: expired')) return 'An error occurred. Refresh the page and try again '
  if (
    error.includes('mintotalamountout') ||
    error.includes('err_limit_out') ||
    error.includes('return amount is not enough') ||
    error.includes('code=call_exception') ||
    error.includes('none of the calls threw an error')
  )
    return `An error occurred. Try refreshing the price rate or increase max slippage`
  if (error.includes('header not found') || error.includes('swap failed'))
    return `An error occurred. Refresh the page and try again. If the issue still persists, it might be an issue with your RPC node settings in Metamask.`
  if (didUserReject(error)) return `User rejected the transaction.`
  if (error.includes('insufficient')) return `An error occurred. Please try increasing max slippage`
  if (error.includes('permit')) return `An error occurred. Invalid Permit Signature`
  if (error.includes('burn amount exceeds balance'))
    return `Insufficient fee rewards amount, try to remove your liquidity without claiming fees for now and you can try to claim it later`
  if (error === '[object Object]') return `Something went wrong. Please try again`
  return void 0
}

var patterns = [
  {
    pattern: /{"originalError":.+"message":"execution reverted: ([^"]+)"/,
    getMessage: match => match[1]
  },
  { pattern: /^([\w ]*\w+) \(.+?\)$/, getMessage: match => match[1] },
  { pattern: /"message": ?"[^"]+?"/, getMessage: match => match[1] }
]
function parseKnownRegexPattern(text) {
  const pattern = patterns.find(pattern2 => pattern2.pattern.exec(text))
  if (pattern) return capitalizeFirstLetter(pattern.getMessage(pattern.pattern.exec(text)))
  return void 0
}

export function friendlyError(error) {
  const message = typeof error === 'string' ? error : error.message
  const knownPattern = parseKnownPattern(message)
  if (knownPattern) return knownPattern
  if (message.length < 100) return message
  const knownRegexPattern = parseKnownRegexPattern(message)
  if (knownRegexPattern) return knownRegexPattern
  return `An error occurred`
}

export const truncateAddress = address => {
  if (!address) return 'No Account'

  const match = address.match(/^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/)
  if (!match) return address

  return `${match[1]}⋯${match[2]}`
}

export const toHex = num => {
  const val = Number(num)

  return '0x' + val.toString(16)
}

export const formatPercent = value => {
  return parseFloat(formatNumber(value) * 100).toFixed(2)
}

export const isOnlyNumber = value => {
  return /^-?\d*\.?\d*$/.test(value)
}

import { Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import { BetweenBox } from 'src/components/base/grid'

const SlippageWarning = ({ slippage, suggestedSlippage, className, showWarning = false }) => {
  const isTooHigh = slippage > 2 * suggestedSlippage
  const isTooLow = slippage < suggestedSlippage / 2
  const shouldWarn = showWarning && (isTooHigh || isTooLow)

  const warningText = !showWarning
    ? ''
    : isTooHigh
    ? 'Your slippage is set higher than usual, which may cause unexpected losses.'
    : isTooLow
    ? 'Your slippage is set lower than usual, increasing the risk of transaction failure.'
    : ''

  const slippagePercent = ((slippage * 100) / 1e4).toFixed(2)

  return (
    <BetweenBox className={`text-sm ${className}`}>
      <Tooltip title='Applied to each zap step. Setting a high slippage tolerance can help transactions succeed, but you may not get such a good price. Please use with caution!'>
        <Box
          className={`text-subText text-xs ${shouldWarn && 'text-warning border-warning'}`}
          sx={{ borderBottom: `1px dotted #ccc8` }}
        >
          Max Slippage
        </Box>
      </Tooltip>

      <Tooltip title={warningText}>
        <Box
          className={`font-medium text-xs ${shouldWarn ? 'text-warning' : 'text-text'}`}
          style={{
            borderBottom: shouldWarn ? '1px solid #ff990133' : ''
          }}
        >
          {slippagePercent}%
        </Box>
      </Tooltip>
    </BetweenBox>
  )
}

export default SlippageWarning

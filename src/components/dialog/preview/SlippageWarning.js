import { Box, Typography, Tooltip } from '@mui/material'

const SlippageWarning = ({ slippage, suggestedSlippage }) => {
  const warningCondition = slippage > 2 * suggestedSlippage || slippage < suggestedSlippage / 2

  const slippagePercent = ((slippage * 100) / 1e4).toFixed(2)

  const warningMessage =
    slippage > 2 * suggestedSlippage
      ? 'Your slippage is set higher than usual, which may cause unexpected losses.'
      : slippage < suggestedSlippage / 2
      ? 'Your slippage is set lower than usual, increasing the risk of transaction failure.'
      : ''

  return (
    <Box
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      mt={2}
      gap={4}
    >
      <Tooltip
        title='Applied to each zap step. Setting a high slippage tolerance can help transactions succeed, but you may not get such a good price. Please use with caution!'
        placement='top'
        arrow
      >
        <Typography
          variant='body2'
          sx={{
            color: warningCondition ? 'warning.main' : 'text.secondary',
            borderBottom: '1px dotted',
            borderColor: warningCondition ? 'warning.main' : 'text.secondary',
            cursor: 'default'
          }}
        >
          Max Slippage
        </Typography>
      </Tooltip>

      <Tooltip
        title={warningMessage}
        placement='top'
        arrow
      >
        <Typography
          variant='body2'
          fontWeight='medium'
          fontSize={14}
          sx={{
            color: warningCondition ? 'warning.main' : 'text.primary',
            borderBottom: warningCondition ? '1px dotted' : 'none',
            borderColor: 'warning.main',
            cursor: warningCondition ? 'default' : 'inherit'
          }}
        >
          {slippagePercent}%
        </Typography>
      </Tooltip>
    </Box>
  )
}

export default SlippageWarning

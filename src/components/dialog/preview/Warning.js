import { Box, Typography, useTheme } from '@mui/material'
import { useAddLiquidity } from 'src/hooks/useAddLiquidity'
import { useZapAction } from 'src/hooks/useZapAction'

const Warning = ({ slippage }) => {
  const theme = useTheme()

  const { zapInfo } = useAddLiquidity()
  const { piRes, swapPiRes } = useZapAction()

  const suggestedSlippage = zapInfo?.zapDetails.suggestedSlippage

  const piHigh = piRes.level === 'HIGH' || piRes.level === 'VERY_HIGH' || piRes.level === 'INVALID'

  return (
    <>
      {(slippage > 2 * suggestedSlippage || slippage < suggestedSlippage / 2) && (
        <Box
          mt={4}
          px={4}
          py={3}
          borderRadius={2}
          sx={{
            backgroundColor: `${theme.palette.warning.main}33`
          }}
        >
          <Typography
            variant='body2'
            fontSize={12}
            color='warning.main'
          >
            {slippage < suggestedSlippage / 2
              ? 'Your slippage is set lower than usual, increasing the risk of transaction failure.'
              : 'Your slippage is set higher than usual, which may cause unexpected losses.'}
          </Typography>
        </Box>
      )}

      {zapInfo && swapPiRes?.piRes?.level !== 'NORMAL' && (
        <Box
          mt={4}
          px={4}
          py={3}
          borderRadius={2}
          sx={{
            backgroundColor:
              swapPiRes.piRes.level === 'HIGH' ? `${theme.palette.warning.main}33` : `${theme.palette.error.main}33`
          }}
        >
          <Typography
            variant='body2'
            fontSize={12}
            color={swapPiRes.piRes.level === 'HIGH' ? 'warning.main' : 'error.main'}
          >
            {swapPiRes.piRes.msg}
          </Typography>
        </Box>
      )}

      {zapInfo && piRes?.level !== 'NORMAL' && (
        <Box
          mt={4}
          px={4}
          py={3}
          borderRadius={2}
          sx={{
            backgroundColor: piHigh ? `${theme.palette.warning.main}33` : `${theme.palette.error.main}33`
          }}
        >
          <Typography
            variant='body2'
            fontSize={12}
            color={piHigh ? 'warning.main' : 'error.main'}
          >
            {piRes.msg}
          </Typography>
        </Box>
      )}
    </>
  )
}

export default Warning

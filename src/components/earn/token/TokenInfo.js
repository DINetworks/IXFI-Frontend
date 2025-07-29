import { CenterBox } from 'src/components/base/grid'
import { useAddLiquidity } from 'src/hooks/useAddLiquidity'
import MarketInfo from './MarketInfo'
import SecurityInfo from './SecurityInfo'
import { Icon } from '@iconify/react'
import { Box, Typography } from '@mui/material'

const TokenInfo = ({ token, onGoBack }) => {
  const { chainId } = useAddLiquidity()
  return (
    <Box>
      <CenterBox
        gap={1}
        py={1}
        mb={2}
      >
        <Icon
          icon='tabler:arrow-left'
          fontSize='1.5rem'
          className='text-subText cursor-pointer hover:text-text'
          onClick={onGoBack}
        />

        <img
          className='earn-token'
          src={token.logoURI}
          alt='token-logo'
        />
        <Box>
          <Typography>{token.symbol || ''}</Typography>
          <Typography
            variant='body2'
            className='text-subText text-xs mt-1'
          >
            {token.name || ''}
          </Typography>
        </Box>
      </CenterBox>

      <MarketInfo
        chainId={chainId}
        token={token}
      />

      <SecurityInfo
        chainId={chainId}
        token={token}
      />
    </Box>
  )
}

export default TokenInfo

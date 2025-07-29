import { Icon } from '@iconify/react'
import { Box, Chip, Typography } from '@mui/material'
import { useAddLiquidity } from 'src/hooks/useAddLiquidity'
import { CenterBox } from 'src/components/base/grid'
import { truncateAddress } from 'src/wallet/utils'
import { CHAIN_LOGOS } from 'src/configs/constant'
import { DEX_INFO } from 'src/configs/protocol'

export default function PoolHeader() {
  const { chainId, ids, protocol, isLoadingInfo, pool, tickLower, tickUpper } = useAddLiquidity()
  const { token0, token1, swapFee, type } = pool || {}

  const isOutOfRange =
    pool?.type == 'v3' ? tickLower > pool.positionInfo.tick || pool.positionInfo.tick >= tickUpper : false

  return (
    !isLoadingInfo &&
    type != 'error' && (
      <CenterBox
        gap={2}
        sx={{ flexWrap: 'wrap' }}
      >
        <Box
          display='flex'
          alignItems='baseline'
        >
          <img
            src={token0?.logoURI}
            className='earn-token'
            alt='main-token'
          />
          <img
            src={token1?.logoURI}
            className='earn-token'
            style={{ marginLeft: '-8px' }}
            alt='pair-token'
          />
          <img
            src={CHAIN_LOGOS[chainId]}
            className='earn-chain'
            alt='chain-icon'
          />
        </Box>

        <Typography
          variant='h6'
          ml={2}
        >
          {token0?.symbol}/{token1?.symbol}
        </Typography>

        <Chip
          label={`${swapFee}%`}
          ml={4}
        />

        <Chip
          label={
            <Typography
              fontSize='1rem'
              color={'#00ff66'}
            >
              {truncateAddress(ids)}
            </Typography>
          }
          icon={
            <Icon
              icon='tabler:copy'
              fontSize='1.5rem'
              color='#00ff66'
            />
          }
          sx={{ px: 2.5 }}
          ml={4}
        />

        <CenterBox>
          <img
            src={DEX_INFO?.[protocol]?.icon}
            className='earn-token'
            alt={DEX_INFO?.[protocol]?.name}
          />
          <Typography ml={2}>{DEX_INFO?.[protocol]?.name}</Typography>
        </CenterBox>
      </CenterBox>
    )
  )
}

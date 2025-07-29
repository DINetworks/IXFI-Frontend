import { Icon } from '@iconify/react'
import { Box } from '@mui/material'
import { useMemo, useState } from 'react'
import CopyIcon from 'src/components/base/CopyIcon'
import { BetweenBox, CenterBox, FullCenterBox } from 'src/components/base/grid'
import Loader from 'src/components/base/Loader'
import useMarketTokenInfo from 'src/hooks/useMarketTokenInfo'
import { truncateAddress } from 'src/wallet/utils'
import { NATIVE_EVM_TOKEN_ADDRESS } from 'src/components/utils/uniswap'

const MarketInfo = ({ chainId, token }) => {
  const tokenAddress = useMemo(() => {
    if (!token?.address) return ''
    return (
      token.address.toLowerCase() === NATIVE_EVM_TOKEN_ADDRESS.toLowerCase()
        ? NetworkInfo[chainId].wrappedToken.address
        : token.address
    ).toLowerCase()
  }, [token, chainId])

  const { marketTokenInfo = [], loading } = useMarketTokenInfo(chainId, tokenAddress)
  const [expand, setExpand] = useState(false)

  const handleChangeExpand = () => setExpand(prev => !prev)

  return (
    <Box mb={2}>
      <BetweenBox
        className='text-text'
        px={4}
        py={2}
        style={{ background: `#a9a9a933` }}
      >
        <CenterBox gap={2}>
          <Icon
            icon='tabler:chart-line'
            fontSize='1rem'
          />
          <span>Market Info</span>
        </CenterBox>
        <CenterBox gap={1}>
          <span className='text-subText text-xs'>Powered by</span>
          <img
            src='/images/icons/coingecko.svg'
            alt='coingecko'
            style={{ width: 'auto', height: '1rem' }}
          />
        </CenterBox>
      </BetweenBox>

      <Box
        display='flex'
        flexDirection='column'
        gap={3}
        px={4}
        pt={2}
        className='transition-all ease-in-out duration-300 overflow-hidden'
        sx={{
          height: expand ? '100%' : '86px',
          background: '#111'
        }}
      >
        {marketTokenInfo?.map(item => (
          <BetweenBox
            className='text-xs'
            key={item.label}
          >
            <span className='text-subText'>{item.label}</span>
            <span>{loading ? <Loader className='animate-spin' /> : item.value}</span>
          </BetweenBox>
        ))}
      </Box>

      <Box
        display='flex'
        flexDirection='column'
        gap={3}
        px={4}
        py={2}
        sx={{
          background: '#111'
        }}
      >
        <BetweenBox className='text-xs'>
          <span className='text-subText'>Contract Address</span>
          <CenterBox gap={1}>
            {token ? (
              <>
                <img
                  className='earn-token small'
                  src={token.logoURI}
                  alt='token-logo'
                />
                <span>{truncateAddress(tokenAddress)}</span>
                <CopyIcon text={tokenAddress} />
              </>
            ) : (
              <Loader className='animate-spin' />
            )}
          </CenterBox>
        </BetweenBox>

        <FullCenterBox
          sx={{ background: '#111', cursor: 'pointer' }}
          className='text-xs text-accent'
          onClick={handleChangeExpand}
        >
          <span>{!expand ? 'View more' : 'View less'}</span>
          <Icon
            icon='tabler:chevron-down'
            className={`transition-all ease-in-out duration-300`}
            style={{ transform: expand ? 'rotate(-180deg)' : '' }}
          />
        </FullCenterBox>
      </Box>
    </Box>
  )
}

export default MarketInfo

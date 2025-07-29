import { Box, Typography } from '@mui/material'
import { useAddLiquidity, useZapAction } from 'src/hooks'
import { BetweenBox, CenterBox, FullCenterBox } from '../../base/grid'
import { Icon } from '@iconify/react'
import { formatDisplayNumber } from '../../utils/uniswap'
import { formatUnits } from 'viem'
import { useEffect } from 'react'

const ZapOutToken = () => {
  const { pool, openTokenSelectDialog } = useAddLiquidity()
  const { position, zapOutToken, setZapOutToken, zapOutPercent, zapOutDerivedInfo } = useZapAction()

  useEffect(() => {
    if (!zapOutToken) {
      setZapOutToken(position?.currentAmounts[1].token)
    }
  }, [zapOutToken, position?.currentAmounts, setZapOutToken])

  return (
    <Box>
      {pool?.type == 'v3' && (
        <>
          <Box
            px={4}
            py={3}
            border={'1px solid #fff3'}
            borderRadius={2}
            mb={2}
          >
            <Typography mb={2}>Removed position liquidity</Typography>
            <BetweenBox gap={4}>
              {position?.currentAmounts.map((cta, index) => (
                <BetweenBox
                  key={index}
                  mb={2}
                  flex={1}
                >
                  <CenterBox gap={1}>
                    <img
                      src={cta.token?.logo}
                      className='earn-token small'
                      alt='main-token'
                    />

                    <Typography variant='h6'>{cta.token?.symbol}</Typography>
                  </CenterBox>

                  <Box
                    display='flex'
                    flexDirection='column'
                    alignItems='flex-end'
                  >
                    <Typography
                      variant='body2'
                      color={'#fff'}
                    >
                      {formatDisplayNumber(
                        formatUnits(Math.floor((cta.balance * zapOutPercent) / 100), cta.token?.decimals),
                        {
                          significantDigits: 5
                        }
                      )}
                    </Typography>
                    <Typography fontSize='0.6rem'>
                      $
                      {formatDisplayNumber(
                        formatUnits(
                          Math.floor((cta.balance * cta.token?.price * zapOutPercent) / 100),
                          cta.token?.decimals
                        ),
                        {
                          significantDigits: 5
                        }
                      )}
                    </Typography>
                  </Box>
                </BetweenBox>
              ))}
            </BetweenBox>
          </Box>

          <FullCenterBox mb={2}>
            <Icon
              icon={'teenyicons:down-circle-outline'}
              fontSize='1.2rem'
            />
          </FullCenterBox>
        </>
      )}

      <Box
        px={4}
        py={3}
        border={'1px solid #fff3'}
        borderRadius={2}
        mb={3}
      >
        <Typography mb={2}>Zap to</Typography>
        <BetweenBox>
          <CenterBox
            sx={{ background: '#fff3', borderRadius: 8, cursor: 'pointer', px: 3 }}
            onClick={() => openTokenSelectDialog('SELECT', position?.currentAmounts[1].token)}
          >
            <img
              src={zapOutToken?.logo ?? zapOutToken?.logoURI ?? '/images/default-token.png'}
              className={`earn-token small`}
              alt=''
            />
            <Typography m={1}>{zapOutToken?.symbol}</Typography>
            <Icon
              icon='dashicons:arrow-down'
              fontSize='1.2rem'
            />
          </CenterBox>
          <Typography
            variant='h6'
            color={'#fff'}
          >
            {zapOutDerivedInfo?.amountOut
              ? formatDisplayNumber(formatUnits(zapOutDerivedInfo?.amountOut, zapOutToken.decimals))
              : '--'}
          </Typography>
        </BetweenBox>
      </Box>
    </Box>
  )
}

export default ZapOutToken

import { Box, Chip, Slider, Typography } from '@mui/material'
import { BetweenBox, CenterBox, FullCenterBox } from '../base/grid'
import { formatDisplayNumber, formatUnits } from '../utils/uniswap'
import { useAddLiquidity, useZapAction } from 'src/hooks'

const Percents = [25, 50, 75, 100]

const RemoveLiquidity = ({ position }) => {
  const { pool } = useAddLiquidity()
  const { zapOutPercent, setZapOutPercent } = useZapAction()

  return (
    <Box>
      <Box
        px={4}
        py={3}
        border={'1px solid #fff3'}
        borderRadius={2}
        mb={3}
      >
        <Typography mb={2}>Liquidity To Remove</Typography>
        {pool?.type == 'v3' && (
          <>
            <BetweenBox mb={2}>
              <Typography variant='h6'>{zapOutPercent} %</Typography>

              <CenterBox gap={1}>
                {Percents.map(percent => (
                  <Chip
                    key={percent}
                    label={`${percent}%`}
                    color={zapOutPercent === percent ? 'info' : 'secondary'}
                    size='small'
                    onClick={() => setZapOutPercent(percent)}
                  />
                ))}
              </CenterBox>
            </BetweenBox>

            <Slider
              min={0}
              max={100}
              step={1}
              defaultValue={100}
              onChange={(_, value) => setZapOutPercent(value)}
              mb={2}
            />
          </>
        )}

        {position?.currentAmounts.map((cta, index) => (
          <BetweenBox
            key={index}
            mb={2}
          >
            <CenterBox gap={1}>
              <img
                src={cta.token?.logo}
                className='earn-token'
                alt='main-token'
              />

              <Typography
                variant='h6'
                color={'#fff'}
              >
                {formatDisplayNumber(
                  formatUnits(Math.floor((cta.balance * zapOutPercent) / 100), cta.token?.decimals),
                  {
                    significantDigits: 5
                  }
                )}
              </Typography>

              <Typography
                variant='h6'
                ml={2}
              >
                {cta.token?.symbol}
              </Typography>
            </CenterBox>

            <Typography variant='body2'>
              $
              {formatDisplayNumber(
                formatUnits(Math.floor((cta.balance * cta.token?.price * zapOutPercent) / 100), cta.token?.decimals),
                {
                  significantDigits: 5
                }
              )}
            </Typography>
          </BetweenBox>
        ))}
      </Box>
    </Box>
  )
}

export default RemoveLiquidity

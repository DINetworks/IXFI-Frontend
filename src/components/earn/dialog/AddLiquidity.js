import { useMemo, useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'
import { BetweenBox, CenterBox } from '../../base/grid'
import { Icon } from '@iconify/react'
import { useZapAction } from 'src/hooks/useZapAction'
import { NATIVE_EVM_TOKEN_ADDRESS } from 'src/components/utils/uniswap'
import { formatCurrency } from 'src/components/utils/format'
import { useAddLiquidity } from 'src/hooks/useAddLiquidity'
import { formatEther, parseEther } from 'viem'
import { formatDisplayNumber } from 'src/components/utils/uniswap'

const AddLiquidity = ({ index }) => {
  const { openTokenSelectDialog } = useAddLiquidity()
  const { tokensForZap, tokensInUsdPrice, balanceTokens, handleUpdateTokenAmount, removeTokenForZap } = useZapAction()

  const token = useMemo(() => tokensForZap[index], [tokensForZap, index])
  const amount = useMemo(() => token.amount, [token])

  const usdAmount = useMemo(
    () => tokensInUsdPrice[index] * parseFloat(amount || '0'),
    [tokensInUsdPrice, index, amount]
  )

  const balanceInWei = useMemo(
    () =>
      balanceTokens[
        token.address.toLowerCase() === NATIVE_EVM_TOKEN_ADDRESS.toLowerCase()
          ? NATIVE_EVM_TOKEN_ADDRESS
          : token.address.toLowerCase()
      ]?.toString() || '0',
    [balanceTokens, token]
  )

  const enoughBalance = useMemo(() => {
    if (!amount) return true
    return parseEther(amount) <= balanceInWei
  }, [balanceInWei, amount])

  const onAmountChange = e => {
    const value = e.target.value.replace(/,/g, '')
    const inputRegex = /^(\d+)?([.]?\d*)?$/
    if (value === '' || inputRegex.test(value)) {
      handleUpdateTokenAmount(index, value)
    }
  }

  const setAmountFull = () => handleUpdateTokenAmount(index, formatEther(balanceInWei))

  const setAmountHalf = () => handleUpdateTokenAmount(index, formatEther(balanceInWei / 2))

  const setAmountDisabled = !balanceInWei || balanceInWei == '0' || balanceInWei == '0n'

  const removeZapToken = () => {
    removeTokenForZap(index)
  }

  return (
    <Box>
      <BetweenBox>
        <Typography fontWeight='medium' color='#fffd'>
          {index == 0 ? 'Add Liquidity' : ''}
        </Typography>
        {tokensForZap?.length > 1 && (
          <Icon icon='ic:twotone-close' className='cursor-pointer' fontSize='1.2rem' onClick={removeZapToken} />
        )}
      </BetweenBox>
      <Box border='1px solid #fff3' borderRadius={2} px={4} py={3} mt={2}>
        <BetweenBox>
          <CenterBox gap={2}>
            <Button
              size='small'
              variant='outlined'
              color='inherit'
              disabled={setAmountDisabled}
              onClick={setAmountFull}
            >
              Max
            </Button>
            <Button
              size='small'
              variant='outlined'
              color='inherit'
              disabled={setAmountDisabled}
              onClick={setAmountHalf}
            >
              Half
            </Button>
          </CenterBox>

          <CenterBox gap={2}>
            <Icon icon='iconoir:wallet-solid' fontSize='1.2rem' />
            <Typography variant='body1'>
              {formatDisplayNumber(formatEther(balanceInWei), { significantDigits: 6 })}
            </Typography>
          </CenterBox>
        </BetweenBox>
        <BetweenBox display='flex' mt={2} gap={2}>
          <Box display='flex' flexDirection='column' gap={1}>
            <TextField
              variant='standard'
              fullWidth
              value={token?.amount}
              onChange={onAmountChange}
              placeholder='0.0'
              inputProps={{
                inputMode: 'decimal',
                pattern: '^[0-9]*[.,]?[0-9]*$',
                minLength: 1,
                maxLength: 10
              }}
              sx={{
                mt: 0.5,
                input: {
                  fontSize: '1.2rem',
                  color: 'white',
                  fontWeight: 'bold',
                  textAlign: 'right'
                }
              }}
            />
            <BetweenBox>
              <Typography color={'#cc3300'} variant='body2'>
                {enoughBalance ? '' : 'Insufficient balance'}
              </Typography>
              <Typography variant='body2' color={'#cc5a'}>
                {formatCurrency(usdAmount)}
              </Typography>
            </BetweenBox>
          </Box>
          <CenterBox
            sx={{ border: '1px solid #fff3', borderRadius: 8, cursor: 'pointer', px: 3 }}
            onClick={() => openTokenSelectDialog('SELECT', token)}
          >
            <img src={token?.logoURI} className={`chain-selector-icon small`} alt='' />
            <Typography m={2}>{token?.symbol}</Typography>
            <Icon icon='dashicons:arrow-down' fontSize='1.2rem' />
          </CenterBox>
        </BetweenBox>
      </Box>
    </Box>
  )
}

export default AddLiquidity

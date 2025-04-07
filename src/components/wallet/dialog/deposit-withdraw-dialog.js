import { Avatar, Box, Button, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { showToast } from 'src/components/utils/toast'
import BaseDialog from 'src/components/wallet/base/base-dialog'
import DialogButton from 'src/components/wallet/base/dialog-button'
import { CROSSFI_CHAINID, GASRELAYER_CROSSFI, supportedChains } from 'src/configs/constant'
import {
  depositIXFI,
  depositXFI,
  formatNumber,
  getBalanceInApp,
  getIXFIBalanceInWallet,
  getPublicClient,
  getXFIBalanceInWallet,
  isInvalidAmount,
  waitForTransactionReceipt,
  withdrawIXFI,
  withdrawXFI
} from 'src/wallet/utils'
import { TransactionExecutionError } from 'viem'
import { useAccount } from 'wagmi'

const DepositWithdrawDialog = ({ isDeposit, openModal, setOpenModal }) => {
  const [isXFI, setXFI] = useState(true)
  const [gasBalance, setGasBalance] = useState(0)
  const [xfiBalance, setXFIBalance] = useState(0)
  const [ixfiBalance, setIXFIBalance] = useState(0)
  const [amount, setAmount] = useState('')
  const { address, chain, isConnected } = useAccount()
  const [isPending, setPending] = useState(false)

  const isCrossFiChain = chain?.id == CROSSFI_CHAINID

  const title = isDeposit ? 'Deposit XFI/IXFI' : 'Withdraw XFI/IXFI'
  const amountTitle = isDeposit ? 'Deposit Amount' : 'Withdraw Amount'
  const tokenSymbol = isXFI ? 'XFI' : 'IXFI'
  const avialableForAction = isDeposit ? (isXFI ? xfiBalance : ixfiBalance) : gasBalance

  const fetchCreditAndBalance = (chain, address) => {
    getBalanceInApp(chain, address).then(balance => {
      const _balance = formatNumber(balance)
      setGasBalance(_balance ?? 0)
    })

    if (isCrossFiChain)
      getXFIBalanceInWallet(chain, address).then(balance => {
        const _balance = formatNumber(balance)
        setXFIBalance(_balance ?? 0)
      })

    getIXFIBalanceInWallet(chain, address).then(balance => {
      const _balance = formatNumber(balance)
      setIXFIBalance(_balance ?? 0)
    })
  }

  const closeDialog = () => {
    setOpenModal(false)
  }

  const handleAmountChange = e => {
    setAmount(e.target.value)
  }

  const setAmountByPercentage = percent => {
    if (percent == 'max') setAmount(avialableForAction)
    else if (percent == 'half') setAmount(avialableForAction / 2)
    else if (percent == 'quater') setAmount(avialableForAction / 4)
  }

  const handleError = err => {
    if (err instanceof TransactionExecutionError) {
      showToast('error', 'Transaction was rejected.')

      return // prevents further propagation
    }

    console.error(err)
    showToast('error', 'Something went wrong during the deposit.')
  }

  const applyDeposit = async () => {
    try {
      const hash = isXFI ? await depositXFI(chain, address, amount) : await depositIXFI(chain, address, amount)
      const receipt = await waitForTransactionReceipt(chain, hash)

      const event = receipt.logs.find(log => {
        return log.address.toLowerCase() === GASRELAYER_CROSSFI.toLowerCase()
      })

      if (event) {
        showToast('success', 'Successfully Deposited')
      }
    } catch (err) {
      handleError(err)
    }
  }

  const applyWithdraw = async () => {
    try {
      const hash = isXFI ? await withdrawXFI(chain, address, amount) : await withdrawIXFI(chain, address, amount)
      const receipt = await waitForTransactionReceipt(chain, hash)

      const event = receipt.logs.find(log => {
        return log.address.toLowerCase() === GASRELAYER_CROSSFI.toLowerCase()
      })

      if (event) {
        showToast('success', 'Withdrawal Success')
      }
    } catch (err) {
      handleError(err)
    }
  }

  const applyAction = async () => {
    if (isInvalidAmount(amount)) {
      showToast('error', 'Amount Invalid')
      return
    }

    if (amount > avialableForAction) {
      showToast('error', 'Exceed available amount')
      return
    }

    setPending(true)
    isDeposit ? await applyDeposit() : await applyWithdraw()
    setPending(false)
    fetchCreditAndBalance(chain, address)
  }

  useEffect(() => {
    if (isConnected) {
      fetchCreditAndBalance(chain, address)
    }
  }, [address, chain, isConnected])

  const TokenItem = ({ symbol, logo, isActive }) => {
    return (
      <Box
        gap={2}
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: '8px',
          cursor: isActive ? '' : 'pointer',
          px: 6,
          py: 2,
          backgroundColor: isActive ? 'var(--violet)' : '',
          '&:hover': {
            backgroundColor: isActive ? 'var(--violet)' : 'action.hover'
          }
        }}
        onClick={() => !isActive && setXFI(!isXFI)}
      >
        <Avatar src={logo} alt={symbol} sx={{ width: 36, height: 36 }} /> <Typography variant='h4'>{symbol}</Typography>
      </Box>
    )
  }

  return (
    <BaseDialog openModal={openModal} setOpenModal={setOpenModal} title={title}>
      <Box
        gap={4}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mb: 4 }}
      >
        <Typography variant='h4'>Select Token</Typography>
        <Typography variant='h4' sx={{ textAlign: 'end' }}>
          Credit in App
        </Typography>
      </Box>
      <Box
        gap={4}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mb: 8 }}
      >
        <Box gap={4} sx={{ display: 'flex', alignItems: 'center' }}>
          {isCrossFiChain && <TokenItem symbol='XFI' logo='/images/tokens/xfi.png' isActive={isXFI} />}
          <TokenItem symbol='IXFI' logo='/images/tokens/ixfi.png' isActive={!isXFI} />
        </Box>
        <Typography variant='h4' color='primary' sx={{ textAlign: 'end' }}>
          {gasBalance}
        </Typography>
      </Box>

      <Typography variant='h4' sx={{ mb: 4 }}>
        {amountTitle}
      </Typography>
      <TextField fullWidth label='Amount' variant='outlined' value={amount} onChange={handleAmountChange} />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, mb: 8 }}>
        <Box gap={2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant='h6'>Available:</Typography>
          <Typography variant='h6' color='primary'>
            {avialableForAction} {tokenSymbol}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color='info' size='small' onClick={() => setAmountByPercentage('quater')}>
            25%
          </Button>
          <Button color='info' size='small' onClick={() => setAmountByPercentage('half')}>
            50%
          </Button>
          <Button color='info' size='small' onClick={() => setAmountByPercentage('max')}>
            Max
          </Button>
        </Box>
      </Box>
      <DialogButton isPending={isPending} text='Apply' onClick={applyAction} />
    </BaseDialog>
  )
}

export default DepositWithdrawDialog

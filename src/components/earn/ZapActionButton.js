import { useMemo } from 'react'
import { parseEther } from 'viem'
import { useAccount, useSwitchChain } from 'wagmi'
import DialogButton from '../base/dialogButton'
import { useAddLiquidity } from 'src/hooks/useAddLiquidity'
import { useZapAction } from 'src/hooks/useZapAction'
import { NATIVE_EVM_TOKEN_ADDRESS } from '../utils/uniswap'
import { useDialogs } from 'src/hooks/useDialogs'
import { useLiquidityDialogs } from 'src/hooks/useLiquidityDialogs'
import { useZapValidation } from 'src/hooks/useZapValidation'
import { useZapApproval } from 'src/hooks/useZapApproval'

const ZapActionButton = () => {
  const { chainId: networkChainId, isConnected } = useAccount()
  const { chainId, tokensForZap } = useAddLiquidity()
  const { priceImpact } = useZapAction()
  const { switchChain } = useSwitchChain()
  const { setConnectDialog } = useDialogs()
  const { setDeadline, openTokenSelectDialog, openZapPreviewDialog } = useLiquidityDialogs()
  const { balances } = useZapValidation()
  const { invalidApproves, handleApprove, pendingApprove } = useZapApproval()

  const handleZap = () => {
    if (priceImpact.piVeryHigh) {
      return
    }

    const date = new Date()
    date.setMinutes(date.getMinutes() + 20)
    const deadline = Math.floor(date.getTime() / 1000)
    setDeadline(deadline)

    openZapPreviewDialog()
  }

  const emptyTokens = useMemo(() => {
    return tokensForZap.length == 0
  }, [tokensForZap])

  const invalidTokens = useMemo(() => {
    return tokensForZap.filter(token => !token.amount).length
  }, [tokensForZap])

  const invalidBalances = useMemo(() => {
    return (
      tokensForZap.filter(
        token =>
          parseEther(token.amount.toString()) >
          balances[
            token.address.toLowerCase() === NATIVE_EVM_TOKEN_ADDRESS.toLowerCase()
              ? NATIVE_EVM_TOKEN_ADDRESS
              : token.address.toLowerCase()
          ]
      ).length > 0
    )
  }, [tokensForZap, balances])

  const buttonText = !isConnected
    ? 'Connect Wallet'
    : chainId != networkChainId
    ? 'Switch Chain'
    : emptyTokens
    ? 'Add Tokens'
    : invalidTokens
    ? 'Invalid Tokens'
    : invalidBalances
    ? 'Insufficient Balance'
    : invalidApproves
    ? 'Approve'
    : 'Execute'

  const executeAction = () => {
    if (!isConnected) {
      setConnectDialog(true)
      return
    } else if (chainId != networkChainId) {
      switchChain({ chainId })
    } else if (emptyTokens) {
      openTokenSelectDialog('ADD')
    } else if (invalidApproves) {
      handleApprove()
    } else if (!invalidTokens && !invalidBalances) {
      handleZap()
    }
  }

  return (
    <DialogButton
      text={pendingApprove ? 'Approving...' : buttonText}
      disabled={invalidTokens || invalidBalances || pendingApprove}
      flex={1}
      onClick={executeAction}
    />
  )
}

export default ZapActionButton

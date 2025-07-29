import { parseToBigInt, useMultiChainWallet, useXrplTrustLine } from 'src/components/swap/widget/react-hooks'
import { nativeXrplTokenAddress } from 'src/components/swap/widget/react-hooks/core/constants'
import { ChainType } from '@0xsquid/squid-types'
import { useCallback, useMemo } from 'react'
import { useSwapRouter } from './useSwapRouter'
import { routes } from '../core/routes'

export function useXrplConditions({ destinationAddress, chain, token, amount, isDestAddressConnected = false }) {
  const { switchRoute } = useSwapRouter()
  const { wallet } = useMultiChainWallet(chain)
  const isXrpDestination = chain?.chainType === ChainType.XRPL

  const amountBn = useMemo(() => {
    if (!amount || !token?.decimals) {
      return undefined
    }
    return parseToBigInt(amount, token.decimals)
  }, [amount, token?.decimals])

  const { createTrustLine, isTrustLineApproved, accountActivatedInfo } = useXrplTrustLine({
    address: destinationAddress,
    chain,
    token,
    amount: amountBn
  })

  const handleCreateTrustLine = useCallback(() => {
    if (wallet?.isQrWallet) {
      switchRoute(routes.signTrustLineTransactionQr)
    }
    createTrustLine.mutate()
  }, [createTrustLine.mutate, switchRoute, wallet?.isQrWallet])

  const { buttonState } = useMemo(() => {
    // If not XRP destination, don't block
    if (!isXrpDestination) {
      return {
        buttonState: { shouldBlock: false, disabled: false }
      }
    }
    const isXrpToken = token?.address.toLowerCase() === nativeXrplTokenAddress.toLowerCase()
    // Default state when not all params are provided
    if (!destinationAddress || !chain || !token) {
      return {
        isXrplLoading: false,
        buttonState: { shouldBlock: false, disabled: false }
      }
    }
    if (createTrustLine.isLoading) {
      return {
        buttonState: {
          shouldBlock: true,
          label: 'Approving...',
          disabled: true,
          showLoader: true
        }
      }
    }
    if (accountActivatedInfo.isLoading) {
      return {
        buttonState: {
          shouldBlock: true,
          label: 'Checking approval...',
          disabled: true
        }
      }
    }
    // Native XRP
    // If account is not activated
    if (accountActivatedInfo.data?.isActivated === false && isXrpToken && amountBn) {
      const isBelow = amountBn < (accountActivatedInfo.data.reserveBaseBn ?? BigInt(0))
      if (isBelow) {
        return {
          buttonState: {
            shouldBlock: true,
            label: 'Increase amount',
            disabled: true
          }
        }
      }
    }
    // For non-native tokens
    if (!isXrpToken) {
      if (isTrustLineApproved.isFetching) {
        return {
          buttonState: {
            shouldBlock: true,
            label: 'Checking approval...',
            disabled: true
          }
        }
      }
      // If account is not activated
      if (accountActivatedInfo.data?.isActivated === false) {
        return {
          buttonState: {
            shouldBlock: true,
            label: 'Account not activated',
            disabled: true
          }
        }
      }
      // if account is activated, check trust line
      if (isTrustLineApproved.data !== true) {
        const label = `Approve ${token.symbol} on recipient wallet`
        return {
          buttonState: {
            shouldBlock: true,
            label,
            disabled: !isDestAddressConnected,
            onClick: isDestAddressConnected ? handleCreateTrustLine : undefined
          }
        }
      }
    }
    // Default success state - don't block
    return {
      buttonState: { shouldBlock: false, disabled: false }
    }
  }, [
    isXrpDestination,
    destinationAddress,
    chain,
    token,
    amountBn,
    accountActivatedInfo.data,
    accountActivatedInfo.isLoading,
    isTrustLineApproved.data,
    isTrustLineApproved.isFetching,
    isDestAddressConnected,
    createTrustLine.isLoading,
    handleCreateTrustLine
  ])

  return {
    isXrpDestination,
    buttonState
  }
}

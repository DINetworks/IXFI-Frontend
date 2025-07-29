import {
  chainTypeToNativeTokenAddressMap,
  convertTokenAmountToUSD,
  formatBNToReadable,
  formatSeconds,
  formatUsdAmount,
  parseToBigInt,
  useEstimateSendTransaction,
  useMultiChainBalance,
  useMultiChainWallet,
  useNativeTokenForChain,
  useSquidChains,
  useWallet,
  useXrplTrustLine
} from 'src/components/swap/widget/react-hooks'
import React from 'react'
import { ArrowDownIcon, Button, CaptionText, ErrorMessage, GasIcon, TimeFliesIcon } from '@0xsquid/ui'
import { useMemo } from 'react'
import { getSwapError } from '../../../components/swap/SwapWarning'
import { getEstimatedConfirmationTimeForChain } from '../../../services/internal/transactionStatusService'
import { useSendStore } from '../../../store/useSendStore'

export function DetailsToolbar() {
  const { findChain } = useSquidChains('from')
  const token = useSendStore(store => store.token)
  const amount = useSendStore(store => store.amount)
  const toAddress = useSendStore(store => store.toAddress)
  const setAmount = useSendStore(store => store.setAmount)

  const chain = findChain(token?.chainId)
  const { nativeToken } = useNativeTokenForChain(chain)

  const amountBn = amount && token?.decimals ? parseToBigInt(amount, token.decimals) : undefined

  const { accountActivatedInfo, isTrustLineApproved } = useXrplTrustLine({
    address: toAddress?.address,
    chain,
    token,
    amount: amountBn
  })

  const estimatedTimeToComplete = useMemo(() => {
    if (!chain?.chainType) return formatSeconds(0)

    const estimatedTime = getEstimatedConfirmationTimeForChain({
      chainId: chain.chainId,
      chainType: chain.chainType
    })

    return formatSeconds(estimatedTime)
  }, [chain?.chainId, chain?.chainType])

  const { connectedAddress } = useMultiChainWallet(chain)

  const { balance } = useMultiChainBalance({
    chain,
    token,
    userAddress: connectedAddress.address
  })

  const {
    estimatedGas: gas,
    isBalanceEnough,
    isLoading: isLoadingEstimate,
    isNativeBalanceEnoughToPayGasFees,
    minAmountValueWarnMsg
  } = useEstimateSendTransaction({
    chain,
    token,
    amount,
    balance,
    from: connectedAddress.address
  })

  const { gasFeeUsd } = useMemo(() => {
    const gasFeeFormatted = formatBNToReadable(gas ?? '0', nativeToken?.decimals)
    const gasFeeUsd = formatUsdAmount(convertTokenAmountToUSD(gasFeeFormatted, nativeToken?.usdPrice ?? 0), {
      includeSign: false
    })

    return {
      gasFeeUsd
    }
  }, [gas, nativeToken?.decimals, nativeToken?.usdPrice])

  const { isChainTypeConnected } = useWallet()

  const isConnectedOnSource = chain?.chainType ? isChainTypeConnected(chain.chainType) : false

  const isTokenNative =
    !!token && token.address.toLowerCase() === chainTypeToNativeTokenAddressMap[token.type].toLowerCase()

  const { showFitGasButton, toolbarError } = getSwapError({
    priceImpactStatus: undefined,
    fromAmount: amountBn?.toString(),
    minAmountValueWarnMsg,
    isNativeBalanceEnoughToPayFees: isNativeBalanceEnoughToPayGasFees,
    isFromTokenNative: isTokenNative,
    squidRouteError: undefined,
    sourceChainNativeToken: nativeToken,
    destChainNativeToken: nativeToken,
    swapAmountExceedsLimit: false,
    fromBalanceEnoughToSwap: isBalanceEnough,
    fromToken: token,
    isFetchingEstimate: isLoadingEstimate,
    isConnectedOnSource,
    totalFeesInNativeTokenPlusRatio: gas,
    isDestinationAddressSet: !!toAddress,
    // this will always be false when sending tokens
    // since the only connected wallet is the one sending tokens
    isDestinationAddressConnected: false,
    destinationAddress: toAddress?.address,
    accountActivatedInfoQuery: accountActivatedInfo,
    isTrustLineApprovedQuery: isTrustLineApproved,
    toChain: chain,
    toToken: token
  })

  return (
    <div className='tw-flex tw-py-squid-xxs tw-px-squid-m tw-justify-center tw-items-center tw-self-stretch tw-border tw-border-material-light-thin tw-text-grey-500'>
      {toolbarError ? (
        <div className='tw-flex tw-items-center tw-pl-squid-xs tw-w-full'>
          <ErrorMessage message={toolbarError} />
          {showFitGasButton ? (
            <Button onClick={() => setAmount(minAmountValueWarnMsg)} size='md' variant='tertiary' label='Fit gas' />
          ) : null}
        </div>
      ) : (
        <>
          <div className='tw-flex tw-h-squid-xl tw-min-w-squid-xxl tw-px-squid-xs tw-items-center tw-gap-squid-xs tw-flex-1 tw-rounded-squid-m'>
            <div className='tw-flex tw-justify-center tw-items-center tw-gap-squid-xxs'>
              <GasIcon size='20' />
              <span className='tw-flex tw-justify-center tw-items-center'>
                <CaptionText className='tw-opacity-66'>$</CaptionText>
                <CaptionText>{gasFeeUsd}</CaptionText>
              </span>
            </div>
          </div>
          <div className='tw-flex tw-h-squid-xl tw-min-w-squid-xxl tw-px-squid-xs tw-justify-center tw-items-center tw-text-grey-300'>
            <ArrowDownIcon size='24' />
          </div>
          <div className='tw-flex tw-h-squid-2xl tw-px-squid-xs tw-justify-end tw-items-center tw-gap-squid-xxs tw-flex-1'>
            <TimeFliesIcon size='20' />
            <CaptionText>~{estimatedTimeToComplete}</CaptionText>
          </div>
        </>
      )}
    </div>
  )
}

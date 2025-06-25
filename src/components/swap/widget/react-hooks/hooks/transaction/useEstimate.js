import { FeeType } from '@0xsquid/squid-types'
import { useMemo } from 'react'
import { limitTradeSizeUsd } from '../../core/constants'
import { formatUsdAmount } from '../../services'
import {
  calculateEstimateResults,
  calculateTotalWithRefundEstimate,
  getProposedGasDestinationAmount
} from '../../services/internal/estimateService'
import { useConfigStore } from '../store/useSwapStore'
import { useSwap } from '../swap/useSwap'
import { useMultiChainBalance } from '../tokens/useMultiChainBalance'
import { useNativeBalance } from '../tokens/useNativeBalance'
import { useSingleTokenPrice } from '../tokens/useSingleTokenPrice'
import { useSquidTokens } from '../tokens/useSquidTokens'

const DEFAULT_PROVIDER_IMAGE_URL =
  'https://raw.githubusercontent.com/0xsquid/assets/main/images/webp128/providers/squid.webp'

const AXELAR_PROVIDER_IMAGE_URL =
  'https://raw.githubusercontent.com/0xsquid/assets/main/images/webp128/providers/axelar.webp'

export const useEstimate = squidRoute => {
  const collectFees = useConfigStore(state => state.config.collectFees)
  const { tokens } = useSquidTokens()
  const { fromChain, toChain } = useSwap()
  const { nativeBalance } = useNativeBalance(fromChain)

  const estimateResults = useMemo(
    () =>
      calculateEstimateResults({
        squidRoute,
        tokens,
        fromChain,
        toChain,
        collectFees: !!collectFees && collectFees.fee > 0,
        nativeTokenBalanceFromChainWei: nativeBalance?.value ?? BigInt('0')
      }),
    [squidRoute, tokens, fromChain, toChain, collectFees, nativeBalance]
  )

  const balanceFormatted =
    useMultiChainBalance({
      chain: fromChain,
      token: estimateResults.fromToken,
      userAddress: squidRoute?.params.fromAddress ?? '',
      enabled: !!squidRoute
    }).balance ?? '0'
  const { getUSDValue } = useSingleTokenPrice(estimateResults.firstFeeCost?.token)

  const totalWithRefundEstimate = useMemo(
    () =>
      calculateTotalWithRefundEstimate(estimateResults.allFeeCosts, estimateResults.expectedGasRefundCost, getUSDValue),
    [estimateResults.allFeeCosts, estimateResults.expectedGasRefundCost, getUSDValue]
  )

  const proposedGasDestinationAmount = useMemo(
    () => getProposedGasDestinationAmount(estimateResults.destChainNativeToken?.symbol),
    [estimateResults.destChainNativeToken]
  )

  const { feeCostsFormatted, totalFeeCostsUsd } = useMemo(() => {
    const feeCosts = squidRoute?.estimate.feeCosts ?? []
    const feeCostsRenamed = []

    const feesToRename = [
      {
        newName: 'CORAL fee',
        match: [FeeType.EXECUTION_FEE, FeeType.SETTLEMENT_FEE],
        imageUrl: DEFAULT_PROVIDER_IMAGE_URL
      },
      {
        newName: 'Axelar fee',
        match: [FeeType.GAS_RECEIVER_FEE, FeeType.BOOST_FEE],
        imageUrl: AXELAR_PROVIDER_IMAGE_URL
      }
    ]
    for (const fee of feeCosts) {
      if (Number(fee.amountUsd) === 0) continue
      const feeToRename = feesToRename.find(({ match }) => match.includes(fee.name))
      if (feeToRename) {
        const previousRenamedFeeIndex = feeCostsRenamed.findIndex(f => f.name === feeToRename.newName)
        if (feeCostsRenamed[previousRenamedFeeIndex] == null) {
          feeCostsRenamed.push({
            name: feeToRename.newName,
            amountUsd: Number(fee.amountUsd),
            imageUrl: feeToRename.imageUrl
          })
        } else {
          feeCostsRenamed[previousRenamedFeeIndex].amountUsd += Number(fee.amountUsd)
        }
      } else {
        feeCostsRenamed.push({
          name: fee.name,
          amountUsd: Number(fee.amountUsd),

          // TODO: missing logoURI property, update types
          imageUrl: fee?.logoURI || DEFAULT_PROVIDER_IMAGE_URL
        })
      }
    }

    const feeCostsFormatted = feeCostsRenamed.map(fee => ({
      name: fee.name,
      imageUrl: fee.imageUrl,
      amountUsdFormatted: formatUsdAmount(fee.amountUsd, {
        decimalPrecision: true
      })
    }))

    const totalFeeCostsUsd = feeCosts.reduce((totalFees, currentFee) => {
      return Number(totalFees) + Number(currentFee.amountUsd)
    }, 0)

    const totalFeeCostsUsdFormatted = formatUsdAmount(totalFeeCostsUsd, {
      decimalPrecision: true
    })
    return {
      feeCostsFormatted,
      totalFeeCostsUsd: totalFeeCostsUsdFormatted
    }
  }, [squidRoute?.estimate.feeCosts])

  const slippageFormatted = Number(squidRoute?.estimate?.aggregateSlippage ?? 0).toFixed(2) + '%'
  const swapAmountExceedsLimit = estimateResults.toAmountUSDFloat > limitTradeSizeUsd

  const enoughBalanceToSwap = +balanceFormatted >= 0 && +balanceFormatted > +estimateResults.fromAmountFormatted
  return {
    ...estimateResults,
    balanceFormatted,
    slippageFormatted,
    totalWithRefundEstimate,
    proposedGasDestinationAmount,
    swapAmountExceedsLimit,
    enoughBalanceToSwap,
    feeCostsFormatted,
    totalFeeCostsUsd
  }
}

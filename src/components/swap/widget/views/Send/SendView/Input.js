import { useMultiChainBalance, useMultiChainWallet, useSquidChains } from 'src/components/swap/widget/react-hooks'
import { LargeNumericInput } from '@0xsquid/ui'
import { TOOLTIP_DISPLAY_DELAY_MS } from '../../../core/constants'
import { useSendStore } from '../../../store/useSendStore'

export function Input() {
  const { findChain } = useSquidChains('from')
  const token = useSendStore(store => store.token)
  const amount = useSendStore(store => store.amount)
  const setAmount = useSendStore(store => store.setAmount)

  const chain = findChain(token?.chainId)
  const { connectedAddress } = useMultiChainWallet(chain)

  const { balance } = useMultiChainBalance({
    chain,
    token,
    userAddress: connectedAddress.address
  })

  return (
    <LargeNumericInput
      onAmountChange={setAmount}
      token={{
        decimals: token?.decimals ?? 0,
        symbol: token?.symbol ?? '',
        price: token?.usdPrice ?? 0
      }}
      forcedAmount={amount}
      balance={balance}
      balanceButton={{
        tooltip: {
          tooltipContent: 'Max swap',
          displayDelayMs: TOOLTIP_DISPLAY_DELAY_MS.DEFAULT
        }
      }}
      inputModeButton={{
        tokenModeTooltip: {
          tooltipContent: 'Enter in USD',
          displayDelayMs: TOOLTIP_DISPLAY_DELAY_MS.DEFAULT
        },
        usdModeTooltip: {
          tooltipContent: 'Enter token amount',
          displayDelayMs: TOOLTIP_DISPLAY_DELAY_MS.DEFAULT
        }
      }}
    />
  )
}

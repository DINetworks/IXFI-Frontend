import {
  chainTypeToNativeTokenAddressMap,
  formatHash,
  useAvatar,
  useMultiChainWallet,
  useSquidChains,
  useSquidTokens
} from 'src/components/swap/widget/react-hooks'
import { AddressHeader } from '@0xsquid/ui'
import { useEffect } from 'react'
import { POPULAR_CHAINS_IDS, TOOLTIP_DISPLAY_DELAY_MS } from '../../../core/constants'
import { routes } from '../../../core/routes'
import { useSwapRouter } from '../../../hooks/useSwapRouter'
import { getEnsAvatar } from '../../../services/internal/assetsService'
import { useSendStore } from '../../../store/useSendStore'
import { AssetButton } from './AssetsButton'
import { DetailsToolbar } from './DetailsToolbar'
import { Input } from './Input'
import { SendButton } from './SendButton'

export function SendView() {
  const { tokens } = useSquidTokens()
  const token = useSendStore(store => store.token)
  const setToken = useSendStore(store => store.setToken)
  const { switchRoute } = useSwapRouter()
  const { findChain } = useSquidChains()
  const chain = findChain(token?.chainId)

  const { networkConnected, connectedAddress, wallet: connectedWallet } = useMultiChainWallet(chain)

  const toAddress = useSendStore(store => store.toAddress)

  useEffect(() => {
    if (token) return

    /**
     * Set the default token to the first one that is a native token of a popular chain
     */
    const defaultToken = tokens.find(token => {
      const isPopularChain = POPULAR_CHAINS_IDS.includes(token.chainId)
      if (!isPopularChain) return false

      const isNativeToken = chainTypeToNativeTokenAddressMap[token.type].toLowerCase() === token.address.toLowerCase()
      return isNativeToken
    })

    if (defaultToken) {
      setToken(defaultToken)
    }
  }, [setToken, token, tokens])

  const toAddressFallbackAvatar = useAvatar(toAddress?.address)

  return (
    <section className='tw-flex tw-flex-col tw-items-start tw-flex-1 tw-self-stretch tw-border-t tw-border-t-material-light-thin'>
      <AddressHeader
        showIcon={true}
        direction='from'
        onClick={() => switchRoute(routes.wallets, { chainId: token?.chainId })}
        isDisabled={!token}
        tooltip={{
          tooltipContent: !token ? 'Select an asset to send first' : 'Change wallet',
          displayDelayMs: TOOLTIP_DISPLAY_DELAY_MS.DEFAULT
        }}
        highlightLabel={!networkConnected}
        label={
          networkConnected
            ? connectedAddress.ens?.name ?? connectedAddress.formatted ?? 'Connect wallet'
            : 'Connect wallet'
        }
        walletIconUrl={connectedWallet?.icon ?? null}
      />

      <AssetButton />
      <Input />
      <DetailsToolbar />

      <span className='tw-h-squid-xxs tw-w-full' />

      <AddressHeader
        showIcon={true}
        direction='to'
        highlightLabel={!toAddress}
        onClick={() =>
          switchRoute(routes.destination, {
            isSendView: true,
            chainId: token?.chainId
          })
        }
        label={
          toAddress?.address
            ? toAddress.ens?.name ||
              formatHash({
                hash: toAddress.address,
                chainType: chain?.chainType
              })
            : 'Select recipient'
        }
        tooltip={{
          tooltipContent: toAddress?.address ? 'Select recipient' : 'Add a recipient',
          displayDelayMs: TOOLTIP_DISPLAY_DELAY_MS.DEFAULT
        }}
        walletIconUrl={toAddress?.address ? getEnsAvatar(toAddress) || toAddressFallbackAvatar : null}
      />

      <SendButton />
    </section>
  )
}

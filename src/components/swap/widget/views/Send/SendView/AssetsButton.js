import { getTokenImage, useSquidChains } from 'src/components/swap/widget/react-hooks'
import React from 'react'
import { AssetsButton } from '@0xsquid/ui'
import { TOOLTIP_DISPLAY_DELAY_MS } from '../../../core/constants'
import { routes } from '../../../core/routes'
import { useSwapRouter } from '../../../hooks/useSwapRouter'
import { defaultAssetsColors } from '../../../services/internal/assetsService'
import { useSendStore } from '../../../store/useSendStore'

export function AssetButton() {
  const { switchRoute } = useSwapRouter()
  const { findChain } = useSquidChains('from')
  const token = useSendStore(store => store.token)
  const chain = findChain(token?.chainId)

  return (
    <div className='tw-flex tw-px-squid-l tw-items-center tw-self-stretch'>
      <AssetsButton
        chain={
          chain
            ? {
                bgColor: chain.bgColor || defaultAssetsColors.chainBg,
                iconUrl: chain.chainIconURI
              }
            : undefined
        }
        token={
          token
            ? {
                bgColor: token.bgColor || defaultAssetsColors.tokenBg,
                iconUrl: getTokenImage(token) ?? '',
                symbol: token.symbol,
                textColor: token.textColor || defaultAssetsColors.tokenText
              }
            : undefined
        }
        onClick={() =>
          switchRoute(routes.allTokens, {
            isSendView: true,
            direction: 'from'
          })
        }
        tooltip={{
          tooltipContent: 'Select chain and token',
          displayDelayMs: TOOLTIP_DISPLAY_DELAY_MS.DEFAULT
        }}
      />
    </div>
  )
}

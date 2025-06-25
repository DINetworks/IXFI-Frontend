import { formatHash, useMultiChainWallet, useSquidChains } from 'src/components/swap/widget/react-hooks'
import { BodyText, ChevronLargeRightIcon, cn, Image, Tooltip, WalletFilledIcon } from '@0xsquid/ui'
import { useMemo } from 'react'
import { TOOLTIP_DISPLAY_DELAY_MS } from '../../../core/constants'
import { routes } from '../../../core/routes'
import { useSwapRouter } from '../../../hooks/useSwapRouter'
import { useSendStore } from '../../../store/useSendStore'

export function Header({ direction }) {
  const { findChain } = useSquidChains(direction)
  const token = useSendStore(store => store.token)
  const toAddress = useSendStore(store => store.toAddress)
  const chain = findChain(token?.chainId)

  const { networkConnected, connectedAddress, wallet: connectedWallet } = useMultiChainWallet(chain)

  const { switchRoute } = useSwapRouter()

  const { label, onClick, walletIconUrl, isDisabled, tooltip } = useMemo(() => {
    if (direction === 'from') {
      if (!chain) {
        return {
          isDisabled: true,
          label: 'Connect wallet',
          walletIconUrl: null,
          tooltip: 'Select an asset to send first'
        }
      }

      const addressOrEnsName = connectedAddress.ens?.name ?? connectedAddress.formatted

      if (networkConnected && addressOrEnsName) {
        return {
          label: addressOrEnsName,
          onClick: () => {
            switchRoute(routes.wallets, {
              chainId: chain?.chainId
            })
          },
          walletIconUrl: connectedWallet?.icon ?? null,
          tooltip: 'Change wallet'
        }
      }

      return {
        label: 'Connect wallet',
        onClick: () => {
          switchRoute(routes.wallets, {
            chainId: chain?.chainId
          })
        },
        tooltip: 'Select an asset to send first',
        walletIconUrl: null
      }
    }

    if (toAddress && chain) {
      return {
        label: formatHash({
          hash: toAddress.address,
          chainType: chain.chainType
        }),
        // TODO: add useEns/Avatar hook
        walletIconUrl: null,
        onClick: () => {
          switchRoute(routes.destination, {
            isSendView: true,
            chainId: chain.chainId
          })
        },
        tooltip: 'Select recipient'
      }
    }

    return {
      label: 'Select recipient',
      walletIconUrl: null,
      onClick: () => {
        switchRoute(routes.destination, {
          isSendView: true,
          chainId: token?.chainId
        })
      },
      tooltip: 'Add a recipient'
    }
  }, [
    chain,
    connectedAddress.ens?.name,
    connectedAddress.formatted,
    connectedWallet?.icon,
    toAddress,
    direction,
    networkConnected,
    switchRoute,
    token?.chainId
  ])

  return (
    <header className='tw-flex tw-py-squid-xxs tw-px-squid-m tw-items-center tw-self-stretch tw-h-squid-xl2'>
      <Tooltip
        tooltipContent={tooltip}
        tooltipWidth='max'
        childrenClassName='tw-rounded-squid-s'
        containerClassName='tw-rounded-squid-s'
        displayDelayMs={TOOLTIP_DISPLAY_DELAY_MS.DEFAULT}
      >
        <button
          onClick={onClick}
          disabled={isDisabled}
          type='button'
          className={cn(
            'tw-flex tw-items-center tw-gap-squid-xxs tw-h-squid-l tw-px-squid-xs tw-rounded-squid-s',
            !isDisabled && 'hover:tw-bg-material-light-thin'
          )}
        >
          <BodyText size='small' className='tw-text-grey-500'>
            {direction === 'from' ? 'From' : 'To'}
          </BodyText>
          <BodyText size='small' className='tw-text-grey-600'>
            :
          </BodyText>
          <div className='tw-flex tw-items-center tw-gap-squid-xxs'>
            {walletIconUrl != null ? (
              <Image width={24} height={24} rounded='xxs' src={walletIconUrl} />
            ) : (
              <div className='tw-flex tw-px-0.5 tw-items-center tw-w-6 tw-h-6 tw-outline tw-outline-1 tw-outline-material-light-thin tw-justify-center tw-rounded-lg tw-bg-royal-500'>
                <WalletFilledIcon size='18' />
              </div>
            )}
            <BodyText size='small' className='tw-text-royal-500'>
              {label}
            </BodyText>
            <ChevronLargeRightIcon className='tw-text-royal-500' size='16' />
          </div>
        </button>
      </Tooltip>
    </header>
  )
}

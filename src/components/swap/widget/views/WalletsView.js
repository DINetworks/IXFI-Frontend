import {
  ConnectingWalletStatus,
  sortWallets,
  useMultiChainWallet,
  useSquidChains,
  useWallet,
  walletSupportsChainType
} from 'src/components/swap/widget/react-hooks'
import React from 'react'
import {
  BodyText,
  Button,
  ChevronLargeRightIcon,
  Input,
  ListItem,
  Loader,
  Modal,
  ModalContent,
  ModalContentDivider
} from '@0xsquid/ui'
import Fuse from 'fuse.js'
import { useCallback, useMemo, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { routes } from '../core/routes'
import { useSwapRouter } from '../hooks/useSwapRouter'

export const WalletsView = () => {
  const { previousRoute, handleCloseModal, switchRoute, isModalOpen, modalRoute } = useSwapRouter()

  const { findChain } = useSquidChains()
  const chainId = modalRoute?.params?.chainId
  const onConnect = modalRoute?.params?.onConnect
  const [search, setSearch] = useState('')
  const currentChain = findChain(chainId)

  const { connectWallet, wallets, connectedWallets, connectingWalletState, disconnectWallet, cancelConnectWallet } =
    useWallet()

  const { connectedAddress, wallet: currentWallet } = useMultiChainWallet(currentChain)

  /**
   * Wallets sorted and filtered by chain and device type
   */
  const filteredAndSortedWallets = useMemo(() => {
    let filtered = wallets.filter(wallet => {
      const isDeviceSupported = isMobile ? wallet.isMobile : true
      const isCorrectChainType = !!currentChain?.chainType && walletSupportsChainType(wallet, currentChain?.chainType)
      return isDeviceSupported && isCorrectChainType
    })

    // rename Injected wallet in mobile
    if (isMobile) {
      filtered = filtered.map(wallet => {
        if (wallet.connectorId === 'injected') {
          return {
            ...wallet,
            name: 'Mobile wallet'
          }
        }
        return wallet
      })
    }

    const sortByInstallationStatusAndPriority = (a, b) =>
      sortWallets(a, b, {
        isMobile,
        connectedWallets,
        priorityList: [
          'xaman-xapp',
          'xaman-qr',
          'joey',
          'girin',
          'bifrost',
          'crossmark',
          'xrpl-metamask-snap',
          'walletConnect',
          'metamask',
          'coinbase',
          'trustwallet',
          'rainbow',
          'blockchaindotcom',
          'exodus'
        ]
      })

    return filtered.sort(sortByInstallationStatusAndPriority)
  }, [wallets, currentChain, connectedWallets])

  const onWalletClicked = useCallback(
    async wallet => {
      const isWalletConnected = wallet.connectorId === currentWallet?.connectorId

      if (isWalletConnected) {
        if (currentChain) {
          disconnectWallet(currentChain.chainType)
        }
        handleCloseModal()
        return
      }

      try {
        if (wallet.isQrWallet) {
          switchRoute(routes.connectWalletQr, {
            chainId
          })
        }

        const connected = await connectWallet({ wallet, chain: currentChain })

        // If connection worked, close modal
        if (connected) {
          handleCloseModal()
          previousRoute()
          onConnect?.()
        }
      } catch (error) {
        console.error(error)
      }
    },
    [
      currentWallet,
      currentChain,
      disconnectWallet,
      handleCloseModal,
      switchRoute,
      connectWallet,
      previousRoute,
      chainId,
      onConnect
    ]
  )

  const handleClose = useCallback(() => {
    handleCloseModal()
    cancelConnectWallet()
  }, [handleCloseModal, cancelConnectWallet])

  const fuse = useMemo(
    () =>
      new Fuse(filteredAndSortedWallets, {
        isCaseSensitive: false,
        includeScore: false,
        minMatchCharLength: 1,
        threshold: 0.4,
        keys: ['name']
      }),
    [filteredAndSortedWallets]
  )

  const fuseWallets = useMemo(() => {
    return fuse
      .search(search)
      .map(wallet => wallet.item)
      .sort((a, b) =>
        sortWallets(a, b, {
          isMobile,
          connectedWallets: undefined
        })
      )
  }, [fuse, search])

  const walletsToDisplay = search.length > 0 ? fuseWallets : filteredAndSortedWallets

  return (
    <Modal onBackdropClick={handleCloseModal} isOpen={isModalOpen} maxHeight={true}>
      <ModalContent addGap={true}>
        <div className='tw-px-squid-xs tw-pt-squid-xxs'>
          <Input
            // disable autofocus on mobile
            autoFocusTimeout={isMobile ? undefined : 200}
            onChange={e => setSearch(e.target.value)}
            placeholder='Select your wallet'
            autoComplete='off'
            autoCorrect='off'
            spellCheck={false}
          />
        </div>
        <ul className='tw-gap-squid-xxs tw-py-squid-xs tw-flex tw-flex-col tw-overflow-auto tw-scrollbar-hidden'>
          {walletsToDisplay.map((wallet, index, self) => (
            <React.Fragment key={wallet.connectorId}>
              {index > 0 && !wallet.isInstalled?.() && self[index - 1]?.isInstalled?.() && (
                <span className='tw-text-material-light-thin'>
                  <ModalContentDivider />
                </span>
              )}
              <ListItem
                isSelected={wallet.connectorId === currentWallet?.connectorId}
                icon={
                  connectingWalletState.wallet?.connectorId === wallet.connectorId &&
                  connectingWalletState.status === ConnectingWalletStatus.CONNECTING ? (
                    <Loader />
                  ) : (
                    <SwitchWalletDetail
                      isConnected={wallet.connectorId === currentWallet?.connectorId}
                      isInstalled={wallet.isInstalled?.()}
                      formattedAddress={connectedAddress.ens?.name ?? connectedAddress.formatted}
                    />
                  )
                }
                className='tw-group/tw-wallet-item tw-bg-transparent'
                itemTitle={
                  <BodyText size='small' className='tw-text-grey-300 !tw-leading-[13px]'>
                    {wallet.name}
                  </BodyText>
                }
                rounded='xs'
                mainImageUrl={wallet.icon}
                onClick={() => {
                  onWalletClicked(wallet)
                }}
              />
            </React.Fragment>
          ))}
        </ul>
      </ModalContent>
      <Button size='lg' variant='secondary' label='Cancel' onClick={handleClose} />
    </Modal>
  )
}

const SwitchWalletDetail = ({ isConnected, formattedAddress, isInstalled }) => {
  return (
    <span className='tw-text-royal-500 tw-flex tw-items-center tw-gap-1'>
      {isConnected ? (
        <React.Fragment>
          <span className='tw-block group-hover/tw-wallet-item:tw-hidden'>{formattedAddress}</span>
          <span className='tw-hidden group-hover/tw-wallet-item:tw-block'>Disconnect</span>
        </React.Fragment>
      ) : isInstalled ? (
        'Installed'
      ) : null}
      <ChevronLargeRightIcon className='tw-text-material-light-average' />
    </span>
  )
}

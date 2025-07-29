var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
import {
  CHAIN_IDS,
  EnsService,
  areSameAddress,
  formatHash,
  isWalletAddressValid,
  isXionSmartContractAddress,
  sortAddressBook,
  useAddressBookStore,
  useAvatar,
  useCosmosContext,
  useEnsSearch,
  useIntegratorContext,
  useMultiChainWallet,
  useRouteWarnings,
  useSquidChains,
  useSwap,
  useSwapRoutePersistStore
} from 'src/components/swap/widget/react-hooks'
import React from 'react'
import { ChainType } from '@0xsquid/squid-types'
import { BorderedContainer, Button, CaptionText, Collapse, ListItem, Loader, PunkIcon, SectionTitle } from '@0xsquid/ui'
import clsx from 'clsx'
import Fuse from 'fuse.js'
import { useEffect, useMemo, useState } from 'react'
import { EditAddress } from '../components/EditAddressComponent'
import { HighlightTextComponent } from '../components/HighlightText'
import { NavigationBar } from '../components/NavigationBar'
import { routes } from '../core/routes'
import { useSwapRouter } from '../hooks/useSwapRouter'
import { getEnsAvatar } from '../services/internal/assetsService'
import { useFiatOnRampStore } from '../store/useFiatOnRampStore'
import { useSendStore } from '../store/useSendStore'

export const DestinationAddressView = () => {
  const { switchRoute, previousRoute, currentRouteParams } = useSwapRouter()
  const { onSwapChange, toChain: swapToChain, destinationAddress: swapDestinationAddress } = useSwap()
  const { chains } = useSquidChains()
  const { walletHandledExternally } = useIntegratorContext()
  const { swapRoute } = useSwapRoutePersistStore()
  const { addressBook, add: addToAddressBook } = useAddressBookStore()

  // Send
  const setSendDestinationAddress = useSendStore(store => store.setDestinationAddress)
  const sendToAddress = useSendStore(store => store.toAddress)

  // Buy
  const setFiatOnRampDestinationAddress = useFiatOnRampStore(store => store.setDestinationAddress)
  const fiatOnRampDestinationAddress = useFiatOnRampStore(store => store.destinationAddress)

  const { isConnected: cosmosConnected, getCosmosAddressForChain } = useCosmosContext()
  const [showConnectWalletSection, setShowConnectWalletSection] = useState(true)
  const { findChain } = useSquidChains()

  const isFiatOnRamp = currentRouteParams?.isFiatOnRamp
  const isSendView = currentRouteParams?.isSendView
  const fiatOnRampChainId = isFiatOnRamp ? currentRouteParams?.chainId : undefined
  const sendViewChainId = isSendView ? currentRouteParams?.chainId : undefined

  // depending on the context (swap, fiat on ramp, or send views)
  // we have different chains and addresses
  const { toChain, destinationAddress } = useMemo(() => {
    if (isFiatOnRamp) {
      return {
        toChain: findChain(fiatOnRampChainId),
        destinationAddress: fiatOnRampDestinationAddress?.address
      }
    }
    if (isSendView) {
      const sendViewChain = findChain(sendViewChainId)
      return {
        toChain: sendViewChain,
        destinationAddress: sendToAddress?.address
      }
    }
    return {
      toChain: swapToChain,
      destinationAddress: swapDestinationAddress.address
    }
  }, [
    isFiatOnRamp,
    isSendView,
    swapToChain,
    swapDestinationAddress.address,
    findChain,
    fiatOnRampChainId,
    sendViewChainId,
    sendToAddress?.address,
    fiatOnRampDestinationAddress?.address
  ])

  const { connectedAddress: connectedDestinationAddress, networkConnected: isConnectedInDestination } =
    useMultiChainWallet(toChain)
  const { needsFallbackAddress: isFallbackAddressNeededForSwapRoute } = useRouteWarnings()
  const needsFallbackAddress = !isSendView && !isFiatOnRamp && isFallbackAddressNeededForSwapRoute

  const osmosisChain = useMemo(() => chains.find(c => c.chainId === 'osmosis-1'), [chains])

  const [addressInputValue, setAddressInputValue] = useState()
  const [fallbackAddressInputValue, setFallbackAddressInputValue] = useState(swapRoute?.fallbackAddress)

  const displayFallbackInput = useMemo(() => {
    if (!needsFallbackAddress) return false
    if (toChain?.chainType !== ChainType.COSMOS) return false
    if (toChain.chainId === CHAIN_IDS.XION) {
      return isXionSmartContractAddress(addressInputValue) || isXionSmartContractAddress(destinationAddress)
    }
    return toChain.coinType !== 118
  }, [needsFallbackAddress, toChain, addressInputValue, destinationAddress])

  /**
   * Updates the fallback address input value.
   * If it is a valid Osmosis address, updates the fallback address in the global state
   */
  const handleUpdateAndValidateFallbackAddress = address => {
    if (isWalletAddressValid(osmosisChain, address)) {
      onSwapChange({ fallbackAddress: address })
    }
    setFallbackAddressInputValue(address)
  }

  const isDestinationAddressSameAsConnectedAddress = areSameAddress(
    connectedDestinationAddress.address,
    destinationAddress
  )

  useEffect(() => {
    // If cosmos wallet is connected and there's no fallback address
    // We set the fallback address to the connected cosmos address
    const setInitialFallbackAddress = async () => {
      if (cosmosConnected && fallbackAddressInputValue === undefined) {
        // TODO: Using mainnet osmo by default for now.
        // We introduced a env variable for the widget with the deposit address
        // Once it's merged, can use that to pick the right chainId
        const address = await getCosmosAddressForChain(CHAIN_IDS.OSMOSIS)
        setFallbackAddressInputValue(address)
      }
    }
    setInitialFallbackAddress()
  }, [cosmosConnected, fallbackAddressInputValue, getCosmosAddressForChain])

  /**
   * Checks if the address is valid for the current destination chain.
   * Updates the destination address in the global store.
   * Adds the address to the address book.
   *
   * @param address - the new destination address
   * @param filledFromWallet - whether the address was filled from the wallet
   */
  const handleAddNewDestinationAddress = ({ address, ens = {}, redirectToPreviousRoute = true, fallbackAddress }) => {
    if (!toChain) return

    const isAddressValidForChain = isWalletAddressValid(toChain, address)
    if (!isAddressValidForChain) return

    const newDestinationAddress = {
      address,
      ens,
      chainType: toChain.chainType
    }

    const isValidFallbackAddress = isWalletAddressValid(osmosisChain, fallbackAddress)

    if (isSendView) {
      setSendDestinationAddress(newDestinationAddress)
    } else if (isFiatOnRamp) {
      setFiatOnRampDestinationAddress(newDestinationAddress)
    } else {
      const swapParams =
        needsFallbackAddress && isValidFallbackAddress
          ? {
              destinationAddress: newDestinationAddress,
              fallbackAddress
            }
          : {
              destinationAddress: newDestinationAddress
            }
      onSwapChange(swapParams)
    }

    const newAddressIsSameAsConnectedAddress = areSameAddress(connectedDestinationAddress.address, address)

    // Update the address book only if the new address is different from the connected address
    if (!newAddressIsSameAsConnectedAddress) {
      const newDestAddressHasEns = !!newDestinationAddress.ens.name
      if (newDestAddressHasEns) {
        addToAddressBook(newDestinationAddress)
      } else {
        EnsService.getEnsDataFromAddress(newDestinationAddress.address).then(ensData => {
          addToAddressBook({
            ...newDestinationAddress,
            ens: ensData
          })
        })
      }
    }

    const isFallbackAddressMissingForCurrentView =
      !isSendView && !isFiatOnRamp && needsFallbackAddress && !isValidFallbackAddress

    // Only redirect if fallback address is not needed or if both addresses are valid
    if (redirectToPreviousRoute && !isFallbackAddressMissingForCurrentView) {
      previousRoute()
    }
  }

  const resetDestinationAddressToConnectedWallet = async () => {
    if (needsFallbackAddress) {
      const initialFallbackAddress = await getCosmosAddressForChain(CHAIN_IDS.OSMOSIS)
      handleAddNewDestinationAddress({
        address: connectedDestinationAddress.address ?? '',
        fallbackAddress: initialFallbackAddress
      })
    } else {
      handleAddNewDestinationAddress({
        address: connectedDestinationAddress.address ?? ''
      })
    }
    setAddressInputValue('')
  }

  const {
    isFetching: isFetchingEnsResults,
    data: ensSearchResults = [],
    isFetched: isFetchedEnsResults
  } = useEnsSearch({
    name: addressInputValue,
    enabled:
      toChain?.chainType === ChainType.EVM &&
      // disable search when input value is a valid address
      !isWalletAddressValid(toChain, addressInputValue)
  })

  /**
   * Updates the input value.
   * If it is a valid address for the destination chain, updates the destination address in the global state
   */
  const handleUpdateAndValidateInputValue = value => {
    setAddressInputValue(value)
    if (isWalletAddressValid(toChain, value)) {
      handleAddNewDestinationAddress({
        address: value,
        redirectToPreviousRoute: false,
        fallbackAddress: fallbackAddressInputValue
      })
    }
  }

  const fuse = useMemo(() => {
    return new Fuse(ensSearchResults, {
      keys: ['ens.name'],
      includeMatches: true,
      threshold: 0.4
    })
  }, [ensSearchResults])

  const searchResults = fuse.search(addressInputValue?.trim() ?? '').map(result => result.item)

  // Show search results if the user has entered a search query
  // otherwise, show the address book
  // filter addresses for the current chain
  // and sort them to display the connected address first
  const addressesList = (isFetchedEnsResults && !!addressInputValue?.trim() ? searchResults : addressBook)
    .filter(address => address.chainType === toChain?.chainType && isWalletAddressValid(toChain, address.address))
    .sort((a, b) => {
      return sortAddressBook(a, b, destinationAddress)
    })

  const formattedAddressOrEns = connectedDestinationAddress.ens?.name ?? connectedDestinationAddress.formatted ?? ''

  const destinationAddressTab = (
    <FlexContainer>
      <EditAddress
        title={isSendView ? 'Recipient wallet' : 'Custom wallet'}
        accessory='CEX addresses are not supported'
        chain={toChain}
        placeholder={
          toChain?.chainType === ChainType.EVM
            ? `Address or ENS on ${toChain?.networkName}`
            : `Address on ${toChain?.networkName}`
        }
        input={{
          value: addressInputValue,
          onChange(value) {
            setShowConnectWalletSection(String(value).length <= 0)
            handleUpdateAndValidateInputValue(value)
          }
        }}
        messages={{
          error: `This isn't a valid ${toChain?.networkName} address`
        }}
      />

      <div
        className='tw-w-full tw-overflow-hidden'
        style={{
          maxHeight: needsFallbackAddress ? (showConnectWalletSection ? '100px' : '200px') : undefined,
          display: needsFallbackAddress && addressesList.length === 0 ? 'none' : 'flex',
          height: displayFallbackInput ? undefined : '100%'
        }}
      >
        {isFetchingEnsResults ? (
          <EmptyAddressBookContainer>
            <Loader className='tw-text-grey-300' size='32' strokeWidth='3' />
          </EmptyAddressBookContainer>
        ) : addressesList.length === 0 ? (
          <EmptyAddressBookContainer>
            <CaptionText
              className={clsx(
                'tw-text-grey-500 tw-text-center',
                isFetchedEnsResults && !!addressInputValue?.trim() ? '' : 'tw-max-w-[200px]'
              )}
            >
              {isFetchedEnsResults && !!addressInputValue?.trim()
                ? `No results for ${addressInputValue}`
                : 'Wallets you add and swap to will appear here'}
            </CaptionText>
          </EmptyAddressBookContainer>
        ) : (
          <ul className='tw-flex tw-flex-col tw-gap-squid-xxs tw-overflow-auto tw-w-full tw-pb-squid-xs tw-scrollbar-hidden'>
            {addressesList.map(address => (
              <ListItemWrapper
                key={`${address.address}-${address.ens?.name ?? ''}`}
                address={address}
                isSelected={areSameAddress(address.address, destinationAddress)}
                onClick={() => {
                  handleAddNewDestinationAddress({
                    address: address.address,
                    ens: {
                      name: address.ens?.name,
                      avatar: address.ens?.avatar
                    },
                    fallbackAddress: fallbackAddressInputValue
                  })
                }}
                itemTitle={
                  address.ens?.name ? (
                    <HighlightTextComponent text={address.ens.name} textToHighlight={addressInputValue} />
                  ) : (
                    formatHash({
                      hash: address.address,
                      chainType: toChain?.chainType
                    })
                  )
                }
                subtitle={
                  address.ens?.name
                    ? formatHash({
                        hash: address.address,
                        chainType: toChain?.chainType
                      })
                    : undefined
                }
              />
            ))}
          </ul>
        )}
      </div>

      {displayFallbackInput && (
        <EditAddress
          validateEmpty={needsFallbackAddress}
          title='Fallback address'
          accessory='Required'
          placeholder='Address on Osmosis'
          input={{
            value: fallbackAddressInputValue,
            onChange(value) {
              setShowConnectWalletSection(String(value).length <= 0)
              handleUpdateAndValidateFallbackAddress(value)
            }
          }}
          chain={osmosisChain}
          messages={{
            default:
              "We will refund tokens to this Osmosis wallet in case of high slippage. Make sure it's a valid Osmosis address.",
            error:
              needsFallbackAddress && !fallbackAddressInputValue
                ? 'Please provide a fallback Osmosis address'
                : "This isn't a valid Osmosis address"
          }}
        />
      )}
    </FlexContainer>
  )

  const navigationBar = <NavigationBar />

  // If the wallet is handled externally, we don't need to show the wallet selector
  // Because the user wont be able to select a wallet
  // Example if he is on ledger or gnosis safe context
  if (walletHandledExternally) {
    return (
      <div className='tw-flex tw-h-full tw-w-full tw-flex-1 tw-flex-col tw-overflow-hidden'>
        {navigationBar}
        <BorderedContainer className='tw-overflow-hidden tw-h-full'>{destinationAddressTab}</BorderedContainer>
      </div>
    )
  }

  return (
    <React.Fragment>
      {navigationBar}

      {!isSendView && (
        <BorderedContainer className='tw-min-h-fit'>
          <Collapse collapsed={!showConnectWalletSection}>
            <FlexContainer>
              <SectionTitle title='Your wallet' icon={<PunkIcon />} />

              <ListItem
                itemTitle={
                  isConnectedInDestination ? formattedAddressOrEns : `Not connected to ${toChain?.networkName}`
                }
                subtitle={isConnectedInDestination ? connectedDestinationAddress.formatted : undefined}
                mainImageUrl={
                  (isConnectedInDestination && connectedDestinationAddress.ens?.avatar) || toChain?.chainIconURI
                }
                size='large'
                rounded='xs'
                className={clsx(
                  'tw-w-full tw-max-w-none',
                  isConnectedInDestination ? 'tw-text-grey-300' : 'tw-text-grey-600'
                )}
                isSelected={isDestinationAddressSameAsConnectedAddress}
                icon={
                  <CaptionText className='tw-text-royal-500'>
                    {isConnectedInDestination ? 'Connected' : undefined}
                  </CaptionText>
                }
                onClick={isConnectedInDestination ? resetDestinationAddressToConnectedWallet : undefined}
              />

              <div className='tw-px-squid-m tw-pb-squid-s tw-pt-squid-xxs tw-flex tw-w-full tw-items-center tw-justify-center'>
                <Button
                  size='md'
                  variant='primary'
                  label={isConnectedInDestination ? 'Change wallet' : 'Connect'}
                  className='tw-w-full'
                  containerClassName='tw-w-full'
                  onClick={() =>
                    switchRoute(routes.wallets, {
                      chainId: isFiatOnRamp ? fiatOnRampChainId : isSendView ? sendViewChainId : toChain?.chainId
                    })
                  }
                />
              </div>
            </FlexContainer>
          </Collapse>
        </BorderedContainer>
      )}

      {destinationAddressTab}
    </React.Fragment>
  )
}

export const FlexContainer = ({ children }) => (
  <div className='tw-gap-squid-xxs tw-flex tw-flex-col tw-items-center mobile-lg:tw-px-2.5 tw-max-h-full tw-h-full tw-overflow-hidden tw-w-full'>
    {children}
  </div>
)

const EmptyAddressBookContainer = ({ children }) => {
  return (
    <div className='tw-gap-squid-xxs tw-px-squid-xxl tw-py-squid-xl tw-flex tw-h-full tw-w-full tw-flex-1 tw-flex-col tw-items-center tw-justify-center tw-self-stretch'>
      {children}
    </div>
  )
}

/**
 * A wrapper for ListItem with a placeholder avatar in case there's no avatar for the given address.
 */
const ListItemWrapper = ({ onClick, itemTitle, subtitle, isSelected, address }) => {
  const addressAvatar = useAvatar(address.address)
  return (
    <ListItem
      onClick={onClick}
      itemTitle={itemTitle}
      subtitle={subtitle}
      mainImageUrl={getEnsAvatar(address)}
      placeholderImageUrl={addressAvatar}
      isSelected={isSelected}
      rounded='xs'
    />
  )
}

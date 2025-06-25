import {
  isWalletAddressValid,
  useDepositAddress,
  useIntegratorContext,
  useMultiChainWallet,
  useSwap,
  useSwapRoutePersistStore
} from 'src/components/swap/widget/react-hooks'
import React from 'react'
import {
  BankIcon,
  BorderedContainer,
  Button,
  CaptionText,
  cn,
  CoinsAddIcon,
  Image,
  Input,
  ListItem,
  PunkIcon,
  SectionTitle,
  WalletIcon
} from '@0xsquid/ui'
import { useCallback, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { NavigationBar } from '../components/NavigationBar'
import { routes } from '../core/routes'
import { useSwapRouter } from '../hooks/useSwapRouter'
import { FlexContainer } from './DestinationAddressView'

export function PaymentMethodView() {
  const { fromChain, fromToken } = useSwap()
  const { switchRoute, previousRoute } = useSwapRouter()
  const {
    isEnabled: isDepositAddressEnabled,
    enable: enableDepositAddress,
    disable: disableDepositAddress
  } = useDepositAddress()

  const { connectedAddress: connectedSourceAddress, networkConnected: isConnectedOnSource } =
    useMultiChainWallet(fromChain)

  const formattedAddressOrEns = connectedSourceAddress?.ens?.name ?? connectedSourceAddress?.formatted ?? ''

  const [isValidDepositRefundAddress, setIsValidDepositRefundAddress] = useState(false)

  const handleSelectDepositAddress = useCallback(() => {
    enableDepositAddress()
  }, [enableDepositAddress])

  const handleSelectConnectedWallet = useCallback(() => {
    previousRoute()
    disableDepositAddress()
  }, [previousRoute, disableDepositAddress])

  return (
    <>
      <NavigationBar />
      <div className='tw-overflow-auto tw-scrollbar-hidden tw-flex tw-flex-col tw-h-full'>
        <BorderedContainer className='tw-min-h-fit'>
          <FlexContainer>
            <SectionTitle title='Your wallet' icon={<PunkIcon />} />
            <ListItem
              itemTitle={isConnectedOnSource ? formattedAddressOrEns : `Not connected to ${fromChain?.networkName}`}
              subtitle={isConnectedOnSource ? connectedSourceAddress.formatted : undefined}
              mainImageUrl={(isConnectedOnSource && connectedSourceAddress?.ens?.avatar) || fromChain?.chainIconURI}
              size='large'
              rounded='xs'
              className={cn('tw-w-full tw-max-w-none', isConnectedOnSource ? 'tw-text-grey-300' : 'tw-text-grey-600')}
              isSelected={!isDepositAddressEnabled && isConnectedOnSource}
              onClick={isConnectedOnSource ? handleSelectConnectedWallet : undefined}
              icon={
                <CaptionText className='tw-text-royal-500'>{isConnectedOnSource ? 'Connected' : undefined}</CaptionText>
              }
            />
            <div className='tw-px-squid-m tw-pb-squid-s tw-pt-squid-xxs tw-flex tw-w-full tw-items-center tw-justify-center'>
              <Button
                size='md'
                variant='primary'
                label={isConnectedOnSource ? 'Change wallet' : 'Connect'}
                className='tw-w-full'
                containerClassName='tw-w-full'
                onClick={() =>
                  switchRoute(routes.wallets, {
                    chainId: fromChain?.chainId,
                    onConnect() {
                      handleSelectConnectedWallet()
                    }
                  })
                }
              />
            </div>
          </FlexContainer>
        </BorderedContainer>

        <BorderedContainer className='tw-flex-1 tw-pt-squid-xs'>
          <div className='tw-gap-squid-xxs tw-flex tw-flex-col tw-items-center mobile-lg:tw-px-2.5 tw-max-h-full tw-h-full tw-w-full'>
            <SectionTitle title='Centralized Exchange' icon={<BankIcon />} />
            <ListItem
              multilineSubtitle={true}
              subtitle={`Send ${fromToken?.symbol} to a temporary deposit. Your swap is made once the transaction is confirmed.`}
              itemTitle='Deposit'
              mainIcon={
                <div className='tw-flex tw-h-full tw-items-center tw-justify-center tw-rounded-squid-xs tw-bg-royal-500 tw-text-grey-100'>
                  <CoinsAddIcon />
                </div>
              }
              className='tw-w-full tw-max-w-none'
              onClick={handleSelectDepositAddress}
              isSelected={isDepositAddressEnabled}
            />
            <DepositRefundAddressForm
              isValidDepositRefundAddress={isValidDepositRefundAddress}
              setIsValidDepositRefundAddress={setIsValidDepositRefundAddress}
            />
          </div>
        </BorderedContainer>

        {isDepositAddressEnabled && (
          <div className='tw-px-squid-m tw-py-squid-s tw-mt-auto'>
            <Button
              variant='primary'
              size='lg'
              label={
                isDepositAddressEnabled && !isValidDepositRefundAddress
                  ? 'Add a fallback address'
                  : 'Continue with deposit'
              }
              disabled={
                (!isConnectedOnSource && !isDepositAddressEnabled) ||
                (isDepositAddressEnabled && !isValidDepositRefundAddress)
              }
              onClick={() => previousRoute()}
              className='tw-w-full'
            />
          </div>
        )}
      </div>
    </>
  )
}

function DepositRefundAddressForm({ isValidDepositRefundAddress, setIsValidDepositRefundAddress }) {
  const { widgetInIframe } = useIntegratorContext()
  const { isEnabled: isDepositAddressEnabled } = useDepositAddress()
  const { previousRoute } = useSwapRouter()
  const { fromChain, onSwapChange } = useSwap()
  const depositRefundAddress = useSwapRoutePersistStore(store => store.swapRoute?.depositRefundAddress)
  const [depositRefundAddressInputValue, setDepositRefundAddressInputValue] = useState(depositRefundAddress ?? '')

  const pasteFromClipboard = useCallback(async () => {
    try {
      const clipboardText = await navigator.clipboard.readText()
      validateDepositRefundAddress(clipboardText)
    } catch (error) {
      console.error('Failed to read clipboard:', error)
    }
  }, [])

  const validateDepositRefundAddress = useCallback(
    value => {
      const isValid = isWalletAddressValid(fromChain, value)
      setIsValidDepositRefundAddress(isValid)
      setDepositRefundAddressInputValue(value)
      if (isValid) {
        onSwapChange({
          depositRefundAddress: value
        })
      }
    },
    [fromChain, onSwapChange, setIsValidDepositRefundAddress]
  )

  const { connectedAddress } = useMultiChainWallet(fromChain)

  // Just to handle the lifecycle of the component
  // If user re-opens and the depositRefundAddress is still valid, we don't need to validate it again, but want to show it as valid
  useEffect(() => {
    if (depositRefundAddress) {
      const isValid = isWalletAddressValid(fromChain, depositRefundAddress)
      setIsValidDepositRefundAddress(isValid)
    }
  }, [])

  useEffect(() => {
    if (connectedAddress.address && !depositRefundAddress) {
      validateDepositRefundAddress(connectedAddress.address)
    }
  }, [connectedAddress.address, depositRefundAddress, validateDepositRefundAddress])

  if (!isDepositAddressEnabled) return null

  return (
    <>
      <SectionTitle title='Fallback wallet' accessory='Required' icon={<WalletIcon />} />
      <form
        onSubmit={event => {
          event.preventDefault()
          if (isValidDepositRefundAddress) {
            previousRoute()
          }
        }}
        className='tw-flex tw-py-squid-xxs tw-px-squid-m tw-flex-col tw-justify-center tw-items-start tw-gap-squid-s tw-self-stretch'
      >
        <Input
          autoComplete='off'
          autoCorrect='off'
          spellCheck={false}
          isError={!isValidDepositRefundAddress}
          autoFocus={!isMobile}
          onChange={event => validateDepositRefundAddress(event.target.value)}
          value={depositRefundAddressInputValue}
          placeholder={`Address on ${fromChain?.networkName}`}
          actionButtonProps={
            widgetInIframe
              ? undefined
              : {
                  label: 'Paste',
                  onClick: pasteFromClipboard
                }
          }
          icon={
            <Image
              src={fromChain?.chainIconURI}
              rounded='xxs'
              style={{
                width: 24,
                height: 24
              }}
            />
          }
        />
        <CaptionText className='tw-text-grey-500 tw-text-center tw-w-full'>
          Address to receive a refund in case of transaction failure.
        </CaptionText>
      </form>
    </>
  )
}

import {
  areSameAddress,
  formatHash,
  formatTokenAmount,
  getTokenImage,
  useAvailableQuotes,
  useAvatar,
  useClient,
  useCurrencyDetails,
  useDebouncedValue,
  useExecuteFiatQuote,
  useGetFiatQuote,
  useGetOnRampConfig,
  useGetOnrampPaymentTypes,
  useMultiChainWallet,
  useSquidChains,
  useSquidTokens,
  useSuggestedFiatAmounts
} from 'src/components/swap/widget/react-hooks'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDownIcon,
  BodyText,
  Button,
  CaptionText,
  ChevronArrowIcon,
  ChevronDownSmallIcon,
  Chip,
  cn,
  ErrorMessage,
  Loader,
  NumericInput,
  SwapConfiguration,
  Tooltip,
  UserInputType
} from '@0xsquid/ui'
import { PaymentMethodIcon } from '../../components/PaymentMethodIcon'
import { TOOLTIP_DISPLAY_DELAY_MS } from '../../core/constants'
import { routes } from '../../core/routes'
import { useSwapRouter } from '../../hooks/useSwapRouter'
import { useXrplConditions } from '../../hooks/useXrplConditions'
import { defaultAssetsColors, getEnsAvatar, getTokensForFiatOnRampView } from '../../services/internal/assetsService'
import { openExternalLink } from '../../services/internal/urlService'
import { useFiatOnRampStore } from '../../store/useFiatOnRampStore'
import { CountryFlag } from './CountryFlag'

const BASE_USDC_TOKEN = {
  address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  chainId: '8453'
}

export function FiatConfiguration({
  currencyDetails,
  amount,
  onAmountChange,
  onCurrencyClick,
  suggestedAmounts = [100, 500, 1000],
  selectedPaymentMethod,
  onPaymentMethodClick
}) {
  const currencyButton = useMemo(
    () => ({
      id: 'currency-selector',
      labelOrIcon: (
        <div className='tw-flex tw-items-center tw-gap-squid-xs'>
          {currencyDetails?.code && <CountryFlag rounded countryCode={currencyDetails.countryCode || ''} size='md' />}
          <span className='tw-font-medium'>{currencyDetails?.code}</span>
        </div>
      ),
      tooltip: {
        tooltipContent: 'Select currency',
        displayDelayMs: TOOLTIP_DISPLAY_DELAY_MS.DEFAULT
      }
    }),
    [currencyDetails]
  )

  return (
    <section className='tw-px-squid-l tw-relative tw-flex tw-w-full tw-flex-col tw-border-t tw-border-t-material-light-thin tw-bg-grey-900 mobile-lg:tw-w-card-large tw-h-full tw-pt-squid-s tw-pb-squid-m'>
      <div className='tw-flex tw-w-full tw-items-center tw-justify-between tw-pt-squid-xxs'>
        <header className='tw-h-squid-[50px] tw-flex tw-items-center tw-self-stretch tw-py-squid-xxs'>
          <div className='tw-flex tw-items-center'>
            <Tooltip
              tooltipContent='Pay with'
              displayDelayMs={TOOLTIP_DISPLAY_DELAY_MS.DEFAULT}
              tooltipWidth='max'
              containerClassName='tw-w-fit'
            >
              <button
                type='button'
                onClick={onPaymentMethodClick}
                className='-tw-ml-squid-xs tw-flex tw-h-squid-l tw-items-center tw-gap-squid-xxs tw-rounded-squid-s tw-px-squid-xs tw-text-grey-600 hover:tw-bg-material-light-thin'
              >
                <BodyText className='tw-text-grey-500' size='small'>
                  Pay
                </BodyText>
                {selectedPaymentMethod && (
                  <>
                    <span> :</span>
                    <div className='tw-flex tw-items-center tw-gap-1'>
                      <PaymentMethodIcon method={selectedPaymentMethod} size='tiny' />
                      <BodyText
                        size='small'
                        className={selectedPaymentMethod ? 'tw-text-grey-300' : 'tw-text-royal-500'}
                      >
                        {selectedPaymentMethod?.name || 'Select payment method'}
                      </BodyText>
                      <ChevronArrowIcon className={selectedPaymentMethod ? 'tw-text-grey-600' : 'tw-text-royal-500'} />
                    </div>
                  </>
                )}
              </button>
            </Tooltip>
          </div>
        </header>
        <Tooltip {...currencyButton.tooltip} tooltipWidth='max' containerClassName='tw-w-fit'>
          <Button
            size='md'
            variant='tertiary'
            icon={currencyButton.labelOrIcon}
            onClick={onCurrencyClick}
            className='!tw-pl-[4px]'
          />
        </Tooltip>
      </div>

      <div>
        <div className='tw-relative tw-flex tw-w-full tw-flex-col'>
          <div className='tw-text-heading-small tw-font-regular'>
            <div className='tw-flex tw-items-center tw-justify-center'>
              <NumericInput
                forcedAmount={amount ?? ''}
                hideControls={true}
                hideBalance={true}
                customSymbol={currencyDetails?.symbol}
                token={{
                  price: 1,
                  symbol: currencyDetails?.symbol ?? '',
                  decimals: 18
                }}
                initialInputMode={UserInputType.USD}
                onAmountChange={e => onAmountChange?.(e)}
                isInteractive={true}
                maxUsdDecimals={2}
                containerClassName='!tw-px-0'
                inputClassName='tw-h-[55px] tw-w-full tw-rounded-squid-s tw-bg-transparent tw-px-squid-xs tw-py-squid-s tw-text-heading-small tw-text-grey-300 placeholder:tw-text-grey-600 hover:tw-bg-material-light-thin focus:tw-bg-material-light-thin focus:tw-text-royal-500 focus:tw-outline-none'
                placeholder='0'
                debounceInput={false}
              />
            </div>
          </div>

          <div className='tw-flex tw-h-squid-m tw-items-center tw-justify-start tw-gap-squid-xxs tw-self-stretch'>
            {suggestedAmounts.map(amount => (
              <Chip
                key={amount}
                label={`${currencyDetails?.symbol}${amount}`}
                onClick={() => onAmountChange?.(amount.toString())}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export const FiatOnRampView = () => {
  const { switchRoute } = useSwapRouter()
  const {
    selectedToken,
    selectedCountry,
    setSelectedQuote,
    selectedQuote,
    selectedCurrency,
    setSelectedCurrency,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    setCurrentQuote,
    destinationAddress,
    setDestinationAddress,
    setSelectedToken
  } = useFiatOnRampStore()

  const { findChain } = useSquidChains()
  const { userCountry, defaultCurrency } = useClient()
  const [inputValue, setInputValue] = useState('')
  const debouncedInputValue = useDebouncedValue(inputValue, 500)
  const [isQuoteEnabled, setIsQuoteEnabled] = useState(false)
  const prevProviderIdRef = useRef()

  // Use selectedCountry if defined, otherwise fall back to userCountry
  const currentCountry = selectedCountry || userCountry
  const currencyDetails = useCurrencyDetails(selectedCurrency)

  const { data: paymentTypes } = useGetOnrampPaymentTypes({
    fiatCurrency: selectedCurrency || defaultCurrency,
    cryptoCurrencyID: selectedToken?.cryptoCurrencyID || '',
    region: currentCountry,
    enabled: !!selectedToken?.cryptoCurrencyID && !!(selectedCurrency || defaultCurrency)
  })

  const {
    data: quote,
    isFetching: isQuoteFetching,
    isSuccess: isQuoteSuccess,
    error: quoteError
  } = useGetFiatQuote({
    fiatCurrency: selectedCurrency || defaultCurrency,
    cryptoCurrencyID: selectedToken?.cryptoCurrencyID || '',
    amount: Number(debouncedInputValue),
    region: currentCountry,
    paymentMethod: selectedPaymentMethod?.id,
    enabled: isQuoteEnabled
  })

  useEffect(() => {
    if (isQuoteSuccess && quote) {
      setCurrentQuote(quote)
      if (quote.quotes?.length > 0) {
        setSelectedQuote(quote.quotes[0]) // First is most recommended
      }
    }
  }, [isQuoteSuccess, quote])

  // Effect to set the recommended payment method once they are fetched
  useEffect(() => {
    if (paymentTypes && paymentTypes.length > 0 && !selectedPaymentMethod) {
      setSelectedPaymentMethod(paymentTypes[0]) // First is most recommended
      setIsQuoteEnabled(true) // Enable quote fetching
    }
  }, [paymentTypes, selectedPaymentMethod, setSelectedPaymentMethod])

  // When the input amount changes, re-enable quote fetching
  useEffect(() => {
    if (debouncedInputValue && Number(debouncedInputValue) > 0) {
      setIsQuoteEnabled(true)
    }
  }, [debouncedInputValue])

  // Get the current payment method limits
  const currentPaymentMethodLimits = useMemo(() => {
    if (selectedQuote && selectedPaymentMethod) {
      // Find the payment method in the selected quote's payment methods
      const methodInQuote = selectedQuote.paymentMethods.find(m => m.id === selectedPaymentMethod.id)
      // Use provider-specific limits if available
      if (methodInQuote?.details?.limits?.aggregatedLimit) {
        return methodInQuote.details.limits.aggregatedLimit
      }
    }
    // Fallback to general limits if no provider-specific limits found
    if (selectedPaymentMethod?.details?.limits?.aggregatedLimit) {
      return selectedPaymentMethod.details.limits.aggregatedLimit
    }
    return null
  }, [selectedQuote, selectedPaymentMethod])

  const isAmountWithinLimits = useMemo(() => {
    if (!currentPaymentMethodLimits || !debouncedInputValue) return false
    const amount = Number(debouncedInputValue)
    return amount >= currentPaymentMethodLimits.min && amount <= currentPaymentMethodLimits.max
  }, [debouncedInputValue, currentPaymentMethodLimits])

  // Destructure isLoading from the mutation
  const { mutateAsync: executeQuoteAsync, isLoading: isExecutingQuote } = useExecuteFiatQuote()

  const selectedChain = useMemo(() => {
    if (!selectedToken) return undefined
    return findChain(selectedToken.chainId)
  }, [selectedToken, findChain])

  const { connectedAddress, networkConnected, wallet: connectedWallet } = useMultiChainWallet(selectedChain)

  useEffect(() => {
    if (networkConnected && connectedAddress?.address && !destinationAddress) {
      setDestinationAddress(connectedAddress)
    }
  }, [networkConnected, connectedAddress, destinationAddress, setDestinationAddress])

  const selectedTokenUI = useMemo(() => {
    if (!selectedToken) return undefined
    return {
      ...selectedToken,
      bgColor: selectedToken?.bgColor || defaultAssetsColors.tokenBg,
      iconUrl: getTokenImage(selectedToken) ?? '',
      symbol: selectedToken?.symbol ?? '',
      textColor: selectedToken?.textColor || defaultAssetsColors.tokenText,
      decimals: selectedToken?.decimals ?? 18
    }
  }, [selectedToken])

  const selectedChainUI = useMemo(() => {
    if (!selectedChain) return undefined
    return {
      ...selectedChain,
      bgColor: selectedChain?.bgColor || defaultAssetsColors.chainBg,
      iconUrl: selectedChain?.chainIconURI ?? ''
    }
  }, [selectedChain])

  // Get available and recommended quotes
  const availableQuotes = useAvailableQuotes(quote?.quotes)

  const handleInputChange = useCallback(value => {
    setInputValue(value)
  }, [])

  const handleSelectToken = useCallback(() => {
    switchRoute(routes.allTokens, {
      isFiatOnRamp: true,
      direction: 'to'
    })
  }, [switchRoute])

  const handleCheckout = async () => {
    if (!quote || !destinationAddress?.address || !selectedQuote || !selectedPaymentMethod || !selectedCurrency) {
      return
    }

    try {
      const response = await executeQuoteAsync({
        fiatCurrency: selectedCurrency,
        cryptoCurrencyID: selectedToken?.cryptoCurrencyID || '',
        amount: Number(debouncedInputValue),
        walletAddress: destinationAddress.address,
        paymentMethod: selectedPaymentMethod.id,
        region: currentCountry,
        squidToken: selectedToken,
        cryptoAmount: selectedQuote.receivedAmount,
        providerId: selectedQuote.internalProviderId,
        onrampProviderId: selectedQuote.onrampProviderId,
        orderId: selectedQuote.quoteId
      })

      if (response.redirectUrl) {
        switchRoute(routes.fiatOnRampProgress, {
          fiatCurrency: selectedCurrency,
          amount: Number(debouncedInputValue),
          walletAddress: destinationAddress.address,
          squidToken: selectedToken,
          cryptoAmount: selectedQuote.receivedAmount
        })
        openExternalLink(response.redirectUrl)
      }
    } catch (error) {
      console.error('Failed to execute quote:', error)
    }
  }

  // Display error message if we have a NO_QUOTES_AVAILABLE error and no limits are known
  const noQuotes = useMemo(() => {
    if (!quoteError) return false
    return quoteError.message === 'NO_QUOTES_AVAILABLE' && !currentPaymentMethodLimits
  }, [quoteError, currentPaymentMethodLimits])

  // Add this check for destination address connection
  const isDestAddressConnected = useMemo(() => {
    if (!destinationAddress?.address || !selectedChain?.chainType) return false
    return areSameAddress(destinationAddress.address, connectedAddress.address)
  }, [destinationAddress?.address, selectedChain?.chainType, connectedAddress])

  const { buttonState: xrplButtonState } = useXrplConditions({
    destinationAddress: destinationAddress?.address,
    chain: selectedChain,
    token: selectedToken,
    amount: selectedQuote?.receivedAmount?.toString() ?? '',
    isDestAddressConnected
  })

  // Update the button state logic
  const { label, onClick, disabled } = useMemo(() => {
    if (!debouncedInputValue || Number(debouncedInputValue) <= 0) {
      return {
        label: 'Enter amount',
        disabled: true
      }
    }

    // Show limits message if amount is outside range
    if (currentPaymentMethodLimits && !isAmountWithinLimits) {
      const amount = Number(debouncedInputValue)
      if (amount < currentPaymentMethodLimits.min) {
        return {
          label: `Minimum amount: ${currencyDetails?.symbol}${currentPaymentMethodLimits.min}`,
          disabled: true
        }
      }
      if (amount > currentPaymentMethodLimits.max) {
        return {
          label: `Maximum amount: ${currencyDetails?.symbol}${currentPaymentMethodLimits.max}`,
          disabled: true
        }
      }
    }

    if (!selectedToken?.cryptoCurrencyID) {
      return {
        label: 'Select token',
        onClick: () =>
          switchRoute(routes.allTokens, {
            isFiatOnRamp: true,
            direction: 'to'
          }),
        disabled: true
      }
    }

    if (!destinationAddress) {
      return {
        label: 'Select recipient',
        onClick: () =>
          switchRoute(routes.destination, {
            isFiatOnRamp: true,
            chainId: selectedToken?.chainId
          }),
        disabled: false
      }
    }

    // If XRP conditions should block, return the XRP button state
    if (xrplButtonState.shouldBlock) {
      return {
        ...xrplButtonState,
        label: xrplButtonState.label ?? 'Account not activated'
      }
    }

    return {
      label: isExecutingQuote ? 'Opening payment...' : isQuoteFetching ? 'Getting quotes...' : 'Checkout',
      onClick: handleCheckout,
      disabled: !quote || isQuoteFetching || !selectedQuote || isExecutingQuote
    }
  }, [
    selectedToken,
    quote,
    debouncedInputValue,
    destinationAddress,
    switchRoute,
    currencyDetails,
    currentPaymentMethodLimits,
    isAmountWithinLimits,
    isQuoteFetching,
    selectedQuote,
    isExecutingQuote,
    xrplButtonState
  ])

  // Set default currency if none selected
  useEffect(() => {
    if (!selectedCurrency) {
      setSelectedCurrency(defaultCurrency)
    }
  }, [defaultCurrency, selectedCurrency, setSelectedCurrency])

  const suggestedAmounts = useSuggestedFiatAmounts(selectedCurrency)
  const destAddressFallbackAvatar = useAvatar(destinationAddress?.address)

  const getWalletButton = () => {
    if (!destinationAddress || !selectedChain) {
      return {
        icon: undefined,
        address: undefined
      }
    }

    const isDestAddressSameAsConnected = areSameAddress(destinationAddress.address, connectedAddress.address)

    return {
      address:
        destinationAddress.ens?.name ||
        formatHash({
          hash: destinationAddress.address,
          chainType: selectedChain.chainType
        }),
      icon: isDestAddressSameAsConnected
        ? connectedWallet?.icon
        : getEnsAvatar(destinationAddress) || destAddressFallbackAvatar
    }
  }

  const walletButton = getWalletButton()

  const { tokens } = useSquidTokens()
  const { data: onRampConfig } = useGetOnRampConfig()

  useEffect(() => {
    if (!selectedToken && tokens) {
      const availableTokens = getTokensForFiatOnRampView({
        tokens,
        onRampConfig
      })

      // Try to find base USDC
      const baseUSDC = availableTokens.find(
        token =>
          token.address.toLowerCase() === BASE_USDC_TOKEN.address.toLowerCase() &&
          token.chainId === BASE_USDC_TOKEN.chainId
      )

      // Find the supported token in the onRamp config
      const supportedToken = onRampConfig?.supportedCryptos.find(
        t => t.address.toLowerCase() === baseUSDC?.address.toLowerCase() && t.chainId === baseUSDC?.chainId
      )

      // If found, set it as selected token
      if (baseUSDC && supportedToken) {
        setSelectedToken({
          ...baseUSDC,
          cryptoCurrencyID: supportedToken.id
        })
      }
    }
  }, [selectedToken, tokens, onRampConfig, setSelectedToken])

  return (
    <>
      <FiatConfiguration
        currencyDetails={{
          symbol: currencyDetails?.symbol ?? '$',
          code: selectedCurrency || defaultCurrency,
          countryCode: currencyDetails?.countryCode
        }}
        amount={inputValue}
        onAmountChange={handleInputChange}
        onCurrencyClick={() => switchRoute(routes.fiatOnRampCurrency)}
        suggestedAmounts={suggestedAmounts}
        selectedPaymentMethod={selectedPaymentMethod}
        onPaymentMethodClick={() => switchRoute(routes.fiatOnRampPaymentMethod)}
      />

      <div className='tw-h-[50px] tw-shrink-0 tw-flex tw-items-center tw-border-t tw-border-material-light-thin tw-px-squid-m tw-relative'>
        {noQuotes ? (
          <ErrorMessage message='No quotes found. Try changing your source currency' />
        ) : (
          <div className='tw-absolute tw-left-1/2 tw--translate-x-1/2'>
            {isQuoteFetching ? (
              <Loader size='24' className='tw-text-grey-600' />
            ) : (
              <ArrowDownIcon className='tw-h-6 tw-w-6 tw-text-grey-500' />
            )}
          </div>
        )}

        {selectedQuote && (
          <Tooltip
            tooltipContent='Checkout with'
            displayDelayMs={TOOLTIP_DISPLAY_DELAY_MS.DEFAULT}
            tooltipWidth='max'
            containerClassName='tw-w-fit'
          >
            <button
              type='button'
              onClick={() =>
                switchRoute(routes.fiatOnRampProviders, {
                  amount: Number(debouncedInputValue),
                  currency: selectedCurrency
                })
              }
              className='tw-flex tw-items-center tw-gap-squid-xxs tw-rounded-squid-s tw-px-squid-xs hover:tw-bg-material-light-thin tw-max-w-[200px] tw-py-squid-xxs'
            >
              <div className='tw-flex tw-h-6 tw-w-6 tw-flex-shrink-0 tw-items-center tw-justify-center tw-rounded-full tw-font-bold'>
                {selectedQuote?.providerIcon && (
                  <img
                    src={selectedQuote.providerIcon}
                    alt={selectedQuote.providerName}
                    className='tw-h-full tw-w-full tw-rounded-squid-xs'
                  />
                )}
              </div>
              <div className='tw-flex tw-items-center'>
                <span className='tw-text-xl tw-text-grey-300 tw-truncate'>
                  {selectedQuote?.providerName || 'Select provider'}
                </span>
                <ChevronDownSmallIcon className='tw-h-4 tw-w-4 tw-text-grey-500' />
              </div>
            </button>
          </Tooltip>
        )}
      </div>

      <span
        className={cn(
          'tw-relative tw-flex tw-w-full tw-flex-col mobile-lg:tw-w-card-large tw-h-full tw-pb-squid-m',
          !selectedQuote || (!currencyDetails && 'tw-h-full')
        )}
      >
        <SwapConfiguration
          direction='to'
          fullHeight={!selectedQuote || !currencyDetails}
          chain={selectedChainUI}
          showWalletButtonHeader={true}
          walletButton={{
            address: walletButton.address,
            showIcon: true,
            walletIconUrl: walletButton.icon,
            tooltip: {
              tooltipContent: 'Select recipient',
              displayDelayMs: TOOLTIP_DISPLAY_DELAY_MS.DEFAULT
            },
            onClick: () =>
              switchRoute(routes.destination, {
                isFiatOnRamp: true,
                chainId: selectedToken?.chainId
              })
          }}
          amount={!availableQuotes.length ? '0' : selectedQuote?.receivedAmount.toString()}
          token={selectedTokenUI}
          assetsButton={{
            onClick: handleSelectToken,
            tooltip: {
              tooltipContent: 'Select chain and token',
              displayDelayMs: TOOLTIP_DISPLAY_DELAY_MS.DEFAULT
            }
          }}
          isFetching={isQuoteFetching}
          tokenPrice={selectedToken?.usdPrice}
          isInputInteractive={false}
          showNumericInputDetails={false}
        />
        {selectedQuote && currencyDetails && (
          <CaptionText
            tight={true}
            className='tw-text-grey-500 tw-px-squid-m mobile-lg:tw-px-squid-l tw-flex tw-h-squid-m tw-max-h-squid-m tw-items-center tw-justify-between tw-gap-2'
          >
            {`1 ${selectedToken?.symbol} = ${formatTokenAmount(selectedQuote?.rate.toString(), {
              exact: false
            })} ${currencyDetails?.denomination}`}
          </CaptionText>
        )}
      </span>

      <div className='tw-px-squid-m tw-pb-squid-m tw-h-full tw-max-h-[80px] tw-flex tw-flex-col'>
        <Button variant='primary' size='lg' label={label} disabled={disabled} onClick={onClick} className='tw-w-full' />
      </div>
    </>
  )
}

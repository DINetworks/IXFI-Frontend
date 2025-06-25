import { Fragment } from 'react'
import { formatTokenAmount, useAvailableQuotes, useCurrencyDetails } from 'src/components/swap/widget/react-hooks'
import {
  Button,
  CaptionText,
  cn,
  ListItem,
  Modal,
  ModalContent,
  ModalTitle,
  PriceChange,
  SectionTitle
} from '@0xsquid/ui'
import { useCallback } from 'react'
import { useSwapRouter } from '../../hooks/useSwapRouter'
import { useFiatOnRampStore } from '../../store/useFiatOnRampStore'

const ProviderListItem = ({
  provider,
  onSelect,
  isSelected,
  recommendedRate,
  token,
  displayPriceChange = true,
  disabled = false
}) => {
  const { selectedCurrency } = useFiatOnRampStore()
  const currencyDetails = useCurrencyDetails(selectedCurrency || 'USD')

  // Calculate percentage difference from recommended rate
  const getPercentageDiff = (receivedAmount, recommendedRate) => {
    if (!recommendedRate) return 0
    return ((receivedAmount - recommendedRate) / recommendedRate) * 100
  }

  const percentageDiff = getPercentageDiff(provider.receivedAmount, recommendedRate)

  const getLimitsMessage = () => {
    const methodWithLimits = provider.paymentMethods.find(method => method?.details?.limits?.aggregatedLimit)

    if (!methodWithLimits?.details?.limits?.aggregatedLimit) return null

    const { min, max } = methodWithLimits.details.limits.aggregatedLimit
    return `Limits: ${currencyDetails?.symbol}${formatTokenAmount(min.toString(), {
      exact: false
    })} - ${currencyDetails?.symbol}${formatTokenAmount(max.toString(), {
      exact: false
    })}`
  }

  return (
    <ListItem
      key={provider.onrampProviderId}
      mainIcon={
        provider.providerIcon ? (
          <img
            src={provider.providerIcon}
            alt={provider.providerName}
            className={cn('tw-h-10 tw-w-10 tw-object-contain', disabled && 'tw-opacity-50')}
          />
        ) : (
          <div
            className={cn(
              'tw-h-10 tw-w-10 tw-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-royal-500',
              disabled && 'tw-opacity-50'
            )}
          >
            <span className='tw-text-white tw-font-medium'>{provider.providerName.charAt(0)}</span>
          </div>
        )
      }
      itemTitle={provider.providerName}
      className={cn('tw-bg-transparent', disabled && 'tw-opacity-50 hover:tw-bg-transparent tw-cursor-not-allowed')}
      icon={
        <div className='tw-flex tw-flex-col tw-items-end tw-gap-1'>
          <CaptionText className='tw-text-grey-500'>
            {disabled ? (
              getLimitsMessage() || 'Not supported for this amount'
            ) : (
              <Fragment>
                {formatTokenAmount(provider.receivedAmount.toString(), {
                  exact: false
                })}{' '}
                {token?.symbol}
              </Fragment>
            )}
          </CaptionText>
          {displayPriceChange && !disabled && (
            <PriceChange value={percentageDiff} variant='small' highlightText triangle='suffix' />
          )}
        </div>
      }
      onClick={() => !disabled && onSelect(provider)}
      isSelected={isSelected}
    />
  )
}

export function FiatOnRampProvidersView() {
  const { handleCloseModal, isModalOpen, modalRoute } = useSwapRouter()
  const { currentQuote, selectedQuote, setSelectedQuote, selectedToken, setSelectedPaymentMethod } =
    useFiatOnRampStore()

  // Get the amount from route params
  const params = modalRoute?.params
  const currentAmount = params?.amount

  const availableQuotes = useAvailableQuotes(currentQuote?.quotes)
  const recommendedQuote = availableQuotes[0] // First is most recommended

  // Function to check if a provider supports the current amount
  const isProviderSupported = useCallback(
    provider => {
      // Find the first payment method with limits
      const methodWithLimits = provider.paymentMethods.find(method => method?.details?.limits?.aggregatedLimit)

      if (!methodWithLimits?.details?.limits?.aggregatedLimit) return true

      const { min, max } = methodWithLimits.details.limits.aggregatedLimit

      // Use the current amount from the route params, default to 0 if undefined
      return (currentAmount ?? 0) >= min && (currentAmount ?? 0) <= max
    },
    [currentAmount]
  )

  const handleSelectProvider = useCallback(
    provider => {
      setSelectedQuote(provider)
      handleCloseModal()
    },
    [setSelectedQuote, handleCloseModal]
  )

  // If no quotes are available, show a message
  if (!availableQuotes?.length || !selectedToken) {
    return (
      <Modal onBackdropClick={handleCloseModal} isOpen={isModalOpen}>
        <ModalContent>
          <ModalTitle title='No quotes available' />
          <footer className='tw-flex tw-h-squid-xxl tw-items-center tw-justify-center tw-self-stretch tw-px-squid-m tw-py-squid-xs'>
            <CaptionText className='tw-flex-1 tw-text-center tw-text-grey-500'>Please get a quote first.</CaptionText>
          </footer>
        </ModalContent>
        <Button size='lg' variant='secondary' label='Close' onClick={handleCloseModal} />
      </Modal>
    )
  }

  // First get the other providers
  const otherProviders = availableQuotes
    .slice(1) // The rest are "other" providers
    .sort((a, b) => {
      // Sort by received amount in descending order (best rate first)
      return b.receivedAmount - a.receivedAmount
    })

  return (
    <Modal onBackdropClick={handleCloseModal} isOpen={isModalOpen}>
      <ModalContent>
        <ModalTitle title='Select provider' />
        <ul className='tw-flex tw-flex-col tw-items-start tw-gap-squid-xxs tw-self-stretch tw-border-t tw-border-material-light-thin tw-px-0 tw-py-squid-xxs tw-max-h-[400px] tw-overflow-y-auto'>
          {recommendedQuote && (
            <Fragment>
              <SectionTitle title='Recommended' className='tw-bg-transparent' />
              <ProviderListItem
                provider={recommendedQuote}
                onSelect={handleSelectProvider}
                displayPriceChange={false}
                isSelected={selectedQuote?.onrampProviderId === recommendedQuote.onrampProviderId}
                token={selectedToken}
                disabled={!isProviderSupported(recommendedQuote)}
              />
            </Fragment>
          )}

          {otherProviders.length > 0 && (
            <Fragment>
              <span className='tw-flex tw-w-full tw-flex-col tw-justify-center tw-items-center'>
                <span className='tw-flex tw-w-full tw-flex-col tw-justify-center tw-items-center tw-h-squid-xxs'>
                  <span className='tw-w-full tw-bg-material-light-thin' style={{ height: '1px' }} />
                </span>
              </span>

              <SectionTitle
                title={recommendedQuote ? 'Other providers' : 'All providers'}
                className='tw-bg-transparent'
              />

              {otherProviders.map(provider => (
                <ProviderListItem
                  key={provider.onrampProviderId}
                  provider={provider}
                  onSelect={handleSelectProvider}
                  isSelected={selectedQuote?.onrampProviderId === provider.onrampProviderId}
                  recommendedRate={recommendedQuote?.receivedAmount}
                  token={selectedToken}
                  disabled={!isProviderSupported(provider)}
                />
              ))}
            </Fragment>
          )}
        </ul>
      </ModalContent>
      <Button size='lg' variant='secondary' label='Cancel' onClick={handleCloseModal} />
    </Modal>
  )
}

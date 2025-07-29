import { useClient, useGetOnrampPaymentTypes } from 'src/components/swap/widget/react-hooks'
import { Button, CaptionText, ListItem, Modal, ModalContent, ModalTitle } from '@0xsquid/ui'
import { useCallback } from 'react'
import { PaymentMethodIcon } from '../../components/PaymentMethodIcon'
import { useSwapRouter } from '../../hooks/useSwapRouter'
import { useFiatOnRampStore } from '../../store/useFiatOnRampStore'

const PaymentMethodListItem = ({ method, onSelect, isRecommended }) => (
  <ListItem
    mainIcon={<PaymentMethodIcon method={method} size='large' />}
    itemTitle={method.name}
    className='tw-bg-transparent'
    onClick={() => onSelect(method)}
    icon={isRecommended ? <CaptionText className='tw-text-royal-500'>Recommended</CaptionText> : undefined}
  />
)

export function FiatOnRampPaymentMethodView() {
  const { handleCloseModal, isModalOpen } = useSwapRouter()
  const { selectedCurrency, selectedToken, selectedCountry, setSelectedPaymentMethod } = useFiatOnRampStore()

  const { userCountry, defaultCurrency } = useClient()
  const currentCountry = selectedCountry || userCountry

  const { data: paymentTypes } = useGetOnrampPaymentTypes({
    fiatCurrency: selectedCurrency || defaultCurrency,
    cryptoCurrencyID: selectedToken?.cryptoCurrencyID || '',
    region: currentCountry,
    enabled: !!selectedToken?.cryptoCurrencyID && !!(selectedCurrency || defaultCurrency)
  })

  const recommendedPaymentMethod = paymentTypes?.[0]

  const handleSelectPaymentMethod = useCallback(
    method => {
      setSelectedPaymentMethod(method)
      handleCloseModal()
    },
    [setSelectedPaymentMethod, handleCloseModal]
  )

  return (
    <Modal onBackdropClick={handleCloseModal} isOpen={isModalOpen}>
      <ModalContent>
        <ModalTitle title='Select payment method' />
        <ul className='tw-flex tw-flex-col tw-items-start tw-gap-squid-xxs tw-self-stretch tw-border-t tw-border-material-light-thin tw-px-0 tw-py-squid-xs tw-overflow-y-auto tw-max-h-[400px]'>
          {paymentTypes
            ?.filter(m => !!m)
            .map(method => (
              <PaymentMethodListItem
                key={method.id}
                method={method}
                onSelect={handleSelectPaymentMethod}
                isRecommended={method.id === recommendedPaymentMethod?.id}
              />
            ))}
        </ul>
      </ModalContent>
      <Button size='lg' variant='secondary' label='Cancel' onClick={handleCloseModal} />
    </Modal>
  )
}

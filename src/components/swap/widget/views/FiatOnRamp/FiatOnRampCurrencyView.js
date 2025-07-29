import { getCurrencyData, useCurrencyDetails, useGetOnRampConfig } from 'src/components/swap/widget/react-hooks'
import { Button, Input, ListItem, Modal, ModalContent, ModalTitle } from '@0xsquid/ui'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useSwapRouter } from '../../hooks/useSwapRouter'
import { useFiatOnRampStore } from '../../store/useFiatOnRampStore'

const CurrencyListItem = ({ currency, onSelect }) => {
  const currencyDetails = useCurrencyDetails(currency.denomination)

  return (
    <ListItem
      mainIcon={
        <div className='tw-flex tw-h-[40px] tw-w-[40px] tw-items-center tw-justify-center tw-rounded-full tw-bg-royal-500 tw-overflow-hidden'>
          {currencyDetails?.flagUrl ? (
            <img
              src={currencyDetails.flagUrl}
              alt={currency.name}
              className='tw-h-[40px] tw-w-[40px] tw-object-cover'
            />
          ) : (
            <span className='tw-text-xs tw-text-white'>{currencyDetails?.symbol}</span>
          )}
        </div>
      }
      itemTitle={currencyDetails?.denomination}
      subtitle={currency.name}
      className='tw-bg-transparent'
      onClick={() => onSelect(currency)}
      key={currency.denomination}
    />
  )
}

export function FiatOnRampCurrencyView() {
  const { handleCloseModal, isModalOpen } = useSwapRouter()
  const { data: onRampConfig } = useGetOnRampConfig()
  const setSelectedCurrency = useFiatOnRampStore(state => state.setSelectedCurrency)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)

  // Pre-fetch all currency details at component level
  const currencyDetailsMap = useMemo(() => {
    if (!onRampConfig?.supportedFiats) return new Map()

    return new Map(
      onRampConfig.supportedFiats.map(code => {
        const details = getCurrencyData(code)
        return [code, details]
      })
    )
  }, [onRampConfig])

  const supportedCurrencies = useMemo(() => {
    if (!onRampConfig?.supportedFiats) return []

    return onRampConfig.supportedFiats.map(code => {
      const details = currencyDetailsMap.get(code)
      return {
        denomination: code,
        name: details?.name || code,
        symbol: details?.symbol || code
      }
    })
  }, [onRampConfig, currencyDetailsMap])

  const filteredCurrencies = useMemo(() => {
    if (!searchQuery) return supportedCurrencies

    const query = searchQuery.toLowerCase()
    return supportedCurrencies.filter(currency => {
      return (
        currency.name?.toLowerCase().includes(query) ||
        currency.denomination.toLowerCase().includes(query) ||
        currency.symbol.toLowerCase().includes(query)
      )
    })
  }, [supportedCurrencies, searchQuery])

  const handleSelectCurrency = useCallback(
    currency => {
      setSelectedCurrency(currency.denomination)
      handleCloseModal()
    },
    [setSelectedCurrency, handleCloseModal]
  )

  const onSearchChange = useCallback(e => {
    setSearchQuery(e.target.value)
  }, [])

  return (
    <Modal maxHeight={true} onBackdropClick={handleCloseModal} isOpen={isModalOpen}>
      <ModalContent>
        <ModalTitle title='Select currency' />
        <div className='tw-px-squid-m tw-py-squid-xs'>
          <Input
            inputRef={searchInputRef}
            placeholder='Search currency'
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>
        <ul className='tw-flex tw-flex-col tw-items-start tw-gap-squid-xxs tw-self-stretch tw-border-t tw-border-material-light-thin tw-px-0 tw-py-squid-xs tw-overflow-y-auto tw-max-h-[400px]'>
          {filteredCurrencies.map(currency => (
            <CurrencyListItem key={currency.denomination} currency={currency} onSelect={handleSelectCurrency} />
          ))}
        </ul>
      </ModalContent>
      <Button size='lg' variant='secondary' label='Cancel' onClick={handleCloseModal} />
    </Modal>
  )
}

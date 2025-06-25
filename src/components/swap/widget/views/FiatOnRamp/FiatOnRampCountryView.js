import { getCountryData, useCountryDetails, useGetOnRampConfig } from 'src/components/swap/widget/react-hooks'
import React from 'react'
import { Button, Input, ListItem, Modal, ModalContent, ModalTitle } from '@0xsquid/ui'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useSwapRouter } from '../../hooks/useSwapRouter'
import { useFiatOnRampStore } from '../../store/useFiatOnRampStore'
import { CountryFlag } from './CountryFlag'

const CountryListItem = ({ country, onSelect }) => {
  const countryDetails = useCountryDetails(country.code)

  return (
    <ListItem
      mainIcon={
        <span className='tw-flex tw-items-center tw-justify-center tw-h-full'>
          <CountryFlag countryCode={country.code} size='lg' />
        </span>
      }
      itemTitle={countryDetails?.name || country.name}
      className='tw-bg-transparent'
      onClick={() => onSelect(country)}
    />
  )
}

export function FiatOnRampCountryView() {
  const { handleCloseModal, isModalOpen } = useSwapRouter()
  const { data: onRampConfig } = useGetOnRampConfig()
  const setSelectedCountry = useFiatOnRampStore(state => state.setSelectedCountry)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)

  const supportedCountries = useMemo(() => {
    if (!onRampConfig?.supportedCountries) return []

    return onRampConfig.supportedCountries.map(country => getCountryData(country))
  }, [onRampConfig])

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return supportedCountries

    const query = searchQuery.toLowerCase()
    return supportedCountries.filter(
      country => country.name.toLowerCase().includes(query) || country.code.toLowerCase().includes(query)
    )
  }, [supportedCountries, searchQuery])

  const handleSelectCountry = useCallback(
    country => {
      setSelectedCountry(country.code)
      handleCloseModal()
    },
    [setSelectedCountry, handleCloseModal]
  )

  const onSearchChange = useCallback(e => {
    setSearchQuery(e.target.value)
  }, [])

  return (
    <Modal maxHeight={true} onBackdropClick={handleCloseModal} isOpen={isModalOpen}>
      <ModalContent>
        <ModalTitle title='Select your country' />
        <div className='tw-px-squid-m tw-py-squid-xs'>
          <Input inputRef={searchInputRef} placeholder='Search country' value={searchQuery} onChange={onSearchChange} />
        </div>
        <ul className='tw-flex tw-flex-col tw-items-start tw-gap-squid-xxs tw-self-stretch tw-border-t tw-border-material-light-thin tw-px-0 tw-py-squid-xs tw-overflow-y-auto tw-max-h-[400px]'>
          {filteredCountries.map(country => (
            <CountryListItem key={country.code} country={country} onSelect={handleSelectCountry} />
          ))}
        </ul>
      </ModalContent>
      <Button size='lg' variant='secondary' label='Cancel' onClick={handleCloseModal} />
    </Modal>
  )
}

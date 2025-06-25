import {
  isWalletAddressValid,
  useIntegratorContext,
  useIsSameAddressAndGnosisContext
} from 'src/components/swap/widget/react-hooks'
import React, { useState } from 'react'
import { ChainType } from '@0xsquid/squid-types'
import { ArrowRightIcon, Button, CaptionText, Input, SectionTitle, WalletIcon } from '@0xsquid/ui'
import { useSwapRouter } from '../hooks/useSwapRouter'

export const EditAddress = ({
  title,
  chain,
  messages,
  placeholder = 'Enter wallet address',
  accessory,
  input,
  validateEmpty = false
}) => {
  const [hasBeenUpdated, setHasBeenUpdated] = useState(false)
  const { isSameAddressAndGnosisContext } = useIsSameAddressAndGnosisContext()
  const { widgetInIframe } = useIntegratorContext()
  const { previousRoute } = useSwapRouter()
  const isAddressValidForChain = chain ? isWalletAddressValid(chain, input?.value) : false

  const pasteFromClipboard = async () => {
    const text = await navigator.clipboard.readText()
    if (text) {
      handleUpdateInputValue(text)
    }
  }

  const errorMessage = messages?.error ?? ''
  const defaultMessage = messages?.default
  const isError =
    (chain?.chainType !== ChainType.EVM && !!input?.value && !isAddressValidForChain && !!messages?.error) ||
    (validateEmpty && !input?.value)
  const isSuccess = hasBeenUpdated && !!input?.value && isAddressValidForChain
  const showGnosisMessage = chain?.chainType === ChainType.EVM && isSameAddressAndGnosisContext

  const handleUpdateInputValue = value => {
    setHasBeenUpdated(true)
    input?.onChange(value)
  }

  return (
    <>
      <SectionTitle title={title} icon={<WalletIcon />} accessory={accessory} />
      <nav className='tw-gap-squid-xxs tw-px-squid-m tw-py-squid-xxs tw-flex tw-w-full tw-items-center'>
        <Input
          {...input}
          className='tw-flex-1'
          autoComplete='off'
          autoCorrect='off'
          autoCapitalize='off'
          spellCheck='false'
          placeholder={placeholder}
          actionButtonProps={
            widgetInIframe
              ? undefined
              : {
                  label: 'Paste',
                  onClick: pasteFromClipboard
                }
          }
          isError={isError}
          value={input?.value ?? ''}
          onChange={e => handleUpdateInputValue(e.target.value)}
          icon={<img src={chain?.chainIconURI} className='tw-rounded-squid-xxs' alt={chain?.networkName} />}
        />
        <Button
          size='md'
          variant='primary'
          icon={<ArrowRightIcon />}
          disabled={!isSuccess}
          onClick={() => {
            if (isSuccess) {
              previousRoute()
            }
          }}
        />
      </nav>
      {(isError || showGnosisMessage || defaultMessage) && (
        <div className='tw-gap-squid-xxs tw-px-squid-m tw-flex tw-w-full tw-items-center'>
          {isError ? (
            <CaptionText className='tw-text-status-negative'>{errorMessage}</CaptionText>
          ) : (
            !!defaultMessage && <CaptionText className='tw-text-grey-500'>{errorMessage}</CaptionText>
          )}
          {showGnosisMessage && (
            <CaptionText className='tw-text-grey-500'>
              {
                'Important! Gnosis Safe addresses are not always the same on every chain, please double check the address on '
              }
              {chain.networkName}
              {' or you risk losing your funds.'}
            </CaptionText>
          )}
        </div>
      )}
    </>
  )
}

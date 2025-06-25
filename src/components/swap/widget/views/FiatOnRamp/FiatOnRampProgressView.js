import {
  formatHash,
  roundNumericValue,
  useCurrencyDetails,
  useSquidChains
} from 'src/components/swap/widget/react-hooks'
import {
  AnimationCard,
  AnimationWrapper,
  Button,
  CaptionText,
  ChainLink,
  DollarOutlinedIcon,
  IconLabel,
  Image,
  Modal,
  ModalContent,
  PropertyListItem,
  transactionProcessingAnimation,
  Transfer,
  TxProgressViewHeader,
  WalletIcon
} from '@0xsquid/ui'
import { useSwapRouter } from '../../hooks/useSwapRouter'

export function FiatOnRampProgressView() {
  const { handleCloseModal, isModalOpen, modalRoute } = useSwapRouter()
  const params = modalRoute?.params
  const { findChain } = useSquidChains()
  const chain = params?.squidToken ? findChain(params.squidToken.chainId) : undefined

  const currencyDetails = useCurrencyDetails(params?.fiatCurrency)

  return (
    <Modal onBackdropClick={handleCloseModal} isOpen={isModalOpen}>
      <ModalContent>
        <AnimationCard>
          <AnimationWrapper
            style={{
              height: '100%',
              maxHeight: '100%',
              width: 'auto'
            }}
            autoplay={true}
            loop={true}
            src={transactionProcessingAnimation}
          />
        </AnimationCard>

        <TxProgressViewHeader
          title={params?.squidToken ? `Buy ${params.squidToken.symbol}` : 'Buy'}
          description='Continue your payment in the new tab. You can dismiss this window now.'
        />

        {params && (
          <ul className='squid-property-gradient-bg-even-container tw-flex tw-w-full tw-flex-col tw-items-center tw-justify-center tw-gap-squid-xxs tw-rounded-squid-l tw-pb-squid-s tw-pt-squid-xs mobile-sm-height:tw-py-squid-s'>
            <PropertyListItem
              icon={<DollarOutlinedIcon />}
              label='Buy'
              detail={
                <Transfer
                  from={
                    <CaptionText>
                      {params.amount} {currencyDetails?.symbol}
                    </CaptionText>
                  }
                  to={
                    <IconLabel src={chain?.chainIconURI} rounded='full'>
                      {roundNumericValue(params.cryptoAmount.toString(), 2, false, 5)}
                    </IconLabel>
                  }
                />
              }
            />

            {chain && (
              <PropertyListItem
                icon={<ChainLink size='24' strokeWidth='2' />}
                label='Chain'
                detail={
                  <div className='tw-flex tw-items-center tw-gap-squid-xxs'>
                    <Image size='medium' rounded='xxs' src={chain.chainIconURI} />
                    <CaptionText>{chain.networkName}</CaptionText>
                  </div>
                }
              />
            )}

            <PropertyListItem
              icon={<WalletIcon size='24' />}
              label='Wallet'
              detail={
                <CaptionText>
                  {formatHash({
                    chainType: chain?.chainType,
                    hash: params.walletAddress
                  })}
                </CaptionText>
              }
            />
          </ul>
        )}
      </ModalContent>
      <Button size='lg' variant='secondary' label='Close' onClick={handleCloseModal} />
    </Modal>
  )
}

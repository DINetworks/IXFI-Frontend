import {
  formatTokenAmount,
  formatUsdAmount,
  useConfigStore,
  useEstimate,
  useSwap
} from 'src/components/swap/widget/react-hooks'
import React from 'react'
import {
  ArrowBottomTopIcon,
  ArrowExpandIcon,
  ArrowWallDownIcon,
  CaptionText,
  Chip,
  cn,
  GasIcon,
  Image,
  ImageStack,
  Modal,
  ModalContent,
  MoneyBagIcon,
  PercentIcon,
  ReceiptBillIcon,
  Button as UIButton,
  PropertyListItem as UIPropertyListItem
} from '@0xsquid/ui'
import { formatUnits } from 'ethers'
import { memo, useMemo } from 'react'
import { useSwapRoute } from '../hooks/useSwapRoute'
import { useSwapRouter } from '../hooks/useSwapRouter'

const Button = memo(UIButton)
const SwapDetailsList = memo(UISwapDetailsList)
const PropertyListItem = memo(UIPropertyListItem)

export function SwapDetailsView() {
  const { handleCloseModal, isModalOpen } = useSwapRouter()

  return (
    <Modal onBackdropClick={handleCloseModal} isOpen={isModalOpen}>
      <ModalContent>
        <div className='tw-flex tw-flex-col tw-overflow-auto tw-pt-squid-xs tw-pb-squid-xxs tw-scrollbar-hidden'>
          <SwapDetailsList />
        </div>
      </ModalContent>
      <Button size='lg' variant='secondary' label='Close' onClick={handleCloseModal} />
    </Modal>
  )
}

function UISwapDetailsList() {
  const collectFees = useConfigStore(state => state.config.collectFees)
  const slippage = useConfigStore(({ config }) => config.slippage)
  const { squidRoute, isFetching } = useSwapRoute()
  const { fromToken, toToken } = useSwap()
  const isSlippageAutoSelected = slippage === undefined

  const {
    toAmountMinUSD,
    firstFeeCost,
    firstGasCost,
    expectedGasRefundCost,
    expectedGasRefundCostUSD,
    integratorFeeCost,
    toAmount,
    exchangeRate,
    totalWithRefundEstimate,
    slippageFormatted,
    feeCostsFormatted,
    totalFeeCostsUsd
  } = useEstimate(squidRoute.data)

  return (
    <ul className='tw-gap-squid-xxs tw-py-squid-xs tw-flex tw-flex-col tw-items-start tw-self-stretch squid-property-gradient-bg-even-container'>
      <PropertyListItem
        isLoading={isFetching}
        icon={<ArrowBottomTopIcon />}
        label='Exchange rate'
        detail={
          <div className='tw-flex tw-items-center tw-gap-squid-xxs'>
            <CaptionText>
              {+toAmount > 0 ? '1' : '0'} {fromToken?.symbol}
            </CaptionText>
            <span>=</span>
            {exchangeRate !== undefined && <TokenAmount amount={exchangeRate} token={toToken} />}
          </div>
        }
      />

      <PropertyListItem
        isLoading={isFetching}
        icon={<ArrowExpandIcon />}
        label='Max. slippage'
        detail={
          <div className='tw-flex tw-items-center tw-gap-squid-xxs'>
            {isSlippageAutoSelected && <Chip label='AUTO' className='tw-bg-royal-500' />}
            {slippageFormatted !== undefined && <CaptionText>{slippageFormatted}</CaptionText>}
          </div>
        }
      />

      <PropertyListItem
        isLoading={isFetching}
        icon={<ArrowWallDownIcon />}
        label='Receive at least'
        detail={
          <div className='tw-flex tw-items-center tw-gap-squid-xxs'>
            <UsdAmount amount={toAmountMinUSD} />
          </div>
        }
      />

      <span className='tw-h-squid-l tw-w-full tw-flex tw-items-center'>
        <span className='tw-w-full tw-h-px tw-bg-material-light-thin' />
      </span>

      {expectedGasRefundCost.toString() !== '0' && (
        <PropertyListItem
          isLoading={isFetching}
          icon={<GasIcon />}
          label='Gas refund'
          detail={
            <div className='tw-flex tw-items-center tw-gap-squid-xs'>
              <UsdAmount amount={expectedGasRefundCostUSD} highlight isNegative />
              <TokenAmount
                amount={expectedGasRefundCost.toString()}
                token={firstGasCost?.token}
                formatUnits={true}
                secondary={true}
              />
            </div>
          }
        />
      )}

      {collectFees ? (
        <PropertyListItem
          isLoading={isFetching}
          icon={<PercentIcon />}
          label='Integrator fee'
          detail={
            <div className='tw-flex tw-items-center tw-gap-squid-xxs'>
              <TokenAmount amount={integratorFeeCost?.amount} token={integratorFeeCost?.token} formatUnits />
              <UsdAmount amount={integratorFeeCost?.amountUsd} />
            </div>
          }
        />
      ) : null}

      {feeCostsFormatted.length > 0 && (
        <PropertyListItem
          isLoading={isFetching}
          icon={<MoneyBagIcon />}
          label='Liquidity Providers'
          detail={
            <div className='tw-flex tw-items-center tw-gap-squid-xs'>
              <span className='tw-flex tw-gap-squid-xxs tw-items-center'>
                <ImageStack
                  imageUrls={feeCostsFormatted.map(fee => fee.imageUrl)}
                  spacing='-10px'
                  border='outline-lg'
                  className='!tw-outline-grey-800'
                  containerProps={{
                    style: {
                      height: '24px',
                      paddingInline: '2px'
                    }
                  }}
                />
                <CaptionText>{totalFeeCostsUsd}</CaptionText>
              </span>
            </div>
          }
          collapsibleContent={
            <div className='tw-flex tw-flex-col tw-py-squid-xxs tw-gap-squid-xxs'>
              {feeCostsFormatted.map(({ name, amountUsdFormatted: amountUsd, imageUrl }) => (
                <PropertyListItem
                  key={name}
                  label={name}
                  icon={
                    <span className='tw-flex tw-aspect-square tw-w-6 tw-items-center tw-justify-center'>
                      <Image src={imageUrl} />
                    </span>
                  }
                  showGradientBg={false}
                  addExtraPadding={false}
                  detail={
                    <div className='tw-flex tw-items-center tw-gap-squid-xs'>
                      <CaptionText>{amountUsd}</CaptionText>
                      <span className='tw-aspect-square tw-w-4' />
                    </div>
                  }
                />
              ))}
            </div>
          }
        />
      )}

      <PropertyListItem
        isLoading={isFetching}
        icon={<ReceiptBillIcon />}
        label='Total'
        detail={
          <div className='tw-flex tw-items-center tw-gap-squid-xs'>
            <UsdAmount amount={totalWithRefundEstimate.totalAmountUSD.toString()} />
            {!!firstFeeCost?.token && (
              <TokenAmount
                amount={totalWithRefundEstimate.totalAmount.toString()}
                token={firstFeeCost?.token}
                secondary={true}
              />
            )}
          </div>
        }
      />
    </ul>
  )
}

function TokenAmount({ token, amount, formatUnits: _formatUnits, isNegative, secondary }) {
  const amountFormatted = useMemo(() => {
    return formatTokenAmount(_formatUnits ? formatUnits(amount ?? '0', token?.decimals ?? 18) : amount ?? '0')
  }, [_formatUnits, amount, token?.decimals])

  return (
    <CaptionText className={cn(secondary && 'tw-text-grey-500')}>
      {isNegative && '-'}
      {amountFormatted} {token?.symbol}
    </CaptionText>
  )
}

function UsdAmount({ amount, isNegative, highlight }) {
  const amountFormatted = useMemo(() => {
    return formatUsdAmount(amount, {
      decimalPrecision: true
    })
  }, [amount])

  return (
    <CaptionText className={cn(highlight ? 'tw-text-royal-500' : 'tw-text-grey-300')}>
      {isNegative && '-'}
      {amountFormatted}
    </CaptionText>
  )
}

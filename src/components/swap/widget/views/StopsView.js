import {
  formatTokenAmount,
  getTokenImage,
  useEstimate,
  useSquidChains,
  useSwap
} from 'src/components/swap/widget/react-hooks'
import React from 'react'
import {
  ArrowSplit,
  Button,
  Modal,
  ModalContent,
  PropertyListItem,
  RouteStep,
  SectionTitle,
  TimeFliesIcon
} from '@0xsquid/ui'
import { useMemo } from 'react'
import { useSwapRoute } from '../hooks/useSwapRoute'
import { useSwapRouter } from '../hooks/useSwapRouter'
import { getActionProviderImage } from '../services/internal/assetsService'
import { getDescriptionBlocks } from '../services/internal/transactionService'

export function StopsView() {
  const { handleCloseModal, isModalOpen } = useSwapRouter()
  const { squidRoute } = useSwapRoute()
  const { estimatedRouteDuration } = useEstimate(squidRoute.data)

  return (
    <Modal onBackdropClick={handleCloseModal} isOpen={isModalOpen}>
      <ModalContent className='tw-pt-squid-m tw-flex tw-flex-col tw-overflow-auto tw-scrollbar-hidden'>
        <PropertyListItem
          icon={<TimeFliesIcon />}
          showGradientBg={false}
          label='Estimated time to complete'
          detail={`~${estimatedRouteDuration.format()}`}
        />
        <Route />
      </ModalContent>
      <Button size='lg' variant='secondary' label='Close' onClick={handleCloseModal} />
    </Modal>
  )
}

function Route() {
  const { squidRoute } = useSwapRoute()
  const { toChain, fromChain, fromToken, fromPrice, toToken } = useSwap()
  const { toAmount } = useEstimate(squidRoute.data)
  const { findChain } = useSquidChains()

  const fromAmountFormatted = useMemo(() => {
    return formatTokenAmount(fromPrice ?? '0')
  }, [fromPrice])

  const toAmountFormatted = useMemo(() => {
    return formatTokenAmount(toAmount)
  }, [toAmount])

  return (
    <ul className='tw-flex tw-flex-col tw-items-center tw-self-stretch tw-pb-squid-m tw-max-h-full'>
      <SectionTitle
        title='Best route'
        className='tw-bg-transparent'
        icon={<ArrowSplit size='16' className='tw-text-royal-500' />}
      />
      <RouteStep
        descriptionBlocks={[
          {
            type: 'string',
            value: 'Pay'
          },
          {
            type: 'image',
            value: getTokenImage(fromToken) ?? '',
            rounded: true
          },
          {
            type: 'string',
            value: `${fromAmountFormatted} ${fromToken?.symbol}`
          }
        ]}
        imageUrl={fromChain?.chainIconURI ?? ''}
        subtitle={fromChain?.networkName ?? ''}
        showStepSeparator={true}
      />
      {squidRoute.data?.estimate.actions.map(action => {
        return (
          <RouteStep
            key={action.description}
            descriptionBlocks={getDescriptionBlocks({
              action,
              toChain: findChain(action.toChain)
            })}
            imageUrl={getActionProviderImage(action)}
            subtitle={action.provider ?? ''}
            showStepSeparator={true}
          />
        )
      })}
      <RouteStep
        descriptionBlocks={[
          {
            type: 'string',
            value: 'Receive'
          },
          {
            type: 'image',
            value: getTokenImage(toToken) ?? '',
            rounded: true
          },
          {
            type: 'string',
            value: `${toAmountFormatted} ${toToken?.symbol}`
          }
        ]}
        imageUrl={toChain?.chainIconURI ?? ''}
        subtitle={toChain?.networkName ?? ''}
        showStepSeparator={false}
      />
    </ul>
  )
}

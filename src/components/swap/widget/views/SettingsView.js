import { useConfigStore } from 'src/components/swap/widget/react-hooks'
import {
  Button,
  CaptionText,
  Collapse,
  ExplosionIcon,
  MEDIA_QUERIES,
  Menu,
  Modal,
  ModalContent,
  ModalContentDivider,
  RangeInput,
  SettingsItem,
  TradingViewStepsIcon,
  useMediaQuery
} from '@0xsquid/ui'
import { useCallback, useState } from 'react'
import { MAX_SLIPPAGE, slippageWarning, TOOLTIP_DISPLAY_DELAY_MS } from '../core/constants'
import { SUPPORT_LINKS } from '../core/externalLinks'
import { useSwapRouter } from '../hooks/useSwapRouter'

export const SettingsView = () => {
  const { handleCloseModal, isModalOpen } = useSwapRouter()

  return (
    <Modal onBackdropClick={handleCloseModal} isOpen={isModalOpen} width='extra-large'>
      <ModalContent paddingY={true}>
        <Preferences />
        <span className='tw-text-material-light-thin'>
          <ModalContentDivider />
        </span>
      </ModalContent>
      <Button size='lg' variant='secondary' label='Close' onClick={handleCloseModal} />
    </Modal>
  )
}

function Preferences() {
  const { slippage, degenMode } = useConfigStore(({ config }) => ({
    slippage: config.slippage,
    degenMode: config.degenMode
  }))

  const isSlippageAutoSelected = slippage === undefined
  const [isSlippageCollapsed, setIsSlippageCollapsed] = useState(isSlippageAutoSelected)

  const onDegenModeChange = useCallback(() => {
    useConfigStore.setState(({ config }) => {
      return {
        config: {
          ...config,
          degenMode: !config.degenMode,
          // reset slippage when degen mode is turned off
          slippage: config.degenMode ? undefined : config.slippage
        }
      }
    })
  }, [])

  const updateSlippage = useCallback(newSlippage => {
    useConfigStore.setState(({ config }) => {
      return {
        config: {
          ...config,
          slippage: newSlippage
        }
      }
    })
  }, [])

  // const updateRefuel = useCallback((newRefuel: number) => {
  //   // TODO: implement
  // }, [])

  const minSlippage = 0
  const maxSlippage = !!degenMode ? MAX_SLIPPAGE.ADVANCED : MAX_SLIPPAGE.DEFAULT
  const boundedSlippage = (slippage ?? 0) > maxSlippage ? maxSlippage : slippage
  const isWarning = (boundedSlippage ?? 0) >= slippageWarning
  const matchesMobileLg = useMediaQuery(MEDIA_QUERIES.MOBILE_LG.media)

  return (
    <ul className='tw-relative tw-flex tw-flex-col tw-items-start tw-self-stretch'>
      {isWarning && (
        <Menu containerClassName='tw-absolute tw-bottom-full tw-left-1/2 -tw-translate-x-1/2 tw-pb-squid-xs'>
          <CaptionText>Your transaction may result in an unfavourable trade</CaptionText>
        </Menu>
      )}
      <SettingsItem
        transparent={true}
        icon={<TradingViewStepsIcon className='tw-text-royal-500' />}
        label='Slippage'
        helpTooltip={{
          showOnMobile: true,
          tooltipWidth: 'max',
          displayDelayMs: TOOLTIP_DISPLAY_DELAY_MS.HELP,
          tooltipContent: (
            <>
              Slippage is the price variation you are willing to accept in the event that the price of the trade changes
              while it is processing. If the trade fails due to too-low slippage, you will receive one of Squid's
              routing tokens on the destination chain.{' '}
              <a href={SUPPORT_LINKS.ROUTING_TOKEN} target='_blank' rel='noreferrer' className='tw-text-grey-100'>
                Learn more
              </a>{' '}
            </>
          )
        }}
        control={{
          type: 'options',
          selectedLabel: isSlippageAutoSelected ? 'Auto' : 'Custom',
          options: [
            {
              label: 'Auto',
              onSelect: () => {
                updateSlippage(undefined)
                setIsSlippageCollapsed(true)
              }
            },
            {
              label: 'Custom',
              onSelect: () => {
                setIsSlippageCollapsed(false)
              }
            }
          ]
        }}
      />
      <Collapse
        collapsed={isSlippageCollapsed}
        className='tw-w-full'
        collapsedHeight={isSlippageCollapsed ? 0 : matchesMobileLg ? 50 : 70}
      >
        <RangeInput
          label={`Between ${minSlippage}% and ${maxSlippage}%`}
          min={minSlippage}
          max={maxSlippage}
          isWarning={isWarning}
          initialValue={String(boundedSlippage ?? '')}
          onChange={newSlippage => {
            if (Number(newSlippage ?? 0) === 0) {
              updateSlippage(undefined)
            } else {
              updateSlippage(Number(newSlippage))
            }
          }}
        />
      </Collapse>
      <SettingsItem
        transparent={true}
        helpTooltip={{
          showOnMobile: true,
          tooltipWidth: 'max',
          displayDelayMs: TOOLTIP_DISPLAY_DELAY_MS.HELP,
          tooltipContent: (
            <>
              Enable at your own risk! Degen mode allows trades with a price impact over 5%, meaning you risk losing
              funds if prices shift unfavorably.{' '}
              <a className='tw-text-grey-100' href={SUPPORT_LINKS.PRICE_IMPACT} target='_blank'>
                Learn more
              </a>
            </>
          )
        }}
        icon={<ExplosionIcon className='tw-text-royal-500' />}
        label='Degen mode'
        control={{
          type: 'switch',
          checked: !!degenMode,
          onChange: onDegenModeChange
        }}
      />
    </ul>
  )
}

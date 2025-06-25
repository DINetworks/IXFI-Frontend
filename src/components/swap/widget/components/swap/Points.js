import { Tooltip } from '@0xsquid/ui'
import { useSwapPoints } from 'src/hooks/useSwapPoints'
import { useWalletPoints } from 'src/hooks/useWalletPoints'

export const Points = ({ isLoading, wallet, amountUsd }) => {
  const { points } = useWalletPoints(wallet)

  const { swapPoints } = useSwapPoints(amountUsd)

  return (
    <Tooltip
      tooltipWidth='max'
      childrenClassName='tw-rounded-squid-s'
      containerClassName='tw-rounded-squid-s'
      tooltipContent={'You can withdraw DI token by your points in the future.'}
    >
      <div>
        <div className='tw-flex tw-h-[50px] tw-w-full tw-items-center tw-bg-grey-900 tw-py-squid-xxs tw-text-grey-500 mobile-lg:tw-w-card-large tw-px-squid-xs mobile-lg:tw-px-squid-m tw-justify-between'>
          <button className='tw-flex tw-h-squid-xl tw-w-full tw-items-center tw-gap-x-squid-xs tw-rounded-squid-m tw-px-squid-xs'>
            <div className='tw-flex tw-h-squid-m tw-items-center tw-justify-center tw-rounded-squid-m tw-bg-grey-500 tw-text-grey-900 tw-hidden mobile-xs:tw-flex'>
              <span className='tw-text-caption tw-font-caption tw-leading-caption tw-min-w-squid-xl tw-text-nowrap tw-px-squid-xxs tw-text-center'>
                Points
              </span>
            </div>
            {!isLoading && (
              <span className='tw-flex tw-w-full tw-items-center tw-justify-between'>
                <span className='tw-flex tw-items-center tw-text-grey-500'>
                  <span className='tw-text-caption tw-font-caption tw-leading-caption'>{points}</span>
                </span>
                {swapPoints > 0 && (
                  <span className='tw-flex tw-items-center tw-text-grey-500 tw-gap-1.5'>
                    <span className='tw-text-caption tw-font-caption tw-leading-caption tw-opacity-66'>
                      will increase by
                    </span>
                    <span className='tw-text-caption tw-font-caption tw-leading-caption tw-text-status-positive ml-1'>
                      +{swapPoints.toFixed(2)}
                    </span>
                  </span>
                )}
              </span>
            )}
          </button>
        </div>
      </div>
    </Tooltip>
  )
}

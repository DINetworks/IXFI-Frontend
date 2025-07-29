import { HistoryTxType } from 'src/components/swap/widget/react-hooks/core/types/history'
import { CircleX, CompassRoundOutlinedIcon, DropdownMenuItem, RefreshIcon } from '@0xsquid/ui'

const repeatTxLabelMap = {
  [HistoryTxType.SWAP]: 'Repeat swap',
  [HistoryTxType.BUY]: 'Repeat buy',
  [HistoryTxType.SEND]: 'Repeat transfer'
}

export function DropdownMenuContent({ txExplorerData, handleRemoveTransaction, handleRepeatSwap, txType }) {
  return (
    <>
      {handleRepeatSwap && (
        <DropdownMenuItem label={repeatTxLabelMap[txType]} icon={<RefreshIcon />} onClick={handleRepeatSwap} />
      )}
      {!!txExplorerData && (
        <DropdownMenuItem
          label={`View on ${txExplorerData.name}`}
          icon={<CompassRoundOutlinedIcon />}
          link={txExplorerData.url}
        />
      )}
      {handleRemoveTransaction && (
        <DropdownMenuItem
          label='Clear'
          labelClassName='tw-text-status-negative'
          icon={<CircleX className='tw-text-status-negative' />}
          onClick={handleRemoveTransaction}
        />
      )}
    </>
  )
}

import { roundNumericValue, useCurrencyDetails, useSquidTokens } from 'src/components/swap/widget/react-hooks'
import { HistoryTxType } from 'src/components/swap/widget/react-hooks/core/types/history'
import { HistoryItem } from '@0xsquid/ui'
import React, { useMemo } from 'react'
import { formatTransactionHistoryDate } from '../../services/internal/transactionService'
import { DropdownMenuContent } from './DropdownMenuContent'

export const FiatTransactionHistoryListItem = React.memo(
  ({ transaction, itemsContainerRef, handleRemoveTransaction }) => {
    const { findToken } = useSquidTokens()
    const token = findToken(transaction.toTokenAddress, transaction.toChainId)
    const currency = useCurrencyDetails(transaction.fromFiatCurrency)

    const status = useMemo(() => {
      switch (transaction.status) {
        case 'awaiting_payment':
        case 'processing':
          return 'pending'
        case 'failed':
          return 'failed'
        case 'completed':
          return 'completed'
        default:
          return 'pending'
      }
    }, [transaction.status])

    const formattedDate = useMemo(() => formatTransactionHistoryDate(transaction.timestamp), [transaction.timestamp])

    return (
      <HistoryItem
        txType='swap'
        itemsContainerRef={itemsContainerRef}
        dateCompleted={formattedDate ? `${formattedDate.month} ${formattedDate.day}` : ''}
        fromLabel={transaction.fromFiatCurrency}
        dropdownMenuContent={
          <DropdownMenuContent
            handleRemoveTransaction={() =>
              handleRemoveTransaction({
                txType: HistoryTxType.BUY,
                transactionId: transaction.orderId
              })
            }
            txType={HistoryTxType.BUY}
            txExplorerData={undefined}
            handleRepeatSwap={undefined}
          />
        }
        toLabel={token?.symbol ?? transaction.toCryptoCurrencyID}
        fromAmount={roundNumericValue(transaction.fromAmount, 2, false, 5)}
        toAmount={roundNumericValue(transaction.toCryptoAmount, 2, false, 5)}
        warningLabel='Transaction failed'
        firstImageUrl={currency?.flagUrl ?? ''}
        status={status}
        secondImageUrl={token?.logoURI ?? ''}
      />
    )
  }
)

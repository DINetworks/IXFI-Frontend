import {
  formatHash,
  formatTokenAmount,
  getSourceExplorerTxUrl,
  getTokenImage,
  SendTransactionStatus,
  useAvatar,
  useSendTransactionStatus,
  useSquidChains,
  useSquidTokens
} from 'src/components/swap/widget/react-hooks'
import { HistoryTxType } from 'src/components/swap/widget/react-hooks/core/types/history'
import { HistoryItem } from '@0xsquid/ui'
import React, { useCallback, useMemo } from 'react'
import { formatTransactionHistoryDate } from '../../services/internal/transactionService'
import { DropdownMenuContent } from './DropdownMenuContent'

export const SendTransactionHistoryListItem = React.memo(
  ({ transaction, itemsContainerRef, handleRepeatTx, handleRemoveTransaction }) => {
    const { findToken } = useSquidTokens()
    const { findChain } = useSquidChains()
    const chain = findChain(transaction.token.chainId)
    const { status: latestStatus } = useSendTransactionStatus({
      txHash: transaction.hash,
      chain
    })

    const status = useMemo(() => {
      switch (latestStatus) {
        case SendTransactionStatus.ONGOING:
          return 'pending'
        case SendTransactionStatus.ERROR:
          return 'failed'
        case SendTransactionStatus.SUCCESS:
        default:
          return 'completed'
      }
    }, [latestStatus])

    const txExplorerData = useMemo(() => {
      if (!transaction.hash || !chain) return undefined
      const explorerUrl = getSourceExplorerTxUrl(chain, transaction.hash)
      if (!explorerUrl) return undefined
      return {
        name: chain.networkName,
        url: explorerUrl
      }
    }, [transaction.hash, chain])

    const sendToken = useMemo(() => {
      return findToken(transaction.token.address, transaction.token.chainId)
    }, [findToken, transaction.token.address, transaction.token.chainId])

    const canRepeatTransaction = !!transaction && !!sendToken

    const handleRepeatTxCallback = useCallback(() => {
      if (!canRepeatTransaction) return undefined
      return handleRepeatTx(
        {
          data: transaction,
          txType: HistoryTxType.SEND
        },
        sendToken
      )
    }, [canRepeatTransaction, handleRepeatTx, transaction, sendToken])

    const formattedDate = useMemo(() => formatTransactionHistoryDate(transaction?.timestamp), [transaction?.timestamp])

    const avatar = useAvatar(transaction.toAddress)
    const amountFormatted = formatTokenAmount(transaction.amount)
    const toAddressFormatted = formatHash({
      hash: transaction.toAddress,
      chainType: chain?.chainType
    })

    return (
      <HistoryItem
        txType='send'
        itemsContainerRef={itemsContainerRef}
        dropdownMenuContent={
          <DropdownMenuContent
            handleRemoveTransaction={() =>
              handleRemoveTransaction({
                txType: HistoryTxType.SEND,
                transactionId: transaction.hash
              })
            }
            handleRepeatSwap={canRepeatTransaction ? handleRepeatTxCallback : undefined}
            txExplorerData={txExplorerData}
            txType={HistoryTxType.SEND}
          />
        }
        dateCompleted={formattedDate ? `${formattedDate.month} ${formattedDate.day}` : ''}
        fromAmount={`${amountFormatted} ${transaction.token.symbol}`}
        fromLabel={toAddressFormatted}
        firstImageUrl={avatar}
        secondImageUrl={getTokenImage(transaction.token) ?? ''}
        status={status}
        toAmount=''
        toLabel=''
      />
    )
  }
)

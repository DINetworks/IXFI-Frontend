import { useHistoryStore, useSwap } from 'src/components/swap/widget/react-hooks'
import { HistoryTxType } from 'src/components/swap/widget/react-hooks/core/types/history'
import { BodyText, Checkmark2Icon, ClockOutlineIcon, EmojiSadIcon, Loader, SectionTitle } from '@0xsquid/ui'
import { formatUnits } from 'ethers'
import { useCallback, useMemo, useRef } from 'react'
import { FixedSizeList as List } from 'react-window'
import { NavigationBar } from '../components/NavigationBar'
import { FiatTransactionHistoryListItem } from '../components/transaction/FiatTransactionHistoryListItem'
import { SendTransactionHistoryListItem } from '../components/transaction/SendTransactionHistoryListItem'
import { SwapTransactionHistoryListItem } from '../components/transaction/SwapTransactionHistoryListItem'
import { useSwapRouter } from '../hooks/useSwapRouter'
import { useTransactionHistory } from '../hooks/useTransactionHistory'
import { useTxHistoryStatusIndicator } from '../hooks/useTxHistoryStatusIndicator'
import { useSendStore } from '../store/useSendStore'

export const useHistorySwap = () => {
  const { onSwapChange, fromPriceChanged } = useSwap()
  const { previousRoute } = useSwapRouter()

  const handleRepeatTx = useCallback(
    (transaction, fromToken) => {
      switch (transaction.txType) {
        case HistoryTxType.SWAP:
          onSwapChange({
            fromTokenAddress: transaction.data.fromToken,
            toTokenAddress: transaction.data.toToken,
            fromChainId: transaction.data.fromChain,
            toChainId: transaction.data.toChain
          })
          fromPriceChanged(formatUnits(transaction.data.fromAmount ?? '0', fromToken.decimals))
          previousRoute()
          break
        // TODO: handle repeat buy
        case HistoryTxType.BUY:
          break

        case HistoryTxType.SEND:
          useSendStore.setState({
            amount: transaction.data.amount,
            toAddress: {
              address: transaction.data.toAddress
            },
            token: fromToken
          })
          previousRoute()
          break

        default:
          break
      }
    },
    [onSwapChange, fromPriceChanged, previousRoute]
  )

  return { handleRepeatTx }
}

export const HistoryButton = ({ source }) => {
  const { displayState } = useTxHistoryStatusIndicator(source)

  const getButtonContent = () => {
    switch (displayState) {
      case 'success':
        return (
          <Checkmark2Icon
            size='24px'
            className='tw-text-status-positive'
            style={{
              fillOpacity: 1
            }}
          />
        )
      case 'error':
        return <EmojiSadIcon className='tw-text-status-negative' />
      case 'loading':
        return <Loader size='24px' />
      case 'default':
        return <ClockOutlineIcon />

      default:
        return <ClockOutlineIcon />
    }
  }

  return getButtonContent()
}

export const HistoryView = () => {
  const transactions = useHistoryStore(store => store.transactions)
  const removeTransaction = useHistoryStore(store => store.removeTransaction)
  const { handleRepeatTx } = useHistorySwap()
  const itemsContainerRef = useRef(null)
  const { currentRouteParams } = useSwapRouter()

  // Map source to transaction type - with explicit values
  const sourceToTxType = {
    swap: HistoryTxType.SWAP,
    buy: HistoryTxType.BUY,
    send: HistoryTxType.SEND
  }

  const currentTxType = currentRouteParams?.source ? sourceToTxType[currentRouteParams.source] : undefined

  // Filter transactions based on the source parameter
  const filteredTransactions = useMemo(() => {
    if (currentTxType === undefined) return transactions
    return transactions.filter(tx => {
      return tx.txType === currentTxType
    })
  }, [transactions, currentTxType])

  const transactionsAndHeaders = useTransactionHistory(filteredTransactions)

  return (
    <>
      <NavigationBar />
      <div
        ref={itemsContainerRef}
        className='tw-border-material-light-thin tw-pb-squid-xs tw-h-full tw-border-t mobile-lg:tw-px-squid-xs'
      >
        <section className='tw-gap-squid-xxs tw-flex tw-h-full tw-flex-col'>
          {transactionsAndHeaders.length > 0 ? (
            <List
              itemCount={transactionsAndHeaders.length}
              itemSize={55}
              width='100%'
              height={540}
              className='tw-scrollbar-hidden'
            >
              {({ index, style }) => {
                const txOrHeader = transactionsAndHeaders[index]
                const itemsSpacing = 5
                const styleWithGap = {
                  ...style,
                  height: Number(style.height ?? 0) - itemsSpacing
                }

                if (!txOrHeader) return null

                if (txOrHeader.type === 'header') {
                  return (
                    <div style={styleWithGap}>
                      <SectionTitle className='tw-bg-grey-900' title={txOrHeader.element.month} />
                    </div>
                  )
                }

                switch (txOrHeader.element.txType) {
                  case HistoryTxType.SWAP:
                    return (
                      <div style={styleWithGap}>
                        <SwapTransactionHistoryListItem
                          transaction={txOrHeader.element.data}
                          handleRemoveTransaction={removeTransaction}
                          itemsContainerRef={itemsContainerRef}
                          handleRepeatTx={handleRepeatTx}
                          key={`${txOrHeader.element.data.transactionId}-${index}`}
                        />
                      </div>
                    )
                  case HistoryTxType.BUY:
                    return (
                      <div style={styleWithGap}>
                        <FiatTransactionHistoryListItem
                          transaction={txOrHeader.element.data}
                          itemsContainerRef={itemsContainerRef}
                          handleRemoveTransaction={removeTransaction}
                        />
                      </div>
                    )
                  case HistoryTxType.SEND:
                    return (
                      <div style={styleWithGap}>
                        <SendTransactionHistoryListItem
                          handleRepeatTx={handleRepeatTx}
                          handleRemoveTransaction={removeTransaction}
                          transaction={txOrHeader.element.data}
                          itemsContainerRef={itemsContainerRef}
                        />
                      </div>
                    )
                  default:
                    return null
                }
              }}
            </List>
          ) : (
            <div className='tw-text-grey-500 tw-flex tw-h-full tw-items-center tw-justify-center'>
              <BodyText size='small'>Your transaction history will appear here</BodyText>
            </div>
          )}
        </section>
      </div>
    </>
  )
}

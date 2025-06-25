import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { HistoryTxType } from '../../core/types/history'
import { compareTransactionIds, getHistoryTransactionId } from '../../services'

export const useHistoryStore = create(
  persist(
    (set, get) => ({
      transactions: [],
      persistTransaction: tx => {
        set(state => {
          return {
            transactions: [...state.transactions, tx]
          }
        })
      },
      replaceTransactionStatus: params => {
        switch (params.txType) {
          case HistoryTxType.SWAP: {
            set(state => {
              // Find the transaction first to check if we need to update
              const transactionToUpdate = state.transactions.find(tx => 
                tx.txType === HistoryTxType.SWAP && 
                compareTransactionIds(params.transactionId, tx.data.transactionId)
              );
              
              // If transaction not found or status already matches, don't update
              if (!transactionToUpdate || transactionToUpdate.data.status === params.status) {
                return state;
              }
              
              return {
                transactions: state.transactions.map(tx => {
                  if (tx.txType !== HistoryTxType.SWAP) return tx;
                  
                  return compareTransactionIds(params.transactionId, tx.data.transactionId)
                    ? {
                        ...tx,
                        data: {
                          ...tx.data,
                          statusResponse: params.statusResponse,
                          status: params.status
                        }
                      }
                    : tx;
                })
              };
            });
            break;
          }
          
          case HistoryTxType.BUY: {
            set(state => {
              // Find the transaction first to check if we need to update
              const transactionToUpdate = state.transactions.find(tx => 
                tx.txType === HistoryTxType.BUY && tx.data.orderId === params.orderId
              );
              
              // If transaction not found or status already matches, don't update
              if (!transactionToUpdate || 
                  (transactionToUpdate.data.status === params.status && 
                   transactionToUpdate.data.transactionHash === params.transactionHash)) {
                return state;
              }
              
              return {
                transactions: state.transactions.map(tx => {
                  if (tx.txType !== HistoryTxType.BUY || tx.data.orderId !== params.orderId) {
                    return tx;
                  }
                  return {
                    ...tx,
                    data: {
                      ...tx.data,
                      status: params.status,
                      transactionHash: params.transactionHash
                    }
                  };
                })
              };
            });
            break;
          }
          
          case HistoryTxType.SEND: {
            set(state => {
              // Find the transaction first to check if we need to update
              const transactionToUpdate = state.transactions.find(tx => 
                tx.txType === HistoryTxType.SEND && tx.data.hash === params.hash
              );
              
              // If transaction not found or status already matches, don't update
              if (!transactionToUpdate || transactionToUpdate.data.status === params.status) {
                return state;
              }
              
              return {
                transactions: state.transactions.map(tx => {
                  if (tx.txType !== HistoryTxType.SEND || tx.data.hash !== params.hash) {
                    return tx;
                  }
                  return {
                    ...tx,
                    data: {
                      ...tx.data,
                      status: params.status
                    }
                  };
                })
              };
            });
            break;
          }
        }
      },
      removeTransaction: ({ transactionId, txType }) => {
        {
          set(state => ({
            transactions: state.transactions.filter(tx => {
              if (tx.txType !== txType) return true

              return getHistoryTransactionId(tx) !== transactionId
            })
          }))
        }
      },
      replaceTransactionAtNonce: ({ fromAddress, newTx, nonce }) => {
        if (newTx.txType === HistoryTxType.SWAP) {
          set(state => {
            const index = state.transactions.findIndex(
              tx => tx.txType === HistoryTxType.SWAP && tx.data.nonce === nonce && tx.data.fromAddress === fromAddress
            )
            if (index !== -1) {
              const newTransactions = [...state.transactions]
              newTransactions[index] = newTx

              return { transactions: newTransactions }
            }

            return state
          })
        }
      },
      findTransaction: ({ transactionId, txType }) => {
        const { transactions } = get()
        return transactions.find(tx => {
          if (tx.txType !== txType) return false

          return getHistoryTransactionId(tx) === transactionId
        })
      }
    }),
    {
      // ".v2" here references to Squid V2, not the store version
      // This name should not be changed to avoid breaking changes
      name: 'squid.history.store.v2',
      // store version, defaults to 0
      version: 1,
      // migrate stores on previous versions
      migrate(persistedState, version) {
        if (version === 0) {
          const v0State = persistedState

          return {
            transactions: v0State.transactions.map(v0Tx => ({
              txType: HistoryTxType.SWAP,
              data: v0Tx
            }))
          }
        }

        return persistedState
      }
    }
  )
)

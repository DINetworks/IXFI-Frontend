import { ChainType } from '@0xsquid/squid-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { getPrefixKey, QueryKeys } from '../../../core/queries/queries-keys'
import { HistoryTxType } from '../../../core/types/history'
import { SendTransactionStatus } from '../../../core/types/transaction'
import { useHistoryStore } from '../../../hooks/store/useHistoryStore'
import { useSendTransactionStore } from '../../../hooks/store/useSendTransactionStore'
import { useNativeTokenForChain } from '../../../hooks/tokens/useNativeTokenForChain'
import { useMultiChainWallet } from '../../../hooks/wallet/useMultiChainWallet'
import { useWallet } from '../../../hooks/wallet/useWallet'
import { isWalletAddressValid, parseToBigInt, WidgetEvents } from '../../../services'
import { getWorkingCosmosRpcUrl } from '../../../services/external/rpcService'
import { getTransactionError } from '../../../services/internal/errorService'
import {
  sendTransactionBitcoin,
  sendTransactionCosmos,
  sendTransactionEvm,
  sendTransactionSolana,
  sendTransactionSui,
  sendTransactionXrpl
} from '../../../services/internal/sendTransaction'
import { useSolanaConnection } from '../../solana/useSolana'
import { useSigner } from '../../wallet/useSigner'

export function useSendTransaction({ to, amount, token, chain }) {
  const { connectedWalletsByChainType } = useWallet()
  const { connectedAddress } = useMultiChainWallet(chain)
  const { evmSigner, cosmosSigner, solanaSigner, bitcoinSigner, suiSigner, xrplSigner } = useSigner({
    chain
  })
  const solanaClient = useSolanaConnection()
  const queryClient = useQueryClient()
  const { nativeToken } = useNativeTokenForChain(chain)
  const getTransaction = useSendTransactionStore(state => state.getTransaction)
  const setTransactionState = useSendTransactionStore(state => state.setTransactionState)
  const persistTransaction = useHistoryStore(state => state.persistTransaction)
  const allEventParamsDefined = !!connectedAddress.address && !!amount && !!token && !!to

  const dispatchPreSendEvent = useCallback(() => {
    if (!allEventParamsDefined || !connectedAddress.address) return

    WidgetEvents.getInstance().dispatchPreSend({
      fromAddress: connectedAddress.address,
      // amount is already formatted with the token decimals
      amount,
      toAddress: to,
      token: {
        address: token.address,
        chainId: token.chainId,
        symbol: token.symbol,
        type: token.type
      }
    })
  }, [
    allEventParamsDefined,
    token?.type,
    token?.chainId,
    token?.symbol,
    token?.address,
    amount,
    connectedAddress.address,
    to
  ])

  const dispatchPostSendEvent = useCallback(
    ({ txHash }) => {
      if (!allEventParamsDefined || !connectedAddress.address) return

      WidgetEvents.getInstance().dispatchPostSend({
        fromAddress: connectedAddress.address,
        // amount is already formatted with the token decimals
        amount,
        toAddress: to,
        token: {
          address: token.address,
          chainId: token.chainId,
          symbol: token.symbol,
          type: token.type
        },
        txHash
      })
    },
    [
      allEventParamsDefined,
      token?.type,
      token?.chainId,
      token?.symbol,
      token?.address,
      amount,
      connectedAddress.address,
      to
    ]
  )

  const sendTransactionMutation = useMutation({
    mutationFn: async () => {
      const allParamsDefined = token && to && amount && chain
      if (!allParamsDefined) throw new Error('Need all params')
      if (token.type !== chain.chainType) {
        throw new Error('Invalid token or chain')
      }

      const isValidDestinationAddress = isWalletAddressValid(chain, to)
      if (!isValidDestinationAddress) {
        throw new Error('Invalid destination address')
      }

      const rawAmount = parseToBigInt(amount, token.decimals).toString()
      let tx

      switch (token.type) {
        case ChainType.EVM:
          if (!evmSigner) {
            throw new Error('Need EVM signer')
          }
          tx = await sendTransactionEvm({
            to,
            amount: rawAmount,
            token,
            signer: evmSigner,
            rpcUrl: chain.rpc
          })
          break

        case ChainType.COSMOS:
          if (!cosmosSigner) {
            throw new Error('Need Cosmos signer')
          }

          if (!nativeToken) {
            throw new Error('Need Cosmos native token')
          }

          const rpcUrl = await getWorkingCosmosRpcUrl(chain)
          tx = await sendTransactionCosmos({
            amount: rawAmount,
            rpcUrl,
            signer: cosmosSigner,
            to,
            token,
            nativeToken
          })
          break

        case ChainType.SOLANA:
          if (!solanaSigner) {
            throw new Error('Need Solana signer')
          }
          tx = await sendTransactionSolana({
            amount: rawAmount,
            to,
            token,
            connection: solanaClient,
            signer: solanaSigner
          })
          break

        case ChainType.BTC:
          if (!bitcoinSigner) {
            throw new Error('Need Bitcoin signer')
          }
          tx = await sendTransactionBitcoin({
            amount: rawAmount,
            to,
            token,
            signer: bitcoinSigner
          })
          break

        case ChainType.SUI:
          if (!suiSigner) {
            throw new Error('Need Sui signer')
          }
          const suiAccount = connectedWalletsByChainType[ChainType.SUI]
          if (!suiAccount.account) {
            throw new Error('Need Sui account')
          }

          tx = await sendTransactionSui({
            amount: rawAmount,
            to,
            token,
            chain,
            account: suiAccount.account,
            signer: suiSigner
          })
          break

        case ChainType.XRPL:
          if (!xrplSigner) {
            throw new Error('Need XRPL signer')
          }
          if (!connectedAddress.address) {
            throw new Error('No connected address found')
          }

          tx = await sendTransactionXrpl({
            amount: rawAmount,
            to,
            token,
            signer: xrplSigner,
            from: connectedAddress.address
          })

          break
      }

      return {
        amount,
        to,
        token,
        txHash: tx.txHash
      }
    },
    onMutate: variables => {
      useSendTransactionStore.setState({
        txLocalId: variables.id,
        currentTransaction: undefined
      })
    },
    onError: (error, variables) => {
      const currentTx = getTransaction(variables.id)
      const errorObject = getTransactionError(error)

      setTransactionState(variables.id, {
        ...currentTx,
        error: errorObject
      })
    },
    onSuccess: (tx, variables) => {
      queryClient.invalidateQueries(getPrefixKey(QueryKeys.Balance))
      setTransactionState(variables.id, tx)

      persistTransaction({
        txType: HistoryTxType.SEND,
        data: {
          amount: tx.amount,
          token: {
            address: tx.token.address,
            chainId: tx.token.chainId,
            decimals: tx.token.decimals,
            symbol: tx.token.symbol,
            type: tx.token.type
          },
          hash: tx.txHash,
          timestamp: Date.now(),
          toAddress: tx.to,
          status: SendTransactionStatus.ONGOING
        }
      })
      dispatchPostSendEvent({ txHash: tx.txHash })
    }
  })
  const sendTransaction = useCallback(async () => {
    const transactionId = Date.now().toString()
    dispatchPreSendEvent()

    return sendTransactionMutation.mutate({
      id: transactionId
    })
  }, [dispatchPreSendEvent, sendTransactionMutation.mutate])

  /**
   * In QR-based wallets, cleans up listeners and network requests (e.g. websockets)
   * Useful to save resources i.e when the user dismisses the QR code or aborts the connection process
   */
  const cancelSend = useCallback(() => {
    switch (chain?.chainType) {
      case ChainType.XRPL:
        return xrplSigner?.cancelSignAndSubmit?.()
    }
  }, [chain?.chainType, xrplSigner])

  return { sendTransaction, cancelSend }
}

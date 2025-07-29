import { ChainType, SquidDataType } from '@0xsquid/squid-types'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { InjectiveSigningStargateClient } from '@injectivelabs/sdk-ts/dist/cjs/core/stargate'
import { Transaction } from '@mysten/sui/transactions'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { isError } from 'ethers'
import { useCallback, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { getClient } from '../../core/client'
import { CHAIN_IDS } from '../../core/constants'
import { getPrefixKey, QueryKeys } from '../../core/queries/queries-keys'
import { TransactionErrorType } from '../../core/types/error'
import { TransactionStatus } from '../../core/types/transaction'
import { XrplTxStatus } from '../../core/types/xrpl'
import {
  executeSolanaSwap,
  executeSolanaTransfer,
  getCosmosSigningClient,
  getTransactionError,
  getXrplNetwork,
  handleTransactionErrorEvents,
  isProblematicConnector,
  isUserRejectionError,
  normalizeError,
  parseXrplPaymentTx
} from '../../services'
import { getWorkingCosmosRpcUrl } from '../../services/external/rpcService'
import { WidgetEvents } from '../../services/internal/eventService'
import { getSuiChain } from '../../services/internal/suiService'
import { getSourceExplorerTxUrl, isDepositRoute, sleep } from '../../services/internal/transactionService'
import { useSquidChains } from '../chains/useSquidChains'
import { useSolanaConnection } from '../solana/useSolana'
import { useDepositAddressStore } from '../store/useDepositAddressStore'
import { useSwapStore, useTransactionStore } from '../store/useSwapStore'
import { useSwap } from '../swap/useSwap'
import { useSquidTokens } from '../tokens/useSquidTokens'
import { useHistory } from '../user/useHistory'
import { useGnosisContext } from '../wallet/useGnosisContext'
import { useMultiChainWallet } from '../wallet/useMultiChainWallet'
import { useSigner } from '../wallet/useSigner'
import { useWallet } from '../wallet/useWallet'

export const useExecuteTransaction = squidRoute => {
  const { fromChain, toChain, fromToken, toToken, isSameChain } = useSwap()
  const { evmSigner, cosmosSigner, solanaSigner, bitcoinSigner, suiSigner, xrplSigner } = useSigner({
    chain: fromChain
  })
  const { findToken } = useSquidTokens()
  const solanaConnection = useSolanaConnection()
  const { findChain } = useSquidChains()
  const queryClient = useQueryClient()
  const { connectedWalletsByChainType } = useWallet()
  const squid = useSwapStore(state => state.squid)
  const getTransaction = useTransactionStore(state => state.getTransaction)
  const setTransactionStoreState = useTransactionStore(state => state.setTransactionState)
  const { connector: activeConnector } = useAccount()
  const { getGnosisTransactionHash } = useGnosisContext()
  const { addSwapTransaction, replaceSwapTransactionNonce, replaceSwapTransactionStatus } = useHistory()
  const {
    connectedAddress: { address: sourceUserAddress },
    changeNetworkIfNeeded
  } = useMultiChainWallet(fromChain)

  const connectedSourceWallet = useMemo(() => {
    return fromChain?.chainType ? connectedWalletsByChainType[fromChain.chainType] : undefined
  }, [fromChain?.chainType, connectedWalletsByChainType])

  /**
   * Set the transaction state in the store
   * This is useful to access the latest transaction from any hook
   */
  const setTransactionState = useCallback(
    ({ route, txHash, transactionIdForStatus, nonce, status, sourceStatus, userAddress, axelarUrl, id }) => {
      if (!route?.transactionRequest) return undefined
      // TODO: update types
      const { quoteId } = route
      const tx = {
        fromChain,
        toChain,
        routeType: route.transactionRequest.type,
        nonce,
        transactionId: txHash,
        transactionIdForStatus: transactionIdForStatus ?? txHash,
        quoteId,
        status,
        sourceStatus,
        timestamp: Date.now(),
        fromAddress: userAddress,
        sourceTxExplorerUrl: getSourceExplorerTxUrl(fromChain, txHash),
        sourceExplorerImgUrl: fromChain?.chainIconURI,
        axelarUrl
      }
      setTransactionStoreState(id, tx)

      return tx
    },
    [fromChain, setTransactionStoreState, toChain]
  )

  const getCosmosSignerClient = useCallback(async () => {
    if (!fromChain) return null
    const rpc = await getWorkingCosmosRpcUrl(fromChain)

    if (!cosmosSigner) return null

    switch (fromChain.chainId) {
      case CHAIN_IDS.INJECTIVE:
        return InjectiveSigningStargateClient.connectWithSigner(rpc, cosmosSigner)
      default: {
        const cosmosClient = await getCosmosSigningClient({
          chainRpc: rpc,
          cosmosSigner,
          defaultSigningClient: SigningCosmWasmClient
        })
        return cosmosClient
      }
    }
  }, [cosmosSigner, fromChain])

  const resetQueriesAfterTxSigned = () => {
    queryClient.refetchQueries(getPrefixKey(QueryKeys.Balance))
    queryClient.invalidateQueries(getPrefixKey(QueryKeys.Transaction))
  }

  const dispatchSignatureRequestEvent = useCallback(route => {
    WidgetEvents.getInstance().dispatchSwapTxSignatureRequested({
      route
    })
  }, [])

  const dispatchPreSwapEvent = useCallback(
    route => {
      WidgetEvents.getInstance().dispatchPreSwap(
        {
          ...route.params
        },
        findToken
      )
    },
    [findToken]
  )

  const dispatchPostSwapEvent = useCallback(
    (route, txHash) => {
      WidgetEvents.getInstance().dispatchPostSwap(
        {
          ...route.params,
          txHash
        },
        findToken
      )
    },
    [findToken]
  )

  const swapQueryCosmos = useMutation({
    mutationFn: async ({ id, route }) => {
      const fromChainId = route?.params.fromChain
      if (cosmosSigner && fromChainId) {
        try {
          const signingClient = await getCosmosSignerClient()
          const signerAddress = (await cosmosSigner.getAccounts())[0].address
          if (signerAddress && signingClient && route) {
            dispatchSignatureRequestEvent(route)
            const tx = await squid?.executeRoute({
              signer: signingClient,
              signerAddress,
              route
            })

            // set the tx state to loading, as soon as user signed the tx
            setTransactionState({
              txHash: '',
              route,
              status: TransactionStatus.ONGOING,
              sourceStatus: TransactionStatus.ONGOING,
              id
            })
            // broadcast the signed tx to get hash and listen to events
            const response = await signingClient.broadcastTx(TxRaw.encode(tx).finish())
            const hash = response.transactionHash

            if (hash) {
              resetQueriesAfterTxSigned()
            }
            // Dispatch event so it can be listened from outside the widget
            WidgetEvents.getInstance().dispatchSwapExecuteCall(route, hash)
            const txParams = setTransactionState({
              route,
              txHash: hash,
              userAddress: sourceUserAddress,
              status: TransactionStatus.ONGOING,
              sourceStatus: TransactionStatus.ONGOING,
              axelarUrl: undefined,
              id
            })

            if (txParams) {
              addSwapTransaction({
                ...txParams,
                params: route.params,
                estimate: route.estimate
              })
            }

            return response.code === 0
          }
        } catch (error) {
          console.error('Error executing Cosmos transaction', error)
          if (isUserRejectionError(normalizeError(error))) {
            throw new Error('Request rejected')
          }
        }
      }

      throw new Error('Need all parameters')
    }
  })

  // If the transaction is replaced, we need to update the transaction hash
  // Transaction replaced can mean that the user has speed up the transaction for example
  // Could also be cancelled
  const handleTransactionReplacementError = useCallback(
    async ({ error, route, status, sourceStatus, userAddress, axelarUrl, id }) => {
      if (route && isError(error, 'TRANSACTION_REPLACED')) {
        const txReplacementError = error
        const { hash: newHash, nonce: newNonce } = txReplacementError.replacement
        if (route.transactionRequest) {
          const txParams = setTransactionState({
            route,
            txHash: newHash,
            nonce: newNonce,
            userAddress: sourceUserAddress,
            status,
            sourceStatus,
            axelarUrl: undefined,
            id
          })

          if (txParams) {
            replaceSwapTransactionNonce(newNonce, sourceUserAddress, {
              ...txParams,
              params: route.params,
              estimate: route.estimate
            })
          }
        }
        try {
          const response = await txReplacementError.replacement.wait()
          if (!response) {
            throw new Error('Transaction receipt is null')
          }

          return response
        } catch (replacementError) {
          // Maybe the transaction was replaced again
          // recursive call
          return handleTransactionReplacementError({
            error,
            route,
            status,
            sourceStatus,
            userAddress,
            axelarUrl,
            id
          })
        }
      } else {
        throw error
      }
    },
    [replaceSwapTransactionNonce, setTransactionState, sourceUserAddress]
  )

  const swapQueryEvm = useMutation({
    mutationFn: async ({ id, route }) => {
      await changeNetworkIfNeeded.mutateAsync()
      if (!route || !squid || !evmSigner) {
        throw new Error('Need all parameters')
      }
      dispatchSignatureRequestEvent(route)
      const txResponse = await squid.executeRoute({
        bypassBalanceChecks: true,
        signer: evmSigner,
        route
      })
      let hash = txResponse.hash
      if (activeConnector?.id === 'safe') {
        hash = await getGnosisTransactionHash(txResponse.hash)
      }
      if (hash) {
        resetQueriesAfterTxSigned()
      }

      // Dispatch event so it can be listened from outside the widget
      WidgetEvents.getInstance().dispatchSwapExecuteCall(route, hash)

      if (route.transactionRequest) {
        const txParams = setTransactionState({
          route,
          txHash: hash,
          nonce: txResponse.nonce,
          userAddress: sourceUserAddress,
          status: TransactionStatus.INITIAL_LOADING,
          sourceStatus: TransactionStatus.ONGOING,
          axelarUrl: undefined,
          id
        })

        if (txParams) {
          addSwapTransaction({
            ...txParams,
            params: route.params,
            estimate: route.estimate
          })
        }
      }

      try {
        if (isProblematicConnector(activeConnector)) {
          await sleep(3_000)
        }
        const response = await txResponse.wait()
        return response
      } catch (error) {
        return handleTransactionReplacementError({
          error,
          route,
          status: TransactionStatus.INITIAL_LOADING,
          sourceStatus: TransactionStatus.ONGOING,
          userAddress: sourceUserAddress,
          axelarUrl: undefined,
          id
        })
      }
    }
  })

  const swapQuerySolana = useMutation({
    mutationFn: async ({ id, route }) => {
      try {
        if (!route) {
          throw new Error('Route is required')
        }

        if (!solanaSigner) {
          throw new Error('Solana signer is required')
        }

        if (!route.params.fromAddress || !route.params.toAddress) {
          throw new Error('From or to address is required')
        }

        const isDirectTransfer = isDepositRoute(route)

        // Means it's a transfer to a deposit address
        // Instead of a Swap/Contract call using a DEX like Jupiter
        if (isDirectTransfer) {
          // Get the deposit address from the squidRoute
          const depositData = useDepositAddressStore.getState().deposit
          // Validate params
          if (!depositData?.depositAddress) {
            throw new Error('Deposit address is required')
          }

          const signature = await executeSolanaTransfer({
            amount: BigInt(route.params.fromAmount),
            target: depositData.depositAddress,
            signer: solanaSigner,
            connection: solanaConnection,
            sourceToken: findToken(route.params.fromToken, route?.params?.fromChain),
            onSigned: txHash => {
              WidgetEvents.getInstance().dispatchSwapExecuteCall(route, txHash)
              const txParams = setTransactionState({
                route,
                txHash,
                transactionIdForStatus: depositData.chainflipStatusTrackingId,
                userAddress: sourceUserAddress,
                status: TransactionStatus.INITIAL_LOADING,
                sourceStatus: TransactionStatus.ONGOING,
                id
              })
              if (txParams) {
                addSwapTransaction({
                  ...txParams,
                  params: route.params,
                  estimate: route.estimate
                })
              }
            }
          })

          return signature
        }

        const signature = await executeSolanaSwap({
          route,
          signer: solanaSigner,
          connection: solanaConnection,
          onSigned: txHash => {
            WidgetEvents.getInstance().dispatchSwapExecuteCall(route, txHash)
            const txParams = setTransactionState({
              route,
              txHash,
              transactionIdForStatus: undefined,
              userAddress: sourceUserAddress,
              status: TransactionStatus.INITIAL_LOADING,
              sourceStatus: TransactionStatus.ONGOING,
              id
            })

            if (txParams) {
              addSwapTransaction({
                ...txParams,
                params: route.params,
                estimate: route.estimate
              })
            }
          }
        })

        return signature
      } catch (error) {
        console.error('Solana transaction failed:', error)
        throw error instanceof Error ? error : new Error('Failed to execute Solana transaction')
      }
    },
    onError: (error, variables) => {
      const currentTx = getTransaction(variables.id)
      const errorObject = getTransactionError(error)
      setTransactionStoreState(variables.id, {
        ...currentTx,
        status: TransactionStatus.ERROR,
        sourceStatus: TransactionStatus.ERROR,
        error: errorObject
      })

      if (currentTx?.transactionId && errorObject.type === TransactionErrorType.CALL_EXCEPTION) {
        replaceSwapTransactionStatus({
          transactionId: currentTx.transactionId,
          statusResponse: currentTx.statusResponse,
          status: TransactionStatus.ERROR
        })
      }
    },
    onSuccess: (_data, variables) => {
      const currentTx = getTransaction(variables.id)
      queryClient.invalidateQueries(getPrefixKey(QueryKeys.Balances))

      if (isSameChain && currentTx?.transactionId) {
        replaceSwapTransactionStatus({
          transactionId: currentTx.transactionId,
          statusResponse: currentTx.statusResponse,
          status: TransactionStatus.SUCCESS
        })
      }

      setTransactionStoreState(variables.id, {
        ...currentTx,
        sourceStatus: TransactionStatus.SUCCESS,
        status: isSameChain ? TransactionStatus.SUCCESS : TransactionStatus.ONGOING
      })
    }
  })

  const swapQueryBitcoin = useMutation({
    mutationFn: async ({ id, route }) => {
      const {
        depositAddress,
        amount: sendAmount,
        chainflipStatusTrackingId
      } = useDepositAddressStore.getState().deposit ?? {}

      if (!depositAddress) {
        throw new Error(`Invalid deposit address: ${depositAddress}`)
      }

      if (!sendAmount) {
        throw new Error(`Invalid send amount: ${sendAmount}`)
      }

      const allParamsValid = route && bitcoinSigner && depositAddress && sendAmount
      await changeNetworkIfNeeded.mutateAsync()

      if (allParamsValid) {
        dispatchSignatureRequestEvent(route)
        const { txHash } = await bitcoinSigner.sendBTC(depositAddress, Number(sendAmount))
        if (txHash) {
          resetQueriesAfterTxSigned()
        }
        // Dispatch event so it can be listened from outside the widget
        WidgetEvents.getInstance().dispatchSwapExecuteCall(route, txHash)
        if (route.transactionRequest) {
          const txParams = setTransactionState({
            route,
            txHash,
            // When bridging from Bitcoin we need to send the chainflipId to the status endpoint
            // instead of the Bitcoin transaction hash
            transactionIdForStatus: chainflipStatusTrackingId,
            userAddress: sourceUserAddress,
            status: TransactionStatus.INITIAL_LOADING,
            sourceStatus: TransactionStatus.ONGOING,
            axelarUrl: undefined,
            id
          })

          if (txParams) {
            addSwapTransaction({
              ...txParams,
              params: route.params,
              estimate: route.estimate
            })
          }
        }
      } else {
        throw new Error('Need all parameters')
      }
    }
  })

  const swapQueryXrpl = useMutation({
    mutationFn: async ({ id, route }) => {
      if (!route?.transactionRequest || !xrplSigner) {
        throw new Error('Need all parameters')
      }

      if (route.transactionRequest.type !== SquidDataType.OnChainExecution) {
        throw new Error('Invalid route type')
      }

      const { data } = route.transactionRequest
      const paymentTx = parseXrplPaymentTx(data)
      if (!paymentTx) throw new Error('Could not parse transaction')

      const fromChainId = route.params.fromChain
      const xrplNetwork = getXrplNetwork(fromChainId)
      if (xrplNetwork == null) {
        throw new Error(`No XRPL network found for chainId '${fromChainId}'`)
      }

      const txRes = await xrplSigner.signAndSubmit({
        tx: paymentTx,
        network: xrplNetwork
      })

      const txParams = setTransactionState({
        txHash: txRes.hash,
        id,
        sourceStatus: TransactionStatus.ONGOING,
        status: TransactionStatus.ONGOING,
        route: route,
        userAddress: sourceUserAddress
      })

      if (txParams && route) {
        addSwapTransaction({
          ...txParams,
          params: route.params,
          estimate: route.estimate
        })
      }

      if (txRes.status !== XrplTxStatus.SUCCESS) {
        throw new Error(`Transaction failed with status: ${txRes.status}`)
      }
    }
  })

  const swapQuerySui = useMutation({
    mutationFn: async ({ id, route }) => {
      if (!route || !suiSigner || !fromChain) {
        throw new Error('Need all parameters')
      }

      if (route.transactionRequest?.type !== SquidDataType.OnChainExecution) {
        throw new Error('Invalid route type')
      }

      const suiWalletState = connectedWalletsByChainType[ChainType.SUI]
      if (!suiWalletState.account) {
        throw new Error('Sui wallet is missing account data')
      }

      const fromChainId = route.params.fromChain
      const suiChain = getSuiChain(fromChainId)
      if (!suiChain) {
        throw new Error(`Source chain (${fromChainId}) does not match any Sui chain`)
      }

      const suiClient = await getClient(fromChain)
      const txJson = route.transactionRequest.data
      const tx = Transaction.from(txJson)
      const signedTx = await suiSigner.signTransaction({
        transaction: tx,
        account: suiWalletState.account,
        chain: suiChain
      })

      // execute transaction without waiting for confirmation
      const txResponse = await suiClient.executeTransactionBlock({
        signature: signedTx.signature,
        transactionBlock: signedTx.bytes
      })

      const txHash = txResponse.digest
      if (txHash) {
        resetQueriesAfterTxSigned()
      }

      WidgetEvents.getInstance().dispatchSwapExecuteCall(route, txHash)
      const txParams = setTransactionState({
        route,
        txHash,
        userAddress: sourceUserAddress,
        status: TransactionStatus.INITIAL_LOADING,
        sourceStatus: TransactionStatus.ONGOING,
        id
      })

      if (txParams) {
        addSwapTransaction({
          ...txParams,
          params: route.params,
          estimate: route.estimate
        })
      }

      // wait for transaction confirmation
      await suiClient.waitForTransaction({
        digest: txHash
      })
    }
  })

  const handleTransactionSuccess = useCallback(
    id => {
      const currentTx = getTransaction(id)
      queryClient.invalidateQueries(getPrefixKey(QueryKeys.Balances))
      if (isSameChain && currentTx?.transactionId) {
        replaceSwapTransactionStatus({
          transactionId: currentTx.transactionId,
          statusResponse: currentTx.statusResponse,
          status: TransactionStatus.SUCCESS
        })
      }

      setTransactionStoreState(id, {
        ...currentTx,
        sourceStatus: TransactionStatus.SUCCESS,
        status: isSameChain ? TransactionStatus.SUCCESS : TransactionStatus.ONGOING
      })
    },
    [getTransaction, isSameChain, queryClient, replaceSwapTransactionStatus, setTransactionStoreState]
  )

  const handleTransactionError = useCallback(
    (error, id) => {
      const currentTx = getTransaction(id)
      const errorObject = getTransactionError(error)

      handleTransactionErrorEvents({
        error: errorObject,
        transactionParams: currentTx,
        walletProviderName: connectedSourceWallet?.wallet?.name,
        squidRoute
      })

      setTransactionStoreState(id, {
        ...currentTx,
        status: TransactionStatus.ERROR,
        sourceStatus: TransactionStatus.ERROR,
        error: errorObject
      })

      if (currentTx?.transactionId && errorObject.type === TransactionErrorType.CALL_EXCEPTION) {
        replaceSwapTransactionStatus({
          transactionId: currentTx?.transactionId,
          statusResponse: currentTx?.statusResponse,
          status: TransactionStatus.ERROR
        })
      }
    },
    [
      connectedSourceWallet?.wallet?.name,
      getTransaction,
      replaceSwapTransactionStatus,
      setTransactionStoreState,
      squidRoute
    ]
  )

  const swapQuery = useMutation({
    mutationFn: async mutationParams => {
      if (!mutationParams.route) throw new Error('route is required')

      const sourceChain = findChain(mutationParams.route.params?.fromChain)

      if (!sourceChain) throw new Error('Could not find source chain')

      switch (sourceChain.chainType) {
        case ChainType.COSMOS: {
          return swapQueryCosmos.mutateAsync(mutationParams)
        }
        case ChainType.EVM: {
          return swapQueryEvm.mutateAsync(mutationParams)
        }
        case ChainType.BTC: {
          return swapQueryBitcoin.mutateAsync(mutationParams)
        }
        case ChainType.SOLANA: {
          return swapQuerySolana.mutateAsync(mutationParams)
        }
        case ChainType.SUI: {
          return swapQuerySui.mutateAsync(mutationParams)
        }
        case ChainType.XRPL: {
          return swapQueryXrpl.mutateAsync(mutationParams)
        }
        default:
          throw new Error(`Swap query not implemented for chain type: ${sourceChain.chainType}`)
      }
    },
    onMutate: variables => {
      useTransactionStore.setState({
        txLocalId: variables.id,
        currentTransaction: undefined
      })
    },
    onError: (error, variables) => handleTransactionError(error, variables.id),
    onSuccess: (_data, variables) => {
      const currentTx = getTransaction(variables.id)

      handleTransactionSuccess(variables.id)
      // Dispatch postSwap event after successful swap
      if (squidRoute && sourceUserAddress && currentTx?.transactionId) {
        dispatchPostSwapEvent(squidRoute, currentTx.transactionId)
      }
    }
  })

  /**
   * Execute transaction wrapper
   * Generate a unique id for the transaction (as they don't have tx hash yet)
   */
  const executeSwap = useCallback(async () => {
    const transactionId = Date.now().toString()
    // Dispatch preSwap event before executing the swap
    if (squidRoute) {
      dispatchPreSwapEvent(squidRoute)
    }

    return swapQuery.mutate({
      id: transactionId,
      route: squidRoute
    })
  }, [swapQuery, squidRoute, dispatchPreSwapEvent])

  /**
   * In QR-based wallets, cleans up listeners and network requests (e.g. websockets)
   * Useful to save resources i.e when the user dismisses the QR code or aborts the connection process
   */
  const cancelSwap = useCallback(() => {
    switch (fromChain?.chainType) {
      case ChainType.XRPL:
        return xrplSigner?.cancelSignAndSubmit?.()
    }
  }, [fromChain?.chainType, xrplSigner])

  return {
    executeSwap,
    cancelSwap,
    fromToken,
    toToken,
    toChain,
    fromChain,
    isLoading: swapQuery.isLoading,
    error: swapQuery.error
  }
}

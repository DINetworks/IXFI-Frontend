import { useMutation, useQueries, useQuery } from '@tanstack/react-query'
import { useMemo, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { keys } from '../../core/queries/queries-keys'
import { HistoryTxType } from '../../core/types/history'
import { WidgetEvents } from '../../services'
import { OnrampService } from '../../services/external/onrampAdapter'
import { countryCurrencyMap } from '../../services/internal/countryCurrencyMap'
import {
  getCountryData,
  getCurrencyData,
  getSuggestedAmountsForCurrency
} from '../../services/internal/fiatToCryptoService'
import { isWalletAddressValid } from '../../services/internal/walletService'
import { useSquidChains } from '../chains/useSquidChains'
import { useHistoryStore } from '../store/useHistoryStore'
import { useSquidTokens } from '../tokens/useSquidTokens'

export const TX_STATUS_CONSTANTS = {
  RETRY_COUNT: 2,
  RETRY_DELAY: 60_000,
  REFETCH_INTERVAL: 30_000 // Check every 30 seconds
}

/**
 * Final transaction statuses that indicate the transaction has reached a terminal state
 */
export const FINAL_TRANSACTION_STATUSES = ['completed', 'failed']

/**
 * Configuration for transaction status tracking
 */
const createTransactionStatusConfig = ({ transactionId, walletAddress, providerId }) => {
  return {
    queryKey: keys().fiatToCryptoStatus(transactionId),
    queryFn: () => new OnrampService().getTransactionStatus(transactionId, walletAddress, providerId),
    enabled: !!transactionId && !!walletAddress && !!providerId,
    retry: TX_STATUS_CONSTANTS.RETRY_COUNT,
    retryDelay: TX_STATUS_CONSTANTS.RETRY_DELAY,
    refetchInterval: data => {
      if (data?.status && FINAL_TRANSACTION_STATUSES.includes(data.status)) {
        return false
      }
      return TX_STATUS_CONSTANTS.REFETCH_INTERVAL
    },
    // Remove onSuccess and onError callbacks
    meta: {
      transactionId,
      walletAddress,
      providerId
    }
  }
}

/**
 * Fetches quotes for fiat to crypto conversion with provider details.
 * Returns available rates, fees, and supported payment methods for the conversion.
 */
export const useGetFiatQuote = ({
  fiatCurrency,
  cryptoCurrencyID,
  amount,
  region,
  paymentMethod,
  enabled = true,
  onSuccess
}) => {
  const service = useMemo(() => new OnrampService(), [])
  const { data: config } = useGetOnRampConfig()

  const query = useQuery({
    queryKey: keys().fiatToCryptoQuote(fiatCurrency, cryptoCurrencyID, amount, region, paymentMethod),
    queryFn: async () => {
      // Dispatch event before getting quote
      WidgetEvents.getInstance().dispatchOnrampQuoteRequest({
        fiatCurrency,
        cryptoCurrencyID,
        amount,
        region,
        paymentMethod
      })

      const quoteResponse = await service.getQuote({
        fiatCurrency,
        cryptoCurrencyID,
        amount,
        region,
        paymentMethod
      })
      // Enhance quotes with provider information from config
      if (quoteResponse.quotes && config?.supportedOnramps) {
        quoteResponse.quotes = quoteResponse.quotes.map(quote => ({
          ...quote,
          providerIcon: config?.supportedOnramps?.find(provider => provider.id === quote.onrampProviderId)?.icon,
          providerName:
            config?.supportedOnramps?.find(provider => provider.id === quote.onrampProviderId)?.name ||
            quote.providerName
        }))
      }

      // If quotes array is empty, throw an error to preserve previous state
      if (quoteResponse.quotes.length === 0) {
        throw new Error('NO_QUOTES_AVAILABLE')
      }

      return quoteResponse
    },
    enabled: enabled && !!fiatCurrency && !!cryptoCurrencyID && amount > 0
  })

  // Handle onSuccess callback with useEffect
  useEffect(() => {
    if (query.isSuccess && query.data && onSuccess) {
      onSuccess(query.data)
    }
  }, [query.isSuccess, query.data, onSuccess])

  return query
}

/**
 * Fetches and caches onramp provider configuration.
 * Includes supported tokens, payment methods, and country restrictions.
 */
export const useGetOnRampConfig = () => {
  const service = useMemo(() => new OnrampService(), [])
  const { chains } = useSquidChains()
  const { tokens } = useSquidTokens()
  return useQuery({
    queryKey: keys().fiatToCryptoConfig(),
    queryFn: () =>
      service.getConfiguration({
        chains,
        tokens
      }),
    gcTime: 1000 * 60 * 60, // Updated from cacheTime
    staleTime: 1000 * 60 * 30 // 30 minutes
  })
}

/**
 * Executes a fiat to crypto quote and creates an order.
 * Validates wallet address and persists transaction for tracking.
 */
export const useExecuteFiatQuote = () => {
  const service = useMemo(() => new OnrampService(), [])
  const persistTransaction = useHistoryStore(state => state.persistTransaction)
  const { findChain } = useSquidChains()

  return useMutation({
    mutationFn: async executeQuoteRequest => {
      const chain = findChain(executeQuoteRequest.squidToken?.chainId)
      if (!chain) {
        throw new Error('Chain not found')
      }

      if (!isWalletAddressValid(chain, executeQuoteRequest.walletAddress)) {
        throw new Error('Invalid wallet address for selected network')
      }

      // Revolut expects us to provide a quoteId, but Onramper already provides one
      const orderId = executeQuoteRequest.orderId ?? uuidv4()
      const executeQuoteRequestWithOrderId = {
        ...executeQuoteRequest,
        orderId
      }

      // Dispatch event before executing quote
      WidgetEvents.getInstance().dispatchOnrampQuoteExecute(executeQuoteRequestWithOrderId)
      const executeQuoteResult = await service.executeQuote(executeQuoteRequestWithOrderId)

      return {
        ...executeQuoteResult,
        executeQuoteRequest: executeQuoteRequestWithOrderId,
        toChain: chain
      }
    },
    onSuccess: result => {
      const { executeQuoteRequest, toChain, orderId } = result

      persistTransaction({
        data: {
          orderId,
          fromFiatCurrency: executeQuoteRequest.fiatCurrency,
          fromAmount: executeQuoteRequest.amount.toString(),
          toCryptoCurrencyID: executeQuoteRequest.cryptoCurrencyID,
          fromCountryCode: executeQuoteRequest.region ?? '',
          toTokenAddress: executeQuoteRequest.squidToken?.address ?? '',
          toCryptoAmount: executeQuoteRequest.cryptoAmount.toString(),
          toChainId: toChain?.chainId ?? '',
          toAddress: executeQuoteRequest.walletAddress,
          status: 'awaiting_payment',
          timestamp: Date.now(),
          providerId: executeQuoteRequest.providerId
        },
        txType: HistoryTxType.BUY
      })
    }
  })
}

/**
 * Tracks the status of a single fiat to crypto transaction.
 */
export const useFiatOnRampTxStatus = (transactionId, walletAddress, providerId) => {
  const replaceTransactionStatus = useHistoryStore(state => state.replaceTransactionStatus)

  const query = useQuery({
    ...createTransactionStatusConfig({
      transactionId,
      walletAddress,
      providerId
    })
  })

  // Handle success and error with useEffect
  useEffect(() => {
    if (query.isSuccess && query.data) {
      replaceTransactionStatus({
        txType: HistoryTxType.BUY,
        orderId: transactionId,
        status: query.data.status,
        transactionHash: query.data.transactionHash
      })
    }
  }, [query.isSuccess, query.data, transactionId, replaceTransactionStatus])

  useEffect(() => {
    if (query.isError) {
      replaceTransactionStatus({
        txType: HistoryTxType.BUY,
        orderId: transactionId,
        status: 'failed',
        transactionHash: undefined
      })
    }
  }, [query.isError, transactionId, replaceTransactionStatus])

  return query
}

/**
 * Tracks all pending fiat transactions.
 */
export const useFiatTransactions = () => {
  const transactions = useHistoryStore(state => state.transactions.filter(tx => tx.txType === HistoryTxType.BUY))
  const replaceTransactionStatus = useHistoryStore(state => state.replaceTransactionStatus)
  const pendingTransactions = useMemo(
    () => transactions?.filter(tx => !FINAL_TRANSACTION_STATUSES.includes(tx.data.status)) ?? [],
    [transactions]
  )

  const queries = useQueries({
    queries: pendingTransactions.map(tx => {
      const txId = tx.data.orderId
      return {
        ...createTransactionStatusConfig({
          transactionId: txId,
          walletAddress: tx.data.toAddress,
          providerId: tx.data.providerId
        })
      }
    })
  })

  // Handle success and error with useEffect
  useEffect(() => {
    queries.forEach((query, index) => {
      const tx = pendingTransactions[index]
      if (!tx) return

      const txId = tx.data.orderId

      if (query.isSuccess && query.data) {
        replaceTransactionStatus({
          txType: HistoryTxType.BUY,
          orderId: txId,
          status: query.data.status,
          transactionHash: query.data.transactionHash
        })
      } else if (query.isError) {
        replaceTransactionStatus({
          txType: HistoryTxType.BUY,
          orderId: txId,
          status: 'failed',
          transactionHash: undefined
        })
      }
    })
  }, [queries, pendingTransactions, replaceTransactionStatus])

  return {
    transactions: transactions.map(tx => tx.data),
    isLoading: queries.some(q => q.isLoading),
    isError: queries.some(q => q.isError)
  }
}

/**
 * Gets currency details including symbol and limits.
 * Example: USD → { symbol: "$", name: "US Dollar", ... }
 */
export const useCurrencyDetails = currencyCode => {
  const { data: config } = useGetOnRampConfig()
  return useMemo(() => {
    if (!currencyCode) return undefined

    const currencyData = getCurrencyData(currencyCode)
    const countryData = countryCurrencyMap.find(c => c.currencyCode === currencyCode)

    if (currencyData) {
      return {
        ...currencyData,
        countryCode: countryData?.countryCode?.toLowerCase()
      }
    }

    return undefined
  }, [currencyCode, config?.supportedFiats])
}

/**
 * Gets country details with flag URL and localized name.
 * Example: "US" → { name: "United States", flag: "🇺🇸", ... }
 */
export const useCountryDetails = countryCode => {
  return useMemo(() => {
    if (!countryCode) return undefined

    return getCountryData(countryCode)
  }, [countryCode])
}

/**
 * Filters and returns only valid quotes that have available payment methods.
 * Ensures users only see quotes they can actually use.
 */
export const useAvailableQuotes = quotes => {
  return useMemo(() => {
    if (!quotes?.length) return []

    const validQuotes = quotes.filter(quote => quote && quote.paymentMethods?.length > 0 && quote.rate)
    // Remove duplicates by provider name
    const uniqueQuotes = validQuotes.filter(
      (quote, index, self) => index === self.findIndex(t => t.providerName === quote.providerName)
    )

    return uniqueQuotes
  }, [quotes])
}

/**
 * Gets the recommended quote based on best rates or provider preferences.
 * Falls back to first available quote if no specific recommendation.
 */
export const useRecommendedQuote = (quotes, recommendedQuote) => {
  const availableQuotes = useAvailableQuotes(quotes)

  return useMemo(() => {
    if (!availableQuotes.length) return undefined
    if (!recommendedQuote) return availableQuotes[0]
    // Try to find the recommended quote among available quotes
    const recommendedAvailableQuote = availableQuotes.find(
      quote => quote.onrampProviderId === recommendedQuote.onrampProviderId
    )
    // If recommended quote is not available, return first available quote
    return recommendedAvailableQuote ?? availableQuotes[0]
  }, [availableQuotes, recommendedQuote])
}

/**
 * Fetches the available payment methods for a given fiat and crypto currency pair.
 * The first item in the returned array is the most recommended.
 */
export const useGetOnrampPaymentTypes = ({ fiatCurrency, cryptoCurrencyID, region, enabled = true }) => {
  const service = useMemo(() => new OnrampService(), [])

  return useQuery({
    queryKey: keys().fiatToCryptoPaymentMethods(fiatCurrency, cryptoCurrencyID, region),
    queryFn: () => service.getPaymentTypes(fiatCurrency, cryptoCurrencyID, region),
    enabled: enabled && !!fiatCurrency && !!cryptoCurrencyID
  })
}

/**
 * Returns 3 suggested fiat amounts for the given currency code, based on rateAgainstUSD
 */
export function useSuggestedFiatAmounts(currencyCode) {
  return useMemo(() => {
    if (!currencyCode) return [50, 200, 1000]

    return getSuggestedAmountsForCurrency(currencyCode)
  }, [currencyCode])
}

import { formatUnitsRounded } from './numberService'

/**
 * Creates a hash string from quote request parameters to track changes
 */
export const createQuoteRequestParamsHash = params => {
  return [
    params.fromAddress || '',
    params.toAddress || '',
    params.fromChain,
    params.toChain,
    `${params.fromToken}_${params.fromChain}`,
    `${params.toToken}_${params.toChain}`,
    params.fromAmount
  ].join('|')
}

/**
 * Formats the amount based on token details
 * @param data Event parameters containing fromToken, fromChain, and fromAmount
 * @param findToken Function to find token details
 * @returns Original data with formatted amount
 */
const formatTokenAmountForEvent = (data, findToken) => {
  const fromToken = findToken(data.fromToken, data.fromChain)
  const formattedFromAmount = formatUnitsRounded((data.fromAmount ?? '0').toString(), fromToken?.decimals, 10)
  // Rewrite the fromAmount with the formatted amount
  // Example: 1000000000000000000 -> 1 with decimals 18
  // For readability of the event data
  return {
    ...data,
    fromAmount: formattedFromAmount
  }
}

export class WidgetEvents extends EventTarget {
  static instance

  constructor() {
    super()
  }

  // Singleton, because we need to access this service outside the widget
  static getInstance() {
    if (!WidgetEvents.instance) {
      WidgetEvents.instance = new WidgetEvents()
    }
    return WidgetEvents.instance
  }

  /**
   * Overriding the addEventListener method to make it easier to use with typescript
   * @param type
   * @param listener
   * @param options
   */
  listenToWidget(type, listener, options) {
    super.addEventListener(type, listener, options)
  }

  /**
   * Overriding the removeEventListener method to make it easier to use with typescript
   * @param type
   * @param listener
   * @param options
   */
  removeWidgetListener(type, listener, options) {
    super.removeEventListener(type, listener, options)
  }

  /**
   * Dispatch an event of the widget
   * To be listened from an integrator website
   * For example to display a success message when transaction is done
   * @param name
   * @param data
   */
  dispatch(name, data) {
    this.dispatchEvent(new CustomEvent(name, { detail: data }))
  }

  /**
   * Will dispatch the main axelar status of transaction
   * This will be called every time the status is received by backend
   * (Using interval to check status)
   * @param status
   */
  dispatchSwapStatus(status) {
    this.dispatch('swapStatus', { status })
  }

  /**
   * Dispatch event when user executes a swap
   * Only when we have the tx hash received
   * @param route
   */
  dispatchSwapExecuteCall(route, txHash) {
    this.dispatch('swap', { route, txHash })
  }

  /**
   * Dispatch event when user changes chain/token
   * @param swapParams
   */
  dispatchSwapParamsChanged(swapParams) {
    this.dispatch('swapParamsChanged', { ...swapParams })
  }

  /**
   * Dispatch event when we are waiting for the user to sign the swap transaction
   * @param data
   */
  dispatchSwapTxSignatureRequested(data) {
    this.dispatch('swapTxSignatureRequested', data)
  }

  /**
   * Dispatch event when there's an error while executing the swap route
   * @param data
   */
  dispatchSwapRouteExecutionError(data) {
    this.dispatch('swapRouteExecutionError', data)
  }

  /**
   * Dispatch event when requesting a quote for swap
   * @param data Quote request parameters
   */
  dispatchRequestQuote(data) {
    this.dispatch('requestQuote', data)
  }

  /**
   * Dispatch event before swap execution
   * @param data Pre-swap parameters
   * @param findToken Function to find token details
   */
  dispatchPreSwap(data, findToken) {
    this.dispatch('preSwap', formatTokenAmountForEvent(data, findToken))
  }

  /**
   * Dispatch event after swap execution
   * @param data Post-swap parameters including transaction hash
   * @param findToken Function to find token details
   */
  dispatchPostSwap(data, findToken) {
    this.dispatch('postSwap', formatTokenAmountForEvent(data, findToken))
  }

  /**
   * Dispatch event when wallet is successfully connected
   * @param data Wallet connection details
   */
  dispatchWalletConnect(data) {
    this.dispatch('walletConnect', data)
  }

  /**
   * Dispatch event when wallet connection is rejected
   * @param data Wallet rejection details
   */
  dispatchWalletReject(data) {
    this.dispatch('walletReject', data)
  }

  /**
   * Dispatch event when onchain transaction is rejected
   * @param data Onchain rejection details
   */
  dispatchOnchainReject(data) {
    this.dispatch('onchainReject', data)
  }

  /**
   * Dispatch event when requesting an onramp quote
   * @param data Quote request parameters
   */
  dispatchOnrampQuoteRequest(data) {
    this.dispatch('onrampQuoteRequest', data)
  }

  /**
   * Dispatch event when executing an onramp quote
   * @param data Quote execution parameters
   */
  dispatchOnrampQuoteExecute(data) {
    this.dispatch('onrampQuoteExecute', data)
  }

  /**
   * Dispatch event when the search query has no results
   * @param data Empty search details
   */
  dispatchSearchEmpty(data) {
    this.dispatch('searchEmpty', data)
  }

  /**
   * Dispatch event before Send transaction execution
   * @param data Pre-send parameters
   */
  dispatchPreSend(data) {
    this.dispatch('preSend', data)
  }

  /**
   * Dispatch event after Send transaction execution
   * @param data Post-send parameters
   */
  dispatchPostSend(data) {
    this.dispatch('postSend', data)
  }

  /**
   * Dispatch event when QR code is generated for wallet connection.
   * @param data QR code data
   */
  dispatchQrCodeGeneratedForConnect(data) {
    this.dispatch('qrCodeGeneratedForConnect', data)
  }

  /**
   * Dispatch event when QR code is generated for signing a transaction.
   * @param data QR code data
   */
  dispatchQrCodeGeneratedForSign(data) {
    this.dispatch('qrCodeGeneratedForSign', data)
  }

  /**
   * Dispatch event when QR code generation for signing a transaction fails.
   * @param data Error information
   */
  dispatchQrCodeGenerationFailedForSign(data) {
    this.dispatch('qrCodeGenerationFailedForSign', data)
  }

  /**
   * Dispatches event after the QR code for signing a transaction is scanned
   * and we're waiting for the user to approve or reject it.
   */
  dispatchQrTxScannedAwaitingApproval(data) {
    this.dispatch('qrTxScannedAwaitingUserApproval', data)
  }
}

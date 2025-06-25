import { ChainType } from '@0xsquid/squid-types'
import { ChainNotConfiguredError } from '@wagmi/core'
import getProperty from 'lodash/get'
import { isAddress, SwitchChainError } from 'viem'
import { chainTypeToDefaultChainIdMap } from '../../core/constants'
import { walletStoreLinks } from '../../core/wallets'
import { WidgetEvents } from '../../services/internal/eventService'
import { isBitcoinAddressValid } from './bitcoinService'
import { connectCosmosWallet, isCosmosAddressValid } from './cosmosService'
import { isSolanaAddressValid } from './solanaService'
import { isSuiAddressValid } from './suiService'
import { isXrplAddressValid } from './xrplService'

const chainTypeToTrimLength = {
  // 0x1234...5678
  [ChainType.EVM]: {
    start: 6,
    end: 4
  },
  // osmo1234...5678
  [ChainType.COSMOS]: {
    start: 8,
    end: 4
  },
  // 1A1zP1eP...vfNa
  [ChainType.BTC]: {
    start: 8,
    end: 4
  },
  // 6fq5...AmcC
  [ChainType.SOLANA]: {
    start: 4,
    end: 4
  },
  // 0x1234...5678
  [ChainType.SUI]: {
    start: 6,
    end: 4
  },
  // r9uP...s6mN
  [ChainType.XRPL]: {
    start: 4,
    end: 4
  }
}

export const formatHash = ({ chainType, hash }) => {
  if (!hash) return ''

  let chainTypeFormat = chainType
  if (!chainType) {
    if (hash?.startsWith('0x')) {
      chainTypeFormat = ChainType.EVM
    } else {
      chainTypeFormat = ChainType.COSMOS
    }
  }

  const trimLengthStart = chainTypeToTrimLength[chainTypeFormat].start
  const trimLengthEnd = chainTypeToTrimLength[chainTypeFormat].end
  // return the same hash if its length is less than the trim length
  if (hash.length <= trimLengthStart + trimLengthEnd) return hash

  return hash.slice(0, trimLengthStart) + '...' + hash.slice(hash.length - trimLengthEnd, hash.length)
}

export const isWalletAddressValid = (chainData, address) => {
  if (!address || !chainData?.chainType) return false
  switch (chainData.chainType) {
    case ChainType.EVM:
      return isAddress(address)
    case ChainType.COSMOS:
      return isCosmosAddressValid(chainData.bech32Config.bech32PrefixAccAddr, address)
    case ChainType.BTC:
      return isBitcoinAddressValid(address)
    case ChainType.SOLANA:
      return isSolanaAddressValid(address)
    case ChainType.SUI:
      return isSuiAddressValid(address)
    case ChainType.XRPL:
      return isXrplAddressValid(address)
  }
}

export const redirectToExtensionsStore = wallet => {
  const { userAgent } = navigator
  let link
  if (userAgent.indexOf('Firefox') > -1) {
    link = walletStoreLinks[wallet.connectorId]?.firefox
  } else if (userAgent.indexOf('Chrome') > -1) {
    link = walletStoreLinks[wallet.connectorId]?.chrome
  }

  if (link && link !== '') {
    window?.open(link, '_blank')?.focus()
  }
}

/**
 * Dynamically accesses a nested property of an object based on a dot-separated string path.
 * Returns the value of the property if found, otherwise undefined.
 * e.g. "xfi.keplr" will return window.xfi.keplr
 */
export const accessProperty = (object, path) => {
  const value = getProperty(object, path)
  if (value === undefined) {
    console.error(`Property "${path}" not found while reading object`, object)
  }

  return value
}

const definedInWindow = (path, clientWindow) => {
  if (!path || !clientWindow) return false
  const parts = path.split('.')
  let obj = clientWindow
  for (const part of parts) {
    if (obj && typeof obj === 'object' && part in obj) {
      obj = obj[part]
    } else {
      return false
    }
  }

  return Boolean(obj)
}

export const populateWallets = (window, wallets) => {
  return wallets.map(wallet => {
    if (!wallet.isInstalled) {
      return {
        ...wallet,
        isInstalled() {
          return definedInWindow(wallet.windowFlag, window)
        }
      }
    }

    return wallet
  })
}

/**
 * Get the base chain to connect to
 * If only one chain type is selected, use that chain type
 * Otherwise, use the wallet's type
 * This is mainly used for Cosmos wallets, they need a reference chain to connect to (because addresses are different on each chain)
 * @param wallet
 * @param chain
 * @param selectedChainTypes
 * @param findChain
 * @returns
 */
export const getDefaultChain = (wallet, chain, selectedChainTypes, findChain) => {
  // If a chain is provided, use that chain
  if (chain) return chain
  let walletType = wallet.isMultiChain ? undefined : wallet.type
  // If only one chain type is selected, use that chain type
  if (selectedChainTypes?.length === 1) {
    const chainType = selectedChainTypes[0]
    walletType = chainType
  }
  if (!walletType) return undefined

  return findChain(chainTypeToDefaultChainIdMap[walletType])
}

/**
 * Sort order:
 * 1. Connected wallets
 * 2. Installed wallets
 * 3. Priority wallets
 * 4. The rest
 *
 * On mobile, Injected and WalletConnect are always on top,
 * after installed wallets.
 *
 * @returns The sorted wallets
 */
export function sortWallets(a, b, { isMobile, connectedWallets, priorityList = [] }) {
  // Sort connected wallets first
  const aIsConnected = connectedWallets?.some(w => w.connectorId === a.connectorId)
  const bIsConnected = connectedWallets?.some(w => w.connectorId === b.connectorId)
  if (aIsConnected && !bIsConnected) return -1

  if (!aIsConnected && bIsConnected) return 1

  // Then sort installed wallets
  const aIsInstalled = a.isInstalled?.()
  const bIsInstalled = b.isInstalled?.()
  if (aIsInstalled && !bIsInstalled) return -1
  if (!aIsInstalled && bIsInstalled) return 1

  // Sort by priority list
  const aPriorityIndex = priorityList.indexOf(a.connectorId)
  const bPriorityIndex = priorityList.indexOf(b.connectorId)
  if (aPriorityIndex !== -1 || bPriorityIndex !== -1) {
    if (aPriorityIndex === -1) return 1
    if (bPriorityIndex === -1) return -1
    return aPriorityIndex - bPriorityIndex
  }

  // Mobile-specific sorting
  if (isMobile) {
    if (a.connectorId === 'injected' && b.connectorId !== 'injected') return -1
    if (a.connectorId !== 'injected' && b.connectorId === 'injected') return 1
    if (a.connectorId === 'walletConnect' && b.connectorId !== 'walletConnect') return -1
    if (a.connectorId !== 'walletConnect' && b.connectorId === 'walletConnect') return 1
  }

  return 0
}

export function areSameAddress(address1, address2) {
  if (!address1 || !address2) return false

  return address1.trim().toLowerCase() === address2.trim().toLowerCase()
}

export function sortAddressBook(a, b, selectedAddress) {
  if (!selectedAddress) return 0
  if (areSameAddress(a.address, selectedAddress)) {
    return -1
  }
  if (areSameAddress(b.address, selectedAddress)) {
    return 1
  }

  return 0
}

export const calculateTotalUsdBalanceUSD = tokens => {
  const totalUsd = tokens.reduce((total, token) => {
    const balance = parseFloat(token.balance)
    const usdPrice = token.usdPrice ?? 0
    const balanceUsd = balance * usdPrice
    return total + balanceUsd
  }, 0)
  // Convert to string with high precision
  const preciseTotal = totalUsd.toFixed(18)
  // Remove trailing zeros and decimal point if necessary
  const trimmedTotal = preciseTotal.replace(/\.?0+$/, '')

  return trimmedTotal
}

export function addTokenToWallet({ token: { address, decimals, symbol, logoURI }, provider }) {
  if (!address || !symbol || !decimals || !logoURI) return

  try {
    return provider.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address,
          symbol,
          decimals,
          image: logoURI
        }
      }
    })
  } catch (error) {
    console.debug('Error adding token to wallet:', error)
  }
}

export function isEvmChainNotSupportedError(error) {
  return error instanceof ChainNotConfiguredError || error instanceof SwitchChainError
}

export const getWalletSupportedChainTypes = wallet => {
  if (!wallet.isMultiChain) return []

  return wallet.supportedNetworks.map(config => config.chainType)
}

export const getConnectorForChainType = (wallet, chainType) => {
  // For multi-chain wallets
  if (wallet.isMultiChain) {
    const networkConfig = wallet.supportedNetworks.find(config => config.chainType === chainType)
    return networkConfig?.connector
  }
  // For single-chain wallets, return the wallet's connector if chain type matches
  if (wallet.type === chainType) {
    return wallet.connector
  }

  return undefined
}

export function walletSupportsChainType(wallet, chainType) {
  if (wallet.isMultiChain) {
    return wallet.supportedNetworks.some(network => network.chainType === chainType)
  }

  return wallet.type === chainType
}

const connectByChainType = async (chainType, wallet, defaultChain, params) => {
  if (!chainType) {
    throw new Error(`Unsupported wallet type: ${chainType}`)
  }
  // Get connector for chain type if it's a multi-chain wallet
  const connector = getConnectorForChainType(wallet, chainType)
  switch (chainType) {
    case ChainType.EVM:
      return params.connectEvm.mutateAsync({
        wallet: {
          ...wallet,
          connector
        }
      })
    case ChainType.COSMOS:
      return connectCosmosWallet({ ...wallet, connector }, defaultChain, {
        connectCosmos: params.connectCosmos,
        cosmosConnectedWallet: params.cosmosConnectedWallet
      })
    case ChainType.SOLANA:
      return params.connectSolana.mutateAsync({
        wallet: {
          ...wallet,
          connector
        }
      })
    case ChainType.BTC:
      return params.connectBitcoin.mutateAsync({
        wallet: {
          ...wallet,
          connector
        }
      })
    case ChainType.XRPL:
      return params.connectXrpl.mutateAsync({
        wallet: {
          ...wallet,
          connector
        }
      })
    case ChainType.SUI:
      return params.connectSui.mutateAsync({
        wallet: {
          ...wallet,
          connector
        }
      })
  }
}

const getChainTypesToConnect = (selectedChainTypes, defaultChain, supportedChains) => {
  if (selectedChainTypes?.length) {
    return selectedChainTypes
  }
  if (defaultChain) {
    return [defaultChain.chainType]
  }
  return supportedChains.map(chain => chain.chainType)
}

const connectMultiChainWallet = async params => {
  if (!params.wallet.isMultiChain) {
    return null
  }
  const results = []
  // This should be defined, but in some cases (like widget connection) it's not
  const supportedChains = params.wallet.supportedNetworks
  // Depending on params, we need to connect to specific chains or just one
  const chainTypesToConnect = getChainTypesToConnect(params.selectedChainTypes, params.selectedChain, supportedChains)
  // Connect to each chain type
  for (const chainConfig of supportedChains) {
    if (!chainTypesToConnect.includes(chainConfig.chainType)) {
      continue
    }
    const defaultChain = getDefaultChain(params.wallet, params.selectedChain, [chainConfig.chainType], params.findChain)
    try {
      const result = await connectByChainType(chainConfig.chainType, params.wallet, defaultChain, {
        connectEvm: params.connectEvm,
        connectCosmos: params.connectCosmos,
        cosmosConnectedWallet: params.cosmosConnectedWallet,
        connectSolana: params.connectSolana,
        connectBitcoin: params.connectBitcoin,
        connectSui: params.connectSui,
        connectXrpl: params.connectXrpl
      })
      if (result) {
        results.push({
          chainType: chainConfig.chainType,
          data: result
        })
      }
    } catch (error) {
      console.error(`Failed to connect ${chainConfig.chainType}:`, error)
    }
  }

  return results.length > 0
    ? {
        wallet: params.wallet,
        addresses: results
      }
    : null
}

const connectSingleChainWallet = async params => {
  if (params.wallet.isMultiChain) {
    return null
  }

  const defaultChain = params.selectedChain
  const result = await connectByChainType(params.wallet.type, params.wallet, defaultChain, {
    connectEvm: params.connectEvm,
    connectCosmos: params.connectCosmos,
    cosmosConnectedWallet: params.cosmosConnectedWallet,
    connectSolana: params.connectSolana,
    connectBitcoin: params.connectBitcoin,
    connectSui: params.connectSui,
    connectXrpl: params.connectXrpl
  })

  return result
    ? {
        wallet: params.wallet,
        addresses: [
          {
            chainType: params.wallet.type,
            data: result
          }
        ]
      }
    : null
}

export const connectWallet = async params => {
  try {
    const result = params.wallet.isMultiChain
      ? await connectMultiChainWallet(params)
      : await connectSingleChainWallet(params)
    if (result) {
      // Dispatch wallet connect event for each connected address
      result.addresses.forEach(({ chainType, data }) => {
        WidgetEvents.getInstance().dispatchWalletConnect({
          walletAddress: data.address,
          chainType: chainType,
          provider: params.wallet.connectorId
        })
      })
    }
    return result
  } catch (error) {
    // Dispatch wallet reject event
    if (params.selectedChain) {
      WidgetEvents.getInstance().dispatchWalletReject({
        chainId: params.selectedChain.chainId,
        provider: params.wallet.name,
        reason: error instanceof Error ? error.message : 'Unknown error'
      })
    }
    throw error
  }
}

/**
 * Wallets may have a cancelConnect method
 * This is used to cancel a pending connection and clean up resources
 * (e.g. network requests, event listeners, etc.)
 */
export const cancelConnectWallet = wallet => {
  // TODO: implement cancel connect for multi-chain wallets
  if (wallet.isMultiChain) {
    return
  }
  switch (wallet.type) {
    case ChainType.XRPL:
      return wallet.connector.cancelConnect?.()
    default:
      return
  }
}

// Issues with Rabby wallet on some chains
// we need to wait some time before getting transaction receipt
// https://github.com/ethers-io/ethers.js/issues/4760
export const isProblematicConnector = connector => {
  return (
    connector?.id != null &&
    // TODO: inconsistent connector ID behavior, investigate and debug Wagmi
    ['rabby', 'io.rabby'].includes(connector.id)
  )
}

export function mergeWallets({ multiChainWallets, singleChainWallets }) {
  const mergedWallets = [...multiChainWallets, ...singleChainWallets]
  // if mergedWallets includes single-chain wallets with duplicate connector IDs
  // create a new multi-chain wallet with the same connector ID and add all supported networks
  const unifiedWallets = mergedWallets.reduce((acc, wallet) => {
    const existingWallet = acc.find(w => w.connectorId === wallet.connectorId)
    if (existingWallet && !wallet.isMultiChain) {
      if (existingWallet.isMultiChain) {
        // if existing wallet is already a multi-chain wallet
        // we just need to add the new supported network
        if (existingWallet.supportedNetworks.every(network => network.chainType !== wallet.type)) {
          // remove the existing wallet from the array
          acc.splice(acc.indexOf(existingWallet), 1)
          // add the new wallet with all supported networks
          acc.push({
            isMultiChain: true,
            supportedNetworks: [
              ...existingWallet.supportedNetworks,
              {
                chainType: wallet.type,
                connector: wallet.connector
              }
            ],
            // add common properties
            connectorId: existingWallet.connectorId,
            name: existingWallet.name,
            icon: existingWallet.icon,
            windowFlag: existingWallet.windowFlag,
            connectorName: existingWallet.connectorName,
            isInstalled: existingWallet.isInstalled,
            skipInstallCheck: existingWallet.skipInstallCheck,
            isMobile: existingWallet.isMobile,
            rdns: existingWallet.rdns
          })
        }
      } else {
        // otherwise, if existing wallet is a single-chain wallet
        // we need to create a new multi-chain wallet with the same connector ID
        // remove the existing wallet from the array
        acc.splice(acc.indexOf(existingWallet), 1)
        // add the new wallet with all supported networks
        if (existingWallet.type !== wallet.type) {
          acc.push({
            isMultiChain: true,
            supportedNetworks: [
              {
                chainType: existingWallet.type,
                connector: existingWallet.connector
              },
              {
                chainType: wallet.type,
                connector: wallet.connector
              }
            ],
            // add common properties
            connectorId: existingWallet.connectorId,
            name: existingWallet.name,
            icon: existingWallet.icon,
            windowFlag: existingWallet.windowFlag,
            connectorName: existingWallet.connectorName,
            isInstalled: existingWallet.isInstalled,
            skipInstallCheck: existingWallet.skipInstallCheck,
            isMobile: existingWallet.isMobile,
            rdns: existingWallet.rdns
          })
        }
      }
    } else {
      acc.push(wallet)
    }

    return acc
  }, [])

  return unifiedWallets
}

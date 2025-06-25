import { ChainType } from '@0xsquid/squid-types'
import { isAddress as isEvmAddress } from 'viem'
import { standardWalletOverrides } from './walletStandardService'

export const EvmNetworkNotSupportedErrorCode = 4902

export async function addEthereumChain({ chain, provider }) {
  const chainName = chain.rpc.includes('tenderly') ? `${chain.networkName} Tenderly fork` : chain.networkName
  const chainParameters = {
    chainId: `0x${parseInt(chain.chainId, 10).toString(16)}`,
    chainName,
    nativeCurrency: chain.nativeCurrency,
    rpcUrls: [chain.rpc],
    blockExplorerUrls: chain.blockExplorerUrls,
    iconUrls: [chain.chainIconURI]
  }
  try {
    return provider.request({
      method: 'wallet_addEthereumChain',
      params: [chainParameters]
    })
  } catch (error) {
    console.debug('Error adding chain:', error)
  }
}

export const parseEvmAddress = address => {
  if (address && isEvmAddress(address)) {
    return address
  }
}

/**
 * Formats a Wagmi connector into a Squid Wallet
 */
export function formatEvmWallet(connector) {
  const { icon, name: defaultName, id: wagmiConnectorId } = connector
  const walletOverrides = standardWalletOverrides[wagmiConnectorId]
  const walletIcon = walletOverrides?.icon || icon
  const name = walletOverrides?.name || defaultName
  const connectorId = walletOverrides?.connectorId || wagmiConnectorId
  const isNonInstallableWallet = ['injected', 'walletConnect', 'metaMaskSDK', 'coinbaseWalletSDK'].includes(
    wagmiConnectorId
  )
  return {
    connectorId,
    name,
    connectorName: name,
    type: ChainType.EVM,
    icon: walletIcon,
    rdns: wagmiConnectorId,
    windowFlag: name,
    // For non-installable wallets, we don't want to show the "Installed" label
    // but still want to allow the user to connect
    skipInstallCheck: isNonInstallableWallet,
    isInstalled: isNonInstallableWallet ? undefined : () => true,
    connector,
    isMobile: true
  }
}

export function filterWagmiConnector(connector) {
  // Safe is auto-connected when available, should not be listed as an available wallet
  return connector.id !== 'safe'
}

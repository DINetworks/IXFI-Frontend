import { ChainType } from '@0xsquid/squid-types'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { UserRejectedRequestError } from 'viem'
import { useAccount, useSwitchChain } from 'wagmi'
import { addEthereumChain } from '../../services/internal/evmService'
import { formatHash, isEvmChainNotSupportedError } from '../../services/internal/walletService'
import { useSquidChains } from '../chains/useSquidChains'
import { useCosmosForChain } from '../cosmos/useCosmosForChain'
import { useEnsDataForAddress } from './useEns'
import { useGnosisContext } from './useGnosisContext'
import { useWallet } from './useWallet'

export const useMultiChainWallet = chain => {
  const { connectedAddresses, connectedWalletsByChainType } = useWallet()
  const { chain: currentEvmChain, connector: evmConnector } = useAccount()
  const { chains } = useSquidChains()
  const { isGnosisConnected } = useGnosisContext()
  const { switchChainAsync } = useSwitchChain()
  const evmAddress = connectedAddresses[ChainType.EVM]
  const bitcoinAddress = connectedAddresses[ChainType.BTC]
  const solanaAddress = connectedAddresses[ChainType.SOLANA]
  const suiAddress = connectedAddresses[ChainType.SUI]
  const xrplAddress = connectedAddresses[ChainType.XRPL]

  // Cosmos is a special case because the address changes on every chain
  // so we can't use the default cosmos connected address
  const { data: cosmosAddress } = useCosmosForChain(chain)
  const evmEnsData = useEnsDataForAddress({
    address: evmAddress,
    options: {
      enabled: chain?.chainType === ChainType.EVM
    }
  })

  /**
   * Get connected address, depends on chainType
   */
  const connectedAddress = useMemo(() => {
    if (!chain?.chainType) return {}
    switch (chain.chainType) {
      case ChainType.EVM:
        if (!evmAddress) return {}

        return {
          address: evmAddress,
          formatted: formatHash({
            hash: evmAddress,
            chainType: chain.chainType
          }),
          ens: evmEnsData.data
        }
      case ChainType.COSMOS:
        if (!cosmosAddress) return {}

        return {
          address: cosmosAddress,
          formatted: formatHash({
            hash: cosmosAddress,
            chainType: chain.chainType
          })
        }
      case ChainType.BTC:
        if (!bitcoinAddress) return {}

        return {
          address: bitcoinAddress,
          formatted: formatHash({
            hash: bitcoinAddress,
            chainType: chain.chainType
          })
        }
      case ChainType.SOLANA:
        if (!solanaAddress) return {}

        return {
          address: solanaAddress,
          formatted: formatHash({
            hash: solanaAddress,
            chainType: chain.chainType
          })
        }
      case ChainType.XRPL:
        if (!xrplAddress) return {}

        return {
          address: xrplAddress,
          formatted: formatHash({
            hash: xrplAddress,
            chainType: chain.chainType
          })
        }
      case ChainType.SUI:
        if (!suiAddress) return {}

        return {
          address: suiAddress,
          formatted: formatHash({
            hash: suiAddress,
            chainType: chain.chainType
          })
        }
    }
  }, [
    chain?.chainType,
    evmAddress,
    evmEnsData.data,
    cosmosAddress,
    bitcoinAddress,
    solanaAddress,
    suiAddress,
    xrplAddress
  ])

  /**
   * Change current network for desired chain
   */
  const changeNetworkIfNeeded = useMutation({
    mutationFn: async () => {
      const isNotOnDesiredChain = chain?.chainType === ChainType.EVM && currentEvmChain?.id !== Number(chain.chainId)
      if (isNotOnDesiredChain) {
        await switchChainAsync({
          chainId: Number(chain.chainId)
        })
      }
      // Implement keplr change network
      // Looks like there are no method to do that at the moment
      return false
    },
    onError: async error => {
      if (error instanceof UserRejectedRequestError) {
        return
      }

      if (isEvmChainNotSupportedError(error) && chain && evmConnector) {
        const provider = await evmConnector.getProvider()
        addEthereumChain({
          chain: chain,
          provider
        })
      }
    }
  })

  const isChainTypeConnected = useCallback(
    chainType => {
      if (isGnosisConnected && chainType === ChainType.EVM) {
        return true
      }
      const connectedWallet = connectedWalletsByChainType[chainType]

      return !!connectedWallet?.wallet && !!connectedWallet?.address
    },
    [connectedWalletsByChainType, isGnosisConnected]
  )

  /**
   * Handle multiple chains
   */
  const networkConnected = useMemo(() => {
    if (!chain?.chainType) return false

    return isChainTypeConnected(chain.chainType)
  }, [chain?.chainType, isChainTypeConnected])

  const connectedEvmChain = useMemo(() => {
    if (!currentEvmChain) return undefined
    const squidChain = chains.find(c => c.chainId === currentEvmChain.id.toString())

    return squidChain
  }, [currentEvmChain, chains])

  /**
   * Checks if Network is connected and with the right chain
   */
  const networkConnectedOnRightChain = useMemo(() => {
    if (chain?.chainType === ChainType.EVM) {
      // tenderly validation based on rpc
      if (
        currentEvmChain?.rpcUrls?.default?.http?.length &&
        currentEvmChain?.rpcUrls?.default?.http[0].includes('tenderly')
      ) {
        return (
          isChainTypeConnected(ChainType.EVM) &&
          currentEvmChain?.rpcUrls?.default?.http[0].toLowerCase() === chain.rpc.toLowerCase()
        )
      }

      return isChainTypeConnected(ChainType.EVM) && currentEvmChain?.id.toString() === chain.chainId
    }

    return true
  }, [isChainTypeConnected, currentEvmChain, chain])

  const checkNetworkAndSwitch = useCallback(async () => {
    if (!networkConnectedOnRightChain) {
      try {
        await changeNetworkIfNeeded.mutateAsync()
        // Metamask is not popping the second modal if we don't wait a bit
        // TODO: This is something that might be fixed by wagmiv2
        await new Promise(resolve => {
          setTimeout(resolve, 100)
        })

        return true
      } catch (error) {
        return false
      }
    }
    return true
  }, [networkConnectedOnRightChain, changeNetworkIfNeeded])

  const wallet = chain ? connectedWalletsByChainType[chain.chainType].wallet : undefined

  return {
    changeNetworkIfNeeded,
    networkConnected,
    networkConnectedOnRightChain,
    connectedAddress,
    connectedEvmChain,
    evmAddress,
    isChainTypeConnected,
    checkNetworkAndSwitch,
    wallet
  }
}

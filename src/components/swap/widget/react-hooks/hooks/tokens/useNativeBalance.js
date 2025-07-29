import { ChainType } from '@0xsquid/squid-types'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useBalance as useWagmiBalance } from 'wagmi'
import { useCosmosContext } from '../../core'
import { keys } from '../../core/queries/queries-keys'
import { formatBNToReadable, isWalletAddressValid, parseToBigInt } from '../../services'
import { getBitcoinNativeBalance, getSolanaNativeBalance } from '../../services/external/rpcService'
import { useCosmosForChain } from '../cosmos/useCosmosForChain'
import { useWallet } from '../wallet/useWallet'
import { useCosmosBalance, useSuiBalance, useXrplBalance } from './useBalance'
import { useNativeTokenForChain } from './useNativeTokenForChain'

const useEvmNativeBalance = ({ address, chain }) => {
  const { isChainTypeConnected } = useWallet()
  const { data: nativeEvmBalance, isLoading } = useWagmiBalance({
    address: address,
    chainId: Number(chain?.chainId),
    query: {
      enabled: isChainTypeConnected(ChainType.EVM) && !!address,
      refetchInterval: 10000,
      staleTime: 5000,
      refetchOnWindowFocus: true,
      refetchOnMount: true
    }
  })

  const balance = useMemo(() => {
    if (nativeEvmBalance?.decimals && nativeEvmBalance?.value) {
      return {
        decimals: nativeEvmBalance.decimals,
        value: nativeEvmBalance.value
      }
    }
    return
  }, [nativeEvmBalance?.decimals, nativeEvmBalance?.value])

  return {
    balance,
    isLoading
  }
}

const useCosmosNativeBalance = ({ address, chain }) => {
  const { isConnected: isCosmosConnected } = useCosmosContext()
  const { nativeToken: nativeCosmosToken } = useNativeTokenForChain(chain)
  const { balance: rawBalance, isLoading } = useCosmosBalance({
    chain,
    token: nativeCosmosToken,
    userAddress: address,
    enabled: isCosmosConnected && chain?.chainType === ChainType.COSMOS,
    refreshIntervalMs: 10000
  })

  const balance = useMemo(() => {
    if (nativeCosmosToken?.decimals && rawBalance) {
      return {
        decimals: nativeCosmosToken.decimals,
        value: parseToBigInt(rawBalance, nativeCosmosToken.decimals)
      }
    }
  }, [nativeCosmosToken?.decimals, rawBalance])

  return { balance, isLoading }
}

export const useBitcoinNativeBalance = ({ chain, address }) => {
  const { nativeToken } = useNativeTokenForChain(chain)
  const { data: rawBalance = '0', isLoading } = useQuery({
    queryKey: keys().balance(chain?.chainId, nativeToken?.address, address),
    queryFn: async () => {
      if (!address || !nativeToken) return '0'
      const balance = await getBitcoinNativeBalance(address)

      return formatBNToReadable(balance, nativeToken.decimals)
    },
    enabled:
      chain?.chainType === ChainType.BTC && nativeToken?.decimals != null && isWalletAddressValid(chain, address),
    refetchInterval: 40000,
    staleTime: 20000,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  })

  const balance = useMemo(() => {
    if (nativeToken?.decimals && rawBalance) {
      return {
        decimals: nativeToken.decimals,
        value: parseToBigInt(rawBalance, nativeToken.decimals)
      }
    }
  }, [nativeToken?.decimals, rawBalance])

  return {
    balance,
    isLoading
  }
}

export const useSolanaNativeBalance = ({ chain, address }) => {
  const { nativeToken } = useNativeTokenForChain(chain)
  const { data: rawBalance, isLoading } = useQuery({
    queryKey: keys().balance(chain?.chainId, nativeToken?.address, address),
    queryFn: async () => {
      const balance = await getSolanaNativeBalance(address)

      return formatBNToReadable(balance, nativeToken.decimals)
    },
    enabled: !!address && nativeToken?.decimals != null && chain?.chainType === ChainType.SOLANA,
    refetchInterval: 40000,
    staleTime: 20000,
    refetchOnWindowFocus: true,
    refetchOnMount: true
  })

  const balance = useMemo(() => {
    if (nativeToken?.decimals && rawBalance) {
      return {
        decimals: nativeToken.decimals,
        value: parseToBigInt(rawBalance, nativeToken.decimals)
      }
    }
  }, [nativeToken?.decimals, rawBalance])

  return {
    balance,
    isLoading
  }
}

export const useSuiNativeBalance = ({ address, chain }) => {
  const { nativeToken } = useNativeTokenForChain(chain)
  const { balance: rawBalance, isLoading } = useSuiBalance({
    chain,
    token: nativeToken,
    userAddress: address
  })

  const balance = useMemo(() => {
    if (nativeToken?.decimals && rawBalance) {
      return {
        decimals: nativeToken.decimals,
        value: parseToBigInt(rawBalance, nativeToken.decimals)
      }
    }
  }, [nativeToken?.decimals, rawBalance])

  return {
    balance,
    isLoading
  }
}

export const useXrplNativeBalance = ({ address, chain }) => {
  const { nativeToken } = useNativeTokenForChain(chain)
  const { balance: rawBalance, isLoading } = useXrplBalance({
    chain,
    token: nativeToken,
    userAddress: address,
    enabled: chain?.chainType === ChainType.XRPL
  })

  const balance = useMemo(() => {
    if (nativeToken?.decimals && rawBalance) {
      return {
        decimals: nativeToken.decimals,
        value: parseToBigInt(rawBalance, nativeToken.decimals)
      }
    }
  }, [nativeToken?.decimals, rawBalance])

  return {
    balance,
    isLoading
  }
}

export const useNativeBalance = chain => {
  const { connectedAddresses } = useWallet()
  const { data: cosmosAddressForChain } = useCosmosForChain(chain)
  // Cosmos is a special case because the address changes on every chain
  // so we can't use the default cosmos connected address
  const { balance: nativeCosmosBalance, isLoading: isCosmosLoading } = useCosmosNativeBalance({
    address: cosmosAddressForChain,
    chain
  })

  const { balance: nativeEvmBalance, isLoading: isEvmLoading } = useEvmNativeBalance({
    address: connectedAddresses[ChainType.EVM],
    chain
  })
  const { balance: nativeBitcoinBalance, isLoading: isBitcoinLoading } = useBitcoinNativeBalance({
    address: connectedAddresses[ChainType.BTC],
    chain
  })

  const { balance: nativeSolanaBalance, isLoading: isSolanaLoading } = useSolanaNativeBalance({
    address: connectedAddresses[ChainType.SOLANA],
    chain
  })

  const { balance: nativeSuiBalance, isLoading: isSuiLoading } = useSuiNativeBalance({
    address: connectedAddresses[ChainType.SUI],
    chain
  })

  const { balance: nativeXrplBalance, isLoading: isXrpLoading } = useXrplNativeBalance({
    address: connectedAddresses[ChainType.XRPL],
    chain
  })

  const { nativeBalance, nativeBalanceFormatted } = useMemo(() => {
    let balance
    switch (chain?.chainType) {
      case ChainType.EVM:
        balance = nativeEvmBalance
        break
      case ChainType.COSMOS:
        balance = nativeCosmosBalance
        break
      case ChainType.BTC:
        balance = nativeBitcoinBalance
        break
      case ChainType.SOLANA:
        balance = nativeSolanaBalance
        break
      case ChainType.SUI:
        balance = nativeSuiBalance
        break
      case ChainType.XRPL:
        balance = nativeXrplBalance
        break
    }

    const balanceFormatted = !!balance ? formatBNToReadable(balance.value, balance.decimals) : undefined

    return {
      nativeBalance: balance,
      nativeBalanceFormatted: balanceFormatted
    }
  }, [
    chain?.chainType,
    nativeEvmBalance,
    nativeCosmosBalance,
    nativeBitcoinBalance,
    nativeSolanaBalance,
    nativeSuiBalance,
    nativeXrplBalance
  ])

  const isLoading = useMemo(() => {
    if (!chain?.chainType) return false

    switch (chain.chainType) {
      case ChainType.EVM:
        return isEvmLoading
      case ChainType.COSMOS:
        return isCosmosLoading
      case ChainType.BTC:
        return isBitcoinLoading
      case ChainType.SOLANA:
        return isSolanaLoading
      case ChainType.SUI:
        return isSuiLoading
      case ChainType.XRPL:
        return isXrpLoading
    }
  }, [chain?.chainType, isEvmLoading, isCosmosLoading, isBitcoinLoading, isSolanaLoading, isSuiLoading, isXrpLoading])

  return { nativeBalance, nativeBalanceFormatted, isLoading }
}

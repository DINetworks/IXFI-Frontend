import { ChainType } from '@0xsquid/squid-types'
import { useQuery } from '@tanstack/react-query'
import { useReadContract, useBalance as useWagmiBalance } from 'wagmi'
import { useMemo } from 'react'
import { erc20Abi } from 'viem'
import { useCosmosContext } from '../../core'
import { nativeEvmTokenAddress } from '../../core/constants'
import { keys } from '../../core/queries/queries-keys'
import { formatBNToReadable, isCosmosAddressValid } from '../../services'
import {
  getCosmosTokenBalance,
  getSolanaTokenBalance,
  getSuiTokenBalance,
  getXrplTokenBalance
} from '../../services/external/rpcService'
import { isSuiAddressValid } from '../../services/internal/suiService'
import { isXrplAddressValid } from '../../services/internal/xrplService'
import { useWallet } from '../wallet/useWallet'
import { useBitcoinNativeBalance } from './useNativeBalance'

const DEFAULT_REFRESH_INTERVAL_MS = 15000

export const useEvmBalance = ({
  chain,
  token,
  userAddress,
  enabled = true,
  refreshIntervalMs = DEFAULT_REFRESH_INTERVAL_MS
}) => {
  const { isChainTypeConnected } = useWallet()
  const isNativeToken = token?.address.toLowerCase() === nativeEvmTokenAddress.toLowerCase()
  const userAddressParsed = userAddress

  // Only fetch using useBalance if it's a native token
  const { data: nativeBalance, isLoading: isNativeTokenLoading } = useWagmiBalance({
    address: userAddressParsed,
    chainId: Number(chain?.chainId),
    query: {
      enabled:
        enabled &&
        !!userAddress &&
        isNativeToken &&
        !!chain &&
        chain.chainType === ChainType.EVM &&
        isChainTypeConnected(chain.chainType),
      refetchInterval: refreshIntervalMs,
      retry: 2
    }
  })

  // Only fetch using useReadContract if it's not a native token
  // This is temporary, because of wagmi error: https://github.com/wevm/wagmi/issues/4353
  const { data: erc20Balance, isLoading: isErc20Loading } = useReadContract({
    address: token?.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [userAddressParsed],
    chainId: Number(chain?.chainId),
    query: {
      enabled: isChainTypeConnected(ChainType.EVM) && enabled && !!userAddress && !isNativeToken,
      refetchInterval: refreshIntervalMs,
      retry: 2
    }
  })

  const balance = isNativeToken ? nativeBalance?.value : erc20Balance
  const isLoading = isNativeToken ? isNativeTokenLoading : isErc20Loading
  const formattedBalance =
    balance != null && token?.decimals != null ? formatBNToReadable(balance, token.decimals) : '0'

  return { balance: formattedBalance, isLoading }
}

export const useCosmosBalance = ({
  chain,
  token,
  userAddress,
  enabled = true,
  refreshIntervalMs = DEFAULT_REFRESH_INTERVAL_MS
}) => {
  const { isConnected } = useCosmosContext()
  const { data: balance = '0', isLoading } = useQuery({
    queryKey: keys().balance(chain?.chainId, token?.address, userAddress),
    queryFn: async () => {
      if (!userAddress || !token || chain?.chainType !== ChainType.COSMOS) {
        return '0'
      }
      const isAddressValid = isCosmosAddressValid(chain.bech32Config.bech32PrefixAccAddr, userAddress)
      if (!isAddressValid) return '0'
      const balanceBn = await getCosmosTokenBalance(chain, userAddress, token.address)

      return formatBNToReadable(balanceBn, token.decimals)
    },
    enabled: isConnected && enabled && !!userAddress && !!token && chain?.chainType === ChainType.COSMOS,
    refetchInterval: refreshIntervalMs,
    retry: 2
  })

  return { balance, isLoading }
}

export const useSolanaBalance = ({
  chain,
  token,
  userAddress,
  enabled = true,
  refreshIntervalMs = DEFAULT_REFRESH_INTERVAL_MS
}) => {
  const { data: balance = '0', isLoading } = useQuery({
    queryKey: keys().balance(chain?.chainId, token?.address, userAddress),
    queryFn: async () => {
      if (!userAddress || !token) return '0'
      const balanceBn = await getSolanaTokenBalance(userAddress, token.address)

      return formatBNToReadable(balanceBn, token.decimals)
    },
    enabled: enabled && !!userAddress && !!token && chain?.chainType === ChainType.SOLANA,
    refetchInterval: refreshIntervalMs,
    retry: 2
  })

  return { balance, isLoading }
}

// TODO: implement fetching balances for all bitcoin tokens
export const useBitcoinBalance = ({ userAddress, chain }) => {
  const { balance: balanceBn, isLoading } = useBitcoinNativeBalance({
    address: userAddress,
    chain
  })

  const balance = useMemo(() => {
    if (!balanceBn) return '0'
    return formatBNToReadable(balanceBn?.value, balanceBn?.decimals)
  }, [balanceBn])

  return { balance, isLoading }
}

export const useSuiBalance = ({
  chain,
  token,
  userAddress,
  enabled = true,
  refreshIntervalMs = DEFAULT_REFRESH_INTERVAL_MS
}) => {
  const { data: balance = '0', isLoading } = useQuery({
    queryKey: keys().balance(chain?.chainId, token?.address, userAddress),
    queryFn: async () => {
      if (!userAddress || token?.type !== ChainType.SUI || chain?.chainType !== ChainType.SUI) {
        throw new Error('Invalid SUI balance query parameters')
      }
      const balanceBn = await getSuiTokenBalance(userAddress, token.address, chain.rpc)

      return formatBNToReadable(balanceBn, token.decimals) ?? '0'
    },
    enabled:
      enabled &&
      !!userAddress &&
      !!chain?.rpc &&
      token?.type === ChainType.SUI &&
      chain?.chainType === ChainType.SUI &&
      isSuiAddressValid(userAddress),
    refetchInterval: refreshIntervalMs,
    retry: 2
  })

  return { balance, isLoading }
}

export const useXrplBalance = ({
  userAddress,
  chain,
  enabled,
  token,
  refreshIntervalMs = DEFAULT_REFRESH_INTERVAL_MS
}) => {
  const { data: balance = '0', isLoading } = useQuery({
    queryKey: keys().balance(chain?.chainId, token?.address, userAddress),
    queryFn: async () => {
      if (!userAddress || !token || !chain) return '0'

      const balanceBn = await getXrplTokenBalance(userAddress, token, chain)

      return formatBNToReadable(balanceBn, token.decimals) ?? '0'
    },
    enabled:
      enabled &&
      !!userAddress &&
      !!token &&
      !!chain?.rpc &&
      chain?.chainType === ChainType.XRPL &&
      isXrplAddressValid(userAddress),
    refetchInterval: refreshIntervalMs,
    retry: 2
  })

  return { balance, isLoading }
}

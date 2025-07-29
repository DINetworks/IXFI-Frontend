import { erc20Abi } from 'viem'
import { useReadContract } from 'wagmi'
import { nativeEvmTokenAddress } from '../../core/constants'
import { parseEvmAddress } from '../../services'

export const useErc20Allowance = ({
  tokenAddress,
  ownerAddress,
  spenderAddress,
  amount = BigInt(0),
  chainId,
  enabled = true
}) => {
  const parsedTokenAddress = parseEvmAddress(tokenAddress)
  const parsedOwnerAddress = parseEvmAddress(ownerAddress)
  const parsedSpenderAddress = parseEvmAddress(spenderAddress)
  const isNativeToken = parsedTokenAddress?.toLowerCase() === nativeEvmTokenAddress.toLowerCase()

  const result = useReadContract({
    abi: erc20Abi,
    address: parsedTokenAddress ?? undefined,
    functionName: 'allowance',
    chainId,
    args: parsedOwnerAddress && parsedSpenderAddress ? [parsedOwnerAddress, parsedSpenderAddress] : undefined,
    query: {
      enabled: enabled && Boolean(parsedTokenAddress && parsedOwnerAddress && parsedSpenderAddress && !isNativeToken)
    }
  })
  if (!parsedTokenAddress || !parsedOwnerAddress || !parsedSpenderAddress) {
    return {
      hasAllowance: false,
      error: new Error('Invalid or missing address')
    }
  }
  if (isNativeToken) {
    return { hasAllowance: true, isNativeToken: true }
  }
  const allowanceInWei = result.data ?? BigInt(0)
  const hasAllowance = allowanceInWei >= amount
  return {
    query: result,
    hasAllowance,
    allowanceInWei
  }
}

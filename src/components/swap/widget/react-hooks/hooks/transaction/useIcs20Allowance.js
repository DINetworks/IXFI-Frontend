import { useReadContract } from 'wagmi'
import ics20Abi from '../../core/abis/ics20.json'
import { parseEvmAddress } from '../../services'

/**
 * ICS20 is similar to ERC20 but the ABI is different
 * https://docs.evmos.org/develop/smart-contracts/evm-extensions/ibc-transfer
 * https://github.com/evmos/extensions/blob/main/precompiles/abi/ics20.json
 */
export function useIcs20Allowance({ targetAddress, ownerAddress, amount = BigInt(0), chainId, enabled = true }) {
  const parsedTargetAddress = parseEvmAddress(targetAddress)
  const parsedOwnerAddress = parseEvmAddress(ownerAddress)

  const query = useReadContract({
    abi: ics20Abi,
    address: parsedTargetAddress,
    functionName: 'allowance',
    chainId,
    args:
      parsedOwnerAddress && parsedTargetAddress
        ? [parsedOwnerAddress, parsedOwnerAddress] // ICS20: (grantee, granter)
        : undefined,
    query: {
      enabled: enabled && Boolean(parsedTargetAddress && parsedOwnerAddress)
    }
  })

  if (!parsedTargetAddress || !parsedOwnerAddress) {
    return {
      hasAllowance: false,
      error: new Error('Invalid or missing address')
    }
  }

  // Handle ICS20 format
  let allowanceInWei
  if (query.data) {
    const ics20Data = query.data
    allowanceInWei = ics20Data?.[0]?.spendLimit?.[0]?.amount ?? BigInt(0)
  } else {
    allowanceInWei = BigInt(0)
  }

  const hasAllowance = allowanceInWei >= amount

  return {
    query,
    hasAllowance,
    allowanceInWei
  }
}

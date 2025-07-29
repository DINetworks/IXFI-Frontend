import { ChainType } from '@0xsquid/squid-types'
import { SuiClient } from '@mysten/sui/client'
import { useMemo } from 'react'

export function useSuiClient({ chain }) {
  const client = useMemo(() => {
    if (!chain?.rpc || chain.chainType !== ChainType.SUI) {
      return null
    }

    const suiClient = new SuiClient({
      url: chain.rpc
    })
    return suiClient
  }, [chain?.chainType, chain?.rpc])
  return { client }
}

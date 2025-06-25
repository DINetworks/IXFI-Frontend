import { ChainType } from '@0xsquid/squid-types'
import { useMemo } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { useBitcoinContext } from '../../core/providers/BitcoinProvider'
import { useSolanaContext } from '../../core/providers/SolanaProvider'
import { useSuiContext } from '../../core/providers/SuiProvider'
import { useXrplContext } from '../../core/providers/XrplProvider'
import { clientToSigner } from '../../core/wagmiConfig'
import { useCosmosSigner } from '../cosmos/useCosmos'

function useEvmSigner({ chainId }) {
  const { connector } = useAccount()
  const { data: client } = useWalletClient({ chainId, connector })
  const signer = useMemo(() => (client ? clientToSigner(client) : undefined), [client])

  return { signer }
}

export const useSigner = ({ chain }) => {
  const evmChainId = chain?.chainType === ChainType.EVM ? Number(chain.chainId) : undefined
  // EVM and Cosmos need a different signer for each chain
  // This is not the case for Solana or Bitcoin as there's only one chain in those ecosystems
  const { signer: evmSigner } = useEvmSigner({ chainId: evmChainId })
  const { signer: cosmosSigner } = useCosmosSigner({ chain })
  const { signer: solanaSigner } = useSolanaContext()
  const { signer: bitcoinSigner } = useBitcoinContext()
  const { signer: suiSigner } = useSuiContext()
  const { signer: xrplSigner } = useXrplContext()

  const isEvmSignerReady = !!evmSigner
  const isSolanaSignerReady = !!solanaSigner
  const isCosmosSignerReady = !!cosmosSigner
  const isBitcoinSignerReady = !!bitcoinSigner
  const isSuiSignerReady = !!suiSigner
  const isXrplSignerReady = !!xrplSigner
  const isSignerReady = useMemo(() => {
    if (!chain?.chainType) return false

    switch (chain.chainType) {
      case ChainType.EVM:
        return isEvmSignerReady
      case ChainType.COSMOS:
        return isCosmosSignerReady
      case ChainType.BTC:
        return isBitcoinSignerReady
      case ChainType.SOLANA:
        return isSolanaSignerReady
      case ChainType.SUI:
        return isSuiSignerReady
      case ChainType.XRPL:
        return isXrplSignerReady
    }
  }, [
    chain?.chainType,
    isEvmSignerReady,
    isCosmosSignerReady,
    isBitcoinSignerReady,
    isSolanaSignerReady,
    isSuiSignerReady,
    isXrplSignerReady
  ])

  return {
    isSignerReady,
    evmSigner,
    cosmosSigner,
    bitcoinSigner,
    solanaSigner,
    suiSigner,
    xrplSigner
  }
}

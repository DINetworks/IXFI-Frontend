import { ChainType } from '@0xsquid/squid-types'
import { useMutation } from '@tanstack/react-query'
import { useAccount, useSwitchChain } from 'wagmi'
import { addEthereumChain, addTokenToWallet, isEvmChainNotSupportedError } from '../../services'

export const useAddToken = (chainToCompare, tokenToCompare) => {
  const { chain: currentEvmChain } = useAccount()
  const { connector } = useAccount()
  const { switchChainAsync } = useSwitchChain()

  /**
   * Add token to wallet
   */
  const addToken = useMutation({
    mutationFn: async ({ chain: _chain, token: _token }) => {
      const token = _token ?? tokenToCompare
      const chain = _chain ?? chainToCompare
      if (token && chain?.chainType === ChainType.EVM) {
        const provider = await connector?.getProvider()
        // Switch network if needed
        if (currentEvmChain?.id.toString() !== token?.chainId) {
          try {
            await switchChainAsync({
              chainId: +token.chainId
            })
          } catch (error) {
            console.debug('Error switching network:', error)
            if (isEvmChainNotSupportedError(error)) {
              await addEthereumChain({
                chain,
                provider
              })
              await switchChainAsync({
                chainId: +token.chainId
              })
            }
          }
          // Metamask is not popping the second modal if we don't wait a bit
          // eslint-disable-next-line no-promise-executor-return
          await new Promise(resolve => setTimeout(resolve, 100))
        }
        await addTokenToWallet({ token, provider })
      }
      // TODO: Implement keplr add token
      return false
    }
  })

  return {
    addToken
  }
}

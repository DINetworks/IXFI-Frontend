import { useEarnPoolsStore } from 'src/store/useEarnPoolsStore'

export const useZapHandlers = setTokensForZap => {
  const selectTokensForZap = tokens => {
    const tokensWithAmounts = tokens.map(token => ({
      ...token,
      amount: '0'
    }))

    setTokensForZap(tokensWithAmounts)
  }

  const handleUpdateToken = (idx, token) => {
    const prevTokens = useEarnPoolsStore.getState().liquidityZap.tokensForZap || []

    const newTokens = prevTokens.map((item, index) => (index === idx ? { ...token, amount: 0 } : item))

    setTokensForZap(newTokens)
  }

  const handleUpdateTokenAmount = (idx, amount) => {
    const prevTokens = useEarnPoolsStore.getState().liquidityZap.tokensForZap || []

    const newTokens = prevTokens.map((item, index) => (index === idx ? { ...item, amount } : item))

    setTokensForZap(newTokens)
  }

  const removeTokenForZap = idx => {
    const prevTokens = useEarnPoolsStore.getState().liquidityZap.tokensForZap || []

    const newTokens = prevTokens.filter((_, index) => index !== idx)
    setTokensForZap(newTokens)
  }

  return {
    selectTokensForZap,
    handleUpdateToken,
    handleUpdateTokenAmount,
    removeTokenForZap
  }
}

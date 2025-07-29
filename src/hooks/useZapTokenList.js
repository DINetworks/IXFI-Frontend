import axios from 'axios'
import { useCallback, useMemo, useState } from 'react'
import { useAddLiquidity } from './useAddLiquidity'
import { useQuery } from '@tanstack/react-query'

export const useZapTokenList = () => {
  const { isLoadingInfo, chainId, pool } = useAddLiquidity()

  const [importedTokens, setImportedTokens] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const localStorageTokens = JSON.parse(localStorage.getItem('importedTokens') || '[]')
        return localStorageTokens
      } catch (e) {
        return []
      }
    }
    return []
  })

  const fetchTokenInfo = useCallback(
    async address => {
      try {
        const { data: res } = await axios(
          `${process.env.NEXT_PUBLIC_ZAP_TOKEN}?query=${address}&page=1&pageSize=100&chainIds=${chainId}`
        )

        return res.data.tokens
      } catch (error) {
        return {}
      }
    },
    [chainId]
  )

  const { data: tokens = [], loading } = useQuery({
    queryKey: ['fetchTokensList', chainId],
    queryFn: async () => {
      try {
        const { data: res } = await axios(
          `${process.env.NEXT_PUBLIC_ZAP_TOKEN}?page=1&pageSize=100&isWhitelisted=true&chainIds=${chainId}`
        )

        return res.data.tokens
      } catch (error) {
        console.log(error.message)
        return []
      }
    },
    enabled: !!chainId
  })

  const allTokens = useMemo(() => {
    const mergedTokens = [...tokens, ...importedTokens]
    if (
      !isLoadingInfo &&
      pool?.token0?.address &&
      !mergedTokens.find(t => t.address.toLowerCase() === pool?.token0?.address.toLowerCase())
    )
      mergedTokens.push(pool.token0)
    if (
      !isLoadingInfo &&
      pool?.token1?.address &&
      !mergedTokens.find(t => t.address.toLowerCase() === pool?.token1?.address?.toLowerCase())
    )
      mergedTokens.push(pool.token1)
    return mergedTokens
  }, [tokens, isLoadingInfo, importedTokens, pool])

  const addToken = useCallback(
    token => {
      const newTokens = [...importedTokens.filter(t => t.address !== token.address), token]
      setImportedTokens(newTokens)
      if (typeof window !== 'undefined') localStorage.setItem('importedTokens', JSON.stringify(newTokens))
    },
    [importedTokens]
  )

  const removeToken = useCallback(
    token => {
      const newTokens = importedTokens.filter(t => t.address.toLowerCase() !== token.address.toLowerCase())
      setImportedTokens(newTokens)
      if (typeof window !== 'undefined') localStorage.setItem('importedTokens', JSON.stringify(newTokens))
    },
    [importedTokens]
  )

  const removeAllTokens = useCallback(() => {
    setImportedTokens([])
    if (typeof window !== 'undefined') localStorage.removeItem('importedTokens')
  }, [])

  return {
    tokens,
    loading,
    importedTokens,
    allTokens,
    addToken,
    removeToken,
    removeAllTokens,
    fetchTokenInfo
  }
}

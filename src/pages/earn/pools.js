import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { Box } from '@mui/material'
import TagFilter from 'src/components/earn/TagFilter'
import PoolFilter from 'src/components/earn/PoolFilter'
import PoolsGrid from 'src/components/earn/PoolsTable'
import EarnPageLayout from 'src/components/earn/layout/EarnPageLayout'
import PageHeader from 'src/components/earn/layout/PageHeader'
import LoadingState from 'src/components/earn/states/LoadingState'
import ErrorState from 'src/components/earn/states/ErrorState'
import { useEarnPools } from 'src/hooks/useEarnPools'

const PoolsPage = () => {
  const { tag, chainId, protocol, interval, query, sortBy, orderBy, page, setFilteredPools } = useEarnPools()

  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [error, setError] = useState(null)

  const fetchPoolsByFilter = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = { chainId }

      // Build query parameters conditionally
      if (tag && tag !== '') params.tag = tag
      if (protocol !== 'all') params.protocol = protocol
      if (interval !== '24h') params.interval = interval
      if (query) params.q = query
      if (sortBy) params.sortBy = sortBy
      if (orderBy) params.orderBy = orderBy.toUpperCase()
      if (page && page !== 1) params.page = page

      const { data } = await axios.get(process.env.NEXT_PUBLIC_FILTER_EARL_POOLS, {
        params,
        timeout: 10000 // 10 second timeout
      })

      setFilteredPools(data.data)
      setIsInitialLoad(false)
    } catch (err) {
      console.error('Error fetching pools:', err)
      setError({
        message: err.response?.data?.message || err.message || 'Failed to load pools',
        status: err.response?.status
      })
      setIsInitialLoad(false)
    } finally {
      setIsLoading(false)
    }
  }, [tag, chainId, protocol, interval, query, page, sortBy, orderBy])

  useEffect(() => {
    fetchPoolsByFilter()
  }, [fetchPoolsByFilter])

  const handleRetry = useCallback(() => {
    fetchPoolsByFilter()
  }, [fetchPoolsByFilter])

  if (error) {
    return (
      <EarnPageLayout>
        <PageHeader
          title='Earning with Smart Liquidity Providing'
          subtitle='Zap: Instantly add liquidity to high-APY pools using any token(s) or your existing liquidity position with DI Zap'
          subtitleProps={{ fontStyle: 'italic', mt: 6 }}
        />
        <ErrorState title='Failed to Load Pools' error={error} onRetry={handleRetry} variant='alert' />
      </EarnPageLayout>
    )
  }

  return (
    <EarnPageLayout>
      <PageHeader
        title='Earning with Smart Liquidity Providing'
        subtitle='Zap: Instantly add liquidity to high-APY pools using any token(s) or your existing liquidity position with DI Zap'
        subtitleProps={{ fontStyle: 'italic', mt: 6 }}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TagFilter />
        <PoolFilter />

        {isInitialLoad && isLoading ? (
          <LoadingState message='Loading pools...' variant='skeleton' skeletonCount={10} />
        ) : (
          <Box sx={{ position: 'relative' }}>
            {isLoading && !isInitialLoad && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  backdropFilter: 'blur(4px)',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1
                }}
              >
                <LoadingState message='Updating pools...' variant='spinner' height={60} />
              </Box>
            )}
            <PoolsGrid />
          </Box>
        )}
      </Box>
    </EarnPageLayout>
  )
}

export default PoolsPage

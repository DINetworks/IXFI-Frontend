import React, { useMemo } from 'react'
import { Box } from '@mui/material'
import { Grid3 } from 'src/components/base/grid'
import ExploreEarn from 'src/components/earn/Explore'
import PoolsCard from 'src/components/earn/PoolsCard'
import EarnPageLayout from 'src/components/earn/layout/EarnPageLayout'
import PageHeader from 'src/components/earn/layout/PageHeader'
import { useEarnPools } from 'src/hooks/useEarnPools'

const PoolCategorySection = React.memo(({ pools, isLoading = false }) => {
  const { highAPR, highlightedPools, lowVolatility, solidEarning } = pools || {}

  const poolCategories = useMemo(
    () => [
      {
        icon: { name: 'hugeicons:rocket-01', color: '#00ff90' },
        title: 'High APR',
        pools: highAPR
      },
      {
        icon: { name: 'tabler:rollercoaster', color: '#0090ff' },
        title: 'Low Volatility',
        pools: lowVolatility
      },
      {
        icon: { name: 'tabler:rosette-discount-check', color: '#ccff00' },
        title: 'Solid Earning',
        pools: solidEarning
      }
    ],
    [highAPR, lowVolatility, solidEarning]
  )

  return (
    <Box sx={{ mt: 12 }}>
      <PoolsCard
        main
        icon={{ name: 'hugeicons:fire-02', color: '#ff0090' }}
        title='Highlighted Pools'
        pools={highlightedPools}
        isWide={true}
        isLoading={isLoading}
      />

      <Grid3 sx={{ mt: 8 }}>
        {poolCategories.map(category => (
          <PoolsCard
            key={category.title}
            icon={category.icon}
            title={category.title}
            pools={category.pools}
            isLoading={isLoading}
          />
        ))}
      </Grid3>
    </Box>
  )
})

PoolCategorySection.displayName = 'PoolCategorySection'

const EarnPage = () => {
  const { earnPools, isLoading } = useEarnPools()

  return (
    <EarnPageLayout>
      <PageHeader
        title='Earn from Liquidity Provisioning'
        subtitle='Unlock the full potential of your assets. Offering data, tools, and utilities—centered around Zap technology—to help you maximize earnings from your liquidity across various DeFi protocols.'
      />

      <ExploreEarn />

      <PoolCategorySection pools={earnPools} isLoading={isLoading} />
    </EarnPageLayout>
  )
}

export default EarnPage

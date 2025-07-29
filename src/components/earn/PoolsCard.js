import { Box, Typography, Skeleton } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { FullCenterBox, Grid3 } from 'src/components/base/grid'
import PoolItem from './PoolItem'
import { useAddLiquidity } from 'src/hooks/useAddLiquidity'

const PoolsCard = ({ main, icon, title, pools, isWide, isLoading = false }) => {
  const { handlePoolItemClick } = useAddLiquidity()

  // Skeleton loader for pool items
  const renderSkeletonItems = () => {
    const skeletonCount = 10 // Show more skeletons for wide layout
    return Array.from({ length: skeletonCount }).map((_, index) => (
      <Skeleton
        variant='rounded'
        key={`skeleton-${index}`}
        width={'100%'}
        height={48}
        sx={{ borderRadius: '3rem', backgroundColor: '#0003' }}
      />
    ))
  }

  return (
    <Box className={{ card: true, 'w--current': true, 'is-pro-hover': main }}>
      <Box className='card-content is-small'>
        <FullCenterBox mb={2}>
          <Icon
            icon={icon.name}
            fontSize='2rem'
            color={icon.color}
          />
          <Typography
            variant='h3'
            ml={2}
            color={'#fff'}
          >
            {title}
          </Typography>
        </FullCenterBox>

        {isLoading ? (
          // Render skeleton items while loading
          isWide ? (
            <Grid3 rowGap={16}>{renderSkeletonItems()}</Grid3>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{renderSkeletonItems()}</Box>
          )
        ) : // Render actual pool items when loaded
        isWide ? (
          <Grid3 rowGap={16}>
            {pools &&
              pools.map((pool, index) => (
                <PoolItem
                  key={index}
                  pool={pool}
                  handleClick={handlePoolItemClick}
                />
              ))}
          </Grid3>
        ) : (
          pools &&
          pools.map((pool, index) => (
            <PoolItem
              key={index}
              pool={pool}
              handleClick={handlePoolItemClick}
            />
          ))
        )}
      </Box>
    </Box>
  )
}

export default PoolsCard

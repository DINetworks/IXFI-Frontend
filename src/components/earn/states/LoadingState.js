import React from 'react'
import { Box, CircularProgress, Typography, Skeleton } from '@mui/material'
import PropTypes from 'prop-types'

const LoadingState = ({
  message = 'Loading...',
  variant = 'spinner',
  height = 'auto',
  showMessage = true,
  skeletonCount = 3
}) => {
  if (variant === 'skeleton') {
    return (
      <Box sx={{ width: '100%', height }}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Skeleton
            key={index}
            variant='rectangular'
            height={60}
            sx={{ mb: 2, borderRadius: 1 }}
          />
        ))}
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: height === 'auto' ? 200 : height,
        gap: 2,
        p: 4
      }}
    >
      <CircularProgress size={40} />
      {showMessage && (
        <Typography
          variant='body1'
          color='textSecondary'
          textAlign='center'
        >
          {message}
        </Typography>
      )}
    </Box>
  )
}

LoadingState.propTypes = {
  message: PropTypes.string,
  variant: PropTypes.oneOf(['spinner', 'skeleton']),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showMessage: PropTypes.bool,
  skeletonCount: PropTypes.number
}

export default LoadingState

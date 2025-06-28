import React from 'react'
import { Box, Typography, Button, Alert } from '@mui/material'
import { Icon } from '@iconify/react'
import PropTypes from 'prop-types'

const ErrorState = ({
  title = 'Something went wrong',
  message = 'An error occurred while loading the data.',
  error,
  onRetry,
  onGoBack,
  showRetry = true,
  showGoBack = false,
  variant = 'alert',
  height = 'auto'
}) => {
  const errorMessage = error?.message || message

  if (variant === 'alert') {
    return (
      <Box sx={{ width: '100%', p: 2 }}>
        <Alert
          severity='error'
          sx={{ mb: 2 }}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              {showRetry && onRetry && (
                <Button
                  size='small'
                  onClick={onRetry}
                  variant='outlined'
                  color='error'
                >
                  Retry
                </Button>
              )}
              {showGoBack && onGoBack && (
                <Button
                  size='small'
                  onClick={onGoBack}
                  variant='contained'
                  color='error'
                >
                  Go Back
                </Button>
              )}
            </Box>
          }
        >
          <Typography
            variant='subtitle2'
            sx={{ mb: 1 }}
          >
            {title}
          </Typography>
          <Typography variant='body2'>{errorMessage}</Typography>
        </Alert>
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
        height: height === 'auto' ? 300 : height,
        gap: 3,
        p: 4,
        textAlign: 'center'
      }}
    >
      <Icon
        icon='tabler:alert-circle'
        style={{ fontSize: '4rem', color: '#f44336' }}
      />

      <Box>
        <Typography
          variant='h6'
          sx={{ mb: 1, fontWeight: 'bold' }}
        >
          {title}
        </Typography>
        <Typography
          variant='body1'
          color='textSecondary'
          sx={{ mb: 2 }}
        >
          {errorMessage}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        {showRetry && onRetry && (
          <Button
            onClick={onRetry}
            variant='outlined'
            startIcon={<Icon icon='tabler:refresh' />}
          >
            Try Again
          </Button>
        )}
        {showGoBack && onGoBack && (
          <Button
            onClick={onGoBack}
            variant='contained'
            startIcon={<Icon icon='tabler:arrow-left' />}
          >
            Go Back
          </Button>
        )}
      </Box>
    </Box>
  )
}

ErrorState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  error: PropTypes.object,
  onRetry: PropTypes.func,
  onGoBack: PropTypes.func,
  showRetry: PropTypes.bool,
  showGoBack: PropTypes.bool,
  variant: PropTypes.oneOf(['alert', 'centered']),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default ErrorState

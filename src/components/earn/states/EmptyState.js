import React from 'react'
import { Box, Typography, Button, Fab } from '@mui/material'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import PropTypes from 'prop-types'

const EmptyState = ({
  icon = 'qlementine-icons:empty-slot-16',
  title = 'No data available',
  description,
  actionText,
  actionHref,
  onAction,
  showConnectWallet = false,
  onConnectWallet,
  isClient = true,
  userAddress,
  height = 500
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: height,
        borderRadius: 2,
        gap: 4,
        mt: 4,
        backgroundColor: '#ffffff18',
        boxShadow: '0 1px 3px #0002',
        p: 4,
        textAlign: 'center'
      }}
    >
      <Icon
        icon={icon}
        style={{ fontSize: '5rem', opacity: 0.6 }}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 400
        }}
      >
        <Typography
          variant='h6'
          sx={{ fontWeight: 'medium' }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant='body2'
            color='textSecondary'
          >
            {description}
          </Typography>
        )}

        {actionText && actionHref && (
          <Link href={actionHref}>
            <Typography
              sx={{
                color: 'primary.main',
                textDecoration: 'underline',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'none'
                }
              }}
            >
              {actionText}
            </Typography>
          </Link>
        )}

        {actionText && onAction && !actionHref && (
          <Button
            variant='outlined'
            onClick={onAction}
            sx={{ mt: 2 }}
          >
            {actionText}
          </Button>
        )}
      </Box>

      {showConnectWallet && isClient && !userAddress && onConnectWallet && (
        <Fab
          className='connect-wallet'
          variant='extended'
          color='primary'
          size='large'
          onClick={onConnectWallet}
          sx={{
            textTransform: 'none',
            fontWeight: 'medium'
          }}
        >
          <Icon
            icon='tabler:wallet'
            style={{ marginRight: 8 }}
          />
          Connect Wallet
        </Fab>
      )}
    </Box>
  )
}

EmptyState.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  actionText: PropTypes.string,
  actionHref: PropTypes.string,
  onAction: PropTypes.func,
  showConnectWallet: PropTypes.bool,
  onConnectWallet: PropTypes.func,
  isClient: PropTypes.bool,
  userAddress: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default EmptyState

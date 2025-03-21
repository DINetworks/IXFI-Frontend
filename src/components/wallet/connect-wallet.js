import { useEffect, useState } from 'react'

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { truncateAddress } from 'src/wallet/utils'

// ** MUI Imports
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Menu from '@mui/material/Menu'
import Fab from '@mui/material/Fab'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import WalletOption from './wallet-options'
import Icon from 'src/@core/components/icon'

import CloseButton from 'src/components/wallet/close-connect'
import { useRouter } from 'next/router'

const ConnectWallet = () => {
  const [isClient, setIsClient] = useState(false)

  const [anchorEl, setAnchorEl] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // console.log('chainId', chainId)
  }, [isConnected])

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleConnectDialogOpen = () => setOpenModal(true)
  const handleConnectDialogClose = () => setOpenModal(false)

  const selectWalletOption = connector => {
    handleConnectDialogClose()
    connect({ connector })
  }

  const goDashboard = () => {
    // router.push('/dashboard')
  }

  if (isConnected && isClient) {
    return (
      <div>
        <Button variant='outlined' size='large' aria-controls='simple-menu' aria-haspopup='true' onClick={handleClick}>
          {truncateAddress(address)}
        </Button>
        <Menu keepMounted id='simple-menu' anchorEl={anchorEl} onClose={handleClose} open={Boolean(anchorEl)}>
          <MenuItem onClick={disconnect}>Disconnect</MenuItem>
        </Menu>
      </div>
    )
  }

  return (
    <>
      <Dialog
        className='connect-modal'
        onClose={handleConnectDialogClose}
        aria-labelledby='connect-dialog'
        open={openModal}
        sx={{
          '& .MuiDialog-paper': {
            width: '480px',
            maxWidth: 'none',
            backgroundImage: 'linear-gradient(to bottom, var(--violet-4), var(--violet-14))',
            backgroundColor: 'transparent !important',
            border: '1px solid var(--white-10-101)',
            borderRadius: '20px',
            overflow: 'visible'
          },
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(10, 10, 11, 0.85)' // Change background color
          }
        }}
      >
        <DialogTitle className='text-center' variant='h3' color='primary' id='connect-dialog'>
          Connect Wallet
        </DialogTitle>
        <CloseButton aria-label='close' onClick={handleConnectDialogClose}>
          <Icon icon='tabler:x' color='white' fontSize='1.25rem' />
        </CloseButton>
        <Box sx={{ p: 8 }}>
          {connectors
            .filter(connector => connector.type != 'injected')
            .map(connector => (
              <WalletOption key={connector.uid} connector={connector} onClick={() => selectWalletOption(connector)} />
            ))}
        </Box>
        <div className='dialog-background-blur'></div>
      </Dialog>
      <Fab
        className='connect-wallet'
        variant='extended'
        color='primary'
        size='large'
        onClick={() => handleConnectDialogOpen()}
      >
        Connect Wallet
      </Fab>
    </>
  )
}

export default ConnectWallet

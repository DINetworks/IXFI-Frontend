import { useEffect, useState } from 'react'

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { truncateAddress } from 'src/wallet/utils'

// ** MUI Imports
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Menu from '@mui/material/Menu'
import Fab from '@mui/material/Fab'
import MenuItem from '@mui/material/MenuItem'
import WalletOption from './wallet-option'
import Icon from 'src/@core/components/icon'

import CloseButton from 'src/components/wallet/close-connect'
import { useRouter } from 'next/router'
import { chainLogos } from 'src/configs/constant'

const ConnectWallet = () => {
  const [isClient, setIsClient] = useState(false)

  const [anchorElConnect, setAnchorElConnect] = useState(null)
  const [anchorElChain, setAnchorElChain] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { chains, switchChain } = useSwitchChain()
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    console.log('chainId', chainId)
  }, [isConnected, chainId])

  const handleConnectClick = event => {
    setAnchorElConnect(event.currentTarget)
  }

  const handleCloseConnect = () => {
    setAnchorElConnect(null)
  }

  const handleChainClick = event => {
    setAnchorElChain(event.currentTarget)
  }

  const handleCloseChain = () => {
    setAnchorElChain(null)
  }

  const selectChain = id => {
    switchChain({ chainId: id })
    handleCloseChain()
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

  const chainSelector = () => {
    return (
      <div>
        <Fab variant='extended' size='medium' color='primary' className='selectchain-btn' onClick={handleChainClick}>
          <img src={`/images/icons/chains/${chainLogos[chainId]}.png`} className='chain-icon' alt='' />
        </Fab>
        <Menu
          anchorEl={anchorElChain}
          open={Boolean(anchorElChain)}
          PaperProps={{
            sx: { width: 220, mt: 2 }
          }}
          onClose={handleCloseChain}
        >
          {chains &&
            chains.map((chain, idx) => (
              <MenuItem key={idx} onClick={() => selectChain(chain.id)}>
                <img src={`/images/icons/chains/${chainLogos[chain.id]}.png`} className='chain-icon' alt='' />
                {chain.name}
              </MenuItem>
            ))}
        </Menu>
      </div>
    )
  }

  const connectInfo = () => {
    return (
      <div>
        <Fab variant='extended' size='medium' color='primary' className='connectinfo-btn' onClick={handleConnectClick}>
          <img src='/images/icons/wallet.svg' className='menuitem-image' alt='' /> {truncateAddress(address)}
        </Fab>
        <Menu
          anchorEl={anchorElConnect}
          onClose={handleCloseConnect}
          open={Boolean(anchorElConnect)}
          PaperProps={{
            sx: { width: 160, mt: 2 }
          }}
        >
          <MenuItem onClick={disconnect}>
            <img src='/images/icons/disconnect.svg' className='menuitem-image' alt='' />
            Disconnect
          </MenuItem>
        </Menu>
      </div>
    )
  }

  if (isConnected && isClient) {
    return (
      <Box display='flex' gap={4}>
        {chainSelector()}
        {connectInfo()}
      </Box>
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
            backgroundColor: 'rgba(10, 10, 11, 0.85)'
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

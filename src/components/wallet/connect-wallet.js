import { useEffect, useState } from 'react'

import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'

// ** MUI Imports
import { Box, Fab } from '@mui/material'
import WalletOption from './wallet-option'

import { useRouter } from 'next/router'
import BaseDialog from './base-dialog'
import ChainSelectorDropdown from './chain-selector-dropdown'
import ConnectInfo from './connect-info'

const ConnectWallet = () => {
  const [isClient, setIsClient] = useState(false)

  const [anchorElConnect, setAnchorElConnect] = useState(null)
  const [anchorElChain, setAnchorElChain] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const showDisconnectMenu = event => {
    setAnchorElConnect(event.currentTarget)
  }

  const closeConnectInfo = () => {
    setAnchorElConnect(null)
  }

  const dropDownChains = event => {
    setAnchorElChain(event.currentTarget)
  }

  const closeChainMenu = () => {
    setAnchorElChain(null)
  }

  const selectChain = id => {
    switchChain({ chainId: id })
    closeChainMenu()
  }

  const openDialog = () => setOpenModal(true)
  const closeDialog = () => setOpenModal(false)

  const selectWalletOption = connector => {
    closeDialog()
    connect({ connector })
  }

  const goDashboard = () => {
    // router.push('/dashboard')
  }

  if (isConnected && isClient) {
    return (
      <Box display='flex' gap={4}>
        <ChainSelectorDropdown
          anchorEl={anchorElChain}
          onClose={closeChainMenu}
          onSelect={selectChain}
          openDropdown={dropDownChains}
        />

        <ConnectInfo
          address={address}
          anchorEl={anchorElConnect}
          onClose={closeConnectInfo}
          disconnect={disconnect}
          showDisconnect={showDisconnectMenu}
        />
      </Box>
    )
  }

  return (
    <>
      <BaseDialog openModal={openModal} setOpenModal={closeDialog} width='480px' title='Connect Wallet'>
        <Box sx={{ py: 8 }}>
          {connectors
            .filter(connector => connector.type != 'injected')
            .map(connector => (
              <WalletOption key={connector.uid} connector={connector} onClick={() => selectWalletOption(connector)} />
            ))}
        </Box>
      </BaseDialog>
      <Fab className='connect-wallet' variant='extended' color='primary' size='large' onClick={() => openDialog()}>
        Connect Wallet
      </Fab>
    </>
  )
}

export default ConnectWallet

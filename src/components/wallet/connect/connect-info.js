import { Box, Menu, MenuItem, Fab } from '@mui/material'
import { truncateAddress } from 'src/wallet/utils'

const ConnectInfo = ({ anchorEl, address, onClose, disconnect, showDisconnect }) => {
  return (
    <Box>
      <Fab variant='extended' size='medium' color='primary' className='connectinfo-btn' onClick={showDisconnect}>
        <img src='/images/icons/wallet.svg' className='menuitem-image' alt='' /> {truncateAddress(address)}
      </Fab>
      <Menu
        anchorEl={anchorEl}
        onClose={onClose}
        open={Boolean(anchorEl)}
        PaperProps={{
          sx: { width: 160, mt: 2 }
        }}
      >
        <MenuItem onClick={disconnect}>
          <img src='/images/icons/disconnect.svg' className='menuitem-image' alt='' />
          Disconnect
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default ConnectInfo

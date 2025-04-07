import { useChainId, useSwitchChain } from 'wagmi'
import { Fab, Menu, MenuItem } from '@mui/material'
import { chainLogos } from 'src/configs/constant'

const ChainSelectorDropdown = ({ anchorEl, onSelect, onClose, openDropdown }) => {
  const { chains } = useSwitchChain()
  const chainId = useChainId()

  return (
    <div>
      <Fab variant='extended' size='medium' color='primary' className='selectchain-btn' onClick={openDropdown}>
        <img src={`/images/icons/chains/${chainLogos[chainId]}.png`} className='chain-icon' alt='' />
      </Fab>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        PaperProps={{
          sx: { width: 220, mt: 2 }
        }}
        onClose={onClose}
      >
        {chains &&
          chains.map((chain, idx) => (
            <MenuItem key={idx} onClick={() => onSelect(chain.id)}>
              <img src={`/images/icons/chains/${chainLogos[chain.id]}.png`} className='chain-icon' alt='' />
              {chain.name}
            </MenuItem>
          ))}
      </Menu>
    </div>
  )
}

export default ChainSelectorDropdown

import { useEffect, useState } from 'react'
import { Dialog, DialogTitle, Box, Typography, Grid } from '@mui/material'
import CloseButton from './close-connect'
import Icon from 'src/@core/components/icon'
import { useChainId, useSwitchChain } from 'wagmi'
import { chainLogos, supportedChains } from 'src/configs/constant'

const ChainSelector = ({ openModal, setOpenModal }) => {
  const chainId = useChainId()
  const { chains, switchChain } = useSwitchChain()
  const [selectedChain, setSelectedChain] = useState()

  useEffect(() => {
    setSelectedChain(chainId)
  }, [chainId])

  const chainDialogClose = () => {
    setOpenModal(false)
  }

  const onSelectChain = id => setSelectedChain(id)

  const applySelectedChain = () => {
    switchChain({ chainId: selectedChain })
    setOpenModal(false)
  }

  return (
    <Dialog
      className='connect-modal'
      onClose={chainDialogClose}
      open={openModal}
      sx={{
        '& .MuiDialog-paper': {
          width: '640px',
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
        Switch Chain
      </DialogTitle>
      <CloseButton aria-label='close' onClick={chainDialogClose}>
        <Icon icon='tabler:x' color='white' fontSize='1.25rem' />
      </CloseButton>
      <Box sx={{ px: 12, py: 4 }}>
        <Grid container spacing={2} className='margin-bottom margin-medium'>
          {chains.map(chain => (
            <Grid item key={chain.id} xs={4} md={4}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: selectedChain == chain.id ? 'var(--violet)' : '#00000099',
                  borderRadius: 2,
                  m: 1,
                  cursor: 'pointer',
                  color: 'black',
                  border: '1px solid var(--white-10-101)',
                  p: 4,
                  '&:hover': {
                    background: 'var(--violet)'
                  }
                }}
                onClick={() => onSelectChain(chain.id)}
              >
                <img src={`/images/icons/chains/${chainLogos[chain.id]}.png`} alt='' className='chain-selector-icon' />
                <Typography variant='h4'>{supportedChains[chain.id]}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box>
          <Box
            sx={{
              background: '#00CFE899',
              borderRadius: 2,
              mb: 4,
              mx: 2,
              cursor: 'pointer',
              color: 'black',
              p: 4,
              '&:hover': {
                background: '#00CFE8'
              }
            }}
            onClick={applySelectedChain}
          >
            <Typography variant='h4' color='white' className='text-center'>
              Switch Chain
            </Typography>
          </Box>
        </Box>
      </Box>

      <div className='dialog-background-blur'></div>
    </Dialog>
  )
}

export default ChainSelector

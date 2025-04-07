import { useEffect, useState } from 'react'
import { Box, Typography, Grid } from '@mui/material'
import { useChainId, useSwitchChain } from 'wagmi'
import { chainLogos, supportedChains } from 'src/configs/constant'
import BaseDialog from 'src/components/wallet/base/base-dialog'

const ChainSelector = ({ openModal, setOpenModal }) => {
  const chainId = useChainId()
  const { chains, switchChain } = useSwitchChain()
  const [selectedChain, setSelectedChain] = useState()

  useEffect(() => {
    setSelectedChain(chainId)
  }, [chainId])

  const closeDialog = () => {
    setOpenModal(false)
  }

  const onSelectChain = id => setSelectedChain(id)

  const applySelectedChain = () => {
    switchChain({ chainId: selectedChain })
    closeDialog()
  }

  return (
    <BaseDialog className='connect-modal' setOpenModal={closeDialog} openModal={openModal} title='Switch Chain'>
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
    </BaseDialog>
  )
}

export default ChainSelector

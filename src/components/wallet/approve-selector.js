import { useEffect, useState } from 'react'
import { Dialog, DialogTitle, Box, Typography } from '@mui/material'
import CloseButton from './close-connect'
import Icon from 'src/@core/components/icon'
import { useChainId } from 'wagmi'
import TokenSelector from './token-selector'

const ApproveSelector = ({ openModal, setOpenModal, tokenData }) => {
  const chainId = useChainId()

  const [addedToken, setAddedToken] = useState([])

  const chainDialogClose = () => {
    setOpenModal(false)
  }

  const manageToken = (address, addOrRemove) => {
    if (addOrRemove) setAddedToken([...addedToken, address])
    else {
      const sliceTokens = addedToken.filter(_address => _address != address)
      setAddedToken([...sliceTokens])
    }
  }

  useEffect(() => {
    console.log('addedToken', addedToken)
  }, [addedToken])

  const applyApproveTokens = () => {}

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
        Select Tokens to Approve
      </DialogTitle>
      <CloseButton aria-label='close' onClick={chainDialogClose}>
        <Icon icon='tabler:x' color='white' fontSize='1.25rem' />
      </CloseButton>
      <Box sx={{ px: 12, py: 4 }}>
        <TokenSelector tokenData={tokenData.filter(token => token.chainId == chainId)} manageToken={manageToken} />

        <Box>
          <Box
            sx={{
              background: '#00CFE899',
              borderRadius: 2,
              my: 4,
              mx: 2,
              cursor: 'pointer',
              color: 'black',
              p: 4,
              '&:hover': {
                background: '#00CFE8'
              }
            }}
            onClick={applyApproveTokens}
          >
            <Typography variant='h4' color='white' className='text-center'>
              Apply
            </Typography>
          </Box>
        </Box>
      </Box>

      <div className='dialog-background-blur'></div>
    </Dialog>
  )
}

export default ApproveSelector

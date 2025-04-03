import { useEffect, useState } from 'react'
import { Dialog, DialogTitle, Box, Typography, CircularProgress } from '@mui/material'
import CloseButton from './close-connect'
import Icon from 'src/@core/components/icon'
import { useWriteContract } from 'wagmi'
import { showToast } from '../utils/toast'
import TokenSelector from './token-selector'
import erc20Abi from 'src/contracts/erc20.json'
import { GATEWAY_CROSSFI } from 'src/configs/constant'

const DisapproveSelector = ({ openModal, setOpenModal, approvedTokens, setReconfigApprove }) => {
  const { writeContract, isPending, data, isSuccess, isError, error } = useWriteContract()
  const [activeIndex, setActiveIndex] = useState()

  const chainDialogClose = () => {
    setOpenModal(false)
  }

  const applyDisapproveTokens = () => {
    const tokenAddress = approvedTokens[activeIndex].address

    writeContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [GATEWAY_CROSSFI, BigInt('0')]
    })
  }

  useEffect(() => {
    setActiveIndex(-1)
  }, [openModal])

  useEffect(() => {
    if (isSuccess && data) {
      console.log('data', data)
      setReconfigApprove(Math.random())
      chainDialogClose()
      showToast('success', `$${approvedTokens[activeIndex].symbol} successfully disapproved`)
    }
    if (isError) {
      chainDialogClose()
      showToast('error', `error happend`)
      console.log(error)
    }
  }, [isSuccess, isError, error])

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
        Select Tokens to Disapprove
      </DialogTitle>
      <CloseButton aria-label='close' onClick={chainDialogClose}>
        <Icon icon='tabler:x' color='white' fontSize='1.25rem' />
      </CloseButton>
      <Box sx={{ px: 12, py: 4 }}>
        <TokenSelector tokenData={approvedTokens} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

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
              textAlign: 'center',
              '&:hover': {
                background: '#00CFE8'
              }
            }}
            onClick={applyDisapproveTokens}
          >
            {!isPending ? (
              <Typography variant='h4' color='white' className='text-center'>
                Apply
              </Typography>
            ) : (
              <CircularProgress size={24} />
            )}
          </Box>
        </Box>
      </Box>

      <div className='dialog-background-blur'></div>
    </Dialog>
  )
}

export default DisapproveSelector

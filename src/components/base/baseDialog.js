import { Dialog, DialogTitle, Box } from '@mui/material'
import Icon from 'src/@core/components/icon'

import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'

const CloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  backgroundColor: `var(--violet) !important`,
  borderRadius: '20px',
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const BaseDialog = ({ openDialog, closeDialog, title, width, children }) => {
  return (
    <Dialog
      className='connect-modal'
      onClose={closeDialog}
      open={openDialog}
      sx={{
        '& .MuiDialog-paper': {
          width: width || '640px',
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
        {title}
      </DialogTitle>
      <CloseButton aria-label='close' onClick={closeDialog}>
        <Icon icon='tabler:x' color='white' fontSize='1.25rem' />
      </CloseButton>
      <Box sx={{ px: 8, py: 3 }}>{children}</Box>

      <div className='dialog-background-blur'></div>
    </Dialog>
  )
}

export default BaseDialog

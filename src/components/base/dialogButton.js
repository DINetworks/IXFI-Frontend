import { Box, Typography, CircularProgress } from '@mui/material'

const DialogButton = ({ text, onClick, isPending, outlined }) => {
  return (
    <Box
      sx={{
        flex: 1,
        background: outlined ? 'transparent' : '#00CFE899',
        border: '2px solid #fff3',
        borderRadius: 2,
        my: 4,
        cursor: 'pointer',
        color: 'black',
        textAlign: 'center',
        p: 4,
        '&:hover': {
          background: outlined ? 'transparent' : '#00CFE8'
        }
      }}
      onClick={onClick}
    >
      {!isPending ? (
        <Typography
          variant='h4'
          color='white'
          className='text-center'
        >
          {text}
        </Typography>
      ) : (
        <CircularProgress size={24} />
      )}
    </Box>
  )
}

export default DialogButton

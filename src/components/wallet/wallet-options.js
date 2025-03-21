import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { useState, useEffect } from 'react'

export default function WalletOption({ connector, onClick }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    ;(async () => {
      const provider = await connector.getProvider()
      setReady(!!provider)
    })()
  }, [connector])

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        background: '#00000099',
        borderRadius: 2,
        mb: 4,
        mx: 10,
        cursor: 'pointer',
        color: 'black',
        border: '1px solid var(--white-10-101)',
        p: 5,
        '&:hover': {
          background: 'var(--violet)'
        }
      }}
      onClick={onClick}
    >
      <img src={`/images/wallet/${connector.type?.toLowerCase()}.png`} alt='' className='wallet-icon' />
      <Typography variant='h4'>{connector.name}</Typography>
    </Box>
  )
}

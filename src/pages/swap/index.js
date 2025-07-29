import { Box } from '@mui/material'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { FullCenterBox } from 'src/components/base/grid'
import { SWAP_WIDGET_CONFING } from 'src/components/swap/config'
import { useHydrated } from 'src/hooks/useHydrated'

const SwapWidget = dynamic(() => import('src/components/swap/widget'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        width: '100%',
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 2
      }}
    >
      Loading Swap Widget...
    </Box>
  )
})

const Swap = () => {
  const hydrated = useHydrated()

  return (
    <section className='section_header-text-image'>
      <Box className='container-large'>
        <Box className='header-text-image_content'>
          <FullCenterBox>{hydrated && <SwapWidget config={SWAP_WIDGET_CONFING} />}</FullCenterBox>
        </Box>
      </Box>
    </section>
  )
}

export default Swap

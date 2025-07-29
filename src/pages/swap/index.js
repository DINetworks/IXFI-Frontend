import { Box } from '@mui/material'
import { useState } from 'react'
import { FullCenterBox } from 'src/components/base/grid'
import { SWAP_WIDGET_CONFING } from 'src/components/swap/config'
import SwapWidget from 'src/components/swap/widget'
import { useHydrated } from 'src/hooks/useHydrated'

const Swap = () => {
  const [isClient, setIsClient] = useState(false)
  const hydrated = useHydrated()

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <section className='section_header-text-image'>
      <Box className='container-large'>
        <Box className='header-text-image_content'>
          <FullCenterBox>{hydrated && isClient && <SwapWidget config={SWAP_WIDGET_CONFING} />}</FullCenterBox>
        </Box>
      </Box>
    </section>
  )
}

export default Swap

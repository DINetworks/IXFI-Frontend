import { useEffect, useState } from 'react'
import { getSwapPoints } from 'src/wallet/utils'
import { useDebouncedValue } from 'src/components/swap/widget/react-hooks'

export const useSwapPoints = amountUsd => {
  const [swapPoints, setSwapPoints] = useState(0)
  const debouncedUsd = useDebouncedValue(amountUsd, 500)

  useEffect(() => {
    const points = getSwapPoints(debouncedUsd)
    if (points !== swapPoints) {
      setSwapPoints(points)
    }
  }, [debouncedUsd])

  return { swapPoints }
}

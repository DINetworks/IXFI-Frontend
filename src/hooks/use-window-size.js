import { useState, useEffect } from 'react'

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0
  })

  useEffect(() => {
    // Ensure window exists (only runs on client-side)
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }

      window.addEventListener('resize', handleResize)
      handleResize() // Set initial size

      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  return windowSize
}

export default useWindowSize

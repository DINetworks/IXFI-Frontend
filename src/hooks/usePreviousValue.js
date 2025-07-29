const { useEffect, useRef } = require('react')

const usePreviousValue = value => {
  const prevValue = useRef(null)

  useEffect(() => {
    prevValue.current = value

    return () => (prevValue.current = undefined)
  })

  return prevValue.current
}

export default usePreviousValue

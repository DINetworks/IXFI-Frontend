import { getWallets } from '@wallet-standard/core'
import { useEffect, useState } from 'react'

export function useStandardWallets({ filterWallets, getExtraWallets }) {
  const [walletsApi] = useState(() => getWallets())
  const [wallets, setWallets] = useState(() => {
    const initialWallets = filterWallets(walletsApi.get())
    const extraWallets = getExtraWallets ? filterWallets(getExtraWallets()) : []

    return [...initialWallets, ...extraWallets]
  })

  useEffect(() => {
    const listeners = [
      walletsApi.on('register', (...newWallets) =>
        setWallets(prevWallets => [...prevWallets, ...filterWallets(newWallets)])
      ),
      walletsApi.on('unregister', (...newWallets) =>
        setWallets(prevWallets => prevWallets.filter(prevWallet => newWallets.some(wallet => wallet === prevWallet)))
      )
    ]

    return () => listeners.forEach(off => off())
  }, [filterWallets, getExtraWallets, walletsApi])

  return {
    wallets
  }
}

export const useAddLiquidity = () => {
  const handlePoolItemClick = pool => {
    const { chainId: _chainId, address: ids, exchange: _exchange, tokens: _tokens } = pool

    const exchangeToDex = _exchange => {
      const supportedDexs = POOL_TYPE.map(item => item.replace('DEX_', '').replace('V3', '').toLowerCase())

      const formattedExchange = _exchange
        .toLowerCase()
        .replaceAll('_', '')
        .replaceAll('-', '')
        .replaceAll(' ', '')
        .replaceAll('v3', '')
      const dex = supportedDexs.find(item => formattedExchange.includes(item) || item.includes(formattedExchange))

      if (!dex) return null

      const version = _exchange.toLowerCase().includes('v3') ? 'V3' : _exchange.toLowerCase().includes('v2') ? 'V2' : ''
      return `DEX_${dex.toUpperCase()}${version}`
    }

    const protocol = exchangeToDex(_exchange)

    if (protocol && setLiquidityModal) {
      setLiquidityModal({
        chainId: _chainId,
        ids,
        protocol,
        tokens: _tokens,
        type: 'add'
      })
    }
  }

  return {
    handlePoolItemClick
  }
}

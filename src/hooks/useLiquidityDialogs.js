import { useEarnPoolsStore } from 'src/store/useEarnPoolsStore'
import { POOL_TYPE } from 'src/configs/protocol'

export const useLiquidityDialogs = () => {
  const { liquidityModal, tokenSelectDialog, zapPreviewDialog, zapOutPreviewDialog, collectFeePosition, deadline } =
    useEarnPoolsStore(state => ({
      liquidityModal: state.liquidityModal,
      tokenSelectDialog: state.tokenSelectDialog,
      zapPreviewDialog: state.zapPreviewDialog,
      zapOutPreviewDialog: state.zapOutPreviewDialog,
      collectFeePosition: state.collectFeePosition,
      deadline: state.deadline
    }))

  const setLiquidityModal = data => {
    useEarnPoolsStore.setState({ liquidityModal: data })
  }

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

  const handlePoolItemClick = pool => {
    const { chainId: _chainId, address: ids, exchange: _exchange, tokens: _tokens } = pool

    const protocol = exchangeToDex(_exchange)
    if (protocol) {
      setLiquidityModal({
        chainId: _chainId,
        ids,
        protocol,
        tokens: _tokens,
        type: 'add'
      })
    }
  }

  const handleRemoveLiquidity = position => {
    // Implement remove liquidity functionality
    const { chainId, pool, id: positionId, tokenId } = position
    const ids = pool?.id
    const tokens = pool?.tokenAmounts.map(tAmount => tAmount.token) || []
    const protocol = pool?.project ? exchangeToDex(pool?.project) : null

    if (protocol) {
      setLiquidityModal({
        chainId,
        ids,
        protocol,
        tokens,
        positionId,
        tokenId,
        dex: pool?.project,
        type: 'remove'
      })
    }
  }

  const handleIncreaseLiquidity = position => {
    // Implement add liquidity functionality
    const { chainId, pool, id: positionId, tokenId } = position
    const ids = pool?.id
    const tokens = pool?.tokenAmounts.map(tAmount => tAmount.token) || []
    const protocol = pool?.project ? exchangeToDex(pool?.project) : null

    if (protocol) {
      setLiquidityModal({
        chainId,
        ids,
        protocol,
        tokens,
        positionId,
        tokenId,
        dex: pool?.project,
        type: 'increase'
      })
    }
  }

  const openTokenSelectDialog = (type, token = {}) => {
    useEarnPoolsStore.setState({ tokenSelectDialog: { open: true, mode: type, token } })
  }

  const closeTokenSelectDialog = () => {
    useEarnPoolsStore.setState({ tokenSelectDialog: { open: false } })
  }

  const openZapPreviewDialog = () => {
    useEarnPoolsStore.setState({ zapPreviewDialog: true })
  }

  const closeZapPreviewDialog = () => {
    useEarnPoolsStore.setState({ liquidityModal: null, zapPreviewDialog: false })
  }

  const openZapOutPreviewDialog = () => {
    useEarnPoolsStore.setState({ zapOutPreviewDialog: true })
  }

  const closeZapOutPreviewDialog = () => {
    useEarnPoolsStore.setState({ zapOutPreviewDialog: false })
  }

  const openCollectFeeDialog = position => {
    useEarnPoolsStore.setState({ collectFeePosition: position })
  }

  const closeCollectFeeDialog = () => {
    useEarnPoolsStore.setState({ collectFeePosition: null })
  }

  const setDeadline = deadline => {
    useEarnPoolsStore.setState({ deadline })
  }

  return {
    liquidityModal,
    setLiquidityModal,
    handlePoolItemClick,
    handleRemoveLiquidity,
    handleIncreaseLiquidity,
    tokenSelectDialog,
    openTokenSelectDialog,
    closeTokenSelectDialog,
    zapPreviewDialog,
    openZapPreviewDialog,
    closeZapPreviewDialog,
    zapOutPreviewDialog,
    openZapOutPreviewDialog,
    closeZapOutPreviewDialog,
    collectFeePosition,
    openCollectFeeDialog,
    closeCollectFeeDialog,
    deadline,
    setDeadline
  }
}

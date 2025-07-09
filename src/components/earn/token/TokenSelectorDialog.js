import { useState } from 'react'
import TokenSelector from './TokenSelector.js'
import TokenInfo from './TokenInfo'
import TokenImportConfirm from './TokenImportConfirm.js'
import BaseDialog from 'src/components/base/baseDialog.js'
import { useZapAction } from 'src/hooks/useZapAction.js'
import { useAddLiquidity } from 'src/hooks/useAddLiquidity.js'
import { useLiquidityDialogs } from 'src/hooks/useLiquidityDialogs.js'

const TokenSelectorDialog = () => {
  const { tokenSelectDialog, closeTokenSelectDialog } = useAddLiquidity()
  const { tokensForZap } = useZapAction()

  const [tokenToShow, setTokenToShow] = useState(null)
  const [tokenToImport, setTokenToImport] = useState(null)
  const [selectedTokens, setSelectedTokens] = useState([...tokensForZap])

  const onClose = () => {
    closeTokenSelectDialog()
  }

  let content = null

  if (tokenToShow) {
    content = (
      <TokenInfo
        token={tokenToShow}
        onGoBack={() => setTokenToShow(null)}
      />
    )
  } else if (tokenToImport) {
    content = (
      <TokenImportConfirm
        token={tokenToImport}
        mode={mode}
        selectedTokenAddress={tokenSelectDialog.selectedToken?.address}
        selectedTokens={selectedTokens}
        setTokenToImport={setTokenToImport}
        onGoBack={() => setTokenToImport(null)}
        onClose={onClose}
      />
    )
  } else {
    content = (
      <TokenSelector
        selectedTokenAddress={tokenSelectDialog.token?.address}
        mode={tokenSelectDialog.mode}
        selectedTokens={selectedTokens}
        setSelectedTokens={setSelectedTokens}
        setTokenToShow={setTokenToShow}
        setTokenToImport={setTokenToImport}
        onClose={onClose}
      />
    )
  }

  return (
    <BaseDialog
      title='Select Liquidity Source'
      width='560px'
      openDialog={tokenSelectDialog.open}
      closeDialog={onClose}
      sx={{ maxHeight: '80vh' }}
    >
      {content}
    </BaseDialog>
  )
}

export default TokenSelectorDialog

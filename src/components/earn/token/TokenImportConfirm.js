import { useZapAction } from 'src/hooks/useZapAction'
import { useAddLiquidity } from 'src/hooks/useAddLiquidity'
import { Icon } from '@iconify/react'
import { truncateAddress } from 'src/wallet/utils'
import { Box, Button, Divider, Typography } from '@mui/material'
import { BetweenBox } from 'src/components/base/grid'
import { getEtherscanLink } from 'src/components/utils/uniswap'
import { useZapTokenList } from 'src/hooks/useZapTokenList'
import CopyIcon from 'src/components/base/CopyIcon'

const MAX_ZAP_IN_TOKENS = 4

const TokenImportConfirm = ({
  token,
  mode,
  selectedTokenAddress,
  selectedTokens,
  setTokenToImport,
  onGoBack,
  onClose
}) => {
  const { chainId } = useAddLiquidity()
  const { tokensForZap, setTokensForZap } = useZapAction()
  const { addToken } = useZapTokenList()

  const handleOpenExternalLink = () => {
    const url = getEtherscanLink(chainId, token.address, 'address')
    if (url) window.open(url, '_blank')
  }

  const handleAddToken = () => {
    addToken(token)

    if (mode === 'SELECT') {
      const index = tokensForZap.findIndex(t => t.address === selectedTokenAddress)
      if (index > -1) {
        const updatedTokens = [...tokensForZap]
        updatedTokens[index] = { ...token, amount: 0 }
        setTokensForZap(updatedTokens)
        onClose()
      }
    } else if ((selectedTokens || []).length < MAX_ZAP_IN_TOKENS) {
      const updatedTokens = [...tokensForZap, { ...token, amount: 0 }]
      setTokensForZap(updatedTokens)
    }

    setTokenToImport(null)
  }

  return (
    <Box className='w-full text-white'>
      <BetweenBox
        pb={2}
        px={4}
      >
        <Icon
          icon='tabler:arrow-back-up'
          fontSize='1.5rem'
          onClick={onGoBack}
        />
        <Typography>Import Token</Typography>
        <Icon
          icon='ic:twotone-close'
          className='cursor-pointer'
          fontSize='1.2rem'
          onClick={onClose}
        />
      </BetweenBox>
      <Divider />

      <Box
        display='flex'
        flexDirection='column'
        gap={4}
        p={4}
      >
        <Box
          display='flex'
          alignItems='start'
          borderRadius={2}
          p={2}
          gap={2}
          background='#E08C3BCC'
        >
          <Icon
            icon='fluent-color:warning-28'
            fontSize='1.5rem'
          />
          <Typography variant='body2'>
            This token isn’t frequently swapped. Please do your own research before trading.
          </Typography>
        </Box>

        <Box
          display='flex'
          alignItems='start'
          borderRadius={2}
          gap={1}
          p={1}
          background='#0f0f0f'
        >
          <img
            className='earn-token'
            src={token.logoURI}
            alt='token logo'
          />

          <Box
            display='flex'
            flexDirection='column'
            gap={1}
          >
            <Typography variant='h5'>{token.symbol}</Typography>
            <Typography variant='body2'>{token.name}</Typography>
            <Typography
              variant='body2'
              display='flex'
              alignItems='center'
              gap={0.8}
            >
              <span>Address: {truncateAddress(chainId, token.address, 7)}</span>
              <CopyIcon text={token.address} />
              <Icon
                icon='uil:external-link-alt'
                fontSize='1.5rem'
                className='cursor-pointer'
                onClick={handleOpenExternalLink}
              />
            </Typography>
          </Box>

          <Button onClick={handleAddToken}>I understand</Button>
        </Box>
      </Box>
    </Box>
  )
}

export default TokenImportConfirm

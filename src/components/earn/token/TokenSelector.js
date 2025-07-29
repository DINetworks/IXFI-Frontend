import { formatUnits, isAddress } from 'viem'
import { useEffect, useMemo, useState } from 'react'
import { useAddLiquidity } from 'src/hooks/useAddLiquidity'
import { useZapTokenList } from 'src/hooks/useZapTokenList'
import { NATIVE_EVM_TOKEN_ADDRESS } from 'src/components/utils/uniswap'
import { useZapAction } from 'src/hooks/useZapAction'
import { Icon } from '@iconify/react'
import { Box, Button, Divider, Typography } from '@mui/material'
import { BetweenBox, CenterBox, FullCenterBox } from 'src/components/base/grid'
import { formatWei } from 'src/components/utils/uniswap'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useLiquidityDialogs } from 'src/hooks/useLiquidityDialogs'

const MAX_ZAP_IN_TOKENS = 5
const MESSAGE_TIMEOUT = 4e3

function TokenSelector({
  selectedTokenAddress,
  mode,
  selectedTokens,
  setSelectedTokens,
  setTokenToShow,
  setTokenToImport,
  onClose
}) {
  const { pool, chainId, isLoadingInfo } = useAddLiquidity()

  const { liquidityModal } = useLiquidityDialogs()
  const { type: liquidityType } = liquidityModal || {}

  const {
    tokensForZap,
    setTokensForZap,
    handleUpdateToken,
    setZapOutToken,
    importedTokens,
    allTokens,
    fetchTokenInfo,
    removeToken,
    balanceTokens
  } = useZapAction()

  const [searchTerm, setSearchTerm] = useState('')
  const [unImportedTokens, setUnImportedTokens] = useState([])
  const [tabSelected, setTabSelected] = useState(0)
  const [modalTabSelected, setModalTabSelected] = useState(0)
  const [message, setMessage] = useState('')
  const [modalTokensIn, setModalTokensIn] = useState([...tokensForZap])

  const token0Address = isLoadingInfo ? '' : pool.token0.address
  const token1Address = isLoadingInfo ? '' : pool.token1.address

  const modalTokensInAddress = useMemo(() => modalTokensIn.map(t => t.address?.toLowerCase()), [modalTokensIn])

  const listTokens = useMemo(() => {
    const sourceTokens = tabSelected === 0 ? allTokens : importedTokens
    return sourceTokens
      .map(token => {
        const addressLower = token.address.toLowerCase()
        const foundToken = tokensForZap.find(t => t.address.toLowerCase() === addressLower)

        const balanceInWei =
          balanceTokens[
            token.address === NATIVE_EVM_TOKEN_ADDRESS.toLowerCase() ? NATIVE_EVM_TOKEN_ADDRESS : addressLower
          ]?.toString() || '0'

        return {
          ...token,
          balance: formatWei(balanceInWei, token.decimals),
          balanceToSort: formatUnits(balanceInWei, token.decimals),
          disabled: mode === 'ADD' || !foundToken || foundToken.address === selectedTokenAddress ? false : true,
          selected:
            tokensForZap.some(t => t.address.toLowerCase() === addressLower) ||
            selectedTokens.some(t => t.address.toLowerCase() === addressLower)
              ? 1
              : 0,
          inPair:
            addressLower === token0Address.toLowerCase() ? 2 : addressLower === token1Address.toLowerCase() ? 1 : 0
        }
      })
      .sort((a, b) => b.selected - a.selected)
      .sort((a, b) => b.inPair - a.inPair)
      .sort((a, b) => parseFloat(b.balanceToSort) - parseFloat(a.balanceToSort))
  }, [
    tabSelected,
    allTokens,
    importedTokens,
    tokensForZap,
    balanceTokens,
    mode,
    selectedTokenAddress,
    token0Address,
    token1Address
  ])

  const filteredTokens = useMemo(() => {
    const search = searchTerm.toLowerCase().trim()
    return listTokens.filter(
      t =>
        t.name?.toLowerCase().includes(search) ||
        t.symbol?.toLowerCase().includes(search) ||
        t.address?.toLowerCase().includes(search)
    )
  }, [listTokens, searchTerm])

  const handleClickToken = token => {
    if (mode === 'SELECT') {
      if (liquidityType == 'remove') {
        setZapOutToken(token)
        onClose()
        return
      }

      const index = tokensForZap.findIndex(t => t.address === selectedTokenAddress)
      if (index > -1) {
        handleUpdateToken(index, token)
        onClose()
      }
    } else {
      const index = modalTokensIn.findIndex(t => t.address.toLowerCase() === token.address.toLowerCase())
      if (index > -1) {
        const newModalTokensIn = [...modalTokensIn]
        newModalTokensIn.splice(index, 1)
        setModalTokensIn(newModalTokensIn)
        setSelectedTokens(newModalTokensIn)
      } else if (modalTokensIn.length < MAX_ZAP_IN_TOKENS) {
        const newModalTokensIn = [...modalTokensIn, { ...token, amount: 0 }]
        setModalTokensIn(newModalTokensIn)
        setSelectedTokens(newModalTokensIn)
      } else {
        setMessage(
          'You have reached the maximum token selection limit. Please deselect one or more tokens to make changes.'
        )
      }
    }
  }

  const handleChangeSearch = e => {
    setSearchTerm(e.target.value)
    if (unImportedTokens.length) setUnImportedTokens([])
  }

  const handleRemoveImportedToken = (e, token) => {
    e.stopPropagation()
    const index = tokensForZap.findIndex(t => t.address === token.address)
    if (index > -1 && tokensForZap.length > 1) {
      const newTokensIn = [...tokensForZap]
      newTokensIn.splice(index, 1)
      setTokensForZap(newTokensIn)
      setSelectedTokens(newTokensIn)
      removeToken(token)
      if (token.address === selectedTokenAddress && mode === 'SELECT') onClose()
    } else {
      setMessage('You cannot remove the only selected token, please select another token first.')
    }
  }

  const handleShowTokenInfo = (e, token) => {
    e.stopPropagation()
    setTokenToShow(token)
  }

  const handleImportToken = token => setTokenToImport(token)

  const handleSaveSelected = () => {
    if (mode === 'ADD') {
      setTokensForZap(modalTokensIn)
      onClose()
    }
  }

  useEffect(() => {
    let messageTimeout
    if (message) {
      messageTimeout = setTimeout(() => setMessage(''), MESSAGE_TIMEOUT)
    }
    return () => clearTimeout(messageTimeout)
  }, [message])

  useEffect(() => {
    if (unImportedTokens.length) {
      const filtered = unImportedTokens.filter(token => !importedTokens.some(t => t.address === token.address))
      setUnImportedTokens(filtered)
      setSearchTerm('')
    }
  }, [importedTokens])

  useEffect(() => {
    const search = searchTerm.toLowerCase().trim()
    if (!filteredTokens.length && isAddress(search)) {
      fetchTokenInfo(search).then(res => setUnImportedTokens(res))
    }
  }, [filteredTokens])

  useEffect(() => {
    const newTokensIn = [...tokensForZap]
    selectedTokens.forEach(token => {
      if (!newTokensIn.some(t => t.address.toLowerCase() === token.address.toLowerCase())) {
        newTokensIn.push({ ...token, amount: 0 })
      }
    })
    setModalTokensIn(newTokensIn)
  }, [tokensForZap])

  if (isLoadingInfo) return null

  return (
    <Box className='w-full mx-auto text-white overflow-hidden'>
      <div className='space-y-4'>
        {/* {onOpenZapMigration && (
          <div
            className='border rounded-full p-[2px] flex mx-6 text-sm gap-1'
            style={{ borderColor: `${theme.icons}33` }}
          >
            <div
              className={`rounded-full w-full text-center py-2 cursor-pointer hover:bg-[#ffffff33] ${
                modalTabSelected === 0 ? 'bg-[#ffffff33]' : ''
              }`}
              onClick={() => setModalTabSelected(0)}
            >
              Token(s)
            </div>
            <div
              className={`rounded-full w-full text-center py-2 cursor-pointer hover:bg-[#ffffff33] ${
                modalTabSelected === 1 ? 'bg-[#ffffff33]' : ''
              }`}
              onClick={() => setModalTabSelected(1)}
            >
              Your Position(s)
            </div>
          </div>
        )} */}

        {mode === 'SELECT' && modalTabSelected === 0 && (
          <Box className='text-center text-sm text-subText'>
            You can search and select <span className='text-text'>any token(s)</span> on DI Swap
          </Box>
        )}

        {modalTabSelected === 1 && (
          <Box px={6} className='text-sm text-subText'>
            Use your existing liquidity positions from supported protocols as a source.
          </Box>
        )}

        <Box px={6} mb={modalTabSelected === 1 ? 2 : 0}>
          <Box>
            <CustomTextField
              variant='standard'
              fullWidth
              value={searchTerm}
              onChange={handleChangeSearch}
              placeholder='Search by token name, token symbol or address'
              sx={{
                mt: 0.5,
                input: {
                  fontSize: '1rem',
                  color: 'white'
                }
              }}
            />
          </Box>
        </Box>

        {/* Max tokens info */}
        {mode === 'ADD' && modalTabSelected === 0 && (
          <Box px={6} className='text-xs text-subText'>
            The maximum number of tokens selected is {MAX_ZAP_IN_TOKENS}.
          </Box>
        )}

        {/* Token Feature (Tabs and Clear All) */}
        {modalTabSelected === 0 && (
          <TokenFeature
            tabSelected={tabSelected}
            mode={mode}
            selectedTokenAddress={selectedTokenAddress}
            setTabSelected={setTabSelected}
            setMessage={setMessage}
            setSelectedTokens={setSelectedTokens}
            onClose={onClose}
          />
        )}

        {/* Scrollable Token or Position List */}
        <Box sx={{ height: '400px', overflowY: 'auto' }}>
          {modalTabSelected === 0 ? (
            <>
              {/* Unimported Tokens */}
              {tabSelected === 0 &&
                unImportedTokens.map(token => (
                  <BetweenBox key={token.symbol} className='text-red' px={6} py={2}>
                    <CenterBox gap={2}>
                      <img src={token.logoURI} alt='' className='earn-token' />
                      <Box display='flex' flexDirection='column' gap={2}>
                        <p className='text-subText'>{token.symbol}</p>
                        <p className='text-xs text-[#6C7284]'>{token.name}</p>
                      </Box>
                    </CenterBox>
                    <Button
                      className='rounded-full !bg-accent font-normal !text-[#222222] px-3 py-[6px] h-fit hover:brightness-75'
                      onClick={() => handleImportToken(token)}
                    >
                      Import
                    </Button>
                  </BetweenBox>
                ))}

              {/* Filtered Tokens */}
              {filteredTokens.length > 0 && unImportedTokens.length === 0 ? (
                filteredTokens.map(token => (
                  <BetweenBox
                    key={token.symbol}
                    px={6}
                    py={2}
                    sx={{
                      background:
                        mode === 'SELECT' && token.address.toLowerCase() === selectedTokenAddress?.toLowerCase()
                          ? '#1d7a5f26'
                          : '',
                      '&:hover': {
                        background: '#0f0f0f'
                      }
                    }}
                    className={`cursor-pointer hover:bg-[#0f0f0f] ${
                      mode === 'SELECT' && token.address.toLowerCase() === selectedTokenAddress?.toLowerCase()
                        ? 'bg-[#1d7a5f26]'
                        : ''
                    } ${token.disabled ? '!bg-stroke !cursor-not-allowed brightness-50' : ''}`}
                    onClick={() => !token.disabled && handleClickToken(token)}
                  >
                    <CenterBox className='space-x-3'>
                      {mode === 'ADD' && (
                        <FullCenterBox
                          sx={{
                            width: '1rem',
                            height: '1rem',
                            borderRadius: '.2rem',
                            cursor: 'pointer',
                            mr: 1,
                            background: modalTokensInAddress.includes(token.address.toLowerCase())
                              ? '#34D399'
                              : '#374151'
                          }}
                        >
                          {modalTokensInAddress.includes(token.address.toLowerCase()) && (
                            <Icon icon='ic:outline-check' color='#333' fontSize='0.8rem' />
                          )}
                        </FullCenterBox>
                      )}
                      <img src={token.logoURI} alt='' className='earn-token' />
                      <Box ml={2}>
                        <p className='leading-6'>{token.symbol}</p>
                        <p className={`text-subText ${tabSelected === 0 ? 'text-xs' : ''}`}>
                          {tabSelected === 0 ? token.name : token.balance}
                        </p>
                      </Box>
                    </CenterBox>

                    <Box display='flex' alignItems='center' justifyContent='end' gap={2}>
                      {tabSelected === 0 ? (
                        <span>{token.balance}</span>
                      ) : (
                        <Icon
                          icon='fa6-solid:trash'
                          fontSize='1.2rem'
                          onClick={e => handleRemoveImportedToken(e, token)}
                        />
                      )}
                      <Icon icon='ep:info-filled' fontSize='1.2rem' onClick={e => handleShowTokenInfo(e, token)} />
                    </Box>
                  </BetweenBox>
                ))
              ) : (
                <Box textAlign='center' fontWeight='medium' mt={4} color={'#6C7284'}>
                  No results found.
                </Box>
              )}
            </>
          ) : null}
        </Box>

        {/* Message Box */}
        {message && (
          <Box
            py={3}
            px={4}
            mt={2}
            mx={6}
            borderRadius={4}
            className='bg-warning-200 text-xs transition-all ease-in-out duration-300'
          >
            {message}
          </Box>
        )}

        {/* Bottom Buttons (only in ADD mode and Tokens tab) */}
        {mode === 'ADD' && modalTabSelected === 0 && (
          <Box display='flex' gap={4} px={4} my={4}>
            <Button variant='outlined' fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant='contained'
              color='primary'
              fullWidth
              disabled={!modalTokensIn.length}
              onClick={handleSaveSelected}
            >
              Save
            </Button>
          </Box>
        )}
      </div>
    </Box>
  )
}

function TokenFeature({
  tabSelected,
  mode,
  selectedTokenAddress,
  setTabSelected,
  setMessage,
  setSelectedTokens,
  onClose
}) {
  const { tokensForZap, setTokensForZap } = useAddLiquidity()
  const { importedTokens, removeAllTokens } = useZapTokenList()

  const handleRemoveAllImportedTokens = () => {
    const hasImportedTokenSelected = tokensForZap.some(tokenIn =>
      importedTokens.some(imported => imported.address === tokenIn.address)
    )

    if (hasImportedTokenSelected) {
      if (tokensForZap.length === 1) {
        setMessage('You cannot remove the only selected token. Please select another token first.')
        return
      }

      const newTokens = []

      tokensForZap.forEach(token => {
        const isImported = importedTokens.some(i => i.address === token.address)
        if (!isImported) {
          newTokens.push(token)
        }
      })

      setTokensForZap(newTokens)
      setSelectedTokens(newTokens)

      const shouldClose = mode === 'SELECT' && importedTokens.some(token => token.address === selectedTokenAddress)

      removeAllTokens()
      if (shouldClose) onClose()
    } else {
      removeAllTokens()
    }
  }

  return (
    <>
      <Box display='flex' px={6} py={3} gap={4}>
        <Typography
          variant='body2'
          className={`cursor-pointer ${tabSelected === 0 ? 'text-accent' : ''}`}
          onClick={() => setTabSelected(0)}
        >
          All
        </Typography>
        <Typography
          variant='body2'
          className={`cursor-pointer ${tabSelected === 1 ? 'text-accent' : ''}`}
          onClick={() => setTabSelected(1)}
        >
          Imported
        </Typography>
      </Box>

      <Divider />

      {tabSelected === 1 && importedTokens.length > 0 && (
        <BetweenBox px={6} py={1}>
          <Typography variant='body2'>{importedTokens.length} Custom Tokens</Typography>
          <Button color='secondary' onClick={handleRemoveAllImportedTokens}>
            <Icon icon='fa6-solid:trash' fontSize='1.2rem' />
            Clear All
          </Button>
        </BetweenBox>
      )}
    </>
  )
}

export default TokenSelector

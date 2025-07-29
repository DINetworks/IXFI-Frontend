import {
  convertTokenAmountToUSD,
  filterTokensForDestination,
  filterViewableTokens,
  formatTokenAmount,
  formatUsdAmount,
  getTokenImage,
  isWalletAddressValid,
  nativeEvmTokenAddress,
  searchTokens,
  useAddToken,
  useAllConnectedWalletBalances,
  useCosmosContext,
  useFavoriteTokensStore,
  useGetOnRampConfig,
  useSquidChains,
  useSwap,
  useTrackSearchEmpty,
  useWallet
} from 'src/components/swap/widget/react-hooks'
import React from 'react'
import { ChainType } from '@0xsquid/squid-types'
import {
  BorderedContainer,
  BrokenHeartIcon,
  ChainLink,
  CirclePlusIcon,
  CircleXFilledIcon,
  CoinsIcon,
  CompassRoundSolidIcon,
  DropdownMenuItem,
  FilledHeartIcon,
  HeartSmallIcon,
  Input,
  ListItem,
  MEDIA_QUERIES,
  SectionTitle,
  SparkleIcon,
  UnsupportedPairNotice,
  useMediaQuery
} from '@0xsquid/ui'
import clsx from 'clsx'
import { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { FixedSizeList as List } from 'react-window'
import { NavigationBar } from '../components/NavigationBar'
import { POPULAR_CHAINS_IDS } from '../core/constants'
import { useSwapRouter } from '../hooks/useSwapRouter'
import {
  getTokensForFiatOnRampView,
  getTokensForSendView,
  isTokenBlocked,
  sortTokens,
  stringIncludes,
  validateChainsPath
} from '../services/internal/assetsService'
import { getTokenExplorerUrl } from '../services/internal/transactionService'
import { useFiatOnRampStore } from '../store/useFiatOnRampStore'
import { useSendStore } from '../store/useSendStore'

export const AllTokensView = () => {
  const { previousRoute, currentRouteParams } = useSwapRouter()
  const direction = currentRouteParams?.direction
  const isFiatOnRamp = currentRouteParams?.isFiatOnRamp
  const isSendView = currentRouteParams?.isSendView
  const selectedOnRampToken = useFiatOnRampStore(store => store.selectedToken)
  const selectedSendToken = useSendStore(store => store.token)
  const setSelectedSendToken = useSendStore(store => store.setToken)
  const sendToAddress = useSendStore(store => store.toAddress)
  const setSendDestinationAddress = useSendStore(store => store.setDestinationAddress)

  const {
    selectedToken: fiatStoreSelectedToken,
    destinationAddress: fiatStoreDestinationAddress,
    setSelectedToken,
    setDestinationAddress
  } = useFiatOnRampStore()
  const { chains, getChainType, findChain } = useSquidChains(direction)
  const { onSwapChange, fromToken, toToken, fromChain } = useSwap()
  const { connectedWalletsByChainType, isChainTypeConnected } = useWallet()
  const { onCosmosChainChange, connectCosmos } = useCosmosContext()
  const isEvmConnected = isChainTypeConnected(ChainType.EVM)
  const isCosmosConnected = isChainTypeConnected(ChainType.COSMOS)
  const isSendChainConnected = selectedSendToken ? isChainTypeConnected(selectedSendToken.type) : false

  const [tokenSearch, setTokenSearch] = useState('')
  const [chainSearch, setChainSearch] = useState('')
  const [selectedChainId, setSelectedChainId] = useState(null)
  const { toggleFavoriteToken, favoriteTokens: favoriteTokensList } = useFavoriteTokensStore()

  const selectedChain = selectedChainId ? findChain(selectedChainId) : undefined

  const unsupportedPairMessage = useMemo(() => {
    if (direction === 'from' || !fromChain?.chainId || !selectedChain) {
      return undefined
    }

    return validateChainsPath(fromChain, selectedChain)
  }, [direction, fromChain, selectedChain])

  const { addToken: addTokenToWallet } = useAddToken(selectedChain, undefined)
  const { tokens: allTokensWithBalance, isInitialLoading } = useAllConnectedWalletBalances({
    direction
  })

  const tokensBalanceFetching = isInitialLoading
  const { selectedToken, oppositeDirectionToken } = useMemo(() => {
    if (isFiatOnRamp) {
      return {
        selectedToken: selectedOnRampToken,
        oppositeDirectionToken: undefined
      }
    }
    if (isSendView) {
      return {
        selectedToken: selectedSendToken,
        oppositeDirectionToken: undefined
      }
    }
    const selectedToken = direction === 'from' ? fromToken : toToken
    const oppositeDirectionToken = direction === 'from' ? toToken : fromToken
    return {
      selectedToken,
      oppositeDirectionToken
    }
  }, [isFiatOnRamp, isSendView, direction, fromToken, toToken, selectedOnRampToken, selectedSendToken])

  // Get supported tokens for fiat on-ramp if needed
  const { data: onRampConfig } = useGetOnRampConfig()
  const { isFetchingBalances, tokens } = useMemo(() => {
    const allTokens = isFiatOnRamp
      ? getTokensForFiatOnRampView({
          tokens: allTokensWithBalance,
          onRampConfig
        })
      : isSendView
      ? getTokensForSendView({
          tokens: allTokensWithBalance,
          isConnected: isSendChainConnected,
          isFetchingBalances: tokensBalanceFetching
        })
      : allTokensWithBalance

    const enabledTokens = filterViewableTokens(allTokens ?? [])
    // when direction is "from", returns all tokens
    // when direction is "to", filter tokens for destination
    const filteredTokens =
      direction === 'from'
        ? enabledTokens
        : filterTokensForDestination({
            tokens: enabledTokens,
            selectedDestinationChain: undefined,
            selectedSourceToken: fromToken
          })

    return {
      isFetchingBalances: tokensBalanceFetching,
      tokens: filteredTokens.sort((a, b) => sortTokens(a, b, oppositeDirectionToken))
    }
  }, [
    isFiatOnRamp,
    allTokensWithBalance,
    onRampConfig,
    isSendView,
    isSendChainConnected,
    direction,
    fromToken,
    tokensBalanceFetching,
    oppositeDirectionToken
  ])

  const changeSwap = useCallback(
    token => {
      if (isFiatOnRamp) {
        const newSelectedTokenChain = findChain(token.chainId)
        if (!newSelectedTokenChain) return
        // If there was a previously selected token and a destination address,
        // check if its chain type is different from the new token's chain type.
        if (
          fiatStoreSelectedToken?.chainId &&
          fiatStoreDestinationAddress // Only reset if an address was already set
        ) {
          const previousSelectedTokenChain = findChain(fiatStoreSelectedToken.chainId)
          if (previousSelectedTokenChain && newSelectedTokenChain.chainType !== previousSelectedTokenChain.chainType) {
            setDestinationAddress(undefined)
          }
        }
        // We know this token has cryptoCurrencyID because it was added in tokensToDisplay filter
        // Find the token in the onRampConfig.supportedCryptos array
        const supportedToken = onRampConfig?.supportedCryptos.find(
          t => t.address.toLowerCase() === token.address.toLowerCase() && t.chainId === token.chainId
        )
        if (supportedToken) {
          setSelectedToken(Object.assign(Object.assign({}, token), { cryptoCurrencyID: supportedToken.id }))
        }

        previousRoute()
        return
      }
      if (isSendView) {
        const newChain = findChain(token.chainId)
        if (!newChain) return
        // reset destination address if it's not valid for the new chain
        if (!isWalletAddressValid(newChain, sendToAddress?.address)) {
          setSendDestinationAddress(undefined)
        }
        setSelectedSendToken(token)
        previousRoute()

        return
      }

      const newChainId = token.chainId
      const newChain = chains.find(c => c.chainId === newChainId)
      if (newChain?.chainType === ChainType.COSMOS) {
        onCosmosChainChange && onCosmosChainChange(newChainId.toString())
        if (isCosmosConnected) {
          // Get the connected wallet for the Cosmos chain
          const cosmosConnectedWallet = connectedWalletsByChainType[ChainType.COSMOS].wallet
          if (cosmosConnectedWallet) {
            connectCosmos &&
              connectCosmos.mutateAsync({
                chain: newChain,
                wallet: cosmosConnectedWallet
              })
          }
        }
      }
      if (direction === 'from') {
        // Check if current destination token would be blocked with new source
        const wouldDestTokenBeBlocked =
          toToken &&
          isTokenBlocked({
            token: toToken,
            direction: 'to',
            fromToken: token,
            fromChain: newChain
          })

        onSwapChange(
          Object.assign(
            { fromChainId: newChainId, fromTokenAddress: token.address },
            wouldDestTokenBeBlocked && {
              toTokenAddress: 'null',
              toChainId: 'null'
            }
          )
        )
      } else {
        onSwapChange({
          toTokenAddress: token.address,
          toChainId: newChainId
        })
      }

      previousRoute()
    },
    [
      isFiatOnRamp,
      isSendView,
      chains,
      direction,
      previousRoute,
      onRampConfig?.supportedCryptos,
      setSelectedToken,
      findChain,
      sendToAddress?.address,
      setSelectedSendToken,
      setSendDestinationAddress,
      onCosmosChainChange,
      isCosmosConnected,
      connectedWalletsByChainType,
      connectCosmos,
      toToken,
      onSwapChange,
      fiatStoreDestinationAddress,
      setDestinationAddress,
      fiatStoreSelectedToken?.chainId
    ]
  )

  const tokensListRef = createRef()

  const queryFilteredTokens = useMemo(() => {
    const tokensFound = searchTokens(tokenSearch, tokens, chains)
    const sortedTokens = tokensFound.sort((a, b) => sortTokens(a, b, oppositeDirectionToken))
    return sortedTokens
  }, [tokenSearch, tokens, chains, oppositeDirectionToken])

  const sortedTokens = useMemo(() => {
    const tokensToDisplayFilteredBySelectedChain = (tokenSearch.length > 0 ? queryFilteredTokens : tokens).filter(t => {
      // Filter tokens based on the selected chain
      if (selectedChainId !== null) {
        return filterTokenForChain(t, selectedChainId)
      }

      return true
    })

    const { favoriteTokens, userTokens, popularTokens, unavailableTokens } =
      tokensToDisplayFilteredBySelectedChain.reduce(
        (acc, token) => {
          token.isFavorite = false
          // We shouldn't block tokens if we're in context of a fiat on-ramp or send view
          if (
            !isFiatOnRamp &&
            !isSendView &&
            isTokenBlocked({
              token,
              direction,
              fromToken,
              fromChain
            })
          ) {
            acc.unavailableTokens.push({
              type: 'token',
              element: {
                token,
                isUnavailable: true
              }
            })
          } else if (
            favoriteTokensList.some(
              favToken => favToken.chainId === token.chainId && favToken.address === token.address
            )
          ) {
            token.isFavorite = true
            acc.favoriteTokens.push({
              type: 'token',
              element: {
                token
              }
            })
          } else if (+token.balance > 0) {
            acc.userTokens.push({
              type: 'token',
              element: {
                token
              }
            })
          } else {
            acc.popularTokens.push({
              type: 'token',
              element: {
                token
              }
            })
          }
          return acc
        },
        {
          favoriteTokens: [],
          userTokens: [],
          popularTokens: [],
          unavailableTokens: []
        }
      )

    if (favoriteTokens.length > 0) {
      favoriteTokens.unshift({
        type: 'header',
        element: {
          title: 'Favorite tokens',
          icon: <HeartSmallIcon />
        }
      })
    }

    if (userTokens.length > 0) {
      userTokens.unshift({
        type: 'header',
        element: {
          title: 'Your tokens',
          icon: <CoinsIcon />
        }
      })
    }

    if (popularTokens.length > 0) {
      popularTokens.unshift({
        type: 'header',
        element: {
          title: 'Popular tokens',
          icon: <SparkleIcon />
        }
      })
    }

    if (unavailableTokens.length > 0) {
      unavailableTokens.unshift({
        type: 'header',
        element: {
          title: 'Unavailable for this route',
          icon: <CircleXFilledIcon size='16' />
        }
      })
    }

    return [...favoriteTokens, ...userTokens, ...popularTokens, ...unavailableTokens]
  }, [
    tokenSearch.length,
    queryFilteredTokens,
    tokens,
    selectedChainId,
    favoriteTokensList,
    direction,
    fromToken,
    fromChain
  ])

  const { queryFilteredChains, sortedChains } = useMemo(() => {
    const popularChains = []
    const otherChains = []

    const queryFilteredChains = chains.filter(c => {
      const matchesChainsSearch = stringIncludes(c.networkName, chainSearch)
      if (!matchesChainsSearch) return false
      const matchesTokenSearch = queryFilteredTokens.some(t => t.chainId === c.chainId)
      return matchesTokenSearch
    })

    for (const chain of queryFilteredChains) {
      if (POPULAR_CHAINS_IDS.includes(chain.chainId)) {
        popularChains.push(chain)
      } else {
        otherChains.push(chain)
      }
    }

    popularChains.sort((a, b) => {
      return POPULAR_CHAINS_IDS.indexOf(a.chainId) - POPULAR_CHAINS_IDS.indexOf(b.chainId)
    })
    // sort alphabetically by chain name
    otherChains.sort((a, b) => {
      return a.networkName.localeCompare(b.networkName)
    })

    const sortedChains = {
      popular: popularChains,
      other: otherChains
    }

    return {
      sortedChains,
      queryFilteredChains
    }
  }, [chains, queryFilteredTokens, chainSearch])

  const updateSelectedChain = useCallback(
    newChainId => {
      setSelectedChainId(newChainId)
      if (!isMobile) {
        searchInputRef.current?.focus()
      }

      if (tokensListRef.current) {
        tokensListRef.current.scrollToItem?.(0)
      }
    },
    [tokensListRef]
  )

  const matchesMobileLg = useMediaQuery(MEDIA_QUERIES.MOBILE_LG.media)
  const searchInputRef = useRef(null)
  const tokensListContainerRef = useRef(null)

  const onChainInputChange = useCallback(
    e => {
      setChainSearch(e.target.value)
      const searchMatchesSelectedChain = stringIncludes(selectedChain?.networkName, e.target.value)
      if (!searchMatchesSelectedChain) {
        setSelectedChainId(null)
      }
    },
    [selectedChain?.networkName]
  )

  const onTokenInputChange = useCallback(e => {
    setTokenSearch(e.target.value)
  }, [])

  useEffect(() => {
    if (sortedTokens.length === 0) {
      setSelectedChainId(null)
    }
  }, [sortedTokens.length])

  const headerSubtitle = useMemo(() => {
    if (isSendView) {
      return 'Select token to send'
    }
    if (isFiatOnRamp) {
      return 'Select token to buy'
    }

    return direction === 'from' ? 'Select token to swap' : 'Select token to receive'
  }, [direction, isFiatOnRamp, isSendView])

  useTrackSearchEmpty({
    resultsLength: queryFilteredTokens.length,
    searchQuery: tokenSearch,
    context: 'token'
  })

  useTrackSearchEmpty({
    resultsLength: queryFilteredChains.length,
    searchQuery: chainSearch,
    context: 'chain'
  })

  return (
    <div className='tw-flex tw-flex-col tw-h-full tw-max-h-full'>
      <NavigationBar hideTitle subtitle={headerSubtitle} />

      <div className='tw-px-squid-m tw-py-squid-xs tw-max-h-[60px] tw-gap-squid-xs tw-flex mobile-lg:!tw-gap-squid-m tw-w-full'>
        <div style={{ maxWidth: '150px' }} className='tw-block tw-w-full'>
          <Input
            spellCheck={false}
            autoComplete='off'
            autoCorrect='off'
            onChange={onChainInputChange}
            placeholder='Chain'
            className='tw-w-full'
          />
        </div>
        <Input
          spellCheck={false}
          autoComplete='off'
          autoCorrect='off'
          onChange={onTokenInputChange}
          autoFocus={!isMobile}
          placeholder='Token'
          inputRef={searchInputRef}
        />
      </div>

      <BorderedContainer className='tw-flex-grow tw-overflow-hidden'>
        <div
          className={clsx(
            'tw-grid tw-h-full',
            matchesMobileLg ? 'tw-grid-cols-[180px_299px]' : 'tw-grid-cols-[70px_1fr]'
          )}
        >
          <div
            style={{ height: '540px' }}
            className={clsx(
              'tw-gap-squid-xxs tw-flex tw-h-full tw-flex-col tw-overflow-y-auto tw-overflow-x-hidden tw-scrollbar-hidden',
              matchesMobileLg ? 'tw-w-[180px] tw-max-w-[180px] tw-pt-0' : 'tw-pt-squid-xs tw-w-[70px] tw-max-w-[70px]'
            )}
          >
            <ul className='tw-gap-squid-xxs tw-py-squid-xs tw-flex tw-flex-col'>
              <ListItem
                size='small'
                mainIcon={
                  <span className='tw-h-squid-l tw-w-squid-l tw-rounded-squid-xs tw-bg-royal-500 tw-flex tw-flex-1 tw-items-center tw-justify-center tw-text-[#FBFBFD]'>
                    <ChainLink size='24' />
                  </span>
                }
                itemTitle='All Chains'
                isSelected={selectedChainId === null}
                compactOnMobile
                rounded='xs'
                onClick={() => updateSelectedChain(null)}
              />

              {sortedChains.popular.length > 0 && (
                <SectionTitle
                  title='Popular chains'
                  icon={<SparkleIcon />}
                  className={clsx(matchesMobileLg ? 'tw-flex' : 'tw-hidden')}
                />
              )}

              {sortedChains.popular.map(item => (
                <ListItem
                  key={item.chainId}
                  size='small'
                  mainImageUrl={item.chainIconURI}
                  itemTitle={item.networkName}
                  detail={item.networkName}
                  isSelected={selectedChainId === item.chainId}
                  compactOnMobile
                  rounded='xs'
                  onClick={() => updateSelectedChain(item.chainId)}
                />
              ))}

              {sortedChains.other.length > 0 && (
                <SectionTitle
                  title='Chains A-Z'
                  icon={<ChainLink />}
                  className={clsx(matchesMobileLg ? 'tw-flex' : 'tw-hidden')}
                />
              )}

              {sortedChains.other.map(item => (
                <ListItem
                  key={item.chainId}
                  size='small'
                  mainImageUrl={item.chainIconURI}
                  itemTitle={item.networkName}
                  detail={item.networkName}
                  isSelected={selectedChainId === item.chainId}
                  compactOnMobile
                  rounded='xs'
                  onClick={() => updateSelectedChain(item.chainId)}
                />
              ))}
            </ul>
          </div>

          <div
            ref={tokensListContainerRef}
            className={clsx(
              'tw-gap-squid-xxs tw-flex tw-h-full tw-flex-col tw-overflow-y-auto tw-overflow-x-hidden tw-scrollbar-hidden',
              matchesMobileLg ? 'tw-w-[299px] tw-max-w-[299px]' : 'tw-w-full'
            )}
          >
            {unsupportedPairMessage && fromChain && selectedChain ? (
              <div className='tw-h-full tw-flex tw-items-center tw-justify-center'>
                <UnsupportedPairNotice
                  description={unsupportedPairMessage}
                  fromImageUrl={fromChain.chainIconURI}
                  toImageUrl={selectedChain.chainIconURI}
                />
              </div>
            ) : (
              sortedTokens.length > 0 && (
                <List
                  ref={tokensListRef}
                  itemCount={sortedTokens.length}
                  itemSize={55}
                  width='100%'
                  height={540}
                  className='tw-scrollbar-hidden tw-pb-squid-xxs'
                >
                  {({ index, style }) => {
                    const itemsSpacing = 5
                    const styleWithGap = {
                      ...style,
                      height: Number(style.height ?? 0) - itemsSpacing
                    }
                    const tokenOrHeader = sortedTokens[index]
                    if (!tokenOrHeader) return null

                    if (tokenOrHeader.type === 'header') {
                      return (
                        <li style={styleWithGap}>
                          <SectionTitle title={tokenOrHeader.element.title} icon={tokenOrHeader.element.icon} />
                        </li>
                      )
                    }

                    const { token, isUnavailable } = tokenOrHeader.element
                    const balanceFormatted = `${formatTokenAmount(token.balance, {
                      exact: false
                    })} ${token.symbol}`
                    const balanceLabel = +token.balance > 0 ? balanceFormatted : token.symbol
                    const tokenBalanceInUsd = formatUsdAmount(
                      convertTokenAmountToUSD(token.balance, token.usdPrice ?? 0)
                    )
                    const tokenCanBeAddedToWallet =
                      isEvmConnected &&
                      getChainType(token.chainId) === ChainType.EVM &&
                      token.address.toLowerCase() !== nativeEvmTokenAddress

                    const tokenExplorerLink = getTokenExplorerUrl({
                      tokenAddress: token.address,
                      chain: findChain(token.chainId)
                    })

                    return (
                      <ListItem
                        key={token.name + token.symbol + token.chainId}
                        containerProps={{
                          style: isUnavailable ? { ...styleWithGap, opacity: 0.5 } : styleWithGap
                        }}
                        size='large'
                        loading={{
                          subtitle: isFetchingBalances ? token.symbol : false
                        }}
                        mainImageUrl={getTokenImage(token)}
                        secondaryImageUrl={findChain(token.chainId)?.chainIconURI}
                        itemTitle={token.name}
                        subtitle={balanceLabel}
                        detailButtonClassName='fav-token-badge'
                        dropdownMenuContent={
                          !isUnavailable ? (
                            <>
                              {tokenCanBeAddedToWallet && (
                                <DropdownMenuItem
                                  label='Add to wallet'
                                  icon={<CirclePlusIcon />}
                                  onClick={() => {
                                    addTokenToWallet.mutate({
                                      chain: findChain(token.chainId),
                                      token
                                    })
                                  }}
                                />
                              )}
                              {tokenExplorerLink && (
                                <DropdownMenuItem
                                  label='View contract in explorer'
                                  icon={<CompassRoundSolidIcon />}
                                  link={tokenExplorerLink}
                                />
                              )}
                              <DropdownMenuItem
                                label={token.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                icon={token.isFavorite ? <BrokenHeartIcon /> : <FilledHeartIcon />}
                                onClick={() => {
                                  toggleFavoriteToken({
                                    address: token.address,
                                    chainId: token.chainId
                                  })
                                }}
                              />
                            </>
                          ) : undefined
                        }
                        itemsContainerRef={tokensListContainerRef}
                        subtitleOnHover={Number(token.balance) === 0 ? undefined : tokenBalanceInUsd}
                        rounded='full'
                        isSelected={
                          selectedToken?.address === token.address && selectedToken?.chainId === token.chainId
                        }
                        onClick={isUnavailable ? undefined : () => changeSwap(token)}
                      />
                    )
                  }}
                </List>
              )
            )}
          </div>
        </div>
      </BorderedContainer>
    </div>
  )
}

export const filterTokenForChain = (token, chainId) => {
  // if no chain is selected, return all tokens
  if (chainId === null) return true
  // else return tokens that match the chainId
  return token.chainId === chainId
}

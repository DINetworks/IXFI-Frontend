import { stepsForGasless } from 'src/configs/constant'
import { Box, Grid, Fab, Typography, Avatar } from '@mui/material'
import { truncateAddress, getApprovedTokens, getBalanceInApp, formatNumber } from 'src/wallet/utils'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ChainSelector from 'src/components/wallet/dialog/chain-selector'
import ApproveSelector from 'src/components/wallet/dialog/approve-selector'
import tokenData from 'src/configs/token-list.json'
import DisapproveSelector from 'src/components/wallet/dialog/disapprove-selector'

import { GATEWAY_CROSSFI } from 'src/configs/constant'
import GaslessTransfer from 'src/components/wallet/gasless-transfer'
import DepositWithdrawDialog from 'src/components/wallet/dialog/deposit-withdraw-dialog'
import { useAccount } from 'wagmi'

const GasLess = () => {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [reconfig, setReconfigApprove] = useState()
  const [tokenInChain, setTokenInChain] = useState([])
  const [credit, setCredit] = useState(0)
  const { address, chain } = useAccount()
  const [switchChainModal, setSwitchChainModal] = useState(false)
  const [approveTokenModal, setApproveTokenModal] = useState(false)
  const [disapproveTokenModal, setDisapproveTokenModal] = useState(false)
  const [depositModal, setDepositModal] = useState(false)
  const [isDeposit, setDeposit] = useState(true)
  const [approvedTokens, setApprovedTokens] = useState([])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (address && chain && chain.id) {
      const _tokenInChain = tokenData.filter(token => token.chainId == chain.id)
      setTokenInChain([..._tokenInChain])
      fetchCredit(chain, address)
    }
  }, [chain, address])

  useEffect(() => {
    if (address && chain && chain.id && tokenInChain.length > 0) {
      console.log('reconfig', reconfig)
      const delay = reconfig ? 3000 : 0
      setTimeout(() => {
        getApprovedTokens(chain, tokenInChain, address, GATEWAY_CROSSFI).then(_tokens => {
          // setApprovedTokens([..._tokens])
          console.log(_tokens)
          setApprovedTokens([..._tokens])
        })
      }, delay)
    }
  }, [address, chain, tokenInChain, reconfig])

  const openSwitchChainModal = () => {
    setSwitchChainModal(true)
  }

  const openApproveTokenModal = () => {
    setApproveTokenModal(true)
  }

  const openDisapproveTokenModal = () => {
    setDisapproveTokenModal(true)
  }

  const openDepositWithdrawModal = _isDeposit => {
    setDeposit(_isDeposit)
    setDepositModal(true)
  }

  const fetchCredit = (chain, address) => {
    getBalanceInApp(chain, address).then(balance => {
      const _balance = formatNumber(balance)
      setCredit(_balance ?? 0)
    })
  }

  const moveSwap = () => {
    router.push('/swap')
  }

  const ActionButton = ({ text, color, onClick }) => {
    return (
      <Fab
        variant='extended'
        size='large'
        color={color}
        className='connectinfo-btn'
        sx={{ margin: 2 }}
        onClick={onClick}
      >
        {text}
      </Fab>
    )
  }

  return (
    <section className='section_header-text-image'>
      <div className='container-large'>
        <div className='header-text-image_content'>
          <div className='margin-bottom margin-small'>
            <div className='margin-bottom margin-small'>
              <div className='text-align-center'>
                <div className='max-width-large align-center'>
                  <div className='margin-bottom margin-small'>
                    <h4 className='heading-style-h4'>
                      Steps For <span className='text-gradient-light-pink-lilac'> Gasless Transaction</span>!
                    </h4>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-layout-grid cards-small_component margin-bottom margin-large'>
              <div className='w-layout-grid cards-small_row'>
                {stepsForGasless.map((step, index) => (
                  <div key={index} className='card'>
                    <div className='card-content is-medium'>
                      <div className='cards-small_card-content-top'>
                        <div className='cards-small_icon-wrapper-wrapper margin-bottom margin-small'>
                          <div className='cards-steps_icon-wrapper'>
                            <img src={`/images/icons/${step.icon}`} alt='' className='icon-1x1-small' />
                          </div>
                        </div>
                        <div className='margin-bottom margin-xsmall'>
                          <h5 className='heading-style-h5 text-center'>{step.title}</h5>
                        </div>
                        <p>{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className='card inactive margin-bottom margin-large'>
              <div className='card-content is-medium'>
                <div className='cards-small_card-content-top'>
                  <div className='margin-bottom margin-xsmall'>
                    <Typography variant='h3' className='heading-style-h5' sx={{ color: 'white' }}>
                      <img src='/images/icons/wallet.svg' className='section-image' alt='' /> Wallet Information{' '}
                      {isClient && truncateAddress(address)}
                    </Typography>
                  </div>
                  <Grid
                    container
                    className='margin-bottom margin-small'
                    spacing={2}
                    sx={{ fontSize: '1.2rem', margin: '2rem' }}
                  >
                    <Grid item xs={3}>
                      <strong>Chain:</strong>{' '}
                      <Typography variant='h5' sx={{ color: '#00CFE8', mt: 2 }}>
                        {isClient && chain?.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <strong>Allowed Tokens:</strong>{' '}
                      <Box gap={2} sx={{ display: 'flex', alignItems: 'center', color: 'white', mt: 2 }}>
                        {approvedTokens.map((token, index) => (
                          <Box
                            key={index}
                            gap={1}
                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'cener' }}
                          >
                            <Avatar src={token.logoURI} alt={token.symbol} sx={{ width: 28, height: 28 }} />{' '}
                            <span>{token.symbol}</span>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={3}>
                      <strong>Credit:</strong>{' '}
                      <Typography variant='h5' sx={{ color: '#00CFE8' }}>
                        {credit}
                      </Typography>
                    </Grid>
                  </Grid>
                  <div className='text-center'>
                    <ActionButton text='Switch Chain' color='primary' onClick={openSwitchChainModal} />

                    <ActionButton text='Approve' color='info' onClick={openApproveTokenModal} />

                    <ActionButton text='Disapporve' color='warning' onClick={openDisapproveTokenModal} />

                    <ActionButton text='Deposit Gas' color='info' onClick={() => openDepositWithdrawModal(true)} />

                    <ActionButton text='Withdraw Gas' color='warning' onClick={() => openDepositWithdrawModal(false)} />
                  </div>

                  <ChainSelector openModal={switchChainModal} setOpenModal={setSwitchChainModal} />

                  <ApproveSelector
                    openModal={approveTokenModal}
                    setOpenModal={setApproveTokenModal}
                    tokenData={tokenInChain}
                    approvedTokens={approvedTokens}
                    setReconfigApprove={setReconfigApprove}
                  />

                  <DisapproveSelector
                    openModal={disapproveTokenModal}
                    setOpenModal={setDisapproveTokenModal}
                    approvedTokens={approvedTokens}
                    setReconfigApprove={setReconfigApprove}
                  />

                  <DepositWithdrawDialog
                    openModal={depositModal}
                    setOpenModal={setDepositModal}
                    isDeposit={isDeposit}
                  />
                </div>
              </div>
            </div>
            <GaslessTransfer approvedTokens={approvedTokens} />
            <div className='card is-pro' onClick={moveSwap}>
              <div className='card-content is-large'>
                <div className='features_image-wrapper'>
                  <img
                    src='https://cdn.prod.website-files.com/649412cd35852fa073a7748d/64fb16822c8463fec1a94e73_Auto-Sync your Portfolio.png'
                    alt=''
                    className='features-home_image is-large'
                  />
                </div>
                <div className='features_card-content-top'>
                  <div className='margin-bottom margin-xsmall'>
                    <h4>Would you like to perform token swaps using Gasless Transactions?</h4>
                  </div>
                  <Typography variant='h3' color='primary'>
                    Proceed to Gasless Swap
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GasLess

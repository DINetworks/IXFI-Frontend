import { stepsForGasless } from 'src/configs/constant'
import {
  Box,
  Grid,
  Fab,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  ListItemAvatar,
  Avatar
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useAccount, useChainId } from 'wagmi'
import { truncateAddress, getApprovedTokens } from 'src/wallet/utils'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ChainSelector from 'src/components/wallet/chain-selector'
import ApproveSelector from 'src/components/wallet/approve-selector'
import tokenData from 'src/configs/token-list.json'
import DisapproveSelector from 'src/components/wallet/disapprove-selector'

import { GATEWAY_CROSSFI } from 'src/configs/constant'
import GaslessTransfer from 'src/components/wallet/gasless-transfer'

const GasLess = () => {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [reconfig, setReconfigApprove] = useState()
  const [tokenInChain, setTokenInChain] = useState([])
  const { address, chain } = useAccount()
  const [switchChainModal, setSwitchChainModal] = useState(false)
  const [approveTokenModal, setApproveTokenModal] = useState(false)
  const [disapproveTokenModal, setDisapproveTokenModal] = useState(false)
  const [topupXFIModal, setTopupXFIModal] = useState(false)
  const [approvedTokens, setApprovedTokens] = useState([])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (address && chain && chain.id) {
      const _tokenInChain = tokenData.filter(token => token.chainId == chain.id)
      setTokenInChain([..._tokenInChain])
    }
  }, [chain])

  useEffect(() => {
    if (address && chain && chain.id && tokenInChain.length > 0) {
      getApprovedTokens(chain, tokenInChain, address, GATEWAY_CROSSFI).then(_tokens => {
        // setApprovedTokens([..._tokens])
        setApprovedTokens([...tokenInChain])
      })
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

  const openTopupXFIModal = () => {
    setTopupXFIModal(true)
  }

  const moveSwap = () => {
    router.push('/swap')
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
                    <Grid item xs={4}>
                      <strong>Chain:</strong>{' '}
                      <Typography variant='h5' sx={{ color: '#00CFE8' }}>
                        {isClient && chain?.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <strong>Allowed Tokens:</strong>{' '}
                      <Typography variant='h5' sx={{ color: '#00CFE8' }}>
                        $XFI{' '}
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <strong>XFI Balance:</strong>{' '}
                      <Typography variant='h5' sx={{ color: '#00CFE8' }}>
                        100
                      </Typography>
                    </Grid>
                  </Grid>
                  <div className='text-center'>
                    <Fab
                      variant='extended'
                      size='large'
                      color='primary'
                      className='connectinfo-btn'
                      sx={{ margin: 2 }}
                      onClick={openSwitchChainModal}
                    >
                      Switch Chain
                    </Fab>

                    <Fab
                      variant='extended'
                      size='large'
                      color='info'
                      className='connectinfo-btn'
                      sx={{ margin: 2 }}
                      onClick={openApproveTokenModal}
                    >
                      Approve
                    </Fab>

                    <Fab
                      variant='extended'
                      size='large'
                      color='warning'
                      className='connectinfo-btn'
                      sx={{ margin: 2 }}
                      onClick={openDisapproveTokenModal}
                    >
                      Disapprove
                    </Fab>

                    <Fab
                      variant='extended'
                      size='large'
                      color='info'
                      className='connectinfo-btn'
                      sx={{ margin: 2 }}
                      onClick={openTopupXFIModal}
                    >
                      Deposit XFI
                    </Fab>

                    <Fab
                      variant='extended'
                      size='large'
                      color='warning'
                      className='connectinfo-btn'
                      sx={{ margin: 2 }}
                      onClick={openTopupXFIModal}
                    >
                      Withdraw XFI
                    </Fab>
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

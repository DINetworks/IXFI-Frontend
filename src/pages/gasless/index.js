import { stepsForGasless } from 'src/configs/constant'
import { Box, Grid, Fab, Typography, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useAccount } from 'wagmi'
import { truncateAddress } from 'src/wallet/utils'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ChainSelector from 'src/components/wallet/chain-selector'

const defaultTransferItem = {
  token: '',
  receiver: '0x',
  amount: '0'
}

const GasLess = () => {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const { address, chain } = useAccount()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [switchChainModal, setSwitchChainModal] = useState(false)
  const [approveTokenModal, setApproveTokenModal] = useState(false)
  const [topupXFIModal, setTopupXFIModal] = useState(false)

  const [transfers, setTransfers] = useState([defaultTransferItem])

  const addMoreToken = () => {
    setTransfers(prevTransfers => [...prevTransfers, defaultTransferItem])
  }

  const handleInputChange = (index, field, value) => {
    const newTransfers = [...transfers]
    newTransfers[index][field] = value
    setTransfers(newTransfers)
  }

  const handleAmountChange = (index, value) => {
    // Ensure the value is a valid float or empty
    const floatValue = value === '' || !isNaN(parseFloat(value)) ? value : transfers[index].amount
    handleInputChange(index, 'amount', floatValue)
  }

  const openSwitchChainModal = () => {
    setSwitchChainModal(true)
  }

  const openApproveTokenModal = () => {
    setApproveTokenModal(true)
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
                      <div className='margin-top margin-small hide'>
                        <div className='button-group'>
                          <a className='button is-link is-icon w-inline-block interact-button'>
                            <div>Read more</div>
                            <div className='icon-embed-xxsmall w-embed'>
                              <img src='/images/icons/right-arrow.svg' alt='' />
                            </div>
                          </a>
                        </div>
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
                      color='primary'
                      className='connectinfo-btn'
                      sx={{ margin: 2 }}
                      onClick={openApproveTokenModal}
                    >
                      Approve/Disapprove
                    </Fab>

                    <Fab
                      variant='extended'
                      size='large'
                      color='primary'
                      className='connectinfo-btn'
                      sx={{ margin: 2 }}
                      onClick={openTopupXFIModal}
                    >
                      Top up XFI
                    </Fab>
                  </div>
                  <ChainSelector openModal={switchChainModal} setOpenModal={setSwitchChainModal} />
                </div>
              </div>
            </div>
            <div className='card inactive margin-bottom margin-large'>
              <div className='card-content is-medium'>
                <div className='cards-small_card-content-top'>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    className='margin-bottom margin-xsmall'
                  >
                    <Typography variant='h3' sx={{ color: 'white' }}>
                      <Icon icon='tabler:transfer' color='primary' /> Gasless Transfer (Batch)
                    </Typography>
                    <Fab color='info' size='small' onClick={addMoreToken}>
                      <Icon icon='tabler:plus' />
                    </Fab>
                  </Box>
                  <div className='margin-bottom margin-xxsmall'>
                    {transfers.map((transferItem, index) => (
                      <Grid key={index} container spacing={2} className='margin-bottom margin-xxsmall'>
                        <Grid item xs={12} md={4}>
                          <FormControl fullWidth>
                            <InputLabel id='demo-basic-select-outlined-label'>Token</InputLabel>
                            <Select
                              label='Age'
                              defaultValue=''
                              value={transferItem.token}
                              onChange={e => handleInputChange(index, 'token', e.target.value)}
                              labelId='demo-basic-select-outlined-label'
                            >
                              <MenuItem value=''>
                                <em>None</em>
                              </MenuItem>
                              <MenuItem value={10}>Ten</MenuItem>
                              <MenuItem value={20}>Twenty</MenuItem>
                              <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            required
                            fullWidth
                            label='Receiver'
                            variant='outlined'
                            value={transferItem.receiver}
                            onChange={e => handleInputChange(index, 'receiver', e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            required
                            fullWidth
                            label='Amount'
                            variant='outlined'
                            value={transferItem.amount}
                            inputProps={{ inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' }}
                            onChange={e => handleAmountChange(index, e.target.value)}
                          />
                        </Grid>
                      </Grid>
                    ))}
                  </div>
                  <Box sx={{ textAlign: 'right' }}>
                    <Fab variant='extended' size='large' color='primary' className='connectinfo-btn' sx={{ margin: 2 }}>
                      Transfer Tokens
                    </Fab>
                  </Box>
                </div>
              </div>
            </div>
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

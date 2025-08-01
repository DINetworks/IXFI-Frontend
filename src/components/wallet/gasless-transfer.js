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
import { useAccount } from 'wagmi'
import { useState } from 'react'
import { encodeAbiParameters, parseUnits } from 'viem'

import axios from 'axios'
import { showToast } from '../utils/toast'
import { generateEIP712Signature, getGatewayNonce } from 'src/wallet/utils'
import ConnectWallet from './dialog/connect-wallet'

const defaultTransferItem = {
  token: '',
  receiver: '0x',
  amount: '0'
}

const GaslessTransfer = ({ approvedTokens }) => {
  const { address, chain } = useAccount()
  const [transfers, setTransfers] = useState([{ ...defaultTransferItem }])

  const addMoreToken = () => {
    setTransfers([...transfers, { ...defaultTransferItem }])
  }

  const removeTransfer = index => {
    if (transfers.length > 1) setTransfers([...transfers.slice(0, index), ...transfers.slice(index + 1)])
  }

  const handleInputChange = (index, field, value) => {
    const newTransfers = [...transfers]
    newTransfers[index][field] = value
    setTransfers([...newTransfers])
  }

  const handleAmountChange = (index, value) => {
    const floatValue = value === '' || !isNaN(parseFloat(value)) ? value : transfers[index].amount
    handleInputChange(index, 'amount', floatValue)
  }

  const transferTokens = async () => {
    try {
      // First ensure wallet is connected
      if (!window.ethereum?.isConnected?.()) {
        await window.ethereum?.request?.({ method: 'eth_requestAccounts' })
      }

      // Prepare transfer data
      const targets = transfers.map(transfer => transfer.token)
      const recipients = transfers.map(transfer => transfer.receiver)

      const amounts = transfers.map(transfer => {
        const tokenData = approvedTokens.find(token => token.address == transfer.token)
        const decimals = tokenData.decimals

        return parseUnits(transfer.amount.toString(), decimals)
      })

      // Get nonce
      const nonce = await getGatewayNonce(chain, address)

      // Encode and hash data
      const transferData = encodeAbiParameters(
        [{ type: 'address[]' }, { type: 'address[]' }, { type: 'uint256[]' }],
        [targets, recipients, amounts]
      )

      const signature = await generateEIP712Signature(chain, address, transferData, nonce)

      // Send to relayer
      const relayerHost = process.env.NEXT_PUBLIC_RELAYER_HOST
      const endpoint = `${relayerHost}/relay`

      const params = {
        sender: address,
        transferData,
        nonce: nonce.toString(),
        signature
      }

      const response = await axios.post(endpoint, params)

      showToast('success', `Batch Transfers\n TxId: ${response.data.transactionHash}`)
    } catch (error) {
      showToast('error', `${error}`)
      throw error
    }
  }

  return (
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
          {address ? (
            <div className='margin-bottom margin-xxsmall'>
              {transfers.map((transferItem, index) => (
                <Grid key={index} container spacing={2} className='margin-bottom margin-xxsmall'>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Token</InputLabel>
                      <Select
                        label='Token'
                        value={transferItem.token}
                        onChange={e => handleInputChange(index, 'token', e.target.value)}
                        renderValue={selected => {
                          // Find the selected token from the list
                          const selectedToken = approvedTokens.find(token => token.address === selected)

                          return selectedToken ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                size='small'
                                src={selectedToken.logoURI}
                                alt={selectedToken.symbol}
                                sx={{ marginRight: 1, width: 22, height: 22 }}
                              />
                              <Typography variant='body1'>{selectedToken.symbol}</Typography>
                            </Box>
                          ) : (
                            <em>None</em>
                          )
                        }}
                      >
                        <MenuItem value=''>
                          <em>None</em>
                        </MenuItem>
                        {approvedTokens.map((token, index) => (
                          <MenuItem
                            key={index}
                            sx={{
                              borderRadius: '8px',
                              cursor: 'pointer',
                              padding: '8px 16px'
                            }}
                            value={token.address}
                          >
                            <ListItemAvatar>
                              <Avatar src={token.logoURI} alt={token.symbol} />
                            </ListItemAvatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant='body1'>{token.symbol}</Typography>
                              <Typography variant='body2' color='text.secondary'>
                                {token.name}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
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
                  <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      required
                      fullWidth
                      label='Amount'
                      variant='outlined'
                      value={transferItem.amount}
                      sx={{ mr: 3 }}
                      inputProps={{ inputMode: 'decimal', pattern: '[0-9]*[.,]?[0-9]*' }}
                      onChange={e => handleAmountChange(index, e.target.value)}
                    />

                    <Fab color='black' size='small' onClick={() => removeTransfer(index)}>
                      <Icon icon='tabler:minus' />
                    </Fab>
                  </Grid>
                </Grid>
              ))}
            </div>
          ) : (
            <div className='text-center'>
              <ConnectWallet />
            </div>
          )}
          {address && (
            <Box sx={{ textAlign: 'right' }}>
              <Fab
                variant='extended'
                size='large'
                color='primary'
                className='connectinfo-btn'
                sx={{ margin: 2 }}
                onClick={transferTokens}
              >
                <Icon icon={`tabler:moneybag-move`} fontSize='1.5rem' />
                <span style={{ marginLeft: '8px' }}>Transfer Tokens</span>
              </Fab>
            </Box>
          )}
        </div>
      </div>
    </div>
  )
}

export default GaslessTransfer

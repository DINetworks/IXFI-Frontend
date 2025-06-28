import { Box, Chip, Typography } from '@mui/material'
import { BetweenBox } from 'src/components/base/grid'
import { CHAIN_LOGOS } from 'src/configs/constant'

const PoolItem = props => {
  const {
    pool,
    pool: { chainId, feeTier, apr, tokens },
    handleClick
  } = props

  const onClick = () => handleClick(pool)

  return (
    <BetweenBox
      className='pool-item'
      onClick={onClick}
    >
      <Box
        display='flex'
        alignItems='baseline'
      >
        <img
          src={tokens[0].logoURI}
          className='earn-token'
          alt='main-token'
        />
        <img
          src={tokens[1].logoURI}
          className='earn-token'
          style={{ marginLeft: '-8px' }}
          alt='pair-token'
        />
        <img
          src={CHAIN_LOGOS[chainId]}
          className='earn-chain'
          alt='chain-icon'
        />
      </Box>
      <Box
        display='flex'
        alignItems='center'
      >
        <Typography>{tokens[0].symbol}</Typography>
        <Typography>/</Typography>
        <Typography>{tokens[1].symbol}</Typography>
      </Box>
      <Chip label={`${feeTier}%`}></Chip>

      <Typography color={'green'}>{apr.toFixed(2)}%</Typography>
    </BetweenBox>
  )
}

export default PoolItem

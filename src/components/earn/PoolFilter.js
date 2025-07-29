import { Icon } from '@iconify/react'
import CustomTextField from 'src/@core/components/mui/text-field'
import { BetweenBox, CenterBox } from 'src/components/base/grid'
import { CHAIN_LOGOS, EARN_CHAINS, SUPPORT_CHAINS } from 'src/configs/constant'
import { MenuItem } from '@mui/material'
import { useEarnPools } from 'src/hooks/useEarnPools'

const PoolFilter = () => {
  const { chainId, protocol, protocols, interval, query, setSearchParam } = useEarnPools()

  const intervals = ['24h', '7d', '30d']

  const handleChainChange = event => {
    setSearchParam({ chainId: event.target.value, protocol: 'all', page: 1 })
  }

  const handleProtocolChange = event => {
    setSearchParam({ protocol: event.target.value, page: 1 })
  }

  const handleIntervalChange = event => {
    setSearchParam({ interval: event.target.value })
  }

  const handleKeywordChange = event => {
    setSearchParam({ query: event.target.value, page: 1 })
  }

  return (
    <BetweenBox mt={4}>
      <CenterBox gap={2}>
        <CustomTextField
          select
          size='medium'
          value={chainId}
          onChange={handleChainChange}
        >
          {EARN_CHAINS.map((cid, index) => (
            <MenuItem
              key={index}
              value={cid}
            >
              <img
                src={CHAIN_LOGOS[cid]}
                alt={SUPPORT_CHAINS[cid]}
                className='chain-selector-icon small margin-right margin-xxsmall'
              />
              {SUPPORT_CHAINS[cid]}
            </MenuItem>
          ))}
        </CustomTextField>

        <CustomTextField
          select
          size='medium'
          value={protocol}
          onChange={handleProtocolChange}
        >
          <MenuItem value='all'>All Protocols</MenuItem>
          {protocols.map((_protocol, index) => (
            <MenuItem
              key={index}
              value={_protocol.id}
            >
              <img
                src={_protocol.logo}
                alt={_protocol.name}
                className='chain-selector-icon small margin-right margin-xxsmall'
              />
              {_protocol.name}
            </MenuItem>
          ))}
        </CustomTextField>

        <CustomTextField
          select
          size='medium'
          value={interval}
          id='interval-select'
          onChange={handleIntervalChange}
        >
          {intervals.map((_interval, index) => (
            <MenuItem
              key={index}
              value={_interval}
            >
              {_interval}
            </MenuItem>
          ))}
        </CustomTextField>
      </CenterBox>

      <CustomTextField
        value={query}
        onChange={handleKeywordChange}
        size='medium'
        placeholder='Search by token symbol or address'
        width='300px'
        InputProps={{
          endAdornment: (
            <Icon
              fontSize='1.25rem'
              icon={'tabler:search'}
            />
          )
        }}
      />
    </BetweenBox>
  )
}

export default PoolFilter

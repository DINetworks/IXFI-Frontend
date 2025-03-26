import { FixedSizeList } from 'react-window'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import { Switch } from '@mui/material'

const Row = ({ index, style, data }) => {
  const { tokenData, manageToken } = data
  const token = tokenData[index]

  const handleSwitchChange = value => {
    manageToken(token.address, value)
  }

  return (
    <ListItem
      style={style}
      key={index}
      secondaryAction={<Switch color='info' onChange={e => handleSwitchChange(e.target.checked)} />}
      sx={{
        '&:hover': {
          backgroundColor: 'action.hover'
        }
      }}
    >
      <ListItemAvatar>
        <Avatar src={token.logoURI} alt={token.symbol} />
      </ListItemAvatar>
      <div>
        <ListItemText primary={token.symbol} primaryTypographyProps={{ fontWeight: 'medium' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ marginInlineEnd: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant='body2' color='text.secondary'>
              {token.name}
            </Typography>
          </Box>
        </Box>
      </div>
    </ListItem>
  )
}

const TokenSelector = ({ tokenData, manageToken }) => {
  return (
    <FixedSizeList
      height={420}
      width='100%'
      itemSize={72}
      itemCount={tokenData.length}
      itemData={{ tokenData, manageToken }}
      overscanCount={5}
    >
      {Row}
    </FixedSizeList>
  )
}

export default TokenSelector

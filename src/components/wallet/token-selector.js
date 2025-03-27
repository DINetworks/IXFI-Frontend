import { FixedSizeList } from 'react-window'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import { Switch } from '@mui/material'
import { useState } from 'react'

const Row = ({ index, style, data }) => {
  const { tokenData, activeIndex, setActiveIndex } = data
  const token = tokenData[index]

  const itemClick = () => {
    if (activeIndex != index) setActiveIndex(index)
  }

  return (
    <ListItem
      style={style}
      key={index}
      onClick={itemClick}
      sx={{
        borderRadius: '8px',
        cursor: 'pointer',
        backgroundColor: activeIndex == index ? 'var(--violet)' : '',
        '&:hover': {
          backgroundColor: activeIndex == index ? 'var(--violet)' : 'action.hover'
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

const TokenSelector = ({ tokenData, activeIndex, setActiveIndex }) => {
  return (
    <FixedSizeList
      height={420}
      width='100%'
      itemSize={72}
      itemCount={tokenData.length}
      itemData={{ tokenData, activeIndex, setActiveIndex }}
      overscanCount={5}
    >
      {Row}
    </FixedSizeList>
  )
}

export default TokenSelector

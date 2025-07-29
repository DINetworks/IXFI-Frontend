import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

export const Grid2 = styled(Box)(({ theme }) => ({
  display: 'grid',
  [theme.breakpoints.down('md')]: { gridTemplateColumns: '1fr' },
  [theme.breakpoints.up('md')]: { gridTemplateColumns: '1fr 1fr' },
  rowGap: 12,
  columnGap: 24
}))

export const Grid2L = styled(Box)(({ theme }) => ({
  display: 'grid',
  [theme.breakpoints.down('md')]: { gridTemplateColumns: '1fr' },
  [theme.breakpoints.up('md')]: { gridTemplateColumns: '1fr 1.2fr' },
  gap: 12
}))

export const Grid3 = styled(Box)(({ theme }) => ({
  display: 'grid',
  [theme.breakpoints.down('md')]: { gridTemplateColumns: '1fr' },
  [theme.breakpoints.up('md')]: { gridTemplateColumns: '1fr 1fr 1fr' },
  rowGap: 12,
  columnGap: 24
}))

export const Grid4 = styled(Box)(({ theme }) => ({
  display: 'grid',
  [theme.breakpoints.down('md')]: { gridTemplateColumns: '1fr' },
  [theme.breakpoints.between('md', 'lg')]: { gridTemplateColumns: '1fr 1fr' },
  [theme.breakpoints.up('lg')]: { gridTemplateColumns: '1fr 1fr 1fr 1fr' },
  gap: 18
}))

export const BetweenBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})

export const CenterBox = styled(Box)({
  display: 'flex',
  alignItems: 'center'
})

export const FullCenterBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})

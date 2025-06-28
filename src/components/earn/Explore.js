import Link from 'next/link'
import { Icon } from '@iconify/react'
import { Box, Button, Typography } from '@mui/material'
import { CenterBox, FullCenterBox, Grid2 } from 'src/components/base/grid'
import { EARN_PAGES } from 'src/configs/constant'

const ExploreEarn = () => {
  return (
    <Box mt={12}>
      <Grid2 gap={24}>
        {EARN_PAGES.map((page, index) => (
          <Link className='nav-link' href={page.link} key={index}>
            <Box className={`card`}>
              <Box className='card-content is-small'>
                <CenterBox gap={3}>
                  <Icon icon={page.icon} fontSize='2rem' color='#8833cc' />
                  <Typography variant='h4' color={'#fff'}>
                    {page.title}
                  </Typography>
                </CenterBox>
                <Typography variant='h5'>{page.description}</Typography>
                <FullCenterBox mt={2}>
                  <Button variant='contained'>{page.button}</Button>
                </FullCenterBox>
              </Box>
            </Box>
          </Link>
        ))}
      </Grid2>
    </Box>
  )
}

export default ExploreEarn

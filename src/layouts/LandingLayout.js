import useMediaQuery from '@mui/material/useMediaQuery'
import AppHeader from './base/Header'
import AppFooter from './base/Footer'

const Layout = ({ children }) => {
  return (
    <div className='page-wrapper main-background-hero'>
      <AppHeader />
      {children}
      <AppFooter />
    </div>
  )
}

export default Layout

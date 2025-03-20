import AppHeader from './base/Header'
import AppFooter from './base/Footer'
import { useRouter } from 'next/router'

const Layout = ({ children }) => {
  const router = useRouter()
  const topBgClass = router.pathname == '/' || router.pathname == '' ? 'main-background-hero' : 'pro-background-hero'

  console.log(router.pathname)

  return (
    <div className={`page-wrapper ${topBgClass}`}>
      <AppHeader />
      {children}
      <AppFooter />
    </div>
  )
}

export default Layout

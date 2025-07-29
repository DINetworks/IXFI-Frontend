import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import ConnectWallet from 'src/components/wallet/dialog/connect-wallet'

const Header = () => {
  const router = useRouter()
  const [isDropdownVisible, setDropdownVisible] = useState(false)
  const [isNavButtonVisible, setNavButtonVisible] = useState(false)

  const handleMouseEnter = () => {
    setDropdownVisible(true)
  }

  const handleMouseLeave = () => {
    setDropdownVisible(false)
  }

  const scrollToDownload = () => {
    const section = document.getElementById('download-section')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navbarOpen = () => {
    setNavButtonVisible(!isNavButtonVisible)
  }

  const dropdownMenuClass = isDropdownVisible ? 'w--open' : ''

  const navMenuActiveClass = route => (router.pathname.includes(route) ? 'w--current' : '')

  const flexOrNone = isNavButtonVisible ? 'flex' : ''

  return (
    <div className='navbar_component w-nav'>
      <div className='navbar_container'>
        <Link href={'/'} className='navbar_logo-link test w-nav-brand'>
          <img src='/images/logo.png' alt='Logo' className='site-logo' />
        </Link>
        <div className='navbar_menu w-nav-menu'>
          <Link href={'/gasless'} className={`navbar_link w-nav-link ${navMenuActiveClass('/gasless')}`}>
            Gasless
          </Link>
          <Link href={'/swap'} className={`navbar_link w-nav-link ${navMenuActiveClass('/swap')}`}>
            Swap
          </Link>
          <Link href={'/earn'} className={`navbar_link w-nav-link ${navMenuActiveClass('/earn')}`}>
            Earn
          </Link>
          <div
            className='navbar_menu-dropdown w-dropdown'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className='navbar_dropdwn-toggle w-dropdown-toggle'>
              <div className='dropdown-icon w-embed'>
                <img src='/images/icons/dropdown.svg' alt='' />
              </div>
              <div>Network</div>
            </div>
            <nav className={`navbar_dropdown-list w-dropdown-list ${dropdownMenuClass}`}>
              <div className='navbar_dropdown-grid'>
                <a className='navbar_dropdown-link w-dropdown-link w--current'>Staking</a>
                <a className='navbar_dropdown-link w-dropdown-link'>Governance</a>
                <a className='navbar_dropdown-link w-dropdown-link'>IXN</a>
                <Link
                  href={'/about'}
                  className={`navbar_dropdown-link w-dropdown-link ${navMenuActiveClass('/about')}`}
                >
                  About
                </Link>
              </div>
            </nav>
          </div>
          <a target='_blank' className='navbar_link w-nav-link' href='https://docs.ixfi.fi'>
            Documentation
          </a>
          <div className='nav-background-blur'></div>
        </div>
        <div className='navbar_button-wrapper'>
          <ConnectWallet />
          <div onClick={navbarOpen} className='navbar_menu-button w-nav-button'>
            <div className='menu-icon2'>
              <div className='menu-icon2_line-top'></div>
              <div className='menu-icon2_line-middle'>
                <div className='menu-icon_line-middle-inner'></div>
              </div>
              <div className='menu-icon2_line-bottom'></div>
            </div>
          </div>
        </div>
        <div className={`mobile_menu ${flexOrNone}`}>
          <div className='mobile_menu-link-wrapper'>
            <Link href={'/'} className='navbar_link w-nav-link'>
              Home
            </Link>
          </div>
          <div className='mobile_menu-link-wrapper'>
            <div className='heading-style-subtitle-tiny'>Ecosystems</div>
            <div className='mobile_menu-subgrid'>
              <Link href={'/gasless'} className={`navbar_link is-subitem w-nav-link`}>
                Gasless
              </Link>
              <Link href={'/swap'} className={`navbar_link is-subitem w-nav-link`}>
                Swap
              </Link>
              <Link href={'/lending'} className={`navbar_link is-subitem w-nav-link`}>
                Lending
              </Link>
              <Link href={'/lending'} className={`navbar_link is-subitem w-nav-link`}>
                Earn
              </Link>
            </div>
          </div>
          <div className='mobile_menu-link-wrapper'>
            <Link href={'/lending'} className={`navbar_link is-subitem w-nav-link`}>
              About
            </Link>
          </div>
          <div className='mobile_menu-link-wrapper'>
            <Link href={'/lending'} className={`navbar_link is-subitem w-nav-link`}>
              Documentation
            </Link>
          </div>
          <a target='_blank' className='button is-mobile-button w-button'>
            Download
          </a>
        </div>
      </div>
    </div>
  )
}

export default Header

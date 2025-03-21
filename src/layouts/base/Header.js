import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'

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

  const dropdownMenuClass = isDropdownVisible ? 'w--open' : ''

  const navMenuActiveClass = route => (router.pathname.includes(route) ? 'w--current' : '')

  const scrollToDownload = () => {
    const section = document.getElementById('download-section')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navbarOpen = () => {
    setNavButtonVisible(!isNavButtonVisible)
  }

  const flexOrNone = isNavButtonVisible ? 'flex' : ''

  return (
    <div className='navbar_component w-nav'>
      <div className='navbar_container'>
        <Link href={'/'} className='navbar_logo-link test w-nav-brand interact-button'>
          <img src='/images/logo.png' alt='Logo' className='site-logo' />
        </Link>
        <div className='navbar_menu w-nav-menu'>
          <Link
            href={'/gasless'}
            className={`navbar_link w-nav-link interact-button ${navMenuActiveClass('/gasless')}`}
          >
            Gasless
          </Link>
          <Link href={'/swap'} className={`navbar_link w-nav-link interact-button ${navMenuActiveClass('/swap')}`}>
            Swap
          </Link>
          <Link
            href={'/lending'}
            className={`navbar_link w-nav-link interact-button ${navMenuActiveClass('/lending')}`}
          >
            Lending
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
                <a className='navbar_dropdown-link w-dropdown-link w--current interact-button'>Staking</a>
                <a className='navbar_dropdown-link w-dropdown-link interact-button'>Governance</a>
                <a className='navbar_dropdown-link w-dropdown-link interact-button'>IXN</a>
              </div>
            </nav>
          </div>
          <a className='navbar_link w-nav-link interact-button'>Documentation</a>
          <div className='nav-background-blur'></div>
        </div>
        <div className='navbar_button-wrapper'>
          <button onClick={scrollToDownload} className='button is-navbar-button w-button interact-button'>
            Download
          </button>
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
            <a className='navbar_link w-nav-link interact-button'>Home</a>
          </div>
          <div className='mobile_menu-link-wrapper'>
            <div className='heading-style-subtitle-tiny'>Trackers</div>
            <div className='mobile_menu-subgrid'>
              <a aria-current='page' className='navbar_link is-subitem w-nav-link w--current interact-button'>
                Crypto
              </a>
              <a className='navbar_link is-subitem w-nav-link interact-button'>Stocks</a>
              <a className='navbar_link is-subitem w-nav-link interact-button'>NFTs</a>
              <a className='navbar_link is-subitem w-nav-link interact-button'>Funds</a>
              <a className='navbar_link is-subitem w-nav-link interact-button'>Indices</a>
              <a className='navbar_link is-subitem w-nav-link interact-button'>Commodities</a>
              <a className='navbar_link is-subitem w-nav-link interact-button'>Forex</a>
            </div>
          </div>
          <div className='mobile_menu-link-wrapper'>
            <a className='navbar_link w-nav-link interact-button'>Features</a>
          </div>
          <div className='mobile_menu-link-wrapper is-last'>
            <a className='navbar_link w-nav-link interact-button'>Get PRO</a>
          </div>
          <a target='_blank' className='button is-mobile-button w-button interact-button'>
            Download
          </a>
        </div>
      </div>
    </div>
  )
}

export default Header

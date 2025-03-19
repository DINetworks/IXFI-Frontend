const Header = () => {
  return (
    <div className='navbar_component w-nav'>
      <div className='navbar_container'>
        <a className='navbar_logo-link test w-nav-brand interact-button'>
          <img src='./images/logo.png' alt='Logo' className='site-logo' />
        </a>
        <div id='navbar_menu' className='navbar_menu w-nav-menu'>
          <div className='navbar_menu-dropdown w-dropdown'>
            <div
              className='navbar_dropdwn-toggle w-dropdown-toggle'
              id='w-dropdown-toggle-0'
              aria-controls='w-dropdown-list-0'
              aria-haspopup='menu'
              aria-expanded='false'
              role='button'
              tabindex='0'
            >
              <div className='dropdown-icon w-embed'>
                <svg width=' 100%' height=' 100%' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M2.55806 6.29544C2.46043 6.19781 2.46043 6.03952 2.55806 5.94189L3.44195 5.058C3.53958 4.96037 3.69787 4.96037 3.7955 5.058L8.00001 9.26251L12.2045 5.058C12.3021 4.96037 12.4604 4.96037 12.5581 5.058L13.4419 5.94189C13.5396 6.03952 13.5396 6.19781 13.4419 6.29544L8.17678 11.5606C8.07915 11.6582 7.92086 11.6582 7.82323 11.5606L2.55806 6.29544Z'
                    fill='currentColor'
                  ></path>
                </svg>
              </div>
              <div>Trackers</div>
            </div>
            <nav
              className='navbar_dropdown-list w-dropdown-list'
              id='w-dropdown-list-0'
              aria-labelledby='w-dropdown-toggle-0'
            >
              <div className='navbar_dropdown-grid'>
                <a
                  aria-current='page'
                  className='connectButton navbar_dropdown-link w-dropdown-link w--current interact-button'
                  tabindex='0'
                >
                  Crypto{' '}
                </a>
                <a className='connectButton navbar_dropdown-link w-dropdown-link interact-button' tabindex='0'>
                  Commodities
                </a>
                <a className='connectButton navbar_dropdown-link w-dropdown-link interact-button' tabindex='0'>
                  Stocks
                </a>
                <a className='connectButton navbar_dropdown-link w-dropdown-link interact-button' tabindex='0'>
                  Indices
                </a>
                <a className='connectButton navbar_dropdown-link w-dropdown-link interact-button' tabindex='0'>
                  NFTs
                </a>
                <a className='connectButton navbar_dropdown-link w-dropdown-link interact-button' tabindex='0'>
                  Forex
                </a>
                <a className='connectButton navbar_dropdown-link w-dropdown-link interact-button' tabindex='0'>
                  Funds
                </a>
              </div>
            </nav>
          </div>
          <a className='connectButton navbar_link w-nav-link interact-button'>Leaderboard</a>
          <a className='connectButton navbar_link w-nav-link interact-button'>Get PRO</a>
          <a target='_blank' className='connectButton navbar_link w-nav-link interact-button'>
            Airdrops
          </a>
          <a className='connectButton button is-secondary is-small is-navbar w-button interact-button show'>
            Check Now
          </a>
          <div className='nav-background-blur'></div>
        </div>
        <div id='w-node-_9808c09c-041a-d6d4-c3be-ab9cddd7a758-ddd7a741' className='navbar_button-wrapper'>
          <a className='connectButton button is-navbar-button w-button interact-button'>Try It Now</a>
          <div
            data-w-id='9808c09c-041a-d6d4-c3be-ab9cddd7a75b'
            className='navbar_menu-button w-nav-button'
            aria-label='menu'
            role='button'
            tabindex='0'
            aria-controls='w-nav-overlay-0'
            aria-haspopup='menu'
            aria-expanded='false'
          >
            <div className='menu-icon2'>
              <div className='menu-icon2_line-top'></div>
              <div className='menu-icon2_line-middle'>
                <div className='menu-icon_line-middle-inner'></div>
              </div>
              <div className='menu-icon2_line-bottom'></div>
            </div>
          </div>
        </div>
        <div id='w-node-_2e14337d-80c2-4b70-cd3e-4ba19a3f3884-ddd7a741' className='mobile_menu'>
          <div className='mobile_menu-link-wrapper'>
            <a className='navbar_link w-nav-link interact-button'>Home</a>
          </div>
          <div className='mobile_menu-link-wrapper'>
            <div className='heading-style-subtitle-tiny'>Trackers</div>
            <div className='mobile_menu-subgrid'>
              <a aria-current='page' className='navbar_link is-subitem w-nav-link w--current interact-button'>
                Crypto
              </a>
              <a className='connectButton navbar_link is-subitem w-nav-link interact-button'>Stocks</a>
              <a className='connectButton navbar_link is-subitem w-nav-link interact-button'>NFTs</a>
              <a className='connectButton navbar_link is-subitem w-nav-link interact-button'>Funds</a>
              <a className='connectButton navbar_link is-subitem w-nav-link interact-button'>Indices</a>
              <a className='connectButton navbar_link is-subitem w-nav-link interact-button'>Commodities</a>
              <a className='connectButton navbar_link is-subitem w-nav-link interact-button'>Forex</a>
            </div>
          </div>
          <div className='mobile_menu-link-wrapper'>
            <a className='connectButton navbar_link w-nav-link interact-button'>Features</a>
          </div>
          <div className='mobile_menu-link-wrapper is-last'>
            <a className='connectButton navbar_link w-nav-link interact-button'>Get PRO</a>
          </div>
          <a target='_blank' className='connectButton button is-mobile-button w-button interact-button'>
            Check Now
          </a>
        </div>
      </div>
    </div>
  )
}

export default Header

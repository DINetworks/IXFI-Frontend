const AppFooter = () => {
  return (
    <footer className='footer_component'>
      <div className='padding-global'>
        <div className='container-large'>
          <div className='padding-vertical padding-xxlarge'>
            <div className='padding-bottom padding-xxlarge'>
              <div className='w-layout-grid footer_top-wrapper'>
                <div className='footer_link-list'>
                  <div className='footer_column-heading'>Gasless</div>
                </div>
                <div className='footer_link-list'>
                  <div className='footer_column-heading'>Swap</div>
                </div>
                <div className='footer_link-list'>
                  <div className='footer_column-heading'>Lending</div>
                </div>
                <div className='footer_link-list'>
                  <div className='footer_column-heading'>Network</div>
                  <a className='footer_link not_clickable '>Staking</a>
                  <a className='footer_link not_clickable '>Governance</a>
                  <a className='footer_link not_clickable '>IXN</a>
                </div>
                <div className='footer_link-list'>
                  <div className='footer_column-heading'>Documentation</div>
                </div>
              </div>
            </div>
            <div>
              <div className='w-layout-grid footer_bottom'>
                <div className='footer_row1'>
                  <a className='footer_logo-link w-nav-brand '>
                    <img src='/images/logo.png' alt='Logo' className='site-logo' />
                  </a>
                  <div className='w-layout-grid footer_social-list'>
                    <a target='_blank' className='footer_social-link w-inline-block '>
                      <div className='social-icon w-embed'>
                        <img src='/images/icons/facebook.svg' alt='' />
                      </div>
                    </a>
                    <a target='_blank' className='footer_social-link w-inline-block '>
                      <div className='social-icon w-embed'>
                        <img src='/images/icons/instagram.svg' alt='' />
                      </div>
                    </a>
                    <a target='_blank' className='footer_social-link w-inline-block '>
                      <div className='social-icon w-embed'>
                        <img src='/images/icons/discord.svg' alt='' />
                      </div>
                    </a>
                    <a target='_blank' className='footer_social-link w-inline-block '>
                      <div className='social-icon w-embed'>
                        <img src='/images/icons/twitter.svg' alt='' />
                      </div>
                    </a>
                    <a target='_blank' className='footer_social-link w-inline-block '>
                      <div className='social-icon w-embed'>
                        <img src='/images/icons/linkedin.svg' alt='' />
                      </div>
                    </a>
                    <a target='_blank' className='footer_social-link w-inline-block '>
                      <div className='social-icon w-embed'>
                        <img src='/images/icons/youtube.svg' alt='' />
                      </div>
                    </a>
                  </div>
                </div>
                <div className='footer_row2'>
                  <a className='footer_legal-text '>© 2025. DI Networks - IXFI Labs. All right reserved.</a>
                  <div className='w-layout-grid footer_link-list-horizontal'>
                    <a className='footer_legal-link '>Privacy Policy</a>
                    <a className='footer_legal-link '>Terms of Service</a>
                    <a className='footer_legal-link '>Cookies Settings</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default AppFooter

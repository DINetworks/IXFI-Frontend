const AppFooter = () => {
  return (
    <footer className='footer_component'>
      <div className='padding-global'>
        <div className='container-large'>
          <div className='padding-vertical padding-xxlarge'>
            <div className='padding-bottom padding-xxlarge'>
              <div className='w-layout-grid footer_top-wrapper'>
                <div className='connectButton footer_link-list'>
                  <div className='footer_column-heading'>Trackers</div>
                  <a className='connectButton footer_link interact-button'>Stocks</a>
                  <a className='connectButton footer_link w--current interact-button'>Crypto</a>
                  <a className='connectButton footer_link interact-button'>NFTs</a>
                  <a className='connectButton footer_link interact-button'>Commodities</a>
                  <a className='connectButton footer_link interact-button'>Funds</a>
                  <a className='connectButton footer_link interact-button'>Forex</a>
                  <a className='connectButton footer_link interact-button'>Indices</a>
                </div>
                <div className='connectButton footer_link-list'>
                  <div className='footer_column-heading'>Features</div>
                  <a className='connectButton footer_link interact-button'>Following</a>
                  <a className='connectButton footer_link interact-button'>Price tracking</a>
                  <a className='connectButton footer_link interact-button'>PRO</a>
                  <a className='connectButton footer_link interact-button'>Auto-Sync</a>
                  <a className='connectButton footer_link interact-button'>Fear &amp; Greed Index</a>
                  <a className='connectButton footer_link interact-button'>Daily Recap</a>
                  <a className='connectButton footer_link interact-button'>View more</a>
                </div>
                <div className='connectButton footer_link-list'>
                  <div className='footer_column-heading'>About</div>
                  <a className='connectButton footer_link interact-button'>About Uniswap</a>
                  <a className='connectButton footer_link interact-button'>Jobs</a>
                  <a target='_blank' className='connectButton footer_link interact-button'>
                    Support
                  </a>
                  <a className='connectButton footer_link interact-button'>Newsletter</a>
                  <a className='connectButton footer_link interact-button'>Blog</a>
                  <a className='connectButton footer_link interact-button'>Press</a>
                  <a className='connectButton footer_link interact-button'>Affiliate</a>
                </div>
                <div className='connectButton footer_link-list'>
                  <div className='footer_column-heading'>Markets</div>
                  <a className='connectButton footer_link not_clickable interact-button'>Crypto</a>
                </div>
              </div>
            </div>
            <div>
              <div className='w-layout-grid footer_bottom'>
                <div className='footer_row1'>
                  <a className='footer_logo-link w-nav-brand interact-button'>
                    <img src='./Uniswap _ Portfolio Tracker_files/uniswap-geto.png' alt='Logo' className='site-logo' />
                  </a>
                  <div className='w-layout-grid footer_social-list'>
                    <a target='_blank' className='footer_social-link w-inline-block interact-button'>
                      <div className='social-icon w-embed'>
                        <svg
                          width='100%'
                          height='100%'
                          viewBox='0 0 24 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M16.5 6H13.5C12.9477 6 12.5 6.44772 12.5 7V10H16.5C16.6137 9.99748 16.7216 10.0504 16.7892 10.1419C16.8568 10.2334 16.8758 10.352 16.84 10.46L16.1 12.66C16.0318 12.8619 15.8431 12.9984 15.63 13H12.5V20.5C12.5 20.7761 12.2761 21 12 21H9.5C9.22386 21 9 20.7761 9 20.5V13H7.5C7.22386 13 7 12.7761 7 12.5V10.5C7 10.2239 7.22386 10 7.5 10H9V7C9 4.79086 10.7909 3 13 3H16.5C16.7761 3 17 3.22386 17 3.5V5.5C17 5.77614 16.7761 6 16.5 6Z'
                            fill='CurrentColor'
                          ></path>
                        </svg>
                      </div>
                    </a>
                    <a target='_blank' className='footer_social-link w-inline-block interact-button'>
                      <div className='connectButton social-icon w-embed'>
                        <svg
                          width='100%'
                          height='100%'
                          viewBox='0 0 24 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            fill-rule='evenodd'
                            clip-rule='evenodd'
                            d='M16 3H8C5.23858 3 3 5.23858 3 8V16C3 18.7614 5.23858 21 8 21H16C18.7614 21 21 18.7614 21 16V8C21 5.23858 18.7614 3 16 3ZM19.25 16C19.2445 17.7926 17.7926 19.2445 16 19.25H8C6.20735 19.2445 4.75549 17.7926 4.75 16V8C4.75549 6.20735 6.20735 4.75549 8 4.75H16C17.7926 4.75549 19.2445 6.20735 19.25 8V16ZM16.75 8.25C17.3023 8.25 17.75 7.80228 17.75 7.25C17.75 6.69772 17.3023 6.25 16.75 6.25C16.1977 6.25 15.75 6.69772 15.75 7.25C15.75 7.80228 16.1977 8.25 16.75 8.25ZM12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5027 10.8057 16.0294 9.65957 15.1849 8.81508C14.3404 7.97059 13.1943 7.49734 12 7.5ZM9.25 12C9.25 13.5188 10.4812 14.75 12 14.75C13.5188 14.75 14.75 13.5188 14.75 12C14.75 10.4812 13.5188 9.25 12 9.25C10.4812 9.25 9.25 10.4812 9.25 12Z'
                            fill='CurrentColor'
                          ></path>
                        </svg>
                      </div>
                    </a>
                    <a target='_blank' className='footer_social-link w-inline-block interact-button'>
                      <div className='connectButton social-icon w-embed'>
                        <svg
                          width='100%'
                          height='100%'
                          viewBox='0 0 24 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M18.2477 6.71006C17.0651 6.16862 15.8166 5.78451 14.5342 5.56754C14.3587 5.88125 14.1999 6.20402 14.0585 6.5345C12.6925 6.32865 11.3033 6.32865 9.93722 6.5345C9.79573 6.20406 9.63694 5.88129 9.46152 5.56754C8.17826 5.78634 6.92896 6.17137 5.74515 6.71289C3.39498 10.19 2.75789 13.5807 3.07644 16.9234C4.45275 17.9402 5.99324 18.7136 7.63094 19.2098C7.99971 18.7138 8.32601 18.1877 8.6064 17.6369C8.07384 17.438 7.55982 17.1926 7.0703 16.9035C7.19914 16.8101 7.32514 16.7138 7.4469 16.6204C8.87129 17.2902 10.4259 17.6376 12 17.6376C13.574 17.6376 15.1287 17.2902 16.5531 16.6204C16.6762 16.7209 16.8023 16.8172 16.9297 16.9035C16.4392 17.1931 15.9242 17.4389 15.3907 17.6383C15.6708 18.1888 15.9971 18.7146 16.3662 19.2098C18.0053 18.7156 19.547 17.9426 20.9235 16.9248C21.2973 13.0484 20.285 9.68882 18.2477 6.71006ZM9.0099 14.8677C8.12221 14.8677 7.38885 14.0621 7.38885 13.0711C7.38885 12.08 8.09673 11.2674 9.00707 11.2674C9.9174 11.2674 10.6451 12.08 10.6295 13.0711C10.614 14.0621 9.91457 14.8677 9.0099 14.8677ZM14.9901 14.8677C14.101 14.8677 13.3704 14.0621 13.3704 13.0711C13.3704 12.08 14.0783 11.2674 14.9901 11.2674C15.9018 11.2674 16.6239 12.08 16.6083 13.0711C16.5927 14.0621 15.8947 14.8677 14.9901 14.8677Z'
                            fill='white'
                          ></path>
                        </svg>
                      </div>
                    </a>
                    <a target='_blank' className='footer_social-link w-inline-block interact-button'>
                      <div className='connectButton social-icon w-embed'>
                        <svg
                          width='100%'
                          height='100%'
                          viewBox='0 0 24 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M2.9765 4L9.9261 13.2923L2.93262 20.8473H4.50657L10.6294 14.2328L15.5764 20.8473H20.9326L13.592 11.0323L20.1015 4H18.5275L12.8888 10.0918L8.33272 4H2.9765ZM5.29112 5.15938H7.75178L18.6176 19.6877H16.157L5.29112 5.15938Z'
                            fill='white'
                          ></path>
                        </svg>
                      </div>
                    </a>
                    <a target='_blank' className='connectButton footer_social-link w-inline-block interact-button'>
                      <div className='social-icon w-embed'>
                        <svg
                          width='100%'
                          height='100%'
                          viewBox='0 0 24 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            fill-rule='evenodd'
                            clip-rule='evenodd'
                            d='M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3ZM8 18C8.27614 18 8.5 17.7761 8.5 17.5V10.5C8.5 10.2239 8.27614 10 8 10H6.5C6.22386 10 6 10.2239 6 10.5V17.5C6 17.7761 6.22386 18 6.5 18H8ZM7.25 9C6.42157 9 5.75 8.32843 5.75 7.5C5.75 6.67157 6.42157 6 7.25 6C8.07843 6 8.75 6.67157 8.75 7.5C8.75 8.32843 8.07843 9 7.25 9ZM17.5 18C17.7761 18 18 17.7761 18 17.5V12.9C18.0325 11.3108 16.8576 9.95452 15.28 9.76C14.177 9.65925 13.1083 10.1744 12.5 11.1V10.5C12.5 10.2239 12.2761 10 12 10H10.5C10.2239 10 10 10.2239 10 10.5V17.5C10 17.7761 10.2239 18 10.5 18H12C12.2761 18 12.5 17.7761 12.5 17.5V13.75C12.5 12.9216 13.1716 12.25 14 12.25C14.8284 12.25 15.5 12.9216 15.5 13.75V17.5C15.5 17.7761 15.7239 18 16 18H17.5Z'
                            fill='CurrentColor'
                          ></path>
                        </svg>
                      </div>
                    </a>
                    <a target='_blank' className='connectButton footer_social-link w-inline-block interact-button'>
                      <div className='social-icon w-embed'>
                        <svg
                          width='100%'
                          height='100%'
                          viewBox='0 0 24 24'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            fill-rule='evenodd'
                            clip-rule='evenodd'
                            d='M18.5399 4.33992L19.9999 4.48992C21.7284 4.68529 23.0264 6.16064 22.9999 7.89992V16.0999C23.0264 17.8392 21.7284 19.3146 19.9999 19.5099L18.5999 19.6599C14.2315 20.1099 9.82835 20.1099 5.45991 19.6599L3.99991 19.5099C2.27143 19.3146 0.973464 17.8392 0.999909 16.0999V7.89992C0.973464 6.16064 2.27143 4.68529 3.99991 4.48992L5.39991 4.33992C9.76835 3.88995 14.1715 3.88995 18.5399 4.33992ZM11.1099 15.2199L14.9999 12.6199H15.0599C15.2695 12.4833 15.3959 12.2501 15.3959 11.9999C15.3959 11.7497 15.2695 11.5165 15.0599 11.3799L11.1699 8.77992C10.9402 8.62469 10.6437 8.60879 10.3987 8.73859C10.1538 8.86839 10.0004 9.12271 9.99991 9.39992V14.5999C10.0128 14.858 10.1576 15.0913 10.3832 15.2173C10.6088 15.3433 10.8834 15.3443 11.1099 15.2199Z'
                            fill='currentColor'
                          ></path>
                        </svg>
                      </div>
                    </a>
                  </div>
                </div>
                <div className='footer_row2'>
                  <a className='footer_legal-text interact-button'>
                    © 2025. Uniswap Investment Tracker. All right reserved.
                  </a>
                  <div className='w-layout-grid footer_link-list-horizontal'>
                    <a className='connectButton footer_legal-link interact-button'>Privacy Policy</a>
                    <a className='connectButton footer_legal-link interact-button'>Terms of Service</a>
                    <a className='connectButton footer_legal-link interact-button'>Cookies Settings</a>
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

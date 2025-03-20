import { useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'

const slides = [
  {
    title: 'Stocks',
    description:
      'With different stock exchanges over different time zones, it’s sometimes hard to keep track of all your stocks. Uniswap connects with all your brokers and does the work for you.'
  },
  {
    title: 'Crypto',
    description:
      'So many coins, so little time. We auto-synchronize all your wallets to give you a real-time overview of all your crypto. We give you the overview so you can make decisions fast.'
  },
  {
    title: 'ETF',
    description: 'Trust is good, knowledge is better. Keep track of all your funds in one place.&nbsp;'
  },
  {
    title: 'Forex',
    description:
      'World events and politics have a major impact on currencies. Explore and follow all currency pairs, get the latest exchange rates and stay in the know.'
  },
  {
    title: 'NFTs',
    description:
      'Track &amp; Explore NFT’s with Uniswap. Connect your wallets to get an overview of all your NFT’s. Get notified on floor price moves and more.'
  },
  {
    title: 'Commodities',
    description:
      'Commodities are the raw materials that drive the economy. Uniswap gives you a clear overview of all your commodities.'
  },
  {
    title: 'Indices',
    description:
      'Indices are a measure of the value of a section of the stock market. Uniswap gives you a clear overview of all your indices.'
  },
  {
    title: 'Funds',
    description: 'Trust is good, knowledge is better. Keep track of all your funds in one place.'
  }
]

const ApiSDK = () => {
  const swiperRef = useRef(null)

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.updateAutoHeight()
    }
  }, [])

  return (
    <section class='section_tracker-cards radius-corners-top'>
      <div class='background-gradient-purple-radial-top'>
        <section class='section_logo-slider'>
          <div class='padding-section-large no-bottom'>
            <div class='page-padding'>
              <div class='margin-bottom margin-xxlarge'>
                <div class='text-align-center'>
                  <div class='max-width-large align-center'>
                    <div class='margin-bottom margin-small'>
                      <h2 class='heading-style-h2'>
                        Discover your <span class='text-gradient-light-pink-lilac'>Applications</span>
                      </h2>
                    </div>
                    <p class='text-size-medium limited-w'>
                      It’s time to get a clear overview of your application with our interoperability system.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <section class='section_logo-slider'>
              <div class='padding-section-medium no-padding'>
                <div class='padding-global z-index-2'>
                  <div class='container-large'>
                    <div class='margin-bottom margin-large'>
                      <div class='text-align-center'>
                        <div class='logo-slider-max-width-large max-width-large align-center'></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class='logo-slider_component'>
                  <div class='logo-loop'>
                    <div class='logo-loop-row'>
                      <div class='w-dyn-list'>
                        <div class='logo-slider_list w-dyn-items'>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/64e719d932f3a78c8ef03d03_logo-walletconnect.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/64e719ca588b7012d722ea53_logo-trade-republic.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/64e719c0ac9f76a4e2db73b7_logo-robinhood.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/64e719b596e200ab98cc99fb_logo-metamask.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/64e719aa6d08aec32da1dcc3_logo-kucoin.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/64e7199d617dc3acc596fd0d_logo-fidelity.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/etherscan-logo-light.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/64e7198c617dc3acc596f18a_logo-degiro.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/64e7198219c639a015b6ea30_logo-crypto.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/64e71978b9721342a3c9246d_logo-coinbase.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/64e7196ff09eeeb9f37bd7c4_logo-binance.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/64e71962c45e306eec6d62cb_logo-ameritrade.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class='logo-loop-row'>
                      <div class='w-dyn-list'>
                        <div class='logo-slider_list w-dyn-items'>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/64e719d932f3a78c8ef03d03_logo-walletconnect.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/64e719ca588b7012d722ea53_logo-trade-republic.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/64e719c0ac9f76a4e2db73b7_logo-robinhood.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/64e719b596e200ab98cc99fb_logo-metamask.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/64e719aa6d08aec32da1dcc3_logo-kucoin.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/64e7199d617dc3acc596fd0d_logo-fidelity.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/etherscan-logo-light.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/64e7198c617dc3acc596f18a_logo-degiro.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/64e7198219c639a015b6ea30_logo-crypto.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/64e71978b9721342a3c9246d_logo-coinbase.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/64e7196ff09eeeb9f37bd7c4_logo-binance.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                          <div class='w-dyn-item'>
                            <div class='logo-slider_logo-wrapper'>
                              <img
                                alt=''
                                src='./Uniswap _ Portfolio Tracker_files/64e71962c45e306eec6d62cb_logo-ameritrade.svg'
                                class='logo-slider_logo'
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
        <div class='container'>
          <div class='page-padding-slider'>
            <div class='slider-main_component'>
              <Swiper
                className='is-slider-main'
                ref={swiperRef}
                spaceBetween={20}
                slidesPerView={3}
                onSwiper={swiper => console.log(swiper)}
                onSlideChange={() => console.log('slide change')}
              >
                {slides.map((slide, index) => (
                  <SwiperSlide key={index} className='is-slider-main card is-active'>
                    <a class='connectButton tracker-cards_item-link w-inline-block interact-button'>
                      <div class='card-content is-medium'>
                        <div class='tracker-cards_image-wrapper'>
                          <div class='tracker-lottie-animation'></div>
                        </div>
                        <div class='tracker-cards_item-content-top'>
                          <div class='tracker-cards_title-wrapper'>
                            <h8 class='heading-style-h8'>{slide.title}</h8>
                            <p class='text-size-regular'>{slide.description}</p>
                          </div>
                          <div class='tracker-cards_button-wrapper'>
                            <div class='button is-link is-icon'>
                              <div>Read more</div>
                              <div class='icon-embed-xxsmall w-embed'>
                                <svg
                                  width='16'
                                  height='16'
                                  viewBox='0 0 16 16'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'
                                >
                                  <path d='M6 3L11 8L6 13' stroke='CurrentColor' stroke-width='1.5'></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* <div class='swiper is-slider-main swiper-initialized swiper-horizontal swiper-pointer-events swiper-autoheight swiper-css-mode'>
                <div class='swiper-wrapper is-slider-main h-[628px]'>
                  <div class='swiper-slide is-slider-main card is-active w-[416px] mr-4'>
                    <a class='connectButton tracker-cards_item-link w-inline-block interact-button'>
                      <div class='card-content is-medium'>
                        <div class='tracker-cards_image-wrapper'>
                          <div class='tracker-lottie-animation'></div>
                          <div></div>
                        </div>
                        <div class='tracker-cards_item-content-top'>
                          <div class='tracker-cards_title-wrapper'>
                            <h8 class='heading-style-h8'>Stocks</h8>
                            <p class='text-size-regular'>
                              With different stock exchanges over different time zones, it’s sometimes hard to keep
                              track of all your stocks. Uniswap connects with all your brokers and does the work for
                              you.
                            </p>
                          </div>
                          <div class='tracker-cards_button-wrapper'>
                            <div class='button is-link is-icon'>
                              <div>Read more</div>
                              <div class='icon-embed-xxsmall w-embed'>
                                <svg
                                  width='16'
                                  height='16'
                                  viewBox='0 0 16 16'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'
                                >
                                  <path d='M6 3L11 8L6 13' stroke='CurrentColor' stroke-width='1.5'></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div class='swiper-slide is-slider-main card swiper-slide-next w-[416px] mr-4'>
                    <a class='connectButton tracker-cards_item-link w-inline-block w--current interact-button'>
                      <div class='card-content is-medium'>
                        <div class='tracker-cards_image-wrapper'>
                          <div class='tracker-lottie-animation'></div>
                        </div>
                        <div class='tracker-cards_item-content-top'>
                          <div class='tracker-cards_title-wrapper'>
                            <h3 class='heading-style-h5'>Crypto</h3>
                          </div>
                          <p class='text-size-regular'>
                            So many coins, so little time. We auto-synchronize all your wallets to give you a real-time
                            overview of all your crypto. We give you the overview so you can make decisions fast.
                          </p>
                          <div class='tracker-cards_button-wrapper'>
                            <div class='button is-link is-icon'>
                              <div>Read more</div>
                              <div class='icon-embed-xxsmall w-embed'>
                                <svg
                                  width='16'
                                  height='16'
                                  viewBox='0 0 16 16'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'
                                >
                                  <path d='M6 3L11 8L6 13' stroke='CurrentColor' stroke-width='1.5'></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div class='swiper-slide is-slider-main card w-[416px] mr-4'>
                    <a class='connectButton tracker-cards_item-link w-inline-block interact-button'>
                      <div class='card-content is-medium'>
                        <div class='tracker-cards_image-wrapper'>
                          <div class='tracker-lottie-animation'></div>
                        </div>
                        <div class='tracker-cards_item-content-top'>
                          <div class='tracker-cards_title-wrapper'>
                            <h3 class='heading-style-h5'>ETF</h3>
                          </div>
                          <p class='text-size-regular'>
                            Trust is good, knowledge is better. Keep track of all your funds in one place.&nbsp;
                          </p>
                          <div class='tracker-cards_button-wrapper'>
                            <div class='button is-link is-icon'>
                              <div>Read more</div>
                              <div class='icon-embed-xxsmall w-embed'>
                                <svg
                                  width='16'
                                  height='16'
                                  viewBox='0 0 16 16'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'
                                >
                                  <path d='M6 3L11 8L6 13' stroke='CurrentColor' stroke-width='1.5'></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div class='swiper-slide is-slider-main card w-[416px] mr-4'>
                    <a class='connectButton tracker-cards_item-link w-inline-block interact-button'>
                      <div class='card-content is-medium'>
                        <div class='tracker-cards_image-wrapper'>
                          <div class='tracker-lottie-animation'></div>
                        </div>
                        <div class='tracker-cards_item-content-top'>
                          <div class='tracker-cards_title-wrapper'>
                            <h3 class='heading-style-h5'>Forex</h3>
                          </div>
                          <p class='text-size-regular'>
                            World events and politics have a major impact on currencies. Explore and follow all currency
                            pairs, get the latest exchange rates and stay in the know.
                          </p>
                          <div class='tracker-cards_button-wrapper'>
                            <div class='button is-link is-icon'>
                              <div>Read more</div>
                              <div class='icon-embed-xxsmall w-embed'>
                                <svg
                                  width='16'
                                  height='16'
                                  viewBox='0 0 16 16'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'
                                >
                                  <path d='M6 3L11 8L6 13' stroke='CurrentColor' stroke-width='1.5'></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div class='swiper-slide is-slider-main card w-[416px] mr-4'>
                    <a class='connectButton tracker-cards_item-link w-inline-block interact-button'>
                      <div class='card-content is-medium'>
                        <div class='tracker-cards_image-wrapper'>
                          <div class='tracker-lottie-animation'></div>
                        </div>
                        <div class='tracker-cards_item-content-top'>
                          <div class='tracker-cards_title-wrapper'>
                            <h3 class='heading-style-h5'>NFTs</h3>
                          </div>
                          <p class='text-size-regular'>
                            Track &amp; Explore NFT’s with Uniswap. Connect your wallets to get an overview of all your
                            NFT’s. Get notified on floor price moves and more.
                          </p>
                          <div class='tracker-cards_button-wrapper'>
                            <div class='button is-link is-icon'>
                              <div>Read more</div>
                              <div class='icon-embed-xxsmall w-embed'>
                                <svg
                                  width='16'
                                  height='16'
                                  viewBox='0 0 16 16'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'
                                >
                                  <path d='M6 3L11 8L6 13' stroke='CurrentColor' stroke-width='1.5'></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div class='swiper-slide is-slider-main card w-[416px] mr-4'>
                    <a class='connectButton tracker-cards_item-link w-inline-block interact-button'>
                      <div class='card-content is-medium'>
                        <div class='tracker-cards_image-wrapper'>
                          <div class='tracker-lottie-animation'></div>
                        </div>
                        <div class='tracker-cards_item-content-top'>
                          <div class='tracker-cards_title-wrapper'>
                            <h3 class='heading-style-h5'>Commodities</h3>
                          </div>
                          <p class='text-size-regular'>
                            The commodities market is volatile and changes quickly. Get live spot prices for the world’s
                            essential commodities.
                          </p>
                          <div class='tracker-cards_button-wrapper'>
                            <div class='button is-link is-icon'>
                              <div>Read more</div>
                              <div class='icon-embed-xxsmall w-embed'>
                                <svg
                                  width='16'
                                  height='16'
                                  viewBox='0 0 16 16'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'
                                >
                                  <path d='M6 3L11 8L6 13' stroke='CurrentColor' stroke-width='1.5'></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div class='swiper-slide is-slider-main card w-[416px]'>
                    <a class='connectButton tracker-cards_item-link w-inline-block interact-button'>
                      <div class='card-content is-medium'>
                        <div class='tracker-cards_image-wrapper'>
                          <div class='tracker-lottie-animation'></div>
                        </div>
                        <div class='tracker-cards_item-content-top'>
                          <div class='tracker-cards_title-wrapper'>
                            <h3 class='heading-style-h5'>Indices</h3>
                          </div>
                          <p class='text-size-regular'>
                            Look into indices and track their performance. Connect your broker account to track your
                            fees and expenses.
                          </p>
                          <div class='tracker-cards_button-wrapper'>
                            <div class='button is-link is-icon'>
                              <div>Read more</div>
                              <div class='icon-embed-xxsmall w-embed'>
                                <svg
                                  width='16'
                                  height='16'
                                  viewBox='0 0 16 16'
                                  fill='none'
                                  xmlns='http://www.w3.org/2000/svg'
                                >
                                  <path d='M6 3L11 8L6 13' stroke='CurrentColor' stroke-width='1.5'></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                <span class='swiper-notification'></span>
              </div> */}
              <div class='slider-main_top-wrapper'>
                <div class='swiper-bullet-wrapper is-slider-main swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal'>
                  <button class='swiper-bullet is-active'></button>
                  <button class='swiper-bullet'></button>
                  <button class='swiper-bullet'></button>
                  <button class='swiper-bullet'></button>
                </div>
                <div class='slider-main_inner-wrapper'>
                  <a class='slider-main_arrow swiper-prev w-inline-block is-disabled interact-button'>
                    <div class='slider-main_button-icon is-reversed w-embed'>
                      <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 29.541 22.323'>
                        <g id='Group_44' data-name='Group 44' transform='translate(0 1.014)'>
                          <path
                            id='Path_1'
                            data-name='Path 1'
                            d='M115.445,20.633l9.311-10.148L115.445.338'
                            transform='translate(-97.25 -0.338)'
                            fill='none'
                            stroke='currentColor'
                            stroke-miterlimit='10'
                            stroke-width='3'
                          ></path>
                          <line
                            id='Line_1'
                            data-name='Line 1'
                            x1='27.506'
                            transform='translate(0 10.148)'
                            fill='none'
                            stroke='currentColor'
                            stroke-miterlimit='10'
                            stroke-width='3'
                          ></line>
                        </g>
                      </svg>
                    </div>
                  </a>
                  <a class='slider-main_arrow swiper-next w-inline-block interact-button'>
                    <div class='slider-main_button-icon w-embed'>
                      <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 29.541 22.323'>
                        <g id='Group_44' data-name='Group 44' transform='translate(0 1.014)'>
                          <path
                            id='Path_1'
                            data-name='Path 1'
                            d='M115.445,20.633l9.311-10.148L115.445.338'
                            transform='translate(-97.25 -0.338)'
                            fill='none'
                            stroke='currentColor'
                            stroke-miterlimit='10'
                            stroke-width='3'
                          ></path>
                          <line
                            id='Line_1'
                            data-name='Line 1'
                            x1='27.506'
                            transform='translate(0 10.148)'
                            fill='none'
                            stroke='currentColor'
                            stroke-miterlimit='10'
                            stroke-width='3'
                          ></line>
                        </g>
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ApiSDK

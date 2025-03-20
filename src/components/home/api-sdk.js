import { useRef, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import { slides, logos } from 'src/configs/constant'
import 'swiper/css'

const ApiSDK = () => {
  const swiperRef = useRef(null)
  const [activeSwipe, setActiveSwipe] = useState(0)

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.updateAutoHeight()
    }
  }, [])

  const handleSlideChange = swiper => {
    setActiveSwipe(swiper.activeIndex)
  }

  const isPrevClass = activeSwipe === 0 ? 'is-disabled' : ''
  const isNextClass = activeSwipe === slides.length - 1 ? 'is-disabled' : ''

  return (
    <section className='section_tracker-cards radius-corners-top'>
      <div className='background-gradient-purple-radial-top'>
        <section className='section_logo-slider'>
          <div className='padding-section-large no-bottom'>
            <div className='page-padding'>
              <div className='margin-bottom margin-xxlarge'>
                <div className='text-align-center'>
                  <div className='max-width-large align-center'>
                    <div className='margin-bottom margin-small'>
                      <h2 className='heading-style-h2'>
                        Discover your <span className='text-gradient-light-pink-lilac'>Applications</span>
                      </h2>
                    </div>
                    <p className='text-size-medium limited-w'>
                      It’s time to get a clear overview of your application with our interoperability system.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <section className='section_logo-slider'>
              <div className='padding-section-medium no-padding'>
                <div className='padding-global z-index-2'>
                  <div className='container-large'>
                    <div className='margin-bottom margin-large'>
                      <div className='text-align-center'>
                        <div className='logo-slider-max-width-large max-width-large align-center'></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='logo-slider_component'>
                  <div className='logo-loop'>
                    <div className='logo-loop-row'>
                      <div className='w-dyn-list'>
                        <div className='logo-slider_list w-dyn-items'>
                          {logos.map((logo, index) => (
                            <div key={index} className='w-dyn-item'>
                              <div className='logo-slider_logo-wrapper'>
                                <img alt='' src={`/images/partners/${logo}`} className='logo-slider_logo' />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className='logo-loop-row'>
                      <div className='w-dyn-list'>
                        <div className='logo-slider_list w-dyn-items'>
                          {logos.map((logo, index) => (
                            <div key={index} className='w-dyn-item'>
                              <div className='logo-slider_logo-wrapper'>
                                <img alt='' src={`/images/partners/${logo}`} className='logo-slider_logo' />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
        <div className='container'>
          <div className='page-padding-slider'>
            <div className='slider-main_component'>
              <Swiper
                className='is-slider-main'
                ref={swiperRef}
                spaceBetween={20}
                slidesPerView={3}
                onSlideChange={handleSlideChange}
              >
                {slides.map((slide, index) => (
                  <SwiperSlide key={index} className={`is-slider-main card ${index == activeSwipe ? 'is-active' : ''}`}>
                    <a className='tracker-cards_item-link w-inline-block interact-button'>
                      <div className='card-content is-medium'>
                        <div className='tracker-cards_image-wrapper'>
                          <div className='tracker-lottie-animation'></div>
                        </div>
                        <div className='tracker-cards_item-content-top'>
                          <div className='tracker-cards_title-wrapper'>
                            <h8 className='heading-style-h8'>{slide.title}</h8>
                            <p className='text-size-regular'>{slide.description}</p>
                          </div>
                          <div className='tracker-cards_button-wrapper'>
                            <div className='button is-link is-icon'>
                              <div>Read more</div>
                              <div className='icon-embed-xxsmall w-embed'>
                                <img src='/images/icons/right-arrow.svg' alt='' />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className='slider-main_top-wrapper'>
                <div className='swiper-bullet-wrapper is-slider-main swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal'>
                  {slides.map((slide, index) => (
                    <button key={index} className={`swiper-bullet ${index == activeSwipe ? 'is-active' : ''}`}></button>
                  ))}
                </div>
                <div className='slider-main_inner-wrapper'>
                  <a
                    className={`slider-main_arrow swiper-prev w-inline-block interact-button ${isPrevClass}`}
                    onClick={() => swiperRef.current.swiper.slidePrev()}
                  >
                    <div className='slider-main_button-icon is-reversed w-embed'>
                      <img src='/images/icons/next-arrow.svg' alt='' />
                    </div>
                  </a>
                  <a
                    className={`slider-main_arrow swiper-next w-inline-block interact-button ${isNextClass}`}
                    onClick={() => swiperRef.current.swiper.slideNext()}
                  >
                    <div className='slider-main_button-icon w-embed'>
                      <img src='/images/icons/next-arrow.svg' alt='' />
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

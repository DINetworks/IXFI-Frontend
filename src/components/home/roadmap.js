import { useRef, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import useWindowSize from 'src/hooks/use-window-size'
import { roadmaps } from 'src/configs/constant'
import 'swiper/css'

const ApiSDK = () => {
  const swiperRef = useRef(null)
  const [activeSwipe, setActiveSwipe] = useState(0)
  const { width, height } = useWindowSize()

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.updateAutoHeight()
    }
  }, [])

  const handleSlideChange = swiper => {
    setActiveSwipe(swiper.activeIndex)
  }

  const isPrevClass = activeSwipe === 0 ? 'is-disabled' : ''
  const isNextClass = activeSwipe === roadmaps.length - 1 ? 'is-disabled' : ''

  const slidesPerView = parseInt(width / 400)

  return (
    <section className='section_tracker-cards radius-corners-top'>
      <div className='background-gradient-purple-radial-top'>
        <section className='section_logo-slider'>
          <div className='padding-section-large no-bottom'>
            <div className='page-padding'>
              <div className='margin-bottom'>
                <div className='text-align-center'>
                  <div className='max-width-large align-center'>
                    <div className='margin-bottom margin-small'>
                      <h2 className='heading-style-h2 roadmap-title'>Roadmap</h2>
                    </div>
                    <p className='text-size-medium limited-w'>
                      It’s time to get a clear overview of your application with our interoperability system.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className='container'>
          <div className='page-padding-slider'>
            <div className='slider-main_component'>
              <Swiper
                className='is-slider-main'
                ref={swiperRef}
                spaceBetween={30}
                slidesPerView={slidesPerView}
                onSlideChange={handleSlideChange}
              >
                {roadmaps.map((slide, index) => (
                  <SwiperSlide key={index} className={`is-slider-main card ${index == activeSwipe ? 'is-active' : ''}`}>
                    <a className='tracker-cards_item-link w-inline-block interact-button'>
                      <div className='card-content is-medium'>
                        <div>
                          <div className='roadmap-period margin-bottom margin-xxsmall'>{slide.period}</div>
                        </div>
                        <div className='cards-small_icon-wrapper-wrapper margin-bottom margin-small'>
                          <div className='cards-small_icon-wrapper'>
                            <img src={`/images/icons/${slide.icon}`} alt='' className='icon-1x1-small' />
                          </div>
                        </div>
                        <div className='tracker-cards_item-content-top'>
                          <div className='tracker-cards_title-wrapper'>
                            <div className='heading-style-h6 text-center'>{slide.title}</div>
                            {/* <p className='text-size-regular'>{slide.description}</p> */}
                            <ul>
                              {slide.items.map((item, index) => (
                                <li className='text-size-regular' key={index}>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {/* <div className='tracker-cards_button-wrapper'>
                            <div className='button is-link is-icon'>
                              <div>Read more</div>
                              <div className='icon-embed-xxsmall w-embed'>
                                <img src='/images/icons/right-arrow.svg' alt='' />
                              </div>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </a>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className='slider-main_top-wrapper'>
                <div className='swiper-bullet-wrapper is-slider-main swiper-pagination-clickable swiper-pagination-bullets swiper-pagination-horizontal'>
                  {roadmaps.map((slide, index) => (
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

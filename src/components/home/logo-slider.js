import { logos } from 'src/configs/constant'

const LogoSlider = () => {
  return (
    <section className='section_logo-slider mb-4'>
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
  )
}

export default LogoSlider

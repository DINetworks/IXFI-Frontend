import { features } from 'src/configs/constant'

const Features = () => {
  return (
    <section className='section_cards-small background-gradient-purple-radial-top radius-corners-top'>
      <div className='padding-global'>
        <div className='container-large'>
          <div className='padding-section-large'>
            <div className='margin-bottom margin-xxlarge'>
              <div className='text-align-center'>
                <div className='max-width-large align-center'>
                  <div className='margin-bottom margin-small'>
                    <h2 className='heading-style-h2'>
                      Fully Interoperable Solution by <span className='text-gradient-light-pink-lilac'>XFI</span>!
                    </h2>
                  </div>
                  <p>You don't need to have all types of gas! Only XFI on All Supported Networks.</p>
                </div>
              </div>
            </div>
            <div className='w-layout-grid cards-small_component'>
              <div className='w-layout-grid cards-small_row'>
                {features.map((feature, index) => (
                  <div key={index} className='card'>
                    <div className='card-content is-medium'>
                      <div className='cards-small_card-content-top'>
                        <div className='cards-small_icon-wrapper-wrapper margin-bottom margin-small'>
                          <div className='cards-small_icon-wrapper'>
                            <img src={`/images/icons/${feature.icon}`} alt='' className='icon-1x1-small' />
                          </div>
                        </div>
                        <div className='margin-bottom margin-xsmall'>
                          <h5 className='heading-style-h5 text-center'>{feature.title}</h5>
                        </div>
                        <p>{feature.description}</p>
                      </div>
                      <div className='margin-top margin-small hide'>
                        <div className='button-group'>
                          <a className='button is-link is-icon w-inline-block '>
                            <div>Read more</div>
                            <div className='icon-embed-xxsmall w-embed'>
                              <img src='/images/icons/right-arrow.svg' alt='' />
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features

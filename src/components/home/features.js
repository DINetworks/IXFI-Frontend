import { features } from 'src/configs/constant'

const Features = () => {
  return (
    <section class='section_cards-small background-gradient-purple-radial-top radius-corners-top'>
      <div class='padding-global'>
        <div class='container-large'>
          <div class='padding-section-large'>
            <div class='margin-bottom margin-xxlarge'>
              <div class='text-align-center'>
                <div class='max-width-large align-center'>
                  <div class='margin-bottom margin-small'>
                    <h2 class='heading-style-h2'>
                      Fully Interoperable Solution by <span class='text-gradient-light-pink-lilac'>XFI</span>!
                    </h2>
                  </div>
                  <p>You don't need to have all types of gas! Only XFI on All Supported Networks.</p>
                </div>
              </div>
            </div>
            <div class='w-layout-grid cards-small_component'>
              <div class='w-layout-grid cards-small_row'>
                {features.map((feature, index) => (
                  <div key={index} class='card'>
                    <div class='card-content is-medium'>
                      <div class='cards-small_card-content-top'>
                        <div class='cards-small_icon-wrapper-wrapper margin-bottom margin-small'>
                          <div class='cards-small_icon-wrapper'>
                            <img src={`/images/icons/${feature.icon}`} alt='' class='icon-1x1-small' />
                          </div>
                        </div>
                        <div class='margin-bottom margin-xsmall'>
                          <h5 class='heading-style-h5 text-center'>{feature.title}</h5>
                        </div>
                        <p>{feature.description}</p>
                      </div>
                      <div class='margin-top margin-small hide'>
                        <div class='button-group'>
                          <a class='button is-link is-icon w-inline-block interact-button'>
                            <div>Read more</div>
                            <div class='icon-embed-xxsmall w-embed'>
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

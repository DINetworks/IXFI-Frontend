import { useState } from 'react'
import { useCases } from 'src/configs/constant'

const Ecosystems = () => {
  const [activeCase, setActiveCase] = useState(0)

  const isActiveClass = index => (activeCase == index ? 'w--current' : '')
  const isActiveDescShow = index => (activeCase == index ? '' : 'h-0')
  const isActiveShow = index => (activeCase == index ? '' : 'hide')

  return (
    <section className='section_tabs'>
      <div className='padding-global'>
        <div className='container-medium'>
          <div className='padding-section-large'>
            <div className='margin-bottom margin-xxlarge'>
              <div className='text-align-center'>
                <div className='max-width-large align-center'>
                  <div className='margin-bottom margin-xsmall'>
                    <div className='heading-style-subtitle-regular text-gradient-light-pink-lilac'>IXFI’s Usecase</div>
                  </div>
                  <div className='margin-bottom margin-small'>
                    <h2 className='heading-style-h2'>
                      The <span className='text-gradient-light-pink-lilac'>Foundation</span> For Cross-Chain DApps
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className='tabs_component w-tabs'>
              <div className='tabs-content w-tab-content flex-1'>
                <div className='tab-pane w-tab-pane w--tab-active'>
                  {useCases.map((useCase, index) => (
                    <div key={index} className={`tabs_image-wrapper ${isActiveShow(index)}`}>
                      <img src={`/images/ecosystems/${useCase.image}`} alt='' className='tabs_image' />
                    </div>
                  ))}
                </div>
              </div>
              <div className='tabs_tabs-menu w-tab-menu flex-1'>
                {useCases.map((useCase, index) => (
                  <a
                    key={index}
                    className={`card is-tabitem-pro w-inline-block w-tab-link interact-button ${isActiveClass(index)}`}
                    onClick={() => setActiveCase(index)}
                  >
                    <div className='card-content is-small is-tabitem'>
                      <h4 className='heading-style-h5'>
                        <strong>{useCase.title}</strong>
                      </h4>
                      <p className={`tab-item_paragraph ${isActiveDescShow(index)}`}>{useCase.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Ecosystems

const features = [
  {
    icon: 'gasless.svg',
    title: 'Gas-Less Transactions For Multiple Chains',
    description:
      'Gas fees are a significant barrier to seamless blockchain interactions, often requiring users to hold native tokens for each network they interact with. The IXFI Protocol introduces a gas-less transaction system, enabling frictionless cross-chain interactions without requiring users to manage gas tokens for multiple chains.'
  },
  {
    icon: 'evm.svg',
    title: 'Supports All EVM Networks',
    description:
      'The IXFI Protocol is designed to operate seamlessly across all EVM-compatible blockchains, ensuring maximum interoperability and accessibility for users. By supporting a wide range of networks, IXFI enables truly borderless transactions, liquidity aggregation, and smart contract interactions across multiple ecosystems.'
  },
  {
    icon: 'cross-chain.svg',
    title: 'The foundation for cross-chain DApps',
    description:
      'The IXFI Protocol is more than just a cross-chain swap solution—it serves as the core infrastructure for the next wave of DApps. By enabling seamless interoperability, gas-less transactions, and liquidity aggregation across multiple chains, IXFI empowers developers and users to unlock the full potential of blockchain technology.'
  }
]

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

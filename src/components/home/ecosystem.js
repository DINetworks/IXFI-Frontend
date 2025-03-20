import { useState } from 'react'

const useCases = [
  {
    title: 'DEX Aggregators & Swap',
    description:
      'A Cross-Chain DEX Aggregator enables users to swap assets across multiple blockchain networks seamlessly by aggregating liquidity from different DEXs. This ensures optimal trade execution, lower slippage, and enhanced price discovery, regardless of the network.',
    image: 'tab1.webp'
  },
  {
    title: 'Lending & Borrowing Platform',
    description:
      'This allows users to lend and borrow assets across multiple blockchain networks, eliminating liquidity fragmentation and enabling seamless capital efficiency in DeFi. By leveraging cross-chain interoperability, users can supply assets on one chain and borrow against them on another without relying on centralized intermediaries.',
    image: 'tab2.webp'
  },
  {
    title: 'Multi-Chain Liquidity Provisioning',
    description:
      'Multi-chain liquidity provisioning is a system that enables users to supply liquidity across multiple blockchain networks, ensuring efficient token swaps, lending, and yield farming opportunities. It allows liquidity providers (LPs) to earn rewards while enhancing cross-chain DeFi efficiency.',
    image: 'tab3.webp'
  },
  {
    title: 'Cross-Chain Messaging',
    description:
      'Cross-chain messaging enables seamless communication between different blockchain networks, allowing smart contracts and applications to share data, execute transactions, and interact beyond a single chain’s limitations.',
    image: 'tab1.webp'
  }
]

const Ecosystems = () => {
  const [activeCase, setActiveCase] = useState(0)

  const isActiveClass = index => (activeCase == index ? 'w--current' : '')
  const isActiveDescShow = index => (activeCase == index ? '' : 'h-0')
  const isActiveShow = index => (activeCase == index ? '' : 'hide')

  return (
    <section class='section_tabs'>
      <div class='padding-global'>
        <div class='container-medium'>
          <div class='padding-section-large'>
            <div class='margin-bottom margin-xxlarge'>
              <div class='text-align-center'>
                <div class='max-width-large align-center'>
                  <div class='margin-bottom margin-xsmall'>
                    <div class='heading-style-subtitle-regular text-gradient-light-pink-lilac'>IXFI’s Usecase</div>
                  </div>
                  <div class='margin-bottom margin-small'>
                    <h2 class='heading-style-h2'>
                      The <span class='text-gradient-light-pink-lilac'>Foundation</span> For Cross-Chain DApps
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div class='tabs_component w-tabs'>
              <div class='tabs-content w-tab-content flex-1'>
                <div class='tab-pane w-tab-pane w--tab-active'>
                  {useCases.map((useCase, index) => (
                    <div key={index} class={`tabs_image-wrapper ${isActiveShow(index)}`}>
                      <img src={`/images/ecosystems/${useCase.image}`} alt='' class='tabs_image' />
                    </div>
                  ))}
                </div>
              </div>
              <div class='tabs_tabs-menu w-tab-menu flex-1'>
                {useCases.map((useCase, index) => (
                  <a
                    key={index}
                    class={`card is-tabitem-pro w-inline-block w-tab-link interact-button ${isActiveClass(index)}`}
                    onClick={() => setActiveCase(index)}
                  >
                    <div class='card-content is-small is-tabitem'>
                      <h4 class='heading-style-h5'>
                        <strong>{useCase.title}</strong>
                      </h4>
                      <p class={`tab-item_paragraph ${isActiveDescShow(index)}`}>{useCase.description}</p>
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

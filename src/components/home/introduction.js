const Introduction = () => {
  return (
    <section className='section_header-text-image'>
      <div className='padding-global'>
        <div className='container-large'>
          <div className='padding-section-medium pb-1'>
            <div className='w-layout-grid header-text-image_component mt-4'>
              <div className='header-text-image_content'>
                <div className='margin-bottom margin-small'>
                  <h1 className='heading-style-h3'>
                    <span className='text-gradient-light-pink-lilac'>Interoperable XFI</span> <br />
                    Only need $XFI
                  </h1>
                </div>
                <p className='text-size-medium'>
                  Gasless cross-chain transactions, Transfers tokens together with data & programs to other networks.
                  All you need is to hold only XFI for managing all assets.
                </p>
                <div className='padding-section-medium md:pt-[90px] pb-0'>
                  <div className='button-group check-now-btn'>
                    <a className='button is-desktop-modal w-button interact-button'>Check Now</a>
                  </div>
                </div>
              </div>
              <div className='header-text-image_image-wrapper'>
                <img src='/images/ixfi-cover.png' alt='' className='header-text-image_image' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Introduction

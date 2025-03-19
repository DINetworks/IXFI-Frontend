const Introduction = () => {
  return (
    <section class='section_header-text-image'>
      <div class='padding-global'>
        <div class='container-large'>
          <div class='padding-section-medium pb-1'>
            <div class='w-layout-grid header-text-image_component mt-4'>
              <div class='header-text-image_content'>
                <div class='margin-bottom margin-small'>
                  <h1 class='heading-style-h3'>
                    <span class='text-gradient-light-pink-lilac'>Interoperable XFI</span> <br />
                    Only need $XFI
                  </h1>
                </div>
                <p class='text-size-medium'>
                  Gasless cross-chain transactions, Transfers tokens together with data & programs to other networks.
                  All you need is to hold only XFI for managing all assets.
                </p>
                <div class='padding-section-medium md:pt-[90px] pb-0'>
                  <div class='button-group check-now-btn'>
                    <a class='connectButton button is-desktop-modal w-button interact-button'>Check Now</a>
                  </div>
                </div>
              </div>
              <div class='header-text-image_image-wrapper'>
                <img src='/images/ixfi-cover.png' alt='' class='header-text-image_image' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Introduction

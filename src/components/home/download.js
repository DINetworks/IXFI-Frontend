const Download = () => {
  return (
    <section id='download-section' className='section_newsletter-signup margin-bottom margin-xxlarge'>
      <div className='padding-global'>
        <div className='container-large'>
          <div className='w-layout-grid newsletter-signup_component background-gradient-card-hover'>
            <div className='download-card is-large'>
              <div className='newsletter-signup_content'>
                <div className='max-width-large'>
                  <div className='margin-bottom margin-medium'>
                    <div className='margin-bottom margin-medium'>
                      <button className='button is-navbar-button w-button interact-button'>Comming soon</button>
                    </div>
                    <h3>Download IXFI App</h3>
                    <p className='download-page-paragraph'>
                      Unlock the power of IXFI App on your favourite devices. Seamlessly use gasless(meta) transactions
                      across Mac, Windows, iOS, and Android.
                    </p>
                  </div>
                  <div className='download-logo-wrapper'></div>
                  <div className='download-mobile'>
                    <a href='#' className='button-icon w-inline-block'>
                      <img src='/images/icons/apple-app.svg' alt='' />
                      <div>iOS</div>
                    </a>
                    <a href='#' className='button-icon w-inline-block'>
                      <img src='/images/icons/android-app.svg' loading='lazy' alt='' />
                      <div>Android</div>
                    </a>
                  </div>
                  <div className='download-desktop'>
                    <a href='#' className='button-icon desktop-download-button w-inline-block'>
                      <img src='/images/icons/apple-app.svg' loading='lazy' id='button-desktop-mac-i' alt='' />
                      <div id='button-desktop-mac-t'>MacOS</div>
                      <img src='/images/icons/download-app.svg' loading='lazy' alt='' />
                    </a>
                    <a href='#' className='button-icon desktop-download-button w-inline-block'>
                      <img src='/images/icons/windows-app.svg' loading='lazy' alt='' />
                      <div id='button-desktop-mac-t'>Windows</div>
                      <img src='/images/icons/download-app.svg' loading='lazy' alt='' />
                    </a>
                  </div>
                </div>
              </div>
              <div className='lgin-modal1_qr-wrapper is-download-page'>
                <img src='/images/icons/qr.svg' loading='lazy' alt='' className='qr-code' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Download

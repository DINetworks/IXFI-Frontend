const NewsLetter = () => {
  return (
    <section className='section_newsletter-signup'>
      <div className='padding-global'>
        <div className='container-large'>
          <div className='padding-section-large'>
            <div className='w-layout-grid newsletter-signup_component'>
              <div className='newsletter-signup_card background-gradient-radial-pink-lilac'>
                <div className='newsletter-signup_content'>
                  <div className='max-width-large'>
                    <div className='margin-bottom margin-xsmall'>
                      <h2 className='heading-style-h2'>Join our newsletter</h2>
                    </div>
                    <p className='text-color-gray'>Subscribe to all newsletters, or pick your favorites</p>
                  </div>
                </div>
                <div className='download_form-block w-form'>
                  <form action='#' method='post'>
                    <div className='download_form'>
                      <div className='input-block'>
                        <input
                          className='text-field w-input'
                          name='email'
                          placeholder='Enter your email'
                          type='email'
                        />
                      </div>
                      <input type='submit' className='button w-button' value='Sign Up' />
                    </div>
                    <div className='text-size-tiny'>
                      By clicking Sign Up you're confirming that you agree with our
                      <a href='#' className='text-link-light homepage-tnc interact-button'>
                        Terms and Conditions
                      </a>
                      .
                    </div>
                    <div>
                      <div>
                        <input type='hidden' value='' />
                      </div>
                    </div>
                  </form>
                  <div className='success-message w-form-done'>
                    <div className='div-block-2'>
                      <img
                        src='./Uniswap _ Portfolio Tracker_files/65266a4434fd99c7f31a619f_Radio.svg'
                        alt='Check symbol'
                        className='success-message-icon'
                      />
                      <h5 className='text-color-black succes'>Thank you for signing up!</h5>
                    </div>
                    <div className='text-block-3 homepage-tnc'>
                      You’ll be able to unsubscribe from the newsletter at any time by using the unsubscribe link in the
                      newsletter footer.
                    </div>
                  </div>
                  <div className='error-message w-form-fail'>
                    <div>Oops! Something went wrong while submitting the form.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsLetter

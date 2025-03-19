const NewsLetter = () => {
  return (
    <section class='section_newsletter-signup'>
      <div class='padding-global'>
        <div class='container-large'>
          <div class='padding-section-large'>
            <div class='w-layout-grid newsletter-signup_component'>
              <div class='newsletter-signup_card background-gradient-radial-pink-lilac'>
                <div class='newsletter-signup_content'>
                  <div class='max-width-large'>
                    <div class='margin-bottom margin-xsmall'>
                      <h2 class='heading-style-h2'>Join our newsletter</h2>
                    </div>
                    <p class='text-color-gray'>Subscribe to all newsletters, or pick your favorites</p>
                  </div>
                </div>
                <div
                  fs-recptch-badge='false'
                  fs-recptch-element='form-block'
                  fs-recptch-loadingtext='Please wait'
                  fs-recptch-showconsole='true'
                  class='download_form-block w-form'
                >
                  <form
                    id='newsletter-sign-up'
                    name='wf-form-Newsletter-sign-up'
                    data-name='Newsletter sign-up'
                    action='https://delta.app/'
                    method='post'
                    data-wf-page-id='65d4dd923a7af018c0bb40e0'
                    data-wf-element-id='ae35a16e-70bc-10f1-5fe5-963fe633cf92'
                    data-turnstile-sitekey='0x4AAAAAAAQTptj2So4dx43e'
                    aria-label='Newsletter sign-up'
                  >
                    <div class='download_form'>
                      <div id='w-node-ae35a16e-70bc-10f1-5fe5-963fe633cf94-be8a97ff' class='input-block'>
                        <input
                          class='text-field w-input'
                          autocomplete='on'
                          name='email'
                          placeholder='Enter your email'
                          type='email'
                          id='email'
                        />
                      </div>
                      <input
                        type='submit'
                        data-wait='Please wait...'
                        id='newsletter-button'
                        class='button w-button'
                        value='Sign Up'
                      />
                    </div>
                    <div class='text-size-tiny'>
                      By clicking Sign Up you're confirming that you agree with our
                      <a hrefffff='https://delta.app/en/terms' class='text-link-light homepage-tnc interact-button'>
                        Terms and Conditions
                      </a>
                      .
                    </div>
                    <div>
                      <div>
                        <input
                          type='hidden'
                          name='cf-turnstile-response'
                          id='cf-chl-widget-y9e0w_response'
                          value='0.Psl7h0aI1dvBGMqHpmPUwzAPPDtvQcwJ0Mx0gxFi_B0IbWk6A5FiytTvIDMIaKMPIHqZ3bJVAKLSHxZ_QkOYuMUqTQquDqcUHUr2A_JL4ATzAA9Huukk76aJHIbAibwJEMANHpe12aIt_kN3ZM9pVwEMW9SCRl1ktoio5p6DT7gxM8NibNE9vnD9I7YDNxymZZ4l0hpxlB-F_XQtS78cRijYv31OTPk9INGyln4j14VcQzNnt9NX1Fm9-OmwQTr3oDrLXXwKPIsn1lzubMIBqriOlteRESIPbJXL7t1SWGzKEQh1gFET3CVeNxkx0iX-qH3hjS61IViOWIK4Zzcbt2qemscvZV6m0Zo2dXb5o361PN1pXG2_oSUGC7xGy6FivEWxPwM3u-GH0KO9JVnNdn3xhMf4A0DxQ7rVA_27fGyv6MIP5WwGtOvIQI3Z1NhjKAGN6-_e3rq1oAr3m4zmz_bmSfgFqjE08QoxYaPTBOgugPFfcTJYSM87iLL5AobywRvdHGPSG280BmZ3jig7txZ1-pZ8b0lOX6rHgTlcvCRrXlJukIJZhHnq--APIX4fKHSBeNDYiqHWeJ2gu7Crr5BVdbABk9eoFK8MKlRa5YChQ9lWVFxMch-TboeFzoPDW56wWS-CV06hJks1rDOmzxDaXvY08_sBZdMjvAHnxkuFXmj8fvodEGz4mpS5CI3GNIqqRWSvYTeYBrj0CZpu3-lF4uB6VXPD8Fjtwjfpkar-OyvKmd7LOPAQADn_zzphXPkopvsU9dVYrfPsVKFJmaYpH3t2RNP-Qr2jYC6sAL1FlS-bAmTBjTLIIO0ykZen9IEAYpoMmxhybheHEQbCZkE4-a-CsU76DJmaeUDVZJA.1urrlHD8aq_H0Q-3DEZXLw.fb251ab37c59fb5d3d178cea0c1804640a7e1169e4359a7b0aaa1d7efdaff72b'
                        />
                      </div>
                    </div>
                  </form>
                  <div
                    fs-recptch-element='success'
                    class='success-message w-form-done'
                    tabindex='-1'
                    role='region'
                    aria-label='Newsletter sign-up success'
                  >
                    <div class='div-block-2'>
                      <img
                        src='./Uniswap _ Portfolio Tracker_files/65266a4434fd99c7f31a619f_Radio.svg'
                        alt='Check symbol'
                        class='success-message-icon'
                      />
                      <h5 class='text-color-black succes'>Thank you for signing up!</h5>
                    </div>
                    <div class='text-block-3 homepage-tnc'>
                      You’ll be able to unsubscribe from the newsletter at any time by using the unsubscribe link in the
                      newsletter footer.
                    </div>
                  </div>
                  <div class='error-message w-form-fail'>
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

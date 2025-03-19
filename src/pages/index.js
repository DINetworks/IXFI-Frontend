import ApiSDK from 'src/components/home/api-sdk'
import Applications from 'src/components/home/applications'
import Ecosystems from 'src/components/home/ecosystem'
import Features from 'src/components/home/features'
import Introduction from 'src/components/home/introduction'
import LogoSlider from 'src/components/home/logo-slider'
import NewsLetter from 'src/components/home/news-letter'

const Home = () => {
  return (
    <main class='main-wrapper'>
      <Introduction />
      <LogoSlider />
      <Features />
      <Ecosystems />
      {/* <Applications /> */}
      <ApiSDK />
      <NewsLetter />
    </main>
  )
}

export default Home

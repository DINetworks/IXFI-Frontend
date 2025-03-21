import Roadmap from 'src/components/home/roadmap'
import Applications from 'src/components/home/applications'
import Ecosystems from 'src/components/home/ecosystem'
import Features from 'src/components/home/features'
import Introduction from 'src/components/home/introduction'
import LogoSlider from 'src/components/home/logo-slider'
import NewsLetter from 'src/components/home/news-letter'
import Download from 'src/components/home/download'

const Home = () => {
  return (
    <main className='main-wrapper'>
      <Introduction />
      <LogoSlider />
      <Features />
      <Ecosystems />
      {/* <Applications /> */}
      <Download />
      <Roadmap />
      <NewsLetter />
    </main>
  )
}

export default Home

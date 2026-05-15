import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Work from './components/Work'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import { useSmoothScroll } from './hooks/useSmoothScroll'

function App() {
  useSmoothScroll()

  return (
    <>
      <CustomCursor />
      {/* Main content schuift over de sticky footer heen */}
      <div className="main-content">
        <Navbar />
        <Hero />
        <Intro />
        <Work />
      </div>
      <Footer />
    </>
  )
}

export default App

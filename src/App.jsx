import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Work from './components/Work'
import Footer from './components/Footer'
import { useSmoothScroll } from './hooks/useSmoothScroll'

function App() {
  useSmoothScroll()

  return (
    <>
      {/* Main content schuift over de sticky footer heen */}
      <div className="main-content">
        <Navbar />
        <Hero />
        <Work />
      </div>
      <Footer />
    </>
  )
}

export default App

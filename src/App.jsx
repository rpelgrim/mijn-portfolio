import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Work from './components/Work'
import { useSmoothScroll } from './hooks/useSmoothScroll'

function App() {
  useSmoothScroll()

  return (
    <>
      <Navbar />
      <Hero />
      <Work />
    </>
  )
}

export default App

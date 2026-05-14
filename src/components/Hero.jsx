import { useState } from 'react'
import HeroDistortion from './HeroDistortion'
import Loader from './Loader'
import './Hero.css'

function Hero() {
  const [framesDone, setFramesDone] = useState(false)
  const [loaderDone, setLoaderDone] = useState(false)

  const ready = framesDone && loaderDone

  return (
    <section className="hero">
      <Loader
        visible={!ready}
        onDone={() => setLoaderDone(true)}
      />
      <div className="hero__bg">
        <HeroDistortion
          onFramesReady={() => setFramesDone(true)}
          playing={ready}
        />
      </div>
    </section>
  )
}

export default Hero

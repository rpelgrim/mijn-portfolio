import { useState, useEffect, useRef } from 'react'
import HeroDistortion from './HeroDistortion'
import Loader from './Loader'
import './Hero.css'

function Hero() {
  const [framesDone, setFramesDone] = useState(false)
  const [loaderDone, setLoaderDone] = useState(false)
  const ready = framesDone && loaderDone

  const eyebrowRef = useRef(null)
  const nameRef    = useRef(null)
  const roleRef    = useRef(null)

  /* Scroll-animatie: tekst schuift uit beeld na intro */
  useEffect(() => {
    if (!ready) return

    /* Wacht tot intro-animaties klaar zijn voordat scroll actief wordt */
    let active = false
    const t = setTimeout(() => { active = true }, 2000)

    const onScroll = () => {
      if (!active) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) return
      const p = Math.min((window.scrollY / max) / 0.4, 1)

      if (eyebrowRef.current) {
        eyebrowRef.current.style.transform = `translateX(${p * 20}%)`
        eyebrowRef.current.style.opacity   = String(1 - p)
      }
      if (nameRef.current) {
        nameRef.current.style.transform = `translateX(${-p * 12}%)`
        nameRef.current.style.opacity   = String(1 - p)
      }
      if (roleRef.current) {
        roleRef.current.style.transform = `translateX(${p * 20}%)`
        roleRef.current.style.opacity   = String(1 - p)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(t)
      window.removeEventListener('scroll', onScroll)
    }
  }, [ready])

  return (
    <section className="hero">
      <Loader visible={!ready} onDone={() => setLoaderDone(true)} />
      <div className="hero__bg">
        <HeroDistortion
          onFramesReady={() => setFramesDone(true)}
          playing={ready}
        />
        <div className={`hero__content${ready ? ' hero__content--visible' : ''}`}>
          <p ref={eyebrowRef} className="hero__eyebrow">Hey I'am</p>
          <h1 ref={nameRef}   className="hero__name">Rowdy Pelgrim</h1>
          <p ref={roleRef}    className="hero__role">Digital Designer</p>
        </div>
      </div>
    </section>
  )
}

export default Hero

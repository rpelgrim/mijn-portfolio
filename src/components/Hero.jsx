import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import HeroDistortion from './HeroDistortion'
import Loader from './Loader'
import './Hero.css'

function Hero() {
  const [framesDone, setFramesDone] = useState(false)
  const [loaderDone, setLoaderDone] = useState(false)
  const ready = framesDone && loaderDone

  const heroRef    = useRef(null)
  const bgRef      = useRef(null)
  const contentRef = useRef(null)
  const eyebrowRef = useRef(null)
  const nameRef    = useRef(null)
  const roleRef    = useRef(null)

  /* clip-path animeren op scroll: visueel inset zonder canvas-resize */
  useEffect(() => {
    const bg = bgRef.current
    if (!bg) return

    const onScroll = () => {
      const p      = Math.max(0, Math.min(1, window.scrollY / 200))
      const inset  = 16 * (1 - p)
      const radius = 32 * (1 - p)
      bg.style.clipPath = `inset(${inset}px round ${radius}px)`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Heading vult altijd de volledige containerbreedte */
  useLayoutEffect(() => {
    const fit = () => {
      const container = contentRef.current
      const name      = nameRef.current
      if (!container || !name) return
      const containerWidth = container.getBoundingClientRect().width
      if (containerWidth === 0) return
      /* Meet intrinsieke tekstbreedte via max-content */
      name.style.fontSize = '100px'
      name.style.width    = 'max-content'
      const textWidth     = name.getBoundingClientRect().width
      name.style.width    = ''
      if (textWidth === 0) return
      name.style.fontSize = (containerWidth / textWidth * 100) + 'px'
    }
    /* Synchrone eerste meting (voorkomt flash) */
    fit()
    /* Herbereken wanneer custom fonts zeker geladen zijn */
    document.fonts.ready.then(fit)
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  /* Scroll-animatie: tekst schuift uit beeld na intro */
  useEffect(() => {
    if (!ready) return

    /* Wacht tot intro-animaties klaar zijn voordat scroll actief wordt */
    let active = false
    const t = setTimeout(() => {
      /* CSS animations-laag overschrijft inline styles; verwijder ze zodat
         de scroll-handler opacity en transform kan sturen */
      ;[eyebrowRef, nameRef, roleRef].forEach(ref => {
        if (!ref.current) return
        ref.current.style.animation = 'none'
        ref.current.style.opacity   = '1'
      })
      active = true
    }, 2000)

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
    <section ref={heroRef} className="hero">
      <Loader visible={!ready} onDone={() => setLoaderDone(true)} />
      <div ref={bgRef} className="hero__bg">
        <HeroDistortion
          onFramesReady={() => setFramesDone(true)}
          playing={ready}
        />
        <div ref={contentRef} className={`hero__content${ready ? ' hero__content--visible' : ''}`}>
          <p ref={eyebrowRef} className="hero__eyebrow">Hey, I'm</p>
          <h1 ref={nameRef}   className="hero__name">Rowdy Pelgrim</h1>
          <p ref={roleRef}    className="hero__role">Digital Designer</p>
        </div>
      </div>
    </section>
  )
}

export default Hero

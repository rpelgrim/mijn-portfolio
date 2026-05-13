import { useEffect, useRef } from 'react'
import HeroDistortion from './HeroDistortion'
import './Hero.css'

const TOKENS = ['Digital', 'Designer', '•', 'Rowdy', 'Pelgrim', '•']

function MarqueeCopy() {
  return (
    <span className="hero__marquee-copy">
      {TOKENS.map((token, i) => (
        <span key={i} className="hero__word">{token}</span>
      ))}
    </span>
  )
}

function Hero() {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let offset = 0
    let rafId

    /* Initieel gecentreerd inladen in kopie 2 (middelste) */
    const center = () => {
      const cw = track.offsetWidth / 3
      offset = cw + Math.max(0, (cw - window.innerWidth) / 2)
      track.style.transform = `translateX(${-offset}px)`
    }
    center()
    window.addEventListener('resize', center)

    const tick = () => {
      const cw = track.offsetWidth / 3

      offset -= 0.5

      if (offset < cw) offset += cw
      if (offset >= 2 * cw) offset -= cw

      track.style.transform = `translateX(${-offset}px)`
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', center)
    }
  }, [])

  return (
    <section className="hero">
      <div className="hero__bg">
        {/* Three.js achtergrond met pixel distortion op hover heading */}
        <HeroDistortion />

        <div className="hero__content">
          <h1 className="hero__name">
            <div ref={trackRef} className="hero__marquee-track">
              <MarqueeCopy />
              <MarqueeCopy />
              <MarqueeCopy />
            </div>
          </h1>
        </div>
      </div>
    </section>
  )
}

export default Hero

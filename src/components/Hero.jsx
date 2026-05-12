import { useEffect, useRef } from 'react'
import HeroDistortion from './HeroDistortion'
import './Hero.css'

function CharReveal({ text, className, baseDelay = 0 }) {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <span key={i} className="hero__char-clip">
          <span className="hero__char" style={{ animationDelay: `${baseDelay + i * 0.045}s` }}>
            {char}
          </span>
        </span>
      ))}
    </span>
  )
}

const TOKENS      = ['Digital', 'Designer', '•', 'Rowdy', 'Pelgrim', '•']
const START_DELAY = 0.5
const TOTAL_CHARS = TOKENS.reduce((sum, t) => sum + t.length, 0)
const REVEAL_END_MS = (START_DELAY + (TOTAL_CHARS - 1) * 0.045 + 0.9) * 1000 + 200

/* Cumulatieve vertraging op basis van karakters in voorgaande tokens */
function tokenDelay(index) {
  let chars = 0
  for (let i = 0; i < index; i++) chars += TOKENS[i].length
  return START_DELAY + chars * 0.045
}

function MarqueeCopy() {
  return (
    <span className="hero__marquee-copy">
      {TOKENS.map((token, i) => (
        <CharReveal
          key={i}
          text={token}
          className="hero__word"
          baseDelay={tokenDelay(i)}
        />
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

    const timeout = setTimeout(() => {
      rafId = requestAnimationFrame(tick)
    }, REVEAL_END_MS)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', center)
    }
  }, [])

  return (
    <section className="hero">
      <div className="hero__bg">
        {/* Three.js achtergrond met pixel distortion op hover heading */}
        <HeroDistortion />

        <div className="hero__reveal" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="hero__reveal-col" style={{ '--delay': `${i * 0.06}s` }} />
          ))}
        </div>

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

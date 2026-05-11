import { useEffect, useRef } from 'react'
import heroBg from '../assets/hero.webp'
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

    let offset      = 0
    let scrollBoost = 0
    let lastScrollY = window.scrollY
    let rafId

    /* Initieel gecentreerd inladen */
    const center = () => {
      const copyWidth = track.offsetWidth / 2
      offset = Math.max(0, (copyWidth - window.innerWidth) / 2)
      track.style.transform = `translateX(${-offset}px)`
    }
    center()
    window.addEventListener('resize', center)

    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY)
      scrollBoost = Math.min(scrollBoost + delta * 0.5, 25)
      lastScrollY = window.scrollY
    }

    const tick = () => {
      const copyWidth = track.offsetWidth / 2
      scrollBoost *= 0.3
      offset += 0.5 + scrollBoost
      if (offset >= copyWidth) offset -= copyWidth
      track.style.transform = `translateX(${-offset}px)`
      rafId = requestAnimationFrame(tick)
    }

    const timeout = setTimeout(() => {
      window.addEventListener('scroll', onScroll, { passive: true })
      rafId = requestAnimationFrame(tick)
    }, REVEAL_END_MS)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', center)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section className="hero">
      <div className="hero__bg" style={{ backgroundImage: `url(${heroBg})` }}>
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
            </div>
          </h1>
        </div>
      </div>
    </section>
  )
}

export default Hero

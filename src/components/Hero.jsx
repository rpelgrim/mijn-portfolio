import { useEffect, useRef } from 'react'
import heroBg from '../assets/hero.webp'
import './Hero.css'

function Hero() {
  const rowRef = useRef(null)

  useEffect(() => {
    const fit = () => {
      const rowdy = rowRef.current
      if (!rowdy) return

      rowdy.style.fontSize = '10vw'

      if (!rowdy.scrollWidth) return

      const ratio = (window.innerWidth * 0.9) / rowdy.scrollWidth
      rowdy.style.fontSize = `${10 * ratio}vw`
    }

    document.fonts.ready.then(() => requestAnimationFrame(fit))
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  return (
    <section className="hero">
      <div
        className="hero__bg"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Reveal overlay: 6 kolommen krimpen weg zodat de hero van onder naar boven tevoorschijn komt */}
        <div className="hero__reveal" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="hero__reveal-col"
              style={{ '--delay': `${i * 0.06}s` }}
            />
          ))}
        </div>

        <div className="hero__content">
          <p className="hero__tagline">Digital Designer</p>
          <h1 className="hero__name">
            <span ref={rowRef} className="hero__word hero__word--left">Rowdy Pelgrim</span>
          </h1>
        </div>
      </div>
    </section>
  )
}

export default Hero

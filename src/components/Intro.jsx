import { useEffect, useRef } from 'react'
import ArrowLink from './ArrowLink'
import './Intro.css'

const TEKST = "I believe great design is more than what meets the eye — it is the force behind experiences that endure. As a Digital Designer, I translate complex challenges into clear, effective digital products that truly resonate."

const WAVE = 0.15

function Intro() {
  const sectionRef  = useRef(null)
  const spansRef    = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const spans = spansRef.current.filter(Boolean)
    const total = spans.length

    /* Scroll-driven character kleur animatie; triggert divider + link op 75% */
    const onScroll = () => {
      const rect     = section.getBoundingClientRect()
      const viewH    = window.innerHeight
      const progress = Math.max(0, Math.min(1,
        (viewH - rect.top) / (rect.height + viewH * 0.4)
      ))
      const p      = progress * (1 + WAVE)
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark'

      spans.forEach((span, i) => {
        const charP = Math.max(0, Math.min(1, (p - i / total) / WAVE))
        /* Light: #CCCCCC (204) → #111111 (17)
           Dark:  #333333  (51) → #F5F5F5 (245) */
        const v = isDark
          ? Math.round(51  + charP * 194)
          : Math.round(204 - charP * 187)
        span.style.color = `rgb(${v},${v},${v})`
      })

      if (progress >= 0.40 && !section.classList.contains('intro--ready')) {
        section.classList.add('intro--ready')
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    /* Eenmalige reveal voor tekst, divider en link */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add('intro--visible')
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(section)

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <section ref={sectionRef} className="intro">
      <p className="intro__tagline">About me</p>
      <p className="intro__text">
        {[...TEKST].map((char, i) => (
          <span key={i} ref={el => { spansRef.current[i] = el }}>
            {char}
          </span>
        ))}
      </p>
      <hr className="intro__divider" />
      <div className="intro__link-wrap">
        <ArrowLink href="#cases">Continue reading</ArrowLink>
      </div>
    </section>
  )
}

export default Intro

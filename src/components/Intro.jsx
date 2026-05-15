import { useEffect, useRef } from 'react'
import './Intro.css'

const TEKST = "I believe great design is more than what meets the eye — it is the force behind experiences that endure. As a Digital Designer, I translate complex challenges into clear, effective digital products that truly resonate."

const WAVE = 0.15

function Intro() {
  const sectionRef = useRef(null)
  const spansRef   = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const spans = spansRef.current.filter(Boolean)
    const total = spans.length

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
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={sectionRef} className="intro">
      <p className="intro__text">
        {[...TEKST].map((char, i) => (
          <span key={i} ref={el => { spansRef.current[i] = el }}>
            {char}
          </span>
        ))}
      </p>
    </section>
  )
}

export default Intro

import { useEffect, useRef } from 'react'
import './CustomCursor.css'

/* Hoe snel de ring de muis volgt (0 = nooit, 1 = direct) */
const EASE = 0.12

function CustomCursor() {
  const dotRef    = useRef(null)
  const ringRef   = useRef(null)
  const bekijkRef = useRef(null)

  useEffect(() => {
    /* Alleen op apparaten met een muis/trackpad */
    if (window.matchMedia('(pointer: coarse)').matches) return

    let mouseX = -200
    let mouseY = -200
    let ringX  = -200
    let ringY  = -200
    let rafId

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      /* Wissel naar bekijk-cursor wanneer de muis over een project-kaart beweegt */
      const isBekijk = !!e.target.closest('[data-cursor="bekijk"]')
      bekijkRef.current.classList.toggle('cursor__bekijk--visible', isBekijk)
      dotRef.current.classList.toggle('cursor__dot--hidden', isBekijk)
      ringRef.current.classList.toggle('cursor__ring--hidden', isBekijk)
    }

    const tick = () => {
      /* Stip en bekijk-cirkel volgen direct */
      dotRef.current.style.transform    = `translate(${mouseX - 6}px, ${mouseY - 6}px)`
      bekijkRef.current.style.transform = `translate(${mouseX - 40}px, ${mouseY - 40}px)`

      /* Ring lerpt achter de muis aan */
      ringX += (mouseX - ringX) * EASE
      ringY += (mouseY - ringY) * EASE
      ringRef.current.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`

      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}    className="cursor__dot" />
      <div ref={ringRef}   className="cursor__ring" />
      <div ref={bekijkRef} className="cursor__bekijk">Bekijk</div>
    </>
  )
}

export default CustomCursor

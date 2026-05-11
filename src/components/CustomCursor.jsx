import { useEffect, useRef } from 'react'
import './CustomCursor.css'

/* Hoe snel de ring de muis volgt (0 = nooit, 1 = direct) */
const EASE = 0.12

function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    /* Alleen op apparaten met een muis/trackpad */
    if (window.matchMedia('(pointer: coarse)').matches) return

    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let rafId

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const tick = () => {
      /* Stip volgt direct */
      dotRef.current.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`

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
      <div ref={dotRef} className="cursor__dot" />
      <div ref={ringRef} className="cursor__ring" />
    </>
  )
}

export default CustomCursor

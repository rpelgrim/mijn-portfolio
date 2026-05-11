import { useEffect, useRef } from 'react'
import './CustomCursor.css'

const EASE = 0.12

/* Checkt of het element of een voorouder interactief is */
const isInteractive = (el) =>
  !!el.closest('a, button, input, textarea, select, label, [role="button"]')

function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    let mouseX = -100
    let mouseY = -100
    let ringX  = -100
    let ringY  = -100
    let rafId

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onOver = (e) => {
      if (isInteractive(e.target)) {
        dotRef.current.classList.add('cursor__dot--hover')
        ringRef.current.classList.add('cursor__ring--hover')
      }
    }

    const onOut = (e) => {
      if (isInteractive(e.target)) {
        dotRef.current.classList.remove('cursor__dot--hover')
        ringRef.current.classList.remove('cursor__ring--hover')
      }
    }

    /* Stip: vaste breedte 16px, gecentreerd op 8px offset */
    /* Ring: vaste breedte 32px, gecentreerd op 16px offset */
    const tick = () => {
      dotRef.current.style.transform  = `translate(${mouseX - 8}px, ${mouseY - 8}px)`

      ringX += (mouseX - ringX) * EASE
      ringY += (mouseY - ringY) * EASE
      ringRef.current.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`

      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mouseout',  onOut)
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mouseout',  onOut)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor__dot" />
      <div ref={ringRef} className="cursor__ring" />
    </>
  )
}

export default CustomCursor

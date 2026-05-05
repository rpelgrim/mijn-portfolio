import { useEffect } from 'react'

const EASE = 0.08

export function useSmoothScroll() {
  useEffect(() => {
    /* Sla over op touch-apparaten */
    if (window.matchMedia('(pointer: coarse)').matches) return

    let targetY = window.scrollY
    let currentY = window.scrollY
    let rafId = null

    const maxScroll = () =>
      document.documentElement.scrollHeight - window.innerHeight

    const animate = () => {
      const diff = targetY - currentY
      if (Math.abs(diff) < 0.5) {
        currentY = targetY
        window.scrollTo(0, currentY)
        rafId = null
        return
      }
      currentY = currentY + diff * EASE
      window.scrollTo(0, currentY)
      rafId = requestAnimationFrame(animate)
    }

    const onWheel = (e) => {
      e.preventDefault()
      targetY = Math.max(0, Math.min(maxScroll(), targetY + e.deltaY))
      if (!rafId) rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', onWheel)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])
}

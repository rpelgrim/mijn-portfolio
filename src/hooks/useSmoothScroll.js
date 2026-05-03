import { useEffect } from 'react'

const EASE = 0.08

export function useSmoothScroll() {
  useEffect(() => {
    let targetY = window.scrollY
    let currentY = window.scrollY
    let rafId

    const maxScroll = () =>
      document.documentElement.scrollHeight - window.innerHeight

    const onWheel = (e) => {
      e.preventDefault()
      targetY = Math.max(0, Math.min(maxScroll(), targetY + e.deltaY))
    }

    const tick = () => {
      const diff = targetY - currentY
      currentY = Math.abs(diff) < 0.5 ? targetY : currentY + diff * EASE
      window.scrollTo(0, currentY)
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('wheel', onWheel)
      cancelAnimationFrame(rafId)
    }
  }, [])
}

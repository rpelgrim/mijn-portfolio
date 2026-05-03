import { useEffect, useRef } from 'react'
import './Work.css'

/* Tijdelijke projectdata */
const projects = [
  { id: 1, title: 'Project Naam', category: 'Branding' },
  { id: 2, title: 'Project Naam', category: 'UI Design' },
  { id: 3, title: 'Project Naam', category: 'Motion' },
]

function Work() {
  const wrapperRef = useRef(null)
  const sectionRef = useRef(null)
  const scrollRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const section = sectionRef.current
    const scrollEl = scrollRef.current
    const track = trackRef.current
    if (!wrapper || !section || !scrollEl || !track) return

    const EASE = 0.08
    let current = 0
    let target = 0
    let rafId = null

    const getTarget = () => {
      const scrollableWidth = track.scrollWidth - scrollEl.offsetWidth
      if (scrollableWidth <= 0) return { target: 0, scrollableWidth: 0 }

      wrapper.style.height = `calc(100svh + ${scrollableWidth}px)`

      const progress = Math.max(0, Math.min(1,
        -wrapper.getBoundingClientRect().top / scrollableWidth
      ))
      return { target: progress * scrollableWidth, scrollableWidth }
    }

    const tick = () => {
      /* Lerp: huidige positie beweegt elke frame 8% richting doel */
      current += (target - current) * EASE
      track.style.transform = `translateX(${-current}px)`
      rafId = requestAnimationFrame(tick)
    }

    const onScroll = () => {
      const { target: t } = getTarget()
      target = t
    }

    const onResize = () => {
      const { target: t } = getTarget()
      target = t
      current = t
    }

    getTarget()
    rafId = requestAnimationFrame(tick)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="work-wrapper" ref={wrapperRef}>
      <section className="work" id="work" ref={sectionRef}>
        <div className="work__header">
          <h2 className="work__title">Work</h2>
          <p className="work__description">Een selectie van mijn recente projecten.</p>
        </div>

        <div className="work__scroll" ref={scrollRef}>
          <div className="work__track" ref={trackRef}>
            {projects.map((project) => (
              <article key={project.id} className="work__card">
                <div className="work__card-image">
                  <span className="material-symbols-outlined work__card-placeholder">image</span>
                </div>
                <div className="work__card-info">
                  <span className="work__card-category">{project.category}</span>
                  <h3 className="work__card-title">{project.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Work

import { useEffect, useRef } from 'react'
import './Work.css'

const projects = [
  {
    id: 1,
    title: 'Form & Story',
    category: 'Branding',
    year: '2024',
    image: 'https://picsum.photos/seed/11/1200/900',
    description: 'A complete brand identity for an independent publishing house. From logotype to typographic system — everything breathed the feeling of careful craftsmanship. The result: a visual language as timeless as it is distinctive.',
    link: '#',
  },
  {
    id: 2,
    title: 'Studio Helder',
    category: 'UI Design',
    year: '2024',
    image: 'https://picsum.photos/seed/42/1200/900',
    description: 'Digital platform for an architecture studio with a strong focus on white space and hierarchy. The interface guides visitors calmly through an extensive portfolio without overwhelming them. Every screen is a composition in itself.',
    link: '#',
  },
  {
    id: 3,
    title: 'Movement as Language',
    category: 'Motion',
    year: '2023',
    image: 'https://picsum.photos/seed/73/1200/900',
    description: 'A series of animations for the rebrand of an Amsterdam cultural centre. Movement was used as a carrier of the new brand personality. Subtle, intentional and always in service of the story.',
    link: '#',
  },
  {
    id: 4,
    title: 'Ground & Growth',
    category: 'Web Design',
    year: '2023',
    image: 'https://picsum.photos/seed/58/1200/900',
    description: 'Website for a sustainable farming collective that puts transparency at its core. The site connects consumers directly to the farmers behind their food. Warm, honest and functional — just like the product itself.',
    link: '#',
  },
  {
    id: 5,
    title: 'Light & Line',
    category: 'Art Direction',
    year: '2022',
    image: 'https://picsum.photos/seed/97/1200/900',
    description: 'Art direction for a photography exhibition on urban architecture. The visual presentation seamlessly matched the theme: sharp, layered and with a keen eye for detail. From poster to catalogue, everything aligned.',
    link: '#',
  },
]

const N = projects.length

function Work() {
  const wrapperRef    = useRef(null)
  const imagesRef     = useRef([])
  const infoTrackRef  = useRef(null)
  const counterRef    = useRef(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    let prev = -1

    const update = () => {
      if (window.innerWidth <= 768) return

      const rect     = wrapper.getBoundingClientRect()
      const scrolled = -rect.top
      const total    = rect.height - window.innerHeight
      if (total <= 0) return

      /* Scrub: direct gekoppeld aan scrollpositie, geen lerp */
      const progress = Math.max(0, Math.min(1, scrolled / total))

      /*
       * Eén gedeelde waarde drijft zowel afbeeldingen als tekst.
       * textPct = 0 bij project 0, 100 bij project 1, 200 bij project 2, …
       * Beide transforms gebruiken exact dezelfde bron zodat ze pixel-synchroon lopen.
       */
      const textPct = progress * (N - 1) * 100

      /* Afbeeldingen: iets sneller dan de tekst via een factor > 1 */
      const imgFactor = 1
      imagesRef.current.forEach((el, i) => {
        if (!el) return
        el.style.transform = `translateY(${Math.max(0, i * 100 - textPct * imgFactor)}%)`
      })

      /* Tekst-track: scrollt identiek mee */
      if (infoTrackRef.current) {
        infoTrackRef.current.style.transform = `translateY(-${textPct}%)`
      }

      /* Teller bijwerken */
      const index = Math.floor(Math.min(progress * N, N - 1))
      if (index !== prev) {
        prev = index
        if (counterRef.current) {
          counterRef.current.textContent =
            `${String(index + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`
        }
      }
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      className="work-wrapper"
      id="work"
      ref={wrapperRef}
      style={{ height: `calc(${N} * 100svh)` }}
    >
      {/* Desktop: vaste image-kolom links, info rechts */}
      <section className="work work--desktop">
        <div className="work__stage" >

          {/* Afbeeldingen stapelen binnen één vaste container */}
          <div className="work__image-col">
            {projects.map((project, i) => (
              <img
                key={project.id}
                src={project.image}
                alt={project.title}
                className="work__img"
                ref={(el) => (imagesRef.current[i] = el)}
              />
            ))}
          </div>

          {/* Info blokken schuiven omhoog via een bewegende track */}
          <div className="work__info-col">
            <div className="work__info-track" ref={infoTrackRef}>
              {projects.map((project, i) => (
                <div key={project.id} className="work__info">
                  <h3 className="work__title">{project.title}</h3>
                  <p className="work__desc">{project.description}</p>
                  <a href={project.link} className="work__link">View project</a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <span className="work__counter" ref={counterRef}>
          01 / {String(N).padStart(2, '0')}
        </span>
      </section>

      {/* Mobiel: sticky cards die over elkaar schuiven */}
      <div className="work-mobile">
        {projects.map((project, i) => (
          <article key={project.id} className="work-mobile__card" >
            <div className="work-mobile__image">
              <img src={project.image} alt={project.title} className="work-mobile__img" />
            </div>
            <div className="work-mobile__info">
              <h3 className="work__title">{project.title}</h3>
              <p className="work__desc">{project.description}</p>
              <a href={project.link} className="work__link">View project</a>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Work

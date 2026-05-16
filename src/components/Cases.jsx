import './Cases.css'

const projects = [
  {
    id: '01',
    title: 'Form & Story',
    category: 'Branding',
    year: '2024',
    image: 'https://picsum.photos/seed/11/1200/900',
    isNew: true,
  },
  {
    id: '02',
    title: 'Studio Helder',
    category: 'UI Design',
    year: '2024',
    image: 'https://picsum.photos/seed/42/1200/900',
  },
  {
    id: '03',
    title: 'Movement as Language',
    category: 'Motion',
    year: '2023',
    image: 'https://picsum.photos/seed/73/1200/900',
  },
  {
    id: '04',
    title: 'Ground & Growth',
    category: 'Web Design',
    year: '2023',
    image: 'https://picsum.photos/seed/58/1200/900',
  },
  {
    id: '05',
    title: 'Light & Line',
    category: 'Art Direction',
    year: '2022',
    image: 'https://picsum.photos/seed/97/1200/900',
  },
]

function Cases() {
  return (
    <section className="cases" id="cases">
      <div className="cases__header">
        <p className="cases__tagline">Selected work</p>
        <h2 className="cases__heading">Work</h2>
      </div>

      <ul className="cases__list">
        {projects.map((project) => (
          <li key={project.id} className="cases__item">
            <a href="#" className="cases__card">

              {/* Desktop: info links, image rechts */}
              {/* Mobile: image boven, info onder */}
              <div className="cases__info">
                <div className="cases__top">
                  <span className="cases__num">{project.id}</span>
                  <div className="cases__tags">
                    <span className="cases__category">{project.category}</span>
                    {project.isNew && <span className="cases__badge">New</span>}
                  </div>
                  <span className="cases__year">{project.year}</span>
                </div>
                <h3 className="cases__title">{project.title}</h3>
                <span className="cases__cta">
                  View case
                  <span className="material-symbols-outlined">arrow_forward</span>
                </span>
              </div>

              <div className="cases__img-wrap">
                <img
                  src={project.image}
                  alt={project.title}
                  className="cases__img"
                />
              </div>

            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Cases

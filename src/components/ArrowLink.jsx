import './ArrowLink.css'

function ArrowLink({ href = '#', children }) {
  return (
    <a href={href} className="arrow-link">
      <span className="arrow-link__circle" aria-hidden="true">
        <span className="material-symbols-outlined">arrow_forward</span>
      </span>
      <span className="arrow-link__label">{children}</span>
    </a>
  )
}

export default ArrowLink

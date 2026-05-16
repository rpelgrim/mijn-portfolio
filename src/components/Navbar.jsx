import { useState, useEffect } from 'react'
import logo from '../assets/logo-rp-01.svg'
import './Navbar.css'

const menuItems = [
  { label: 'Home', icon: 'home',  href: '#home' },
  { label: 'Expertise', icon: 'cases', href: '#work' },
]

function Navbar() {
  const [open, setOpen]     = useState(false)
  const [dark, setDark]     = useState(false)
  const [scroll, setScroll] = useState(0)
  const [atBottom, setAtBottom] = useState(false)

  /* Thema op <html> zetten */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  /* Scrollvoortgang bijhouden + navbar verbergen onderaan */
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.round((window.scrollY / max) * 100) : 0
      setScroll(progress)
      setAtBottom(progress >= 99)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`navbar-wrapper${atBottom ? ' navbar-wrapper--hidden' : ''}`}
      onAnimationEnd={(e) => { e.currentTarget.style.animation = 'none' }}
    >
      {/* Dropdown */}
      <div className={`navbar__dropdown${open ? ' navbar__dropdown--open' : ''}`}>
        {menuItems.map(({ label, icon, href }) => (
          <a
            key={label}
            href={href}
            className="navbar__item"
            onClick={(e) => {
              e.preventDefault()
              setOpen(false)
              const target = document.querySelector(href)
              if (target) target.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            <div className="navbar__item-icon">
              <span className="material-symbols-outlined">{icon}</span>
            </div>
            <span className="navbar__item-label">{label}</span>
          </a>
        ))}
      </div>

      {/* Navbar */}
      <nav className="navbar">
        {/* Eerste rij: logo, naam en hamburger */}
        <div className="navbar__row">
          <div className="navbar__left">
            <div className="navbar__logo">
              <img src={logo} alt="RP logo" />
            </div>
            <div className="navbar__identity">
              <span className="navbar__name">Rowdy Pelgrim</span>
              <span className="navbar__title">Digital Designer</span>
            </div>
          </div>
          <button
            className="navbar__menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
          >
            <span className={`material-symbols-outlined navbar__menu-icon${open ? ' navbar__menu-icon--open' : ''}`}>
              {open ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        <div className="navbar__divider" />

        {/* Tweede rij: theme toggle en scroll progress */}
        <div className="navbar__subrow">
          <button
            className="navbar__theme-btn"
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined">
              {dark ? 'light_mode' : 'dark_mode'}
            </span>
            <span className="navbar__theme-label">{dark ? 'Light' : 'Dark'}</span>
          </button>

          <div className="navbar__progress-pill">
            <span>{scroll}%</span>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar

import { useEffect, useState } from 'react'
import './Loader.css'

const START_YEAR = 1989
const END_YEAR   = new Date().getFullYear()
const PAUSE_MS   = 700
const COUNT_MS   = 2200

/* Per cijferpositie: welke waarde heeft dat cijfer in elk jaar van 1989→heden */
const years = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, i) => START_YEAR + i)
const digitCols = [0, 1, 2, 3].map(pos =>
  years.map(y => String(y).padStart(4, '0')[pos])
)

/* Leeftijd op basis van geboortedatum — niet visueel zichtbaar */
const BIRTHDAY = new Date(1989, 9, 19) // 19 oktober 1989
const ages = years.map(y => {
  const ref = y === END_YEAR ? new Date() : new Date(y, 11, 31)
  let age = ref.getFullYear() - BIRTHDAY.getFullYear()
  const m = ref.getMonth() - BIRTHDAY.getMonth()
  if (m < 0 || (m === 0 && ref.getDate() < BIRTHDAY.getDate())) age--
  return Math.max(0, age)
})

/* Quintic ease-in-out → traag begin, razendsnel midden, zacht einde */
const easeInOutQuint = t =>
  t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2

function YearDisplay({ yearIdx }) {
  return (
    <div className="loader__content">
      <div className="loader__year" aria-hidden="true">
        {digitCols.map((col, pos) => (
          <div key={pos} className="loader__digit">
            <div
              className="loader__digit-col"
              style={{ transform: `translateY(-${yearIdx}em)` }}
            >
              {col.map((d, i) => <span key={i}>{d}</span>)}
            </div>
          </div>
        ))}
      </div>
      <div className="loader__age" aria-hidden="true">
        {ages[yearIdx] === 0 ? 'geboren' : `${ages[yearIdx]} jaar`}
      </div>
    </div>
  )
}

function Loader({ visible, onDone }) {
  const [yearIdx,  setYearIdx]  = useState(0)
  const [fillPct,  setFillPct]  = useState(0)

  useEffect(() => {
    let rafId
    const timer = setTimeout(() => {
      const start = performance.now()

      const animate = (now) => {
        const p = Math.min((now - start) / COUNT_MS, 1)
        const e = easeInOutQuint(p)
        setYearIdx(Math.round(e * (years.length - 1)))
        setFillPct(e * 100)
        if (p < 1) {
          rafId = requestAnimationFrame(animate)
        } else {
          onDone?.()
        }
      }
      rafId = requestAnimationFrame(animate)
    }, PAUSE_MS)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div className={`loader${visible ? '' : ' loader--hidden'}`}>

      {/* Laag 1: lichte achtergrond + donkere tekst */}
      <div className="loader__layer loader__layer--light">
        <YearDisplay yearIdx={yearIdx} />
      </div>

      {/* Laag 2: accentkleur + witte tekst, vult van onder naar boven */}
      <div
        className="loader__layer loader__layer--accent"
        style={{ clipPath: `inset(${100 - fillPct}% 0 0 0)` }}
      >
        <YearDisplay yearIdx={yearIdx} />
      </div>

      {/* Screenreader-tekst */}
      <span className="loader__sr-year" aria-live="polite">
        {years[yearIdx]}, {ages[yearIdx]} jaar
      </span>
    </div>
  )
}

export default Loader

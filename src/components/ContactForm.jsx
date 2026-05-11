import { useState, useEffect, useRef } from 'react'
import avatarImg from '../assets/rowdy.jpg'
import './ContactForm.css'

const STEPS = [
  {
    message: 'Hey! Leuk dat je contact opneemt. Wat is je voornaam?',
    field: 'firstName',
    label: 'Voornaam*',
    type: 'text',
  },
  {
    message: 'Fijn om je te leren kennen! En je achternaam?',
    field: 'lastName',
    label: 'Achternaam*',
    type: 'text',
  },
  {
    message: 'Super! Op welk e-mailadres kan ik je bereiken?',
    field: 'email',
    label: 'E-mailadres*',
    type: 'email',
  },
  {
    message: 'Bijna klaar! Vertel me waar je mee aan de slag wil.',
    field: 'message',
    label: 'Bericht*',
    type: 'textarea',
  },
]

function ContactForm() {
  const [step, setStep] = useState(0)
  const [values, setValues] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const inputRef = useRef(null)

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1
  const hasValue = !!(values[current?.field] || '').trim()

  useEffect(() => {
    inputRef.current?.focus()
  }, [step])

  const handleNext = () => {
    if (!hasValue) return
    if (isLast) {
      const subject = encodeURIComponent(`Contactverzoek van ${values.firstName} ${values.lastName}`)
      const body = encodeURIComponent(
        `Naam: ${values.firstName} ${values.lastName}\nE-mail: ${values.email}\n\n${values.message}`
      )
      window.location.href = `mailto:rowdypelgrim@gmail.com?subject=${subject}&body=${body}`
      setSubmitted(true)
    } else {
      setStep(s => s + 1)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && current.type !== 'textarea') handleNext()
  }

  const bubbleMessage = submitted
    ? 'Bedankt voor je bericht! Ik neem zo snel mogelijk contact met je op.'
    : current?.message.replace('{firstName}', values.firstName || '')

  return (
    <div className="contact-form">
      <div className="contact-form__top">
        <img src={avatarImg} className="contact-form__avatar" alt="Rowdy Pelgrim" />
        <div className="contact-form__bubble">{bubbleMessage}</div>
      </div>

      {!submitted && (
        <>
          <div className="contact-form__input-wrap">
            {current.type === 'textarea' ? (
              <textarea
                ref={inputRef}
                className="contact-form__input"
                placeholder={current.label}
                value={values[current.field] || ''}
                onChange={(e) => setValues((v) => ({ ...v, [current.field]: e.target.value }))}
                rows={3}
              />
            ) : (
              <input
                ref={inputRef}
                className="contact-form__input"
                type={current.type}
                placeholder={current.label}
                value={values[current.field] || ''}
                onChange={(e) => setValues((v) => ({ ...v, [current.field]: e.target.value }))}
                onKeyDown={handleKeyDown}
              />
            )}
          </div>

          <div className="contact-form__footer">
            <div className="contact-form__dots">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className={[
                    'contact-form__dot',
                    i === step ? 'contact-form__dot--active' : '',
                    i < step ? 'contact-form__dot--done' : '',
                  ].join(' ')}
                />
              ))}
            </div>
            <button
              className="contact-form__next"
              onClick={handleNext}
              disabled={!hasValue}
              aria-label={isLast ? 'Versturen' : 'Volgende'}
            >
              <span className="material-symbols-outlined">
                {isLast ? 'send' : 'arrow_forward'}
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ContactForm

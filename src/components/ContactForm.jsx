import { useState, useEffect, useRef } from 'react'
import avatarImg from '../assets/rowdy.jpg'
import './ContactForm.css'

const STEPS = [
  {
    message: "Hey! Great that you're reaching out. What's your first name?",
    field: 'firstName',
    label: 'First name*',
    type: 'text',
  },
  {
    message: 'Nice to meet you! And your last name?',
    field: 'lastName',
    label: 'Last name*',
    type: 'text',
  },
  {
    message: 'Great! What email address can I reach you at?',
    field: 'email',
    label: 'Email address*',
    type: 'email',
  },
  {
    message: "Almost done! Tell me what you'd like to work on.",
    field: 'message',
    label: 'Message*',
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
      const subject = encodeURIComponent(`Contact request from ${values.firstName} ${values.lastName}`)
      const body = encodeURIComponent(
        `Name: ${values.firstName} ${values.lastName}\nEmail: ${values.email}\n\n${values.message}`
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
    ? "Thank you for your message! I'll get back to you as soon as possible."
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
            <div className="contact-form__actions">
              {step > 0 && (
                <button
                  className="contact-form__back"
                  onClick={() => setStep(s => s - 1)}
                  aria-label="Previous step"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
              )}
              <button
                className="contact-form__next"
                onClick={handleNext}
                disabled={!hasValue}
                aria-label={isLast ? 'Send' : 'Next'}
              >
                <span className="material-symbols-outlined">
                  {isLast ? 'send' : 'arrow_forward'}
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ContactForm

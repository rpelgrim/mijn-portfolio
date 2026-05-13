import ContactForm from './ContactForm'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__left">
            <div className="footer__intro">
              <h2 className="footer__heading">Laten we samen<br />iets moois maken</h2>
              <p className="footer__desc">Beschikbaar voor nieuwe projecten en samenwerkingen. Stuur een bericht en ik reageer zo snel mogelijk.</p>
            </div>
            <ContactForm />
          </div>
          <div className="footer__right" />
        </div>

        <div className="footer__bottom">
          <span className="footer__copy">© {new Date().getFullYear()} Rowdy Pelgrim</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer

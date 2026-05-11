import ContactForm from './ContactForm'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__left">
            <h2 className="footer__heading">Laten we samen<br />iets moois maken</h2>
          </div>

          <div className="footer__right">
            <ContactForm />
          </div>
        </div>

        <div className="footer__bottom">
          <span className="footer__copy">© {new Date().getFullYear()} Rowdy Pelgrim</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer

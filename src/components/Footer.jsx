import ContactForm from './ContactForm'
import './Footer.css'

const navLinks = ['Home', 'Work', 'About', 'Contact']
const socialLinks = [
  { label: 'LinkedIn', href: '#' },
  { label: 'Dribbble', href: '#' },
  { label: 'Instagram', href: '#' },
]

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__left">
            <h2 className="footer__heading">Laten we samen<br />iets moois maken</h2>
            <ContactForm />
          </div>

          <div className="footer__right">
            <nav className="footer__nav">
              {navLinks.map((link) => (
                <a key={link} href="#" className="footer__nav-link">{link}</a>
              ))}
            </nav>
            <nav className="footer__social">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.href} className="footer__social-link" target="_blank" rel="noopener noreferrer">
                  {link.label}
                  <span className="material-symbols-outlined">arrow_outward</span>
                </a>
              ))}
            </nav>
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

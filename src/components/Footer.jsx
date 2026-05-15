import ContactForm from './ContactForm'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__left">
            <div className="footer__intro">
              <h2 className="footer__heading">Let's create something<br />beautiful together</h2>
              <p className="footer__desc">Available for new projects and collaborations. Send a message and I'll get back to you as soon as possible.</p>
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

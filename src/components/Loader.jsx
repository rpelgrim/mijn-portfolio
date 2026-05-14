import logo from '../assets/logo-rp-01.svg'
import './Loader.css'

function Loader({ visible }) {
  return (
    <div className={`loader${visible ? '' : ' loader--hidden'}`} aria-hidden={!visible}>
      <img src={logo} alt="RP" className="loader__logo" />
    </div>
  )
}

export default Loader

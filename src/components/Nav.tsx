import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const links = [
  { to: '/works', label: 'Works' },
  { to: '/contact', label: 'Contact' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const goHome = () => {
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <>
      <nav className="nav">
        <button className="nav-logo" onClick={goHome} type="button">
          PLURAL WORLD
        </button>
        <div className="nav-links">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="nav-link">
              {l.label}
            </Link>
          ))}
        </div>
        <button
          className="nav-burger"
          aria-label="Menu"
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

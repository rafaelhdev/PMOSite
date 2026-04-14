import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const NAV_LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/calendar', label: 'Calendário' },
  { to: '/collaborators', label: 'Colaboradores' },
  { to: '/vacations', label: 'Férias' },
]

export default function Header() {
  const location = useLocation()
  const { collaborators, currentCollaboratorId, setCurrentCollaborator } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="bg-primary-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <span className="bg-white text-primary-600 rounded px-2 py-0.5 text-sm font-extrabold">PMO</span>
            <span>Férias</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-primary-100 ${
                  location.pathname === link.to ? 'border-b-2 border-white pb-0.5' : 'text-primary-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User selector */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-primary-200 text-xs">Logado como:</span>
            <select
              value={currentCollaboratorId}
              onChange={e => setCurrentCollaborator(e.target.value)}
              className="bg-primary-700 text-white text-sm rounded px-2 py-1 border border-primary-400 focus:outline-none"
            >
              {collaborators.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <div className="w-5 h-0.5 bg-white mb-1" />
            <div className="w-5 h-0.5 bg-white mb-1" />
            <div className="w-5 h-0.5 bg-white" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-primary-700 px-4 pb-4 space-y-2">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block py-2 text-sm font-medium ${
                location.pathname === link.to ? 'text-white font-bold' : 'text-primary-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-primary-500">
            <span className="text-primary-300 text-xs block mb-1">Logado como:</span>
            <select
              value={currentCollaboratorId}
              onChange={e => { setCurrentCollaborator(e.target.value); setMenuOpen(false) }}
              className="bg-primary-800 text-white text-sm rounded px-2 py-1 border border-primary-400 w-full"
            >
              {collaborators.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </header>
  )
}

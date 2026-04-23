import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogIn, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { isAdmin, user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/dl.jpg" alt="DriveHub" className="h-9 w-auto rounded-md" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Browse Cars
            </Link>
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors text-sm font-medium"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
            )}
          </nav>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-sm">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-300 hover:text-white border border-slate-700 rounded-lg hover:border-slate-500 transition-colors"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                <LogIn size={14} />
                Admin
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 px-4 py-4 space-y-3 bg-slate-900">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="block text-slate-300 hover:text-white text-sm font-medium"
          >
            Browse Cars
          </Link>
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileOpen(false)}
              className="block text-slate-300 hover:text-white text-sm font-medium"
            >
              Dashboard
            </Link>
          )}
          {user ? (
            <button
              onClick={() => { handleLogout(); setMobileOpen(false) }}
              className="block text-sm text-red-400 hover:text-red-300"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/admin/login"
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-blue-400 hover:text-blue-300"
            >
              Admin Login
            </Link>
          )}
        </div>
      )}
    </header>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Calculator, Car, ChevronDown, Heart, LayoutDashboard, LogOut, Menu, TrendingUp, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useFavourites } from '../../context/FavouritesContext'

const BUY_MENU = [
  { label: 'Browse All Cars', to: '/cars', desc: 'Search our full inventory' },
  { label: 'New Cars', to: '/cars?condition=New', desc: 'Brand new vehicles' },
  { label: 'Used Cars', to: '/cars?condition=Used', desc: 'Quality second-hand cars' },
  { label: 'Electric Cars', to: '/cars?fuel=Electric', desc: 'Go green with EV options' },
  { label: 'SUVs & 4x4s', to: '/cars?bodyType=SUV', desc: 'Rugged family favourites' },
  { label: 'Saved Cars', to: '/saved', desc: 'Your shortlist' },
]

const TOOLS_MENU = [
  { label: 'Finance Calculator', to: '/finance', icon: <Calculator size={15} /> },
  { label: 'Buying Guides', to: '/guides', icon: <BookOpen size={15} /> },
  { label: 'Sell My Car', to: '/sell', icon: <TrendingUp size={15} /> },
]

function DropdownMenu({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${open ? 'text-[#FF5400] bg-orange-50' : 'text-gray-700 hover:text-[#FF5400] hover:bg-orange-50'}`}
      >
        {label}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[220px] py-1.5">
          {children}
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const { isAdmin, user, logout } = useAuth()
  const { favourites } = useFavourites()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function handleLogout() {
    await logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  const displayName = user?.name || user?.email?.split('@')[0] || 'Account'

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-1">
            <span className="bg-[#FF5400] text-white font-black text-xl px-2.5 py-1 rounded">Drive</span>
            <span className="font-black text-xl text-gray-900">Hub</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {/* Buy a Car dropdown */}
            <DropdownMenu label="Buy a Car">
              <div className="grid grid-cols-1 gap-0.5 p-1">
                {BUY_MENU.map(({ label, to, desc }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex flex-col px-3 py-2 rounded-lg hover:bg-orange-50 group"
                  >
                    <span className="text-sm font-medium text-gray-800 group-hover:text-[#FF5400]">{label}</span>
                    <span className="text-xs text-gray-400">{desc}</span>
                  </Link>
                ))}
              </div>
            </DropdownMenu>

            {/* Sell */}
            <Link to="/sell" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#FF5400] hover:bg-orange-50 rounded-lg transition-colors">
              Sell My Car
            </Link>

            {/* Tools dropdown */}
            <DropdownMenu label="Tools & Guides">
              <div className="p-1">
                {TOOLS_MENU.map(({ label, to, icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-orange-50 group"
                  >
                    <span className="text-gray-400 group-hover:text-[#FF5400]">{icon}</span>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-[#FF5400]">{label}</span>
                  </Link>
                ))}
              </div>
            </DropdownMenu>

            <Link to="/about" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#FF5400] hover:bg-orange-50 rounded-lg transition-colors">
              About
            </Link>

            {isAdmin && (
              <Link to="/admin/dashboard" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#FF5400] hover:bg-orange-50 rounded-lg transition-colors">
                <LayoutDashboard size={14} />
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/saved"
              className="relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#FF5400] hover:bg-orange-50 rounded-lg transition-colors"
            >
              <Heart size={17} />
              <span>Saved</span>
              {favourites.length > 0 && (
                <span className="absolute -top-0.5 right-0 min-w-[18px] h-[18px] bg-[#FF5400] text-white text-[10px] rounded-full flex items-center justify-center font-bold px-1">
                  {favourites.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#FF5400] flex items-center justify-center text-white text-xs font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{displayName}</span>
                  <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LayoutDashboard size={14} />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/saved"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Heart size={14} />
                      Saved Cars
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-semibold text-white bg-[#FF5400] hover:bg-[#e04a00] rounded-lg transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: saved + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <Link to="/saved" className="relative p-2 text-gray-600">
              <Heart size={20} />
              {favourites.length > 0 && (
                <span className="absolute top-0 right-0 min-w-[16px] h-4 bg-[#FF5400] text-white text-[9px] rounded-full flex items-center justify-center font-bold px-0.5">
                  {favourites.length}
                </span>
              )}
            </Link>
            <button className="p-2 text-gray-600 hover:text-gray-900" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-0.5">
          <Link to="/cars" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#FF5400] hover:bg-orange-50 rounded-lg">
            <Car size={14} /> Buy a Car
          </Link>
          <Link to="/sell" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#FF5400] hover:bg-orange-50 rounded-lg">
            <TrendingUp size={14} /> Sell My Car
          </Link>
          <Link to="/finance" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#FF5400] hover:bg-orange-50 rounded-lg">
            <Calculator size={14} /> Finance Calculator
          </Link>
          <Link to="/guides" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#FF5400] hover:bg-orange-50 rounded-lg">
            <BookOpen size={14} /> Buying Guides
          </Link>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#FF5400] hover:bg-orange-50 rounded-lg">
            About Us
          </Link>
          {isAdmin && (
            <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-[#FF5400] hover:bg-orange-50 rounded-lg">
              <LayoutDashboard size={14} /> Admin Dashboard
            </Link>
          )}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-[#FF5400] flex items-center justify-center text-white text-sm font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{displayName}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 text-sm font-semibold text-white bg-[#FF5400] rounded-lg">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

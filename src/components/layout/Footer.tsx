import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center">
            <img src="/dl.jpg" alt="DriveHub" className="h-8 w-auto rounded-md" />
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <Link to="/" className="hover:text-white transition-colors">
              Browse Cars
            </Link>
            <Link to="/admin/login" className="hover:text-white transition-colors">
              Admin
            </Link>
          </nav>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} DriveHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

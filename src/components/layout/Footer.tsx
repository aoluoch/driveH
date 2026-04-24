import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'
import { CONTACT_PHONE, CONTACT_EMAIL } from '../../lib/contact'

const FacebookIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const TwitterIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
)

const InstagramIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
)

const YoutubeIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon fill="white" points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" />
  </svg>
)

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-400">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-1">
              <span className="bg-[#FF5400] text-white font-black text-xl px-2.5 py-1 rounded">Drive</span>
              <span className="font-black text-xl text-white">Hub</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Kenya's leading car marketplace. Find your perfect vehicle from our curated selection of new, used, and certified pre-owned cars.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#FF5400] transition-colors">
                <FacebookIcon size={15} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#FF5400] transition-colors">
                <TwitterIcon size={15} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#FF5400] transition-colors">
                <InstagramIcon size={15} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#FF5400] transition-colors">
                <YoutubeIcon size={15} />
              </a>
            </div>
          </div>

          {/* Browse column */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Browse Cars</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Used Cars', to: '/cars?condition=Used' },
                { label: 'New Cars', to: '/cars?condition=New' },
                { label: 'Certified Pre-Owned', to: '/cars?condition=Certified+Pre-Owned' },
                { label: 'Electric Cars', to: '/cars?fuel=Electric' },
                { label: 'SUVs & 4x4s', to: '/cars?bodyType=SUV' },
                { label: 'Sell My Car', to: '/sell' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-[#FF5400] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Company</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'About Us', to: '/about' },
                { label: 'Contact Us', to: '/contact' },
                { label: 'Finance Calculator', to: '/finance' },
                { label: 'Buying Guides', to: '/guides' },
                { label: 'Register', to: '/register' },
                { label: 'Sign In', to: '/login' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-[#FF5400] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="mt-0.5 flex-shrink-0 text-[#FF5400]" />
                <span>Nairobi, Kenya</span>
              </li>
              {CONTACT_PHONE && (
                <li className="flex items-center gap-3">
                  <Phone size={15} className="flex-shrink-0 text-[#FF5400]" />
                  <a href={`tel:${CONTACT_PHONE.replace(/\D/g, '')}`} className="hover:text-[#FF5400] transition-colors">{CONTACT_PHONE}</a>
                </li>
              )}
              {CONTACT_EMAIL && (
                <li className="flex items-center gap-3">
                  <Mail size={15} className="flex-shrink-0 text-[#FF5400]" />
                  <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-[#FF5400] transition-colors">{CONTACT_EMAIL}</a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {year} DriveHub. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

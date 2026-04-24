import { Link, useLocation } from 'react-router-dom'
import { BookOpen, Car, LayoutDashboard, Mail, MessageSquare } from 'lucide-react'

const links = [
  { to: '/admin/dashboard', icon: <LayoutDashboard size={15} />, label: 'Dashboard' },
  { to: '/admin/messages',  icon: <Mail size={15} />,            label: 'Messages' },
  { to: '/admin/inquiries', icon: <MessageSquare size={15} />,   label: 'Sell Inquiries' },
  { to: '/admin/guides',    icon: <BookOpen size={15} />,        label: 'Guides' },
]

export default function AdminNav({ unread = 0, newInquiries = 0 }: { unread?: number; newInquiries?: number }) {
  const { pathname } = useLocation()
  return (
    <nav className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
      {links.map(({ to, icon, label }) => {
        const active = pathname === to
        const badge =
          to === '/admin/messages' && unread > 0
            ? unread
            : to === '/admin/inquiries' && newInquiries > 0
            ? newInquiries
            : 0
        return (
          <Link
            key={to}
            to={to}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              active ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {icon}
            {label}
            {badge > 0 && (
              <span
                className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] text-[10px] font-bold rounded-full flex items-center justify-center px-1 ${
                  active ? 'bg-white text-blue-600' : 'bg-red-500 text-white'
                }`}
              >
                {badge > 99 ? '99+' : badge}
              </span>
            )}
          </Link>
        )
      })}
      <Link
        to="/admin/cars/add"
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors whitespace-nowrap"
      >
        <Car size={15} />
        Add Car
      </Link>
    </nav>
  )
}

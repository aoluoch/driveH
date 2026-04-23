import { useEffect, useState } from 'react'
import {
  AlertCircle,
  Car,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Trash2,
} from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import AdminNav from '../../components/admin/AdminNav'
import {
  listSellInquiries,
  updateInquiryStatus,
  deleteSellInquiry,
  getInboxStats,
} from '../../lib/messages'
import type { SellInquiry, InquiryStatus } from '../../types'

const STATUS_LABELS: Record<InquiryStatus, { label: string; color: string }> = {
  new:       { label: 'New',       color: 'bg-orange-100 text-orange-700 border-orange-200' },
  contacted: { label: 'Contacted', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  listed:    { label: 'Listed',    color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  closed:    { label: 'Closed',    color: 'bg-slate-100 text-slate-600 border-slate-200' },
}

const STATUS_OPTIONS: InquiryStatus[] = ['new', 'contacted', 'listed', 'closed']

function StatusBadge({ status }: { status: InquiryStatus }) {
  const { label, color } = STATUS_LABELS[status]
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${color}`}>
      {label}
    </span>
  )
}

function InquiryCard({
  inquiry,
  onStatusChange,
  onDelete,
}: {
  inquiry: SellInquiry
  onStatusChange: (id: string, status: InquiryStatus) => void
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [updating, setUpdating] = useState(false)

  async function handleStatus(status: InquiryStatus) {
    setUpdating(true)
    await onStatusChange(inquiry.$id, status)
    setUpdating(false)
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    onDelete(inquiry.$id)
  }

  const date = new Date(inquiry.$createdAt).toLocaleString('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div
      className={`bg-white rounded-2xl border transition-all ${
        inquiry.status === 'new' ? 'border-orange-200 shadow-sm' : 'border-slate-200'
      }`}
    >
      {/* Header row */}
      <div
        className="flex items-start justify-between gap-4 p-5 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              inquiry.status === 'new'
                ? 'bg-orange-100 text-orange-600'
                : inquiry.status === 'listed'
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            <Car size={16} />
          </div>
          <div className="min-w-0">
            <p className={`font-semibold text-slate-900 truncate ${inquiry.status === 'new' ? 'font-bold' : ''}`}>
              {inquiry.name}
            </p>
            <p className="text-xs text-slate-500 truncate">{inquiry.phone}</p>
            <p className="text-sm text-slate-700 mt-0.5 truncate">{inquiry.carDetails}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <StatusBadge status={inquiry.status} />
          <span className="text-xs text-slate-400 hidden sm:block">{date}</span>
          {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
          {/* Details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-slate-500 mb-1">Car Details</p>
              <p className="text-sm text-slate-800 font-medium">{inquiry.carDetails}</p>
            </div>
            {inquiry.message && (
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs font-semibold text-slate-500 mb-1">Additional Notes</p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{inquiry.message}</p>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400 sm:hidden">{date}</p>

          {/* Quick contact buttons */}
          <div className="flex flex-wrap gap-2">
            <a
              href={`tel:${inquiry.phone}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              <Phone size={12} />
              Call {inquiry.phone}
            </a>
            {inquiry.email && (
              <a
                href={`mailto:${inquiry.email}?subject=Re: Your Car Listing Request on DriveHub`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <Mail size={12} />
                Email
              </a>
            )}
            <a
              href={`https://wa.me/${inquiry.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${inquiry.name}, thanks for your interest in listing your car on DriveHub. We'd like to help you get your ${inquiry.carDetails} listed.`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#25D366] text-white hover:bg-[#1da851] transition-colors"
            >
              <MessageCircle size={12} />
              WhatsApp
            </a>
          </div>

          {/* Status + delete actions */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 mr-1">Move to:</span>
            {STATUS_OPTIONS.filter((s) => s !== inquiry.status).map((s) => (
              <button
                key={s}
                onClick={() => handleStatus(s)}
                disabled={updating}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${STATUS_LABELS[s].color}`}
              >
                {updating ? <Loader2 size={12} className="animate-spin" /> : null}
                {STATUS_LABELS[s].label}
              </button>
            ))}
            <button
              onClick={handleDelete}
              className={`ml-auto inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                confirmDelete
                  ? 'bg-red-600 text-white border-red-600'
                  : 'border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-600'
              }`}
            >
              <Trash2 size={12} />
              {confirmDelete ? 'Confirm Delete' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Inquiries() {
  const [inquiries, setInquiries] = useState<SellInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<InquiryStatus | 'all'>('all')
  const [inboxStats, setInboxStats] = useState({ unread: 0, newInquiries: 0 })

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([listSellInquiries(), getInboxStats()])
      .then(([data, stats]) => {
        setInquiries(data)
        setInboxStats({ unread: stats.unreadMessages, newInquiries: stats.newInquiries })
      })
      .catch((e) => setError(e.message ?? 'Failed to load inquiries.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleStatusChange(id: string, status: InquiryStatus) {
    const updated = await updateInquiryStatus(id, status)
    setInquiries((prev) => prev.map((i) => (i.$id === id ? updated : i)))
    if (status !== 'new') {
      setInboxStats((s) => ({ ...s, newInquiries: Math.max(0, s.newInquiries - 1) }))
    }
  }

  async function handleDelete(id: string) {
    await deleteSellInquiry(id)
    setInquiries((prev) => prev.filter((i) => i.$id !== id))
  }

  const filtered = filter === 'all' ? inquiries : inquiries.filter((i) => i.status === filter)
  const counts = {
    all:       inquiries.length,
    new:       inquiries.filter((i) => i.status === 'new').length,
    contacted: inquiries.filter((i) => i.status === 'contacted').length,
    listed:    inquiries.filter((i) => i.status === 'listed').length,
    closed:    inquiries.filter((i) => i.status === 'closed').length,
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Sell Inquiries</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {counts.new > 0 ? `${counts.new} new inquiry${counts.new > 1 ? 'ies' : ''}` : 'No new inquiries'}
            </p>
          </div>
          <AdminNav unread={inboxStats.unread} newInquiries={inboxStats.newInquiries} />
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'new', 'contacted', 'listed', 'closed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                filter === f
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${filter === f ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 size={28} className="animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700">
            <AlertCircle size={20} className="flex-shrink-0" />
            <div>
              <p className="font-semibold">Could not load inquiries</p>
              <p className="text-sm mt-0.5">{error}</p>
              <p className="text-xs mt-1 text-red-500">Make sure VITE_APPWRITE_SELL_INQUIRIES_COLLECTION_ID is set in .env and you've run <code>npm run setup</code>.</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <CheckCircle2 size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-600 font-medium">
              {filter === 'all' ? 'No inquiries yet' : `No ${filter} inquiries`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((inquiry) => (
              <InquiryCard
                key={inquiry.$id}
                inquiry={inquiry}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

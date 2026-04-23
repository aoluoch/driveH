import { useEffect, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Mail,
  MailOpen,
  MessageSquareReply,
  Trash2,
} from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import AdminNav from '../../components/admin/AdminNav'
import {
  listContactMessages,
  updateMessageStatus,
  deleteContactMessage,
  getInboxStats,
} from '../../lib/messages'
import type { ContactMessage, MessageStatus } from '../../types'

const STATUS_LABELS: Record<MessageStatus, { label: string; color: string }> = {
  unread:  { label: 'Unread',  color: 'bg-red-100 text-red-700 border-red-200' },
  read:    { label: 'Read',    color: 'bg-blue-100 text-blue-700 border-blue-200' },
  replied: { label: 'Replied', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
}

const STATUS_OPTIONS: MessageStatus[] = ['unread', 'read', 'replied']

function StatusBadge({ status }: { status: MessageStatus }) {
  const { label, color } = STATUS_LABELS[status]
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${color}`}>
      {label}
    </span>
  )
}

function MessageCard({
  msg,
  onStatusChange,
  onDelete,
}: {
  msg: ContactMessage
  onStatusChange: (id: string, status: MessageStatus) => void
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [updating, setUpdating] = useState(false)

  async function handleStatus(status: MessageStatus) {
    setUpdating(true)
    await onStatusChange(msg.$id, status)
    setUpdating(false)
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    onDelete(msg.$id)
  }

  const date = new Date(msg.$createdAt).toLocaleString('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div
      className={`bg-white rounded-2xl border transition-all ${
        msg.status === 'unread' ? 'border-red-200 shadow-sm' : 'border-slate-200'
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
              msg.status === 'unread'
                ? 'bg-red-100 text-red-600'
                : msg.status === 'replied'
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {msg.status === 'unread' ? (
              <Mail size={16} />
            ) : msg.status === 'replied' ? (
              <MessageSquareReply size={16} />
            ) : (
              <MailOpen size={16} />
            )}
          </div>
          <div className="min-w-0">
            <p className={`font-semibold text-slate-900 truncate ${msg.status === 'unread' ? 'font-bold' : ''}`}>
              {msg.name}
            </p>
            <p className="text-xs text-slate-500 truncate">{msg.email}</p>
            <p className="text-sm text-slate-700 mt-0.5 truncate">{msg.subject}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <StatusBadge status={msg.status} />
          <span className="text-xs text-slate-400 hidden sm:block">{date}</span>
          {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
          <p className="text-xs text-slate-400 sm:hidden">{date}</p>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-500 mr-1">Mark as:</span>
            {STATUS_OPTIONS.filter((s) => s !== msg.status).map((s) => (
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
            <a
              href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
              className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <Mail size={12} />
              Reply via Email
            </a>
            <button
              onClick={handleDelete}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
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

export default function Messages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<MessageStatus | 'all'>('all')
  const [inboxStats, setInboxStats] = useState({ unread: 0, newInquiries: 0 })

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([listContactMessages(), getInboxStats()])
      .then(([msgs, stats]) => {
        setMessages(msgs)
        setInboxStats({ unread: stats.unreadMessages, newInquiries: stats.newInquiries })
      })
      .catch((e) => setError(e.message ?? 'Failed to load messages.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleStatusChange(id: string, status: MessageStatus) {
    const updated = await updateMessageStatus(id, status)
    setMessages((prev) => prev.map((m) => (m.$id === id ? updated : m)))
    if (status !== 'unread') {
      setInboxStats((s) => ({ ...s, unread: Math.max(0, s.unread - 1) }))
    }
  }

  async function handleDelete(id: string) {
    await deleteContactMessage(id)
    setMessages((prev) => prev.filter((m) => m.$id !== id))
  }

  const filtered = filter === 'all' ? messages : messages.filter((m) => m.status === filter)
  const counts = {
    all:     messages.length,
    unread:  messages.filter((m) => m.status === 'unread').length,
    read:    messages.filter((m) => m.status === 'read').length,
    replied: messages.filter((m) => m.status === 'replied').length,
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Contact Messages</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {counts.unread > 0 ? `${counts.unread} unread` : 'All caught up'}
            </p>
          </div>
          <AdminNav unread={inboxStats.unread} newInquiries={inboxStats.newInquiries} />
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'unread', 'read', 'replied'] as const).map((f) => (
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
              <p className="font-semibold">Could not load messages</p>
              <p className="text-sm mt-0.5">{error}</p>
              <p className="text-xs mt-1 text-red-500">Make sure VITE_APPWRITE_CONTACT_MESSAGES_COLLECTION_ID is set in .env and you've run <code>npm run setup</code>.</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <CheckCircle2 size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-600 font-medium">
              {filter === 'all' ? 'No messages yet' : `No ${filter} messages`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((msg) => (
              <MessageCard
                key={msg.$id}
                msg={msg}
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

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Car,
  DollarSign,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  PlusCircle,
  Trash2,
  TrendingUp,
  Wrench,
} from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import AdminNav from '../../components/admin/AdminNav'
import { listAllGuides, deleteGuide, toggleGuidePublished, getGuideImageUrl } from '../../lib/guides'
import { getInboxStats } from '../../lib/messages'
import type { GuideArticle, GuideCategory } from '../../types'

const CATEGORIES: { value: GuideCategory | 'all'; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'all',                      label: 'All Articles',          icon: <BookOpen size={14} />,  color: 'bg-slate-100 text-slate-600' },
  { value: 'Buying Guides',            label: 'Buying Guides',         icon: <Car size={14} />,       color: 'bg-blue-100 text-blue-600' },
  { value: 'Finance & Costs',          label: 'Finance & Costs',       icon: <DollarSign size={14} />,color: 'bg-emerald-100 text-emerald-600' },
  { value: 'Car Care & Maintenance',   label: 'Car Care & Maintenance',icon: <Wrench size={14} />,    color: 'bg-orange-100 text-orange-600' },
  { value: 'Selling Your Car',         label: 'Selling Your Car',      icon: <TrendingUp size={14} />,color: 'bg-purple-100 text-purple-600' },
]

export default function GuidesAdmin() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState<GuideArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<GuideCategory | 'all'>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [inboxStats, setInboxStats] = useState({ unread: 0, newInquiries: 0 })

  useEffect(() => {
    Promise.all([
      listAllGuides(),
      getInboxStats().catch(() => null),
    ]).then(([guides, inbox]) => {
      setArticles(guides)
      if (inbox) setInboxStats({ unread: inbox.unreadMessages, newInquiries: inbox.newInquiries })
    }).finally(() => setLoading(false))
  }, [])

  const filtered = activeCategory === 'all'
    ? articles
    : articles.filter((a) => a.category === activeCategory)

  async function handleDelete(id: string) {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000)
      return
    }
    await deleteGuide(id)
    setArticles((prev) => prev.filter((a) => a.$id !== id))
    setDeleteConfirm(null)
  }

  async function handleTogglePublished(article: GuideArticle) {
    const updated = await toggleGuidePublished(article.$id, !article.published)
    setArticles((prev) => prev.map((a) => (a.$id === article.$id ? updated : a)))
  }

  function getCategoryStyle(cat: GuideCategory) {
    return CATEGORIES.find((c) => c.value === cat)?.color ?? 'bg-slate-100 text-slate-600'
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Guide Articles</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage buying guides, finance tips, and more</p>
          </div>
          <AdminNav unread={inboxStats.unread} newInquiries={inboxStats.newInquiries} />
        </div>

        {/* Action bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(({ value, label, icon, color }) => (
              <button
                key={value}
                onClick={() => setActiveCategory(value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeCategory === value
                    ? color + ' ring-2 ring-offset-1 ring-current'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {icon} {label}
                {value !== 'all' && (
                  <span className="ml-1 bg-white/60 rounded-full px-1.5 text-[10px]">
                    {articles.filter((a) => a.category === value).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <Link
            to="/admin/guides/add"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex-shrink-0"
          >
            <PlusCircle size={15} />
            New Article
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
            <BookOpen size={44} className="mx-auto text-slate-200 mb-3" />
            <p className="font-semibold text-slate-700">No articles yet</p>
            <p className="text-sm text-slate-400 mt-1 mb-5">
              {activeCategory === 'all' ? 'Create your first guide article to get started.' : `No articles in "${activeCategory}" yet.`}
            </p>
            <Link
              to="/admin/guides/add"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
            >
              <PlusCircle size={15} /> Create Article
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {deleteConfirm && (
              <p className="text-xs text-orange-600 bg-orange-50 border border-orange-200 px-3 py-2 rounded-lg">
                Click delete again to confirm deletion
              </p>
            )}
            {filtered.map((article) => (
              <div
                key={article.$id}
                className={`bg-white rounded-2xl border transition-all flex gap-4 p-4 ${
                  deleteConfirm === article.$id ? 'border-red-400 bg-red-50' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* Cover thumbnail */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  {article.coverImageId ? (
                    <img
                      src={getGuideImageUrl(article.coverImageId, 160)}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <BookOpen size={24} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getCategoryStyle(article.category)}`}>
                      {article.category}
                    </span>
                    {article.readTime && (
                      <span className="text-[10px] text-slate-400">{article.readTime}</span>
                    )}
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      article.published ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {article.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <h3
                    className="font-semibold text-slate-900 text-sm truncate cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => navigate(`/admin/guides/${article.$id}/edit`)}
                  >
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{article.excerpt}</p>
                  )}
                  <p className="text-[10px] text-slate-300 mt-1">
                    {new Date(article.$createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/admin/guides/${article.$id}/edit`)}
                    title="Edit"
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleTogglePublished(article)}
                    title={article.published ? 'Unpublish' : 'Publish'}
                    className={`p-2 rounded-lg transition-colors ${
                      article.published
                        ? 'text-emerald-500 hover:text-amber-500 hover:bg-amber-50'
                        : 'text-amber-400 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                  >
                    {article.published ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button
                    onClick={() => handleDelete(article.$id)}
                    title="Delete"
                    className={`p-2 rounded-lg transition-colors ${
                      deleteConfirm === article.$id
                        ? 'text-white bg-red-500'
                        : 'text-slate-300 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

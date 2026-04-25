import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  Car,
  Clock,
  DollarSign,
  TrendingUp,
  Wrench,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { getGuide, getGuideImageUrl } from '../lib/guides'
import type { GuideArticle, GuideCategory } from '../types'

const CATEGORY_META: Record<GuideCategory, { icon: React.ReactNode; color: string; bg: string }> = {
  'Buying Guides':          { icon: <Car size={15} />,        color: 'text-blue-600',    bg: 'bg-blue-100' },
  'Finance & Costs':        { icon: <DollarSign size={15} />, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  'Car Care & Maintenance': { icon: <Wrench size={15} />,     color: 'text-orange-600',  bg: 'bg-orange-100' },
  'Selling Your Car':       { icon: <TrendingUp size={15} />, color: 'text-purple-600',  bg: 'bg-purple-100' },
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-64 bg-gray-200 rounded-2xl" />
      <div className="h-8 bg-gray-200 rounded-xl w-3/4" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded-xl" />
        <div className="h-4 bg-gray-200 rounded-xl w-5/6" />
        <div className="h-4 bg-gray-200 rounded-xl w-4/6" />
      </div>
    </div>
  )
}

export default function GuideDetail() {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<GuideArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    const fetch = async () => {
      setLoading(true)
      try {
        const data = await getGuide(id)
        if (!cancelled) setArticle(data)
      } catch (e: unknown) {
        if (!cancelled) setError((e as Error).message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  const meta = article ? CATEGORY_META[article.category] : null

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Back link */}
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF5400] mb-8 transition-colors font-medium"
        >
          <ArrowLeft size={16} /> Back to Guides
        </Link>

        {loading ? (
          <Skeleton />
        ) : error || !article ? (
          <div className="text-center py-20">
            <BookOpen size={44} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-lg font-bold text-gray-700 mb-2">Article not found</h2>
            <p className="text-gray-400 text-sm mb-6">{error ?? 'This article may have been removed.'}</p>
            <Link
              to="/guides"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF5400] text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
            >
              Browse All Guides
            </Link>
          </div>
        ) : (
          <article>
            {/* Cover image */}
            {article.coverImageId && (
              <div className="mb-8 rounded-2xl overflow-hidden shadow-sm">
                <img
                  src={getGuideImageUrl(article.coverImageId, 1200)}
                  alt={article.title}
                  className="w-full h-64 sm:h-80 object-cover"
                />
              </div>
            )}

            {/* Category & meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {meta && (
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${meta.bg} ${meta.color}`}>
                  {meta.icon}
                  {article.category}
                </span>
              )}
              {article.readTime && (
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                  <Clock size={13} />
                  {article.readTime}
                </span>
              )}
              <span className="text-xs text-gray-300">
                {new Date(article.$createdAt).toLocaleDateString('en-KE', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-4">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-base text-gray-500 leading-relaxed mb-8 border-l-4 border-[#FF5400] pl-4">
                {article.excerpt}
              </p>
            )}

            {/* Rich text content */}
            <div
              className="prose prose-gray max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-h1:text-2xl prose-h1:mt-8 prose-h1:mb-4
                prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3
                prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4
                prose-ul:ml-5 prose-ul:mb-4 prose-ul:list-disc
                prose-ol:ml-5 prose-ol:mb-4 prose-ol:list-decimal
                prose-li:text-gray-600 prose-li:mb-1
                prose-blockquote:border-l-4 prose-blockquote:border-[#FF5400] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-500 prose-blockquote:my-6
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-5 prose-pre:my-5
                prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-img:rounded-2xl prose-img:shadow-sm prose-img:my-6
                prose-a:text-[#FF5400] prose-a:font-medium prose-a:underline
                prose-hr:border-gray-200 prose-hr:my-8
                prose-strong:text-gray-800"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Back to guides */}
            <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between">
              <Link
                to="/guides"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#FF5400] transition-colors"
              >
                <ArrowLeft size={15} /> All Guides
              </Link>
              <Link
                to="/cars"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF5400] text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors"
              >
                <Car size={15} /> Browse Cars
              </Link>
            </div>
          </article>
        )}
      </main>

      <Footer />
    </div>
  )
}

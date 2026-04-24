import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Car,
  CheckCircle,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  Fuel,
  Loader2,
  Search,
  Settings2,
  Shield,
  TrendingUp,
  Wrench,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { listGuides, getGuideImageUrl } from '../lib/guides'
import type { GuideArticle, GuideCategory } from '../types'

const CATEGORY_META: Record<GuideCategory, { icon: React.ReactNode; color: string }> = {
  'Buying Guides':          { icon: <Car size={18} />,        color: 'bg-blue-100 text-blue-600' },
  'Finance & Costs':        { icon: <DollarSign size={18} />, color: 'bg-emerald-100 text-emerald-600' },
  'Car Care & Maintenance': { icon: <Wrench size={18} />,     color: 'bg-orange-100 text-orange-600' },
  'Selling Your Car':       { icon: <TrendingUp size={18} />, color: 'bg-purple-100 text-purple-600' },
}

const CATEGORY_ORDER: GuideCategory[] = [
  'Buying Guides',
  'Finance & Costs',
  'Car Care & Maintenance',
  'Selling Your Car',
]

const QUICK_TIPS = [
  { icon: <Search size={16} />, tip: "Always verify a car's chassis number against NTSA records before buying." },
  { icon: <Shield size={16} />, tip: 'Never pay a full deposit before seeing and test-driving the car in person.' },
  { icon: <FileText size={16} />, tip: "Request a copy of the logbook and verify the owner's name matches the seller." },
  { icon: <Settings2 size={16} />, tip: 'Take the car to an independent mechanic for a pre-purchase inspection.' },
  { icon: <Fuel size={16} />, tip: 'Check fuel economy ratings and calculate realistic monthly running costs.' },
  { icon: <DollarSign size={16} />, tip: 'Factor in 3–5 years of ownership costs, not just the purchase price.' },
]

function ArticleCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-16 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-3 bg-gray-200 rounded w-5/6 mb-1" />
      <div className="h-3 bg-gray-200 rounded w-4/6" />
    </div>
  )
}

export default function Guides() {
  const [articlesByCategory, setArticlesByCategory] = useState<Record<GuideCategory, GuideArticle[]>>({
    'Buying Guides': [],
    'Finance & Costs': [],
    'Car Care & Maintenance': [],
    'Selling Your Car': [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listGuides(undefined, true)
      .then((articles) => {
        const grouped: Record<GuideCategory, GuideArticle[]> = {
          'Buying Guides': [],
          'Finance & Costs': [],
          'Car Care & Maintenance': [],
          'Selling Your Car': [],
        }
        for (const article of articles) {
          if (grouped[article.category]) {
            grouped[article.category].push(article)
          }
        }
        setArticlesByCategory(grouped)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const totalArticles = Object.values(articlesByCategory).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gray-900 text-white py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-[#1a0a00] opacity-95" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 bg-[#FF5400]/20 text-[#FF5400] text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-[#FF5400]/30">
            <BookOpen size={13} /> Car Buying Guides
          </span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            Expert Advice & <span className="text-[#FF5400]">Guides</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            Everything you need to buy, sell, finance, and maintain your car with confidence.
          </p>
        </div>
      </section>

      {/* Quick tips */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <CheckCircle size={17} className="text-[#FF5400]" /> Quick Tips
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {QUICK_TIPS.map(({ icon, tip }) => (
              <div key={tip} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-7 h-7 bg-[#FF5400]/10 text-[#FF5400] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  {icon}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guide categories */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {loading ? (
            <>
              <div className="flex items-center gap-3 text-gray-400">
                <Loader2 size={18} className="animate-spin text-[#FF5400]" />
                <span className="text-sm">Loading articles…</span>
              </div>
              {CATEGORY_ORDER.map((cat) => (
                <div key={cat}>
                  <div className="h-7 bg-gray-200 rounded-xl w-48 mb-5 animate-pulse" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => <ArticleCardSkeleton key={i} />)}
                  </div>
                </div>
              ))}
            </>
          ) : totalArticles === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No articles published yet</p>
              <p className="text-sm text-gray-400 mt-1">Check back soon for expert guides.</p>
            </div>
          ) : (
            CATEGORY_ORDER.map((category) => {
              const articles = articlesByCategory[category]
              if (articles.length === 0) return null
              const { icon, color } = CATEGORY_META[category]
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>{icon}</span>
                      {category}
                    </h2>
                    <span className="text-xs text-gray-400">{articles.length} article{articles.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {articles.map((article) => (
                      <Link
                        key={article.$id}
                        to={`/guides/${article.$id}`}
                        className="bg-white rounded-2xl border border-gray-200 hover:border-[#FF5400] hover:shadow-sm transition-all group overflow-hidden"
                      >
                        {article.coverImageId && (
                          <div className="h-36 overflow-hidden">
                            <img
                              src={getGuideImageUrl(article.coverImageId, 600)}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-5">
                          {article.readTime && (
                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                              <Clock size={12} />
                              {article.readTime}
                            </div>
                          )}
                          <h3 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-[#FF5400] transition-colors leading-snug">
                            {article.title}
                          </h3>
                          {article.excerpt && (
                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{article.excerpt}</p>
                          )}
                          <div className="flex items-center gap-1 mt-3 text-xs text-[#FF5400] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                            Read more <ArrowRight size={12} />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-[#FF5400]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-black mb-3">Ready to Find Your Car?</h2>
          <p className="text-orange-100 mb-8">Put your knowledge to work and browse verified listings on DriveHub.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/cars" className="flex items-center gap-2 px-8 py-3.5 bg-white text-[#FF5400] font-bold rounded-xl hover:bg-orange-50 transition-colors">
              <Car size={17} /> Browse Cars
            </Link>
            <Link to="/finance" className="flex items-center gap-2 px-8 py-3.5 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
              Finance Calculator <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

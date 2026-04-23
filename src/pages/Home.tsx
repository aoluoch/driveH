import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Car, CheckCircle, Loader2, Search, Shield, Star, ThumbsUp, Zap } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import CarCard from '../components/cars/CarCard'
import CarBrandLogo from '../components/cars/CarBrandLogo'
import { listCars } from '../lib/cars'
import type { Car as CarType } from '../types'

const POPULAR_MAKES = ['Toyota', 'Honda', 'BMW', 'Mercedes', 'Ford', 'Nissan', 'Volkswagen', 'Subaru']

const BODY_TYPES = [
  { label: 'SUV / 4x4', icon: '🚙', param: 'SUV' },
  { label: 'Sedan', icon: '🚗', param: 'Sedan' },
  { label: 'Hatchback', icon: '🚘', param: 'Hatchback' },
  { label: 'Pickup', icon: '🛻', param: 'Pickup' },
  { label: 'Van', icon: '🚐', param: 'Van' },
  { label: 'Coupe', icon: '🏎️', param: 'Coupe' },
  { label: 'Convertible', icon: '🏖️', param: 'Convertible' },
  { label: 'Wagon', icon: '🚌', param: 'Wagon' },
]

export default function Home() {
  const [featured, setFeatured] = useState<CarType[]>([])
  const [loadingFeatured, setLoadingFeatured] = useState(true)
  const [searchMake, setSearchMake] = useState('')
  const [searchMaxPrice, setSearchMaxPrice] = useState('')
  const [searchCondition, setSearchCondition] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    listCars({ showSold: false })
      .then((cars) => setFeatured(cars.slice(0, 8)))
      .finally(() => setLoadingFeatured(false))
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchMake) params.set('search', searchMake)
    if (searchMaxPrice) params.set('maxPrice', searchMaxPrice)
    if (searchCondition) params.set('condition', searchCondition)
    navigate(`/cars${params.toString() ? '?' + params.toString() : ''}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-[#1a0a00] opacity-95" />
        <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-10"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800")', backgroundSize: 'cover', backgroundPosition: 'center' }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-[#FF5400]/20 text-[#FF5400] text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-[#FF5400]/30">
              <Car size={13} /> Kenya's #1 Car Marketplace
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-4">
              Find Your <span className="text-[#FF5400]">Perfect Car</span> Today
            </h1>
            <p className="text-gray-300 text-lg mb-10 max-w-xl">
              Browse thousands of new, used, and certified pre-owned vehicles — with transparent pricing and no hidden fees.
            </p>

            {/* Search form */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-3 flex flex-col sm:flex-row gap-2 shadow-2xl">
              <input
                type="text"
                value={searchMake}
                onChange={(e) => setSearchMake(e.target.value)}
                placeholder="Brand, model, or keyword…"
                className="flex-1 px-4 py-3 text-gray-800 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5400] border border-gray-200"
              />
              <select
                value={searchCondition}
                onChange={(e) => setSearchCondition(e.target.value)}
                className="px-4 py-3 text-gray-700 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5400] bg-white"
              >
                <option value="">Any Condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Certified Pre-Owned">Certified Pre-Owned</option>
              </select>
              <select
                value={searchMaxPrice}
                onChange={(e) => setSearchMaxPrice(e.target.value)}
                className="px-4 py-3 text-gray-700 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5400] bg-white"
              >
                <option value="">Any Price</option>
                <option value="500000">Under KSh 500K</option>
                <option value="1000000">Under KSh 1M</option>
                <option value="2000000">Under KSh 2M</option>
                <option value="5000000">Under KSh 5M</option>
              </select>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#FF5400] hover:bg-[#e04a00] text-white font-bold rounded-xl transition-colors flex-shrink-0"
              >
                <Search size={16} />
                Search
              </button>
            </form>

            <div className="flex flex-wrap gap-4 mt-5 text-sm text-gray-400">
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-[#FF5400]" /> Verified listings</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-[#FF5400]" /> No hidden fees</span>
              <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-[#FF5400]" /> Direct from sellers</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Popular Makes ── */}
      <section className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-xl font-bold text-gray-900">Browse by Make</h2>
            <Link to="/cars" className="text-sm font-semibold text-[#FF5400] hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {POPULAR_MAKES.map((name) => (
              <Link
                key={name}
                to={`/cars?brand=${name}`}
                className="flex flex-col items-center gap-2 p-3 bg-gray-50 hover:bg-orange-50 hover:border-[#FF5400] border border-gray-200 rounded-xl transition-all group"
                aria-label={name}
              >
                <CarBrandLogo brand={name} size={36} />
                <span className="text-xs font-semibold text-gray-700 group-hover:text-[#FF5400]">{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Browse by Body Type ── */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-7">Browse by Body Type</h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {BODY_TYPES.map(({ label, icon, param }) => (
              <Link
                key={label}
                to={`/cars?bodyType=${param}`}
                className="flex flex-col items-center gap-2 py-5 px-3 bg-white hover:bg-orange-50 hover:border-[#FF5400] border border-gray-200 rounded-xl text-center transition-all group"
              >
                <span className="text-3xl">{icon}</span>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-[#FF5400]">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Listings ── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Latest Listings</h2>
              <p className="text-gray-500 text-sm mt-1">Fresh vehicles added recently</p>
            </div>
            <Link
              to="/cars"
              className="flex items-center gap-1.5 px-5 py-2.5 border-2 border-[#FF5400] text-[#FF5400] hover:bg-[#FF5400] hover:text-white font-semibold text-sm rounded-xl transition-colors"
            >
              View All Cars <ArrowRight size={15} />
            </Link>
          </div>

          {loadingFeatured ? (
            <div className="flex justify-center py-16">
              <Loader2 size={36} className="animate-spin text-[#FF5400]" />
            </div>
          ) : featured.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Car size={48} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium text-gray-600">No listings yet</p>
              <p className="text-sm mt-1">Check back soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map((car) => (
                <CarCard key={car.$id} car={car} variant="grid" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Why DriveHub ── */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">Why Choose DriveHub?</h2>
            <p className="text-gray-500 mt-2">We make car buying simple, transparent and trustworthy</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Shield size={28} />, title: 'Verified Listings', desc: 'Every car is reviewed and verified before going live on our platform.' },
              { icon: <Star size={28} />, title: 'Quality Assured', desc: 'Only quality vehicles from trusted sellers, with full history available.' },
              { icon: <Zap size={28} />, title: 'Fast & Easy', desc: 'Search, filter, and contact a seller in under 2 minutes.' },
              { icon: <ThumbsUp size={28} />, title: 'No Hidden Fees', desc: 'Transparent pricing — the price you see is the price you pay.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-200 text-center hover:border-[#FF5400] transition-colors">
                <div className="w-14 h-14 bg-[#FF5400]/10 text-[#FF5400] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sell CTA Banner ── */}
      <section className="py-14 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-white">
              <h2 className="text-3xl font-black mb-2">Got a Car to Sell?</h2>
              <p className="text-gray-300 text-lg">List it on DriveHub and reach thousands of verified buyers instantly.</p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Link
                to="/sell"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF5400] hover:bg-[#e04a00] text-white font-bold rounded-xl transition-colors text-sm shadow-lg"
              >
                Sell My Car
              </Link>
              <Link
                to="/finance"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors text-sm border border-white/20"
              >
                Finance Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 bg-[#FF5400]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-black mb-3">Ready to Find Your Car?</h2>
          <p className="text-orange-100 mb-8 text-lg">Browse our full inventory of cars available across Kenya</p>
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#FF5400] font-bold rounded-xl hover:bg-orange-50 transition-colors text-lg shadow-lg"
          >
            <Search size={20} />
            Browse All Cars
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

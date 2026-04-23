import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Fuel,
  Gauge,
  Heart,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Settings2,
  Share2,
  Shield,
  Wrench,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { getCar, getCarImageUrl, getCarImageViewUrl } from '../lib/cars'
import { useFavourites } from '../context/FavouritesContext'
import type { Car } from '../types'

function conditionBadgeClass(condition: string) {
  if (condition === 'New') return 'bg-emerald-100 text-emerald-700'
  if (condition === 'Certified Pre-Owned') return 'bg-blue-100 text-blue-700'
  return 'bg-gray-100 text-gray-600'
}

export default function CarDetail() {
  const { id } = useParams<{ id: string }>()
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImg, setActiveImg] = useState(0)
  const [copied, setCopied] = useState(false)
  const { toggle, isFavourite } = useFavourites()

  const whatsapp = import.meta.env.VITE_CONTACT_WHATSAPP as string
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL as string

  useEffect(() => {
    if (!id) return
    getCar(id)
      .then(setCar)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={40} className="animate-spin text-[#FF5400]" />
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <p className="text-xl font-bold text-gray-700 mb-2">Car not found</p>
          <p className="text-gray-500 mb-6 text-sm">{error}</p>
          <Link to="/cars" className="px-5 py-2.5 bg-[#FF5400] text-white rounded-xl text-sm font-semibold hover:bg-[#e04a00]">
            Browse Cars
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const saved = isFavourite(car.$id)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#FF5400] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/cars" className="hover:text-[#FF5400] transition-colors">Browse Cars</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium line-clamp-1">{car.title}</span>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Back link */}
        <Link
          to="/cars"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#FF5400] mb-5 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Gallery + Details ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Gallery */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {/* Main image */}
              <div className="relative aspect-[16/10] bg-gray-100">
                {car.images.length > 0 ? (
                  <a href={getCarImageViewUrl(car.images[activeImg])} target="_blank" rel="noreferrer">
                    <img
                      src={getCarImageUrl(car.images[activeImg], 1200)}
                      alt={car.title}
                      className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                    />
                  </a>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No images available
                  </div>
                )}
                {car.isSold && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-600 text-white font-black text-3xl sm:text-4xl px-10 py-3 rounded tracking-widest shadow-2xl rotate-[-10deg]">
                      SOLD
                    </span>
                  </div>
                )}
                <span className={`absolute top-3 left-3 px-3 py-1 rounded text-xs font-bold ${conditionBadgeClass(car.condition)}`}>
                  {car.condition}
                </span>
                {car.images.length > 1 && (
                  <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                    {activeImg + 1} / {car.images.length}
                  </span>
                )}
              </div>
              {/* Thumbnails */}
              {car.images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {car.images.map((imgId, i) => (
                    <button
                      key={imgId}
                      onClick={() => setActiveImg(i)}
                      className={`flex-shrink-0 w-16 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImg === i ? 'border-[#FF5400] shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={getCarImageUrl(imgId, 150)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title block */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">{car.title}</h1>
                  <p className="text-gray-500 text-sm mt-1">{car.brand} {car.model} · {car.year} · {car.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggle(car.$id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      saved
                        ? 'border-[#FF5400] bg-orange-50 text-[#FF5400]'
                        : 'border-gray-200 text-gray-600 hover:border-[#FF5400] hover:text-[#FF5400]'
                    }`}
                  >
                    <Heart size={15} fill={saved ? 'currentColor' : 'none'} />
                    {saved ? 'Saved' : 'Save'}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Share2 size={15} />
                    {copied ? 'Copied!' : 'Share'}
                  </button>
                </div>
              </div>
            </div>

            {/* Key specs */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="font-bold text-gray-900 text-base mb-4">Key Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { icon: <Fuel size={16} />, label: 'Fuel Type', value: car.fuelType },
                  { icon: <Settings2 size={16} />, label: 'Transmission', value: car.transmission },
                  { icon: <Calendar size={16} />, label: 'Year', value: String(car.year) },
                  { icon: <Wrench size={16} />, label: 'Engine', value: car.engine || '—' },
                  { icon: <Gauge size={16} />, label: 'Mileage', value: car.mileage > 0 ? `${car.mileage.toLocaleString()} km` : '—' },
                  { icon: <MapPin size={16} />, label: 'Location', value: car.location },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                    <div className="flex items-center gap-1.5 text-gray-400 mb-1.5 text-xs">
                      {icon}
                      <span className="font-medium">{label}</span>
                    </div>
                    <p className="font-bold text-gray-800 text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {car.description && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h2 className="font-bold text-gray-900 text-base mb-3">Description</h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{car.description}</p>
              </div>
            )}

            {/* Features */}
            {car.features && car.features.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h2 className="font-bold text-gray-900 text-base mb-4">Features & Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {car.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 py-2 px-3 bg-gray-50 rounded-lg border border-gray-100">
                      <CheckCircle2 size={14} className="text-[#FF5400] flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Price + Contact ── */}
          <div className="space-y-4">
            {/* Price card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-24">
              <div className="mb-5">
                <p className="text-3xl font-black text-[#FF5400]">KSh {car.price.toLocaleString()}</p>
                {car.isSold ? (
                  <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                    This car has been sold
                  </span>
                ) : (
                  <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                    Available for sale
                  </span>
                )}
              </div>

              {!car.isSold && (
                <div className="space-y-2.5">
                  {whatsapp && (
                    <a
                      href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in the ${car.title} listed on DriveHub.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors"
                    >
                      <MessageCircle size={17} />
                      Chat on WhatsApp
                    </a>
                  )}
                  {contactEmail && (
                    <a
                      href={`mailto:${contactEmail}?subject=${encodeURIComponent(`Inquiry: ${car.title}`)}&body=${encodeURIComponent(`Hi,\n\nI am interested in the ${car.title} (${car.year}, KSh ${car.price.toLocaleString()}) listed on DriveHub.\n\nPlease get in touch with me.\n\nThanks`)}`}
                      className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#FF5400] hover:bg-[#e04a00] text-white font-bold rounded-xl text-sm transition-colors"
                    >
                      <Mail size={17} />
                      Send Email Enquiry
                    </a>
                  )}
                  {!whatsapp && !contactEmail && (
                    <div className="py-3.5 text-center text-gray-400 bg-gray-50 rounded-xl text-sm border border-gray-200">
                      Contact details not set
                    </div>
                  )}
                </div>
              )}

              {/* Trust badges */}
              <div className="mt-5 pt-4 border-t border-gray-100 space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <Shield size={15} className="text-[#FF5400] flex-shrink-0" />
                  Verified listing
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <CheckCircle2 size={15} className="text-[#FF5400] flex-shrink-0" />
                  No hidden fees
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <Heart size={15} className="text-[#FF5400] flex-shrink-0" />
                  {saved ? 'Saved to your list' : 'Save for later'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

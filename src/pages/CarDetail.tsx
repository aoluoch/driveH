import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Fuel,
  Gauge,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Settings2,
  Wrench,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { getCar, getCarImageUrl, getCarImageViewUrl } from '../lib/cars'
import type { Car } from '../types'

export default function CarDetail() {
  const { id } = useParams<{ id: string }>()
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImg, setActiveImg] = useState(0)

  const whatsapp = import.meta.env.VITE_CONTACT_WHATSAPP as string
  const email    = import.meta.env.VITE_CONTACT_EMAIL as string

  useEffect(() => {
    if (!id) return
    getCar(id)
      .then(setCar)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={40} className="animate-spin text-blue-600" />
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <p className="text-xl font-semibold text-slate-700 mb-2">Car not found</p>
          <p className="text-slate-500 mb-6">{error}</p>
          <Link to="/" className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
            Back to listings
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const conditionColor =
    car.condition === 'New'
      ? 'bg-emerald-100 text-emerald-700'
      : car.condition === 'Certified Pre-Owned'
        ? 'bg-blue-100 text-blue-700'
        : 'bg-slate-100 text-slate-600'

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Image gallery ── */}
          <div className="space-y-3">
            {/* Main image */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200">
              {car.images.length > 0 ? (
                <a href={getCarImageViewUrl(car.images[activeImg])} target="_blank" rel="noreferrer">
                  <img
                    src={getCarImageUrl(car.images[activeImg], 1200)}
                    alt={car.title}
                    className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                  />
                </a>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  No image available
                </div>
              )}
              {car.isSold && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-red-600 text-white font-black text-3xl px-10 py-3 rounded tracking-widest shadow-xl rotate-[-10deg]">
                    SOLD
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {car.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {car.images.map((imgId, i) => (
                  <button
                    key={imgId}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                      activeImg === i ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={getCarImageUrl(imgId, 150)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info panel ── */}
          <div className="space-y-6">
            {/* Title & price */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${conditionColor}`}>
                  {car.condition}
                </span>
                {car.isSold && (
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                    SOLD
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-1">
                {car.title}
              </h1>
              <p className="text-slate-500">
                {car.brand} {car.model} · {car.year}
              </p>
              <p className="text-3xl font-extrabold text-blue-600 mt-3">
                KSh {car.price.toLocaleString()}
              </p>
            </div>

            {/* Key specs grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Fuel size={16} />,      label: 'Fuel Type',    value: car.fuelType },
                { icon: <Settings2 size={16} />,  label: 'Transmission', value: car.transmission },
                { icon: <Calendar size={16} />,   label: 'Year',         value: String(car.year) },
                { icon: <Wrench size={16} />,     label: 'Engine',       value: car.engine || '—' },
                { icon: <Gauge size={16} />,      label: 'Mileage',      value: car.mileage > 0 ? `${car.mileage.toLocaleString()} km` : '—' },
                { icon: <MapPin size={16} />,     label: 'Location',     value: car.location },
              ].map(({ icon, label, value }) => (
                <div key={label} className="bg-white rounded-xl p-3 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-1 text-xs">
                    {icon}
                    <span>{label}</span>
                  </div>
                  <p className="font-semibold text-slate-800 text-sm">{value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {car.description && (
              <div>
                <h2 className="font-semibold text-slate-900 mb-2">Description</h2>
                <p className="text-slate-600 text-sm leading-relaxed">{car.description}</p>
              </div>
            )}

            {/* Contact buttons */}
            {!car.isSold && (
              <div className="flex gap-3 pt-2">
                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in the ${car.title} listed on DriveHub.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition-colors"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </a>
                )}
                {email && (
                  <a
                    href={`mailto:${email}?subject=${encodeURIComponent(`Inquiry: ${car.title}`)}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors"
                  >
                    <Mail size={16} />
                    Email
                  </a>
                )}
                {!whatsapp && !email && (
                  <div className="flex-1 py-3 text-center text-slate-400 bg-slate-100 rounded-xl text-sm">
                    Contact details not set
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        {car.features && car.features.length > 0 && (
          <section className="mt-10">
            <h2 className="font-bold text-slate-900 text-lg mb-4">Features & Highlights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {car.features.map((feat) => (
                <div key={feat} className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-4 py-2.5">
                  <CheckCircle2 size={15} className="text-blue-500 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{feat}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

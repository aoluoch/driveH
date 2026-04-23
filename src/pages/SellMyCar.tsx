import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BadgeCheck,
  Camera,
  Car,
  CheckCircle,
  ChevronRight,
  Clock,
  DollarSign,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Shield,
  TrendingUp,
  User,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const STEPS = [
  { icon: <Phone size={22} />, step: '01', title: 'Contact Us', desc: 'Fill out the form below or call us directly. We respond within 24 hours.' },
  { icon: <Camera size={22} />, step: '02', title: 'Submit Your Car Details', desc: "Provide your car's specs, condition, mileage, and photos for our team to review." },
  { icon: <BadgeCheck size={22} />, step: '03', title: 'Get Listed', desc: 'Once verified, your car goes live on DriveHub and reaches thousands of buyers.' },
  { icon: <DollarSign size={22} />, step: '04', title: 'Sell Fast', desc: 'Interested buyers contact you directly — no middlemen, no hidden commissions.' },
]

const PERKS = [
  { icon: <TrendingUp size={20} />, title: 'Reach Thousands of Buyers', desc: 'Your listing is seen by active car buyers across Kenya every day.' },
  { icon: <Shield size={20} />, title: 'Safe & Verified Platform', desc: 'All buyers on DriveHub are registered and vetted for your safety.' },
  { icon: <Clock size={20} />, title: 'List in Under 24 Hours', desc: "Submit your details today and go live tomorrow — it's that fast." },
  { icon: <CheckCircle size={20} />, title: 'No Hidden Fees', desc: 'Transparent listing fees with no surprise charges or commissions.' },
]

export default function SellMyCar() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', carDetails: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const whatsapp = import.meta.env.VITE_CONTACT_WHATSAPP as string
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL as string

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitted(true)
      setSubmitting(false)
    }, 800)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gray-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-[#1a0a00] opacity-95" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-[#FF5400]/20 text-[#FF5400] text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-[#FF5400]/30">
            <Car size={13} /> Sell on DriveHub
          </span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            Sell Your Car <span className="text-[#FF5400]">Fast & Easily</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            List your vehicle on Kenya's #1 car marketplace and connect with thousands of verified buyers instantly.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
            <span className="flex items-center gap-2"><CheckCircle size={15} className="text-[#FF5400]" /> Free to list</span>
            <span className="flex items-center gap-2"><CheckCircle size={15} className="text-[#FF5400]" /> Live in 24 hours</span>
            <span className="flex items-center gap-2"><CheckCircle size={15} className="text-[#FF5400]" /> No commission fees</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map(({ icon, step, title, desc }) => (
              <div key={step} className="relative bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="absolute -top-3 left-5 bg-[#FF5400] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {step}
                </div>
                <div className="w-12 h-12 bg-[#FF5400]/10 text-[#FF5400] rounded-xl flex items-center justify-center mb-4 mt-2">
                  {icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Why Sell on DriveHub?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PERKS.map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-gray-200">
                <div className="w-10 h-10 bg-[#FF5400]/10 text-[#FF5400] rounded-xl flex items-center justify-center flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form + quick contact */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Form */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Get In Touch</h2>
              <p className="text-gray-500 text-sm mb-6">Fill out the form and our team will reach out within 24 hours to guide you through the listing process.</p>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                  <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 text-xl mb-2">Request Received!</h3>
                  <p className="text-gray-500 text-sm mb-6">Our team will contact you within 24 hours to get your car listed.</p>
                  <Link to="/cars" className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF5400] text-white font-bold rounded-xl text-sm hover:bg-[#e04a00] transition-colors">
                    Browse Cars <ChevronRight size={15} />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                      <div className="relative">
                        <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          required
                          value={form.name}
                          onChange={handleChange}
                          placeholder="John Kamau"
                          className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5400]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number *</label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+254 7XX XXX XXX"
                          className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5400]"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5400]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Car Details *</label>
                    <input
                      type="text"
                      name="carDetails"
                      required
                      value={form.carDetails}
                      onChange={handleChange}
                      placeholder="e.g. 2019 Toyota Fielder, 60,000 km, Petrol, Auto"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5400]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Additional Message</label>
                    <textarea
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Any other details about the car, asking price, your location…"
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5400] resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#FF5400] hover:bg-[#e04a00] text-white font-bold rounded-xl transition-colors disabled:opacity-60"
                  >
                    <Send size={16} />
                    {submitting ? 'Sending…' : 'Submit Listing Request'}
                  </button>
                </form>
              )}
            </div>

            {/* Quick contact */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Quick Contact</h3>
                <p className="text-sm text-gray-500 mb-5">Prefer to speak directly? Reach our team instantly.</p>
                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hi, I want to list my car on DriveHub.')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors mb-3"
                  >
                    <MessageCircle size={17} />
                    WhatsApp Us
                  </a>
                )}
                {contactEmail && (
                  <a
                    href={`mailto:${contactEmail}?subject=Sell My Car Inquiry`}
                    className="flex items-center gap-3 w-full py-3 px-4 border-2 border-[#FF5400] text-[#FF5400] hover:bg-orange-50 font-bold rounded-xl text-sm transition-colors"
                  >
                    <Mail size={17} />
                    Email Our Team
                  </a>
                )}
              </div>

              <div className="bg-[#FF5400]/5 border border-[#FF5400]/20 rounded-2xl p-5">
                <h4 className="font-bold text-gray-900 mb-3 text-sm">What to Prepare</h4>
                <ul className="space-y-2">
                  {[
                    'Car registration certificate (logbook)',
                    'At least 5 clear photos',
                    'Vehicle service history (if available)',
                    'Current mileage reading',
                    'Asking price',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle size={14} className="text-[#FF5400] mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

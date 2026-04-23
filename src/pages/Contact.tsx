import { useState } from 'react'
import {
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  User,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { createContactMessage } from '../lib/messages'

const FAQ = [
  { q: 'How do I list my car for sale?', a: 'Visit our Sell My Car page and fill out the inquiry form. Our team will get back to you within 24 hours to guide you through the listing process.' },
  { q: 'Is it free to browse listings?', a: 'Yes, browsing and searching for cars on DriveHub is completely free for all users.' },
  { q: 'Are all listings verified?', a: 'We review and verify all listings before they go live on our platform to ensure accuracy and safety.' },
  { q: 'How do I contact a seller?', a: 'On any car detail page, you\'ll find WhatsApp and email contact buttons to reach the seller directly.' },
  { q: 'Can I save cars I\'m interested in?', a: 'Yes! Click the heart icon on any listing to save it. Create an account to access saved cars from any device.' },
  { q: 'What if I have an issue with a listing?', a: 'Contact our support team through the form below or via WhatsApp and we\'ll investigate promptly.' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const whatsapp = import.meta.env.VITE_CONTACT_WHATSAPP as string
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL as string

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createContactMessage({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Failed to send message:', err)
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-500">Have a question or need help? We're here for you.</p>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact info */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="font-bold text-gray-900 mb-4">Get In Touch</h2>
              <div className="space-y-4">
                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-emerald-600 transition-colors group"
                  >
                    <div className="w-9 h-9 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <MessageCircle size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">WhatsApp</p>
                      <p className="text-xs text-gray-500">{whatsapp}</p>
                    </div>
                  </a>
                )}
                {contactEmail && (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#FF5400] transition-colors group"
                  >
                    <div className="w-9 h-9 bg-orange-100 text-[#FF5400] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF5400] group-hover:text-white transition-colors">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <p className="text-xs text-gray-500">{contactEmail}</p>
                    </div>
                  </a>
                )}
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-xs text-gray-500">+254 700 000 000</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-9 h-9 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Office</p>
                    <p className="text-xs text-gray-500">Westlands, Nairobi, Kenya</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={15} className="text-[#FF5400]" />
                <h3 className="font-bold text-gray-900 text-sm">Office Hours</h3>
              </div>
              <div className="space-y-1.5 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Monday – Friday</span>
                  <span className="font-medium text-gray-700">8am – 6pm</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium text-gray-700">9am – 3pm</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium text-gray-400">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-5">Send a Message</h2>
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle size={52} className="text-emerald-500 mb-4" />
                <h3 className="font-bold text-gray-900 text-xl mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm max-w-sm">Thanks for reaching out. Our team will respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Your Name *</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5400]"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Subject *</label>
                  <select
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5400] bg-white text-gray-700"
                  >
                    <option value="">Select a topic</option>
                    <option>General Inquiry</option>
                    <option>Listing a Car</option>
                    <option>Report a Listing</option>
                    <option>Account Issue</option>
                    <option>Partnership</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Message *</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you…"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5400] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#FF5400] hover:bg-[#e04a00] text-white font-bold rounded-xl transition-colors disabled:opacity-60"
                >
                  <Send size={16} />
                  {submitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map(({ q, a }, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-semibold text-gray-800 hover:text-[#FF5400] transition-colors"
                >
                  {q}
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

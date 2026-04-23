import { Link } from 'react-router-dom'
import {
  Award,
  Car,
  CheckCircle,
  ChevronRight,
  Globe,
  Heart,
  Shield,
  Star,
  Target,
  Users,
  Zap,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const STATS = [
  { value: '500+', label: 'Active Listings', icon: <Car size={20} /> },
  { value: '10K+', label: 'Monthly Visitors', icon: <Users size={20} /> },
  { value: '98%', label: 'Satisfied Customers', icon: <Star size={20} /> },
  { value: '5+', label: 'Years of Service', icon: <Award size={20} /> },
]

const VALUES = [
  { icon: <Shield size={22} />, title: 'Trust & Transparency', desc: 'Every listing is reviewed by our team. We\'re honest about what you\'re buying.' },
  { icon: <Heart size={22} />, title: 'Customer First', desc: 'We\'re not just a listing site. We\'re your partner in finding the right car.' },
  { icon: <Zap size={22} />, title: 'Efficiency', desc: 'We eliminate friction from the car buying process so you spend less time searching.' },
  { icon: <Globe size={22} />, title: 'Community', desc: 'We\'re building a trusted automotive community that benefits buyers and sellers alike.' },
]

const TEAM = [
  { name: 'James Otieno', role: 'CEO & Co-Founder', initial: 'J' },
  { name: 'Sarah Wanjiku', role: 'Head of Operations', initial: 'S' },
  { name: 'Kevin Mwangi', role: 'Lead Developer', initial: 'K' },
  { name: 'Grace Akinyi', role: 'Customer Success', initial: 'G' },
]

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gray-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-[#1a0a00] opacity-95" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-[#FF5400]/20 text-[#FF5400] text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-[#FF5400]/30">
            <Target size={13} /> About DriveHub
          </span>
          <h1 className="text-4xl sm:text-5xl font-black mb-5">
            Kenya's <span className="text-[#FF5400]">Most Trusted</span> Car Marketplace
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            DriveHub was built to make car buying and selling simple, transparent, and trustworthy — connecting thousands of Kenyans with their perfect vehicle every month.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(({ value, label, icon }) => (
              <div key={label} className="text-center p-5">
                <div className="w-12 h-12 bg-[#FF5400]/10 text-[#FF5400] rounded-xl flex items-center justify-center mx-auto mb-3">
                  {icon}
                </div>
                <p className="text-3xl font-black text-gray-900 mb-1">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-5">Our Story</h2>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>
                  DriveHub was founded in Nairobi with a single mission: to remove the frustration from buying and selling cars in Kenya. We saw a market full of unreliable listings, hidden fees, and dishonest dealers — and we decided to change that.
                </p>
                <p>
                  We built a platform where every listing is verified, every price is transparent, and every buyer can search with confidence. Whether you're looking for a brand-new Toyota or a reliable second-hand sedan, DriveHub helps you find it — fast.
                </p>
                <p>
                  Today, we're proud to serve thousands of buyers and sellers across Kenya, with a growing team committed to making the automotive market fair for everyone.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-7">
                <Link
                  to="/cars"
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#FF5400] text-white font-bold rounded-xl hover:bg-[#e04a00] transition-colors text-sm"
                >
                  Browse Cars <ChevronRight size={15} />
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-[#FF5400] hover:text-[#FF5400] transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-[#FF5400] rounded-3xl h-64 flex items-center justify-center overflow-hidden">
                <Car size={100} className="text-white opacity-20 absolute" />
                <div className="text-center text-white relative z-10">
                  <p className="text-5xl font-black">2019</p>
                  <p className="text-orange-200 font-medium mt-1">Founded in Nairobi</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl border border-gray-200 p-4 shadow-lg text-center w-36">
                <p className="text-2xl font-black text-[#FF5400]">47</p>
                <p className="text-xs text-gray-500">Cities covered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">What We Stand For</h2>
            <p className="text-gray-500 text-sm">Our values guide every decision we make</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-200 hover:border-[#FF5400] transition-colors">
                <div className="w-11 h-11 bg-[#FF5400]/10 text-[#FF5400] rounded-xl flex items-center justify-center flex-shrink-0">
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

      {/* Team */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Meet the Team</h2>
            <p className="text-gray-500 text-sm">The people behind DriveHub</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {TEAM.map(({ name, role, initial }) => (
              <div key={name} className="bg-white rounded-2xl border border-gray-200 p-5 text-center hover:border-[#FF5400] transition-colors">
                <div className="w-16 h-16 bg-[#FF5400] rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-3">
                  {initial}
                </div>
                <p className="font-bold text-gray-900 text-sm">{name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission CTA */}
      <section className="py-14 bg-[#FF5400]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-black mb-3">Ready to Experience DriveHub?</h2>
          <p className="text-orange-100 mb-8">Join thousands of Kenyans who trust DriveHub to buy and sell cars.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/cars" className="flex items-center gap-2 px-8 py-3.5 bg-white text-[#FF5400] font-bold rounded-xl hover:bg-orange-50 transition-colors">
              <Car size={17} /> Browse Cars
            </Link>
            <Link to="/sell" className="flex items-center gap-2 px-8 py-3.5 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors">
              Sell My Car <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="py-8 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-gray-400 mb-5 uppercase tracking-widest font-semibold">Trusted & verified</p>
          <div className="flex flex-wrap justify-center gap-6">
            {['Verified Listings', 'Secure Payments', 'KE Licensed Dealers', 'NTSA Compliant', 'Data Protected'].map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                <CheckCircle size={14} className="text-[#FF5400]" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

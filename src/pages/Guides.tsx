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
  Search,
  Settings2,
  Shield,
  TrendingUp,
  Wrench,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const GUIDES = [
  {
    category: 'Buying Guides',
    icon: <Car size={18} />,
    color: 'bg-blue-100 text-blue-600',
    guides: [
      { title: 'How to Buy a Used Car: The Complete Guide', time: '8 min read', desc: 'Everything you need to know before buying a second-hand car in Kenya — from inspection to paperwork.' },
      { title: 'New vs Used vs Certified Pre-Owned', time: '5 min read', desc: 'Understand the pros, cons, and pricing differences to make the right choice for your budget.' },
      { title: 'How to Inspect a Car Before Buying', time: '6 min read', desc: 'A step-by-step checklist to help you spot hidden problems before handing over any money.' },
      { title: 'Buying Your First Car: Beginner\'s Guide', time: '7 min read', desc: 'All you need to know about buying your very first car — what to look for and common mistakes to avoid.' },
    ],
  },
  {
    category: 'Finance & Costs',
    icon: <DollarSign size={18} />,
    color: 'bg-emerald-100 text-emerald-600',
    guides: [
      { title: 'How Car Loans Work in Kenya', time: '5 min read', desc: 'A clear guide to car financing, interest rates, deposit requirements, and what banks look for.' },
      { title: 'Total Cost of Car Ownership', time: '6 min read', desc: 'Beyond the sticker price — insurance, servicing, fuel, and parking costs all add up.' },
      { title: 'How to Negotiate a Car Price', time: '4 min read', desc: 'Proven strategies to get the best deal when buying from a dealer or private seller.' },
      { title: 'Car Insurance in Kenya: What You Need', time: '5 min read', desc: 'Types of cover, what\'s required by law, and tips to get the cheapest premium.' },
    ],
  },
  {
    category: 'Car Care & Maintenance',
    icon: <Wrench size={18} />,
    color: 'bg-orange-100 text-orange-600',
    guides: [
      { title: 'Basic Car Maintenance Every Owner Should Know', time: '7 min read', desc: 'Oil changes, tyre rotation, brake checks — the essential tasks that keep your car running.' },
      { title: 'How to Read Car Service History', time: '4 min read', desc: 'Understanding what a good service record looks like and red flags to watch out for.' },
      { title: 'Petrol vs Diesel vs Hybrid: Which is Right for You?', time: '5 min read', desc: 'A practical comparison of fuel types to help you choose based on your driving habits.' },
      { title: 'Common Car Problems & How to Spot Them', time: '6 min read', desc: 'Warning signs that your car may need attention — before they turn into expensive repairs.' },
    ],
  },
  {
    category: 'Selling Your Car',
    icon: <TrendingUp size={18} />,
    color: 'bg-purple-100 text-purple-600',
    guides: [
      { title: 'How to Get the Best Price for Your Car', time: '5 min read', desc: 'Tips to maximise what you earn when selling — presentation, timing, and where to list.' },
      { title: 'How to Write a Great Car Listing', time: '4 min read', desc: 'What to include in your listing, how to take great photos, and what buyers want to see.' },
      { title: 'Transferring Car Ownership in Kenya', time: '6 min read', desc: 'Step-by-step guide to the logbook transfer process at NTSA and the documents you\'ll need.' },
      { title: 'How to Avoid Car Buying Scams', time: '5 min read', desc: 'Red flags to watch for when selling your car and how to stay safe during transactions.' },
    ],
  },
]

const QUICK_TIPS = [
  { icon: <Search size={16} />, tip: 'Always verify a car\'s chassis number against NTSA records before buying.' },
  { icon: <Shield size={16} />, tip: 'Never pay a full deposit before seeing and test-driving the car in person.' },
  { icon: <FileText size={16} />, tip: 'Request a copy of the logbook and verify the owner\'s name matches the seller.' },
  { icon: <Settings2 size={16} />, tip: 'Take the car to an independent mechanic for a pre-purchase inspection.' },
  { icon: <Fuel size={16} />, tip: 'Check fuel economy ratings and calculate realistic monthly running costs.' },
  { icon: <DollarSign size={16} />, tip: 'Factor in 3–5 years of ownership costs, not just the purchase price.' },
]

export default function Guides() {
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
          {GUIDES.map(({ category, icon, color, guides }) => (
            <div key={category}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>{icon}</span>
                  {category}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {guides.map(({ title, time, desc }) => (
                  <div
                    key={title}
                    className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-[#FF5400] hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Clock size={12} />
                      {time}
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-2 group-hover:text-[#FF5400] transition-colors leading-snug">{title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                    <div className="flex items-center gap-1 mt-3 text-xs text-[#FF5400] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Read guide <ArrowRight size={12} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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

import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  Calculator,
  Car,
  CheckCircle,
  ChevronRight,
  Info,
  Percent,
  Shield,
} from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

const LENDERS = [
  { name: 'KCB Bank', rate: 14, maxTerm: 60, logo: '🏦' },
  { name: 'Equity Bank', rate: 13.5, maxTerm: 60, logo: '🏛️' },
  { name: 'Co-operative Bank', rate: 15, maxTerm: 48, logo: '🏢' },
  { name: 'NCBA Bank', rate: 14.5, maxTerm: 60, logo: '🏗️' },
]

function formatKSh(n: number) {
  return `KSh ${Math.round(n).toLocaleString()}`
}

function calcMonthly(principal: number, annualRate: number, months: number) {
  const r = annualRate / 100 / 12
  if (r === 0) return principal / months
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

export default function Finance() {
  const [carPrice, setCarPrice] = useState(1500000)
  const [deposit, setDeposit] = useState(300000)
  const [term, setTerm] = useState(48)
  const [rate, setRate] = useState(14)

  const principal = Math.max(0, carPrice - deposit)
  const depositPct = carPrice > 0 ? Math.round((deposit / carPrice) * 100) : 0

  const monthly = useMemo(() => calcMonthly(principal, rate, term), [principal, rate, term])
  const totalRepayable = monthly * term
  const totalInterest = totalRepayable - principal

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gray-900 text-white py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-[#1a0a00] opacity-95" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 bg-[#FF5400]/20 text-[#FF5400] text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-[#FF5400]/30">
            <Calculator size={13} /> Car Finance Calculator
          </span>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            Calculate Your <span className="text-[#FF5400]">Monthly Payments</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Instantly estimate your car loan repayments based on price, deposit, term and interest rate.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Calculator inputs */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                <Calculator size={18} className="text-[#FF5400]" />
                Finance Details
              </h2>

              <div className="space-y-6">
                {/* Car price */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-700">Car Price</label>
                    <span className="text-[#FF5400] font-bold text-sm">{formatKSh(carPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={200000}
                    max={10000000}
                    step={50000}
                    value={carPrice}
                    onChange={(e) => setCarPrice(+e.target.value)}
                    className="w-full h-2 rounded-full accent-[#FF5400]"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>KSh 200K</span><span>KSh 10M</span>
                  </div>
                </div>

                {/* Deposit */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-700">Deposit / Down Payment</label>
                    <span className="text-[#FF5400] font-bold text-sm">{formatKSh(deposit)} <span className="text-gray-400 font-normal">({depositPct}%)</span></span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={carPrice}
                    step={10000}
                    value={Math.min(deposit, carPrice)}
                    onChange={(e) => setDeposit(+e.target.value)}
                    className="w-full h-2 rounded-full accent-[#FF5400]"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>KSh 0</span><span>{formatKSh(carPrice)}</span>
                  </div>
                </div>

                {/* Term */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-700">Loan Term</label>
                    <span className="text-[#FF5400] font-bold text-sm">{term} months</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[12, 24, 36, 48, 60].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTerm(t)}
                        className={`py-2 rounded-xl text-sm font-semibold border transition-all ${
                          term === t
                            ? 'bg-[#FF5400] text-white border-[#FF5400]'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[#FF5400] hover:text-[#FF5400]'
                        }`}
                      >
                        {t}mo
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interest rate */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                      Annual Interest Rate <Percent size={12} className="text-gray-400" />
                    </label>
                    <span className="text-[#FF5400] font-bold text-sm">{rate}% p.a.</span>
                  </div>
                  <input
                    type="range"
                    min={8}
                    max={25}
                    step={0.5}
                    value={rate}
                    onChange={(e) => setRate(+e.target.value)}
                    className="w-full h-2 rounded-full accent-[#FF5400]"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>8%</span><span>25%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl p-3 border border-gray-100">
                <Info size={13} className="flex-shrink-0 mt-0.5" />
                This calculator provides an estimate only. Actual loan terms depend on your lender and credit profile.
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-2 space-y-4">
              {/* Monthly payment highlight */}
              <div className="bg-[#FF5400] text-white rounded-2xl p-6 text-center shadow-lg">
                <p className="text-orange-100 text-sm font-medium mb-1">Estimated Monthly Payment</p>
                <p className="text-4xl font-black">{formatKSh(monthly)}</p>
                <p className="text-orange-200 text-xs mt-1">per month for {term} months</p>
              </div>

              {/* Breakdown */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
                <h3 className="font-bold text-gray-900 text-sm">Payment Breakdown</h3>
                {[
                  { label: 'Car Price', value: formatKSh(carPrice) },
                  { label: 'Deposit', value: formatKSh(deposit), negative: true },
                  { label: 'Loan Amount', value: formatKSh(principal), bold: true },
                  { label: 'Total Interest', value: formatKSh(totalInterest) },
                  { label: 'Total Repayable', value: formatKSh(totalRepayable), bold: true },
                ].map(({ label, value, bold, negative }) => (
                  <div key={label} className={`flex justify-between text-sm ${bold ? 'font-bold text-gray-900 pt-2 border-t border-gray-100' : 'text-gray-600'}`}>
                    <span>{label}</span>
                    <span className={negative ? 'text-emerald-600' : ''}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Eligibility note */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                <Shield size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-700">A <strong>20–30% deposit</strong> typically improves your chances of loan approval and lowers your monthly payments.</p>
              </div>

              <Link
                to="/cars"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl text-sm transition-colors"
              >
                Browse Cars <ChevronRight size={15} />
              </Link>
            </div>
          </div>

          {/* Lender comparison */}
          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Percent size={18} className="text-[#FF5400]" />
              Compare Lender Rates
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {LENDERS.map(({ name, rate: r, maxTerm, logo }) => {
                const m = calcMonthly(principal, r, Math.min(term, maxTerm))
                return (
                  <div key={name} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-[#FF5400] transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{logo}</span>
                      <p className="font-semibold text-gray-900 text-sm">{name}</p>
                    </div>
                    <p className="text-2xl font-black text-[#FF5400] mb-0.5">{formatKSh(m)}<span className="text-sm font-normal text-gray-400">/mo</span></p>
                    <p className="text-xs text-gray-500">{r}% p.a. · up to {maxTerm} months</p>
                    <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600">
                      <CheckCircle size={12} />
                      <span>Indicative rate</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="flex items-center gap-2 mt-4 text-xs text-gray-400">
              <AlertCircle size={13} />
              Rates are indicative. Contact each lender directly for official quotations. Your actual rate may vary.
            </p>
          </div>

          {/* Tips */}
          <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-7">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Car size={18} className="text-[#FF5400]" />
              Car Finance Tips
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { title: 'Check Your Credit Score', desc: 'A good credit history improves your chances of approval and getting a lower rate.' },
                { title: 'Save a Bigger Deposit', desc: 'The higher your deposit, the smaller your loan and the lower your monthly repayments.' },
                { title: 'Compare Multiple Lenders', desc: 'Don\'t settle for the first offer. Different banks offer different rates for the same car.' },
                { title: 'Factor in Running Costs', desc: 'Remember insurance, fuel, servicing, and parking when budgeting your total car cost.' },
                { title: 'Opt for Shorter Terms', desc: 'Shorter loan terms mean less total interest paid, even if monthly payments are higher.' },
                { title: 'Read the Fine Print', desc: 'Check for early repayment fees, processing charges, and insurance requirements.' },
              ].map(({ title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <CheckCircle size={16} className="text-[#FF5400] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">{title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

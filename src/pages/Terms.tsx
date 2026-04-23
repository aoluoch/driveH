import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function Terms() {
  const updated = 'April 2025'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText size={24} className="text-[#FF5400]" />
            <h1 className="text-3xl font-black text-gray-900">Terms of Service</h1>
          </div>
          <p className="text-gray-500 text-sm">Last updated: {updated}</p>
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-8 text-sm text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using DriveHub's website and services, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our platform. We reserve the right to update these terms at any time.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Use of the Platform</h2>
            <p className="mb-3">You agree to use DriveHub only for lawful purposes and in a way that does not infringe the rights of others. You must not:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Post false, misleading, or fraudulent car listings</li>
              <li>Impersonate any person or entity</li>
              <li>Use automated bots or scrapers to extract data</li>
              <li>Engage in any activity that disrupts or interferes with our services</li>
              <li>Use the platform to facilitate illegal transactions</li>
              <li>Post listings for stolen vehicles or vehicles with encumbrances</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorised use of your account. DriveHub reserves the right to suspend or terminate accounts that violate these Terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Listings & Content</h2>
            <p className="mb-3">When submitting a car listing, you confirm that:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You are the legal owner of the vehicle or authorised to sell it</li>
              <li>All information provided is accurate and complete</li>
              <li>The vehicle is free from any undisclosed legal issues, liens, or encumbrances</li>
              <li>Photos submitted are genuine and represent the actual vehicle</li>
            </ul>
            <p className="mt-3">DriveHub reserves the right to remove any listing that violates these conditions or our community standards, without notice.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Transactions & Liability</h2>
            <p>DriveHub is a marketplace platform and is not a party to any transaction between buyers and sellers. We do not take possession of vehicles, handle payments, or guarantee the quality of any listing. All transactions are the sole responsibility of the buyer and seller. We strongly recommend:</p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Verifying the seller's identity before any transaction</li>
              <li>Inspecting the vehicle in person before purchase</li>
              <li>Using secure payment methods</li>
              <li>Completing all legal ownership transfer paperwork</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Intellectual Property</h2>
            <p>All content on the DriveHub platform — including logos, design, text, and software — is the property of DriveHub and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission. By submitting content (such as photos or descriptions), you grant DriveHub a non-exclusive licence to use that content on the platform.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Disclaimer of Warranties</h2>
            <p>DriveHub is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the platform will be uninterrupted, error-free, or free of viruses or harmful components. We make no representations regarding the accuracy, reliability, or completeness of any content on the platform.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, DriveHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the platform, or from any transaction facilitated through the platform.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">9. Governing Law</h2>
            <p>These Terms are governed by and construed in accordance with the laws of the Republic of Kenya. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Kenya.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">10. Contact</h2>
            <p>For questions about these Terms of Service, please contact us:</p>
            <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="font-semibold text-gray-900">DriveHub Legal Team</p>
              <p>Email: <a href="mailto:legal@drivehub.co.ke" className="text-[#FF5400] hover:underline">legal@drivehub.co.ke</a></p>
              <p>Address: Westlands, Nairobi, Kenya</p>
            </div>
          </section>
        </div>

        <div className="mt-6 flex gap-3">
          <Link to="/privacy" className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-[#FF5400] hover:text-[#FF5400] transition-colors">
            Privacy Policy
          </Link>
          <Link to="/contact" className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-[#FF5400] hover:text-[#FF5400] transition-colors">
            Contact Us
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

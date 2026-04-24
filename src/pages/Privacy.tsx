import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { CONTACT_EMAIL } from '../lib/contact'

export default function Privacy() {
  const updated = 'April 2025'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="bg-white border-b border-gray-200 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={24} className="text-[#FF5400]" />
            <h1 className="text-3xl font-black text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-500 text-sm">Last updated: {updated}</p>
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-8 text-sm text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Introduction</h2>
            <p>DriveHub ("we", "our", or "us") is committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Information We Collect</h2>
            <p className="mb-3">We may collect the following types of information:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and password when you register for an account.</li>
              <li><strong>Usage Data:</strong> Pages visited, search queries, filters used, and cars viewed.</li>
              <li><strong>Device Information:</strong> Browser type, IP address, operating system, and device identifiers.</li>
              <li><strong>Communications:</strong> Messages you send to us through contact forms or email.</li>
              <li><strong>Listing Information:</strong> Car details and photos submitted when listing a vehicle.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide, operate, and maintain our platform and services</li>
              <li>Create and manage your user account</li>
              <li>Process and display car listings</li>
              <li>Send you service-related notifications and updates</li>
              <li>Respond to your enquiries and support requests</li>
              <li>Improve our platform, features, and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Sharing Your Information</h2>
            <p className="mb-3">We do not sell, trade, or rent your personal data to third parties. We may share information with:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Service Providers:</strong> Trusted third-party services that help us operate the platform (e.g., hosting, analytics).</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect our rights and users' safety.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Data Storage & Security</h2>
            <p>Your data is stored securely using Appwrite cloud infrastructure with encryption in transit and at rest. We implement industry-standard security measures to protect against unauthorised access, alteration, disclosure, or destruction of your personal data.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Cookies</h2>
            <p>We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies help us remember your preferences, keep you logged in, and understand how users interact with our site. You can control cookie settings through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Withdraw consent at any time where consent is the legal basis for processing</li>
              <li>Lodge a complaint with a data protection authority</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, please contact us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#FF5400] hover:underline">{CONTACT_EMAIL}</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Third-Party Links</h2>
            <p>Our platform may contain links to external websites. We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policies of any third-party sites you visit.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">9. Children's Privacy</h2>
            <p>Our services are not directed to children under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will delete it promptly.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date above. We encourage you to review this policy periodically.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">11. Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
            <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm">
              <p className="font-semibold text-gray-900">DriveHub Privacy Team</p>
              <p>Email: <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#FF5400] hover:underline">{CONTACT_EMAIL}</a></p>
              <p>Address: Westlands, Nairobi, Kenya</p>
            </div>
          </section>
        </div>

        <div className="mt-6 flex gap-3">
          <Link to="/terms" className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-[#FF5400] hover:text-[#FF5400] transition-colors">
            Terms of Service
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

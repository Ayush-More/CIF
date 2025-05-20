"use client";
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-[#EF5744] text-white rounded-t-2xl p-8 shadow-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-white text-[#EF5744] rounded-full font-medium hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          </div>
          <p className="mt-4 text-white/80">Last Updated: May 20, 2025</p>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-b-2xl shadow-lg p-8">
          <div className="prose max-w-none">
            <div className="space-y-8">
              {/* Introduction */}
              <section className="p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-bold text-[#EF5744] mb-4">1. Introduction</h2>
                <p className="text-gray-600 leading-relaxed">
                  At CIF, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                </p>
              </section>

              {/* Information Collection */}
              <section className="p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-bold text-[#EF5744] mb-4">2. Information We Collect</h2>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700">2.1 Personal Information</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Name and contact information</li>
                    <li>Profile information and photos</li>
                    <li>Payment information</li>
                    <li>Communication preferences</li>
                    <li>Service history and feedback</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-700">2.2 Automatically Collected Information</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>Device information</li>
                    <li>Location data</li>
                    <li>Usage patterns</li>
                    <li>IP addresses and browser information</li>
                  </ul>
                </div>
              </section>

              {/* Use of Information */}
              <section className="p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-bold text-[#EF5744] mb-4">3. How We Use Your Information</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Provide and improve our services</li>
                  <li>Process payments and transactions</li>
                  <li>Send service updates and notifications</li>
                  <li>Verify identity and prevent fraud</li>
                  <li>Personalize your experience</li>
                  <li>Analyze platform usage and trends</li>
                </ul>
              </section>

              {/* Information Sharing */}
              <section className="p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-bold text-[#EF5744] mb-4">4. Information Sharing</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations</li>
                  <li>With service providers under strict confidentiality</li>
                  <li>In the event of a business transfer or merger</li>
                </ul>
              </section>

              {/* Data Security */}
              <section className="p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-bold text-[#EF5744] mb-4">5. Data Security</h2>
                <p className="text-gray-600 leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information, including encryption, access controls, and regular security assessments.
                </p>
              </section>

              {/* User Rights */}
              <section className="p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-bold text-[#EF5744] mb-4">6. Your Rights</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Access your personal information</li>
                  <li>Request corrections or updates</li>
                  <li>Delete your account and data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Data portability</li>
                </ul>
              </section>

              {/* Cookies */}
              <section className="p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-bold text-[#EF5744] mb-4">7. Cookies and Tracking</h2>
                <p className="text-gray-600 leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your experience and collect usage data. You can control cookie settings through your browser preferences.
                </p>
              </section>

              {/* Contact Information */}
              <section className="p-6 bg-[#EF5744] text-white rounded-xl">
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <p className="leading-relaxed">
                  If you have questions about our Privacy Policy or how we handle your data, please contact our Privacy Team at:
                  <br />
                  <a href="mailto:privacy@cif.com" className="text-white underline hover:text-white/90">
                    privacy@cif.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
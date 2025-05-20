"use client";
import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-[#EF5744] text-white rounded-t-2xl p-8 shadow-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Terms of Service</h1>
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
                  Welcome to CIF. By accessing our website, you agree to these terms of service. Please read them carefully before using our platform.
                </p>
              </section>

              {/* User Agreement */}
              <section className="p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-bold text-[#EF5744] mb-4">2. User Agreement</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  By using our service, you agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your account</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </section>

              {/* Service Usage */}
              <section className="p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-bold text-[#EF5744] mb-4">3. Service Usage</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Our service is designed to connect caregivers with those seeking care. Users must:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Use the service for its intended purpose</li>
                  <li>Not engage in harmful or fraudulent activities</li>
                  <li>Respect other users' privacy and rights</li>
                  <li>Not misuse or attempt to manipulate our platform</li>
                </ul>
              </section>

              {/* Privacy & Data */}
              <section className="p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-bold text-[#EF5744] mb-4">4. Privacy & Data Protection</h2>
                <p className="text-gray-600 leading-relaxed">
                  We take your privacy seriously. Our platform implements industry-standard security measures to protect your personal information. For detailed information, please refer to our Privacy Policy.
                </p>
              </section>

              {/* Content Guidelines */}
              <section className="p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-bold text-[#EF5744] mb-4">5. Content Guidelines</h2>
                <p className="text-gray-600 leading-relaxed mb-4">Users must not post content that:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>Is false, misleading, or deceptive</li>
                  <li>Infringes on intellectual property rights</li>
                  <li>Contains harmful or malicious code</li>
                  <li>Violates any applicable laws or regulations</li>
                </ul>
              </section>

              {/* Termination */}
              <section className="p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-bold text-[#EF5744] mb-4">6. Account Termination</h2>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or harm our community. Users will be notified of any such action taken against their account.
                </p>
              </section>

              {/* Disclaimer */}
              <section className="p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-bold text-[#EF5744] mb-4">7. Disclaimer</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our services are provided "as is" without warranties of any kind. We are not responsible for the actions of users on our platform. Users engage with other users at their own risk.
                </p>
              </section>

              {/* Contact Information */}
              <section className="p-6 bg-[#EF5744] text-white rounded-xl">
                <h2 className="text-2xl font-bold mb-4">Questions or Concerns?</h2>
                <p className="leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at:
                  <br />
                  <a href="mailto:support@cif.com" className="text-white underline hover:text-white/90">
                    support@cif.com
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
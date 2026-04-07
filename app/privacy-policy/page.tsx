import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Seoul TradeLab Publisher',
  description:
    'Privacy Policy for the Seoul TradeLab Publisher internal video publishing tool.',
  robots: { index: true, follow: true },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <article lang="en" className="text-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-10">Last Updated: April 7, 2026</p>

        <p className="mb-8 leading-relaxed">
          This Privacy Policy describes how Seoul TradeLab (&quot;we&quot;, &quot;our&quot;, or
          &quot;us&quot;) collects, uses, and protects information when operating our internal
          video publishing tool, &quot;Seoul TradeLab Publisher&quot; (the &quot;App&quot;).
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            1. Purpose of the App
          </h2>
          <p className="leading-relaxed">
            The App is strictly an internal backend automation tool developed exclusively
            for Seoul TradeLab employees. Its sole purpose is to programmatically upload
            officially produced K-beauty marketing videos to our own official social media
            accounts, including TikTok.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            2. Information We Collect
          </h2>
          <p className="mb-4 leading-relaxed">
            We <strong className="font-semibold text-gray-900">do not</strong> collect,
            store, or process any personal data from public TikTok users. The App only
            accesses data strictly necessary to authenticate and operate our own official
            TikTok account via the TikTok API.
          </p>
          <ul className="list-disc pl-6 space-y-2 leading-relaxed">
            <li>
              <strong className="font-semibold text-gray-900">Authentication Data:</strong>{' '}
              We securely store our own OAuth access tokens required to post content to our
              designated TikTok account.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            3. How We Use the Information
          </h2>
          <p className="mb-3 leading-relaxed">
            The authentication tokens are used exclusively to:
          </p>
          <ul className="list-disc pl-6 space-y-2 leading-relaxed">
            <li>Communicate with the TikTok Content Posting API.</li>
            <li>Upload and publish video files to our own TikTok profile.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            4. Data Sharing and Disclosure
          </h2>
          <p className="leading-relaxed">
            We do not sell, trade, or otherwise transfer any data to outside parties. The
            App does not interact with third-party user data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Security</h2>
          <p className="leading-relaxed">
            We implement strict internal security measures to maintain the safety of our API
            keys and access tokens. Only authorized engineers within Seoul TradeLab have
            access to the server where this App is hosted.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Contact Us</h2>
          <p className="mb-3 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <ul className="list-disc pl-6 space-y-2 leading-relaxed">
            <li>
              Email:{' '}
              <a
                href="mailto:sangsaeng.official@gmail.com"
                className="text-blue-700 underline underline-offset-2 hover:text-blue-900"
              >
                sangsaeng.official@gmail.com
              </a>
            </li>
            <li>Company: Seoul TradeLab</li>
          </ul>
        </section>
      </article>
    </div>
  )
}

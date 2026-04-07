import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Seoul TradeLab Publisher',
  description:
    'Terms of Service for the Seoul TradeLab Publisher application. Internal use only.',
  robots: { index: true, follow: true },
}

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <article lang="en" className="text-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 mb-10">Last Updated: April 7, 2026</p>

        <p className="mb-8 leading-relaxed">
          These Terms of Service (&quot;Terms&quot;) govern the use of the &quot;Seoul TradeLab
          Publisher&quot; application (the &quot;App&quot;), operated by Seoul TradeLab.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            1. Acceptance of Terms
          </h2>
          <p className="leading-relaxed">
            By accessing or using the App, you agree to be bound by these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            2. Internal Use Only
          </h2>
          <p className="mb-4 leading-relaxed">
            The App is a private, internal automation tool. It is{' '}
            <strong className="font-semibold text-gray-900">not</strong> a public-facing
            application. Access is strictly restricted to authorized employees and
            administrators of Seoul TradeLab.
          </p>
          <ul className="list-disc pl-6 space-y-2 leading-relaxed">
            <li>
              No external users, third-party creators, or general public TikTok users are
              permitted to access, log in, or use this App.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            3. Permitted Activities
          </h2>
          <p className="mb-3 leading-relaxed">
            Authorized users may only use the App to:
          </p>
          <ul className="list-disc pl-6 space-y-2 leading-relaxed">
            <li>
              Upload authorized marketing and promotional videos to Seoul TradeLab&apos;s
              official social media accounts.
            </li>
            <li>Automate internal content publishing workflows.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            4. Prohibited Activities
          </h2>
          <p className="mb-3 leading-relaxed">
            Even for authorized internal users, it is strictly prohibited to:
          </p>
          <ul className="list-disc pl-6 space-y-2 leading-relaxed">
            <li>
              Use the App to post illegal, harmful, or copyright-infringing content.
            </li>
            <li>Attempt to access TikTok accounts not owned by Seoul TradeLab.</li>
            <li>
              Distribute the App&apos;s access credentials to unauthorized external parties.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Termination</h2>
          <p className="leading-relaxed">
            Seoul TradeLab reserves the right to terminate or suspend access to the App
            immediately, without prior notice or liability, for any reason whatsoever,
            including without limitation if an authorized user breaches these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Contact Us</h2>
          <p className="mb-3 leading-relaxed">
            If you have any questions regarding these Terms, please contact our internal
            administrative team at:
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
          </ul>
        </section>
      </article>
    </div>
  )
}

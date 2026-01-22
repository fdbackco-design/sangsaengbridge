import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import BottomCTA from '@/components/BottomCTA'
import FloatingCall from '@/components/FloatingCall'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sangsaengbridge.com'),
  title: {
    default: '상생 브릿지 - 제조업체와 브랜드를 연결하는 플랫폼',
    template: '%s | 상생 브릿지',
  },
  description: '상생 브릿지에서 최적의 제조 파트너를 찾아보세요. OEM, ODM 서비스로 생활용품, 주방용품, 화장품용기 제조를 지원합니다.',
  keywords: ['제조', 'OEM', 'ODM', '생활용품', '주방용품', '화장품용기', '제조업체', '브랜드', '파트너십', '상생 브릿지'],
  authors: [{ name: '상생 브릿지' }],
  creator: '상생 브릿지',
  publisher: '상생 브릿지',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    siteName: '상생 브릿지',
    title: '상생 브릿지 - 제조업체와 브랜드를 연결하는 플랫폼',
    description: '150여개 제조 공장 파트너십을 보유한 상생 브릿지에서 최적의 제조 파트너를 찾아보세요.',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: '상생 브릿지 로고',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '상생 브릿지 - 제조업체와 브랜드를 연결하는 플랫폼',
    description: '150여개 제조 공장 파트너십을 보유한 상생 브릿지에서 최적의 제조 파트너를 찾아보세요.',
    images: ['/logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    other: {
      'naver-site-verification': 'a5a0bc06b2eb5534795554514389a08354a070b2',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sangsaengbridge.com'
  
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '상생 브릿지',
    url: siteUrl,
    description: '제조업체와 브랜드를 연결하는 플랫폼',
    logo: `${siteUrl}/logo.svg`,
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '상생 브릿지',
    url: siteUrl,
    description: '150여개 제조 공장 파트너십을 보유한 상생 브릿지에서 최적의 제조 파트너를 찾아보세요.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/cases?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="ko">
      <body className={inter.className}>
        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />
        <div className="flex flex-col min-h-screen">
        <Header />
          <main className="flex-1 pb-24">
          {children}
        </main>
          <Footer />
        <BottomCTA />
        <FloatingCall />
        </div>
      </body>
    </html>
  )
}

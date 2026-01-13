import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import BottomCTA from '@/components/BottomCTA'
import FloatingCall from '@/components/FloatingCall'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '상생 브릿지 - 제조업체와 브랜드를 연결하는 플랫폼',
  description: '150여개 제조 공장 파트너십을 보유한 상생 브릿지에서 최적의 제조 파트너를 찾아보세요.',
  keywords: '제조, OEM, ODM, 생활용품, 주방용품, 화장품용기',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen pb-24">
          {children}
        </main>
        <BottomCTA />
        <FloatingCall />
      </body>
    </html>
  )
}

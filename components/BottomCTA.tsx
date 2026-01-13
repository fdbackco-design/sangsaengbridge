'use client'

import Link from 'next/link'

export default function BottomCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-burgundy-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <Link
          href="/quote"
          className="block w-full text-center py-3 px-6 bg-white text-burgundy-700 font-semibold rounded-button hover:bg-cream-50 transition-colors"
        >
          무료 견적 신청하기
        </Link>
      </div>
    </div>
  )
}

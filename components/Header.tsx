'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="상생 브릿지"
              width={180}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* 우측 아이콘들 */}
          <div className="flex items-center gap-4">
            {/* 검색 아이콘 */}
            <button
              aria-label="검색"
              className="p-2 text-gray-600 hover:text-burgundy-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* 햄버거 메뉴 */}
            <button
              aria-label="메뉴"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-burgundy-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <nav className="pb-4 border-t border-gray-200">
            <div className="flex flex-col gap-2 pt-4">
              <Link
                href="/"
                className="px-4 py-2 text-gray-700 hover:text-burgundy-700 hover:bg-cream-50 rounded-button transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                홈
              </Link>
              <Link
                href="/cases"
                className="px-4 py-2 text-gray-700 hover:text-burgundy-700 hover:bg-cream-50 rounded-button transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                성공사례
              </Link>
              <Link
                href="/quote"
                className="px-4 py-2 text-gray-700 hover:text-burgundy-700 hover:bg-cream-50 rounded-button transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                견적 신청
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Case {
  id: string
  title: string
  slug: string
  summary?: string | null
  thumbnail_image_1: string
  hashtags?: string[] | null
  category?: {
    name: string
    slug: string
  } | null
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Case[]>([])
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
      setSearchResults([])
      return
    }

    // 모달이 열릴 때 성공 사례 데이터 가져오기
    const fetchCases = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/cases')
        const data = await response.json()
        if (data.cases) {
          setCases(data.cases)
        }
      } catch (error) {
        console.error('Failed to fetch cases:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCases()
  }, [isOpen])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase().trim()
    const filtered = cases.filter((caseItem) => {
      const titleMatch = caseItem.title.toLowerCase().includes(query)
      const summaryMatch = caseItem.summary?.toLowerCase().includes(query)
      const hashtagMatch = caseItem.hashtags?.some((tag) =>
        tag.toLowerCase().includes(query)
      )
      const categoryMatch = caseItem.category?.name.toLowerCase().includes(query)

      return titleMatch || summaryMatch || hashtagMatch || categoryMatch
    })

    setSearchResults(filtered)
  }, [searchQuery, cases])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 pt-20 md:pt-32"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl mx-4 bg-white rounded-card shadow-card max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 검색 입력 */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-gray-400"
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
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="청소기, 캐리어 등..."
              className="flex-1 outline-none text-base"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600"
              aria-label="닫기"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 검색 결과 */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              로딩 중...
            </div>
          ) : !searchQuery.trim() ? (
            <div className="text-center py-12 text-gray-500">
              검색어를 입력해주세요.
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              검색 결과가 없습니다.
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                검색 결과 {searchResults.length}개
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((caseItem) => (
                  <Link
                    key={caseItem.id}
                    href={`/cases/${caseItem.slug}`}
                    onClick={() => onClose()}
                    className="group bg-white border border-gray-200 rounded-card overflow-hidden hover:border-burgundy-700 hover:shadow-card transition-all"
                  >
                    <div className="relative w-full h-32 overflow-hidden">
                      <Image
                        src={caseItem.thumbnail_image_1}
                        alt={caseItem.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <div className="p-3">
                      {caseItem.category && (
                        <span className="inline-block px-2 py-1 text-xs bg-burgundy-50 text-burgundy-700 rounded mb-2">
                          {caseItem.category.name}
                        </span>
                      )}
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-burgundy-700 transition-colors text-sm">
                        {caseItem.title}
                      </h3>
                      {caseItem.summary && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {caseItem.summary}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

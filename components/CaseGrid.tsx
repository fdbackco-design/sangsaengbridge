'use client'

import Image from 'next/image'
import Link from 'next/link'

interface Case {
  id: string
  title: string
  slug: string
  summary?: string | null
  thumbnail_image_1: string
  thumbnail_image_2?: string | null
  hashtags?: string[] | null
  category?: {
    name: string
    slug: string
  } | null
}

interface CaseGridProps {
  cases: Case[]
  showCategory?: boolean
}

export default function CaseGrid({ cases, showCategory = true }: CaseGridProps) {
  if (cases.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        등록된 성공사례가 없습니다.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {cases.map((caseItem) => (
        <Link
          key={caseItem.id}
          href={`/cases/${caseItem.slug}`}
          className="group bg-white rounded-card shadow-card overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="relative w-full h-48 sm:h-56 overflow-hidden">
            <Image
              src={caseItem.thumbnail_image_1}
              alt={caseItem.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4">
            {showCategory && caseItem.category && (
              <span className="inline-block px-2 py-1 text-xs bg-burgundy-50 text-burgundy-700 rounded mb-2">
                {caseItem.category.name}
              </span>
            )}
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-burgundy-700 transition-colors">
              {caseItem.title}
            </h3>
            {caseItem.summary && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {caseItem.summary}
              </p>
            )}
            {caseItem.hashtags && caseItem.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {caseItem.hashtags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}

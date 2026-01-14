'use client'

import Image from 'next/image'
import Link from 'next/link'

interface Case {
  id: string
  title: string
  slug: string
  thumbnail_image_1: string
  category?: {
    name: string
    slug: string
  } | null
}

interface FilteredCaseGridProps {
  cases: Case[]
  selectedCategory: string | null
}

export default function FilteredCaseGrid({ cases, selectedCategory }: FilteredCaseGridProps) {
  // 카테고리 필터링
  const filteredCases = selectedCategory
    ? cases.filter(caseItem => caseItem.category?.slug === selectedCategory)
    : cases

  // 최대 4개만 표시
  const displayCases = filteredCases.slice(0, 4)

  if (displayCases.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {selectedCategory ? '선택한 카테고리의 성공사례가 없습니다.' : '등록된 성공사례가 없습니다.'}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {displayCases.map((caseItem) => (
        <Link
          key={caseItem.id}
          href={`/cases/${caseItem.slug}`}
          className="group bg-white rounded-card shadow-soft overflow-hidden hover:shadow-card transition-shadow"
        >
          <div className="relative w-full aspect-square overflow-hidden">
            <Image
              src={caseItem.thumbnail_image_1}
              alt={caseItem.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, 50vw"
            />
          </div>
          <div className="p-3 text-center">
            <p className="text-sm font-medium text-gray-900 group-hover:text-burgundy-700 transition-colors">
              {caseItem.title}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import DeleteButton from './DeleteButton'

interface Case {
  id: string
  title: string
  thumbnail_image_1: string
  created_at: string
  category?: {
    name: string
  } | null
}

interface CasesTableProps {
  cases: Case[]
}

export default function CasesTable({ cases }: CasesTableProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // 검색어로 필터링
  const filteredCases = cases.filter((caseItem) =>
    caseItem.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      {/* 검색창 */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
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
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="제목으로 검색..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-card shadow-soft overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">이미지</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">제목</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">카테고리</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">작성일</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCases.length > 0 ? (
              filteredCases.map((caseItem) => (
                <tr key={caseItem.id}>
                  <td className="px-4 py-3">
                    <div className="relative w-16 h-16">
                      <Image
                        src={caseItem.thumbnail_image_1}
                        alt={caseItem.title}
                        fill
                        className="object-cover rounded"
                        sizes="64px"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/cases/${caseItem.id}`}
                      className="text-burgundy-700 hover:text-burgundy-800 font-medium whitespace-nowrap"
                    >
                      {caseItem.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {caseItem.category?.name || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(caseItem.created_at).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/cases/${caseItem.id}`}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        수정
                      </Link>
                      <DeleteButton id={caseItem.id} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  {searchQuery ? '검색 결과가 없습니다.' : '등록된 성공사례가 없습니다.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

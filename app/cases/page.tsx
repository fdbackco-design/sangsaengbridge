import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import CaseGrid from '@/components/CaseGrid'
import { Suspense } from 'react'

interface SearchParams {
  category?: string
}

export const metadata: Metadata = {
  title: '성공사례',
  description: '상생 브릿지의 다양한 성공사례를 확인하세요. 생활용품, 주방용품, 화장품용기 등 카테고리별 제조 성공사례를 제공합니다.',
  openGraph: {
    title: '성공사례 - 상생 브릿지',
    description: '상생 브릿지의 다양한 성공사례를 확인하세요.',
    url: '/cases',
  },
}

async function CasesContent({ category }: { category?: string }) {
  const supabase = createClient()

  let query = supabase
    .from('cases')
    .select(`
      *,
      category:case_categories(*)
    `)
    .order('created_at', { ascending: false })

  if (category) {
    const { data: categoryData } = await supabase
      .from('case_categories')
      .select('id')
      .eq('slug', category)
      .single()
    
    if (categoryData) {
      query = query.eq('category_id', categoryData.id)
    }
  }

  const { data: cases } = await query

  // 카테고리 목록 조회
  const { data: categories } = await supabase
    .from('case_categories')
    .select('*')
    .order('name', { ascending: true })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">성공사례</h1>

      {/* 카테고리 필터 */}
      {categories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <a
            href="/cases"
            className={`px-4 py-2 rounded-button font-medium transition-colors ${
              !category
                ? 'bg-burgundy-700 text-white'
                : 'bg-white text-gray-700 hover:bg-cream-50'
            }`}
          >
            전체
          </a>
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/cases?category=${cat.slug}`}
              className={`px-4 py-2 rounded-button font-medium transition-colors ${
                category === cat.slug
                  ? 'bg-burgundy-700 text-white'
                  : 'bg-white text-gray-700 hover:bg-cream-50'
              }`}
            >
              {cat.name}
            </a>
          ))}
        </div>
      )}

      {/* 성공사례 그리드 */}
      <CaseGrid cases={cases || []} />
    </div>
  )
}

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const category = params.category

  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">로딩 중...</div>}>
      <CasesContent category={category} />
    </Suspense>
  )
}

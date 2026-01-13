import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CaseGrid from '@/components/CaseGrid'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = createClient()

  const { data: caseItem } = await supabase
    .from('cases')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!caseItem) {
    return {
      title: '성공사례를 찾을 수 없습니다',
    }
  }

  return {
    title: `${caseItem.title} - 상생 브릿지`,
    description: caseItem.summary || caseItem.title,
    openGraph: {
      title: caseItem.title,
      description: caseItem.summary || caseItem.title,
      images: caseItem.thumbnail_image_1 ? [caseItem.thumbnail_image_1] : [],
    },
  }
}

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = createClient()

  const { data: caseItem } = await supabase
    .from('cases')
    .select(`
      *,
      category:case_categories(*)
    `)
    .eq('slug', slug)
    .single()

  if (!caseItem) {
    notFound()
  }

  // 관련 성공사례 조회 (같은 카테고리, 최대 3개)
  const { data: relatedCases } = await supabase
    .from('cases')
    .select(`
      *,
      category:case_categories(*)
    `)
    .eq('category_id', caseItem.category_id)
    .neq('id', caseItem.id)
    .limit(3)

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        {/* 썸네일 이미지 */}
        <div className="relative w-full h-64 md:h-96 mb-6 rounded-card overflow-hidden">
          <Image
            src={caseItem.thumbnail_image_1}
            alt={caseItem.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* 제목 및 메타 정보 */}
        <header className="mb-6">
          {caseItem.category && (
            <span className="inline-block px-3 py-1 bg-burgundy-50 text-burgundy-700 rounded-button text-sm mb-3">
              {caseItem.category.name}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {caseItem.title}
          </h1>
          {caseItem.summary && (
            <p className="text-lg text-gray-600 mb-4">{caseItem.summary}</p>
          )}
          {caseItem.hashtags && caseItem.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {caseItem.hashtags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-button text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* 상세 이미지 */}
        {caseItem.detail_image && (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-card overflow-hidden">
            <Image
              src={caseItem.detail_image}
              alt={caseItem.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* 본문 (Markdown) */}
        {caseItem.content_markdown && (
          <div className="prose prose-lg max-w-none mb-8">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {caseItem.content_markdown}
            </ReactMarkdown>
          </div>
        )}

        {/* 썸네일 이미지 2 */}
        {caseItem.thumbnail_image_2 && (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-card overflow-hidden">
            <Image
              src={caseItem.thumbnail_image_2}
              alt={caseItem.title}
              fill
              className="object-cover"
            />
          </div>
        )}
      </article>

      {/* 관련 성공사례 */}
      {relatedCases && relatedCases.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">관련 성공사례</h2>
          <CaseGrid cases={relatedCases} />
        </section>
      )}
    </div>
  )
}

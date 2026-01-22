import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CaseGrid from '@/components/CaseGrid'
import CaseDetailImage from '@/components/CaseDetailImage'
import CaseThumbnailSlider from '@/components/CaseThumbnailSlider'
import StructuredData from '@/components/StructuredData'

export async function generateMetadata({
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
    return {
      title: '성공사례를 찾을 수 없습니다',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sangsaengbridge.com'
  const images = []
  if (caseItem.thumbnail_image_1) images.push(caseItem.thumbnail_image_1)
  if (caseItem.thumbnail_image_2) images.push(caseItem.thumbnail_image_2)
  if (caseItem.detail_image) images.push(caseItem.detail_image)

  return {
    title: caseItem.title,
    description: caseItem.summary || caseItem.title,
    keywords: caseItem.hashtags || [],
    openGraph: {
      title: caseItem.title,
      description: caseItem.summary || caseItem.title,
      type: 'article',
      url: `${siteUrl}/cases/${slug}`,
      images: images.length > 0 ? images : [],
      publishedTime: caseItem.created_at,
      modifiedTime: caseItem.updated_at,
      authors: ['상생 브릿지'],
      section: caseItem.category?.name,
      tags: caseItem.hashtags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: caseItem.title,
      description: caseItem.summary || caseItem.title,
      images: images.length > 0 ? [images[0]] : [],
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sangsaengbridge.com'
  const images = []
  if (caseItem.thumbnail_image_1) images.push(caseItem.thumbnail_image_1)
  if (caseItem.thumbnail_image_2) images.push(caseItem.thumbnail_image_2)
  if (caseItem.detail_image) images.push(caseItem.detail_image)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: caseItem.title,
    description: caseItem.summary || caseItem.title,
    image: images,
    datePublished: caseItem.created_at,
    dateModified: caseItem.updated_at,
    author: {
      '@type': 'Organization',
      name: '상생 브릿지',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: '상생 브릿지',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/cases/${slug}`,
    },
    articleSection: caseItem.category?.name,
    keywords: caseItem.hashtags?.join(', ') || '',
  }

  return (
    <>
      <StructuredData data={articleSchema} />
      <div className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
        {/* 썸네일 이미지 슬라이드 */}
        <CaseThumbnailSlider
          thumbnail1={caseItem.thumbnail_image_1}
          thumbnail2={caseItem.thumbnail_image_2}
          title={caseItem.title}
        />

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
          <CaseDetailImage src={caseItem.detail_image} alt={caseItem.title} />
        )}

        {/* 본문 (Markdown) */}
        {caseItem.content_markdown && (
          <div className="prose prose-lg max-w-none mb-8">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {caseItem.content_markdown}
            </ReactMarkdown>
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
    </>
  )
}

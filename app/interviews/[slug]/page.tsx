import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import InterviewContent from './InterviewContent'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = createClient()

  const { data: interview } = await supabase
    .from('interviews')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!interview) {
    return {
      title: '인터뷰를 찾을 수 없습니다',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sangsaengbridge.com'

  return {
    title: interview.title,
    description: interview.summary || interview.title,
    openGraph: {
      title: interview.title,
      description: interview.summary || interview.title,
      type: 'article',
      url: `${siteUrl}/interviews/${slug}`,
      images: interview.image_url ? [interview.image_url] : [],
      publishedTime: interview.created_at,
      modifiedTime: interview.updated_at,
      authors: ['상생 브릿지'],
    },
    twitter: {
      card: 'summary_large_image',
      title: interview.title,
      description: interview.summary || interview.title,
      images: interview.image_url ? [interview.image_url] : [],
    },
  }
}

export default async function InterviewDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = createClient()

  const { data: interview } = await supabase
    .from('interviews')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!interview) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        {/* 메인 이미지 */}
        <div className="relative w-full h-64 md:h-96 mb-6 rounded-card overflow-hidden">
          <Image
            src={interview.image_url}
            alt={interview.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 896px"
          />
        </div>

        {/* 제목 및 요약 */}
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {interview.title}
          </h1>
          {interview.summary && (
            <p className="text-lg text-gray-600 mb-4">{interview.summary}</p>
          )}
        </header>

        {/* 본문 (Q&A 말풍선 형식) */}
        {interview.content_markdown && (
          <InterviewContent content={interview.content_markdown} />
        )}

        {/* 마무리 블록 */}
        {interview.closing_text && (
          <div className="mt-12 pl-6 md:pl-8 pr-4 md:pr-6 py-6 md:py-8 bg-gray-50/50 border-l-4 border-burgundy-300">
            <div className="prose prose-lg max-w-none interview-content">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {interview.closing_text}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </article>
    </div>
  )
}

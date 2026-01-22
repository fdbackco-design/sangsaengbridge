import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sangsaengbridge.com'
  const supabase = createClient()

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/cases`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/quote`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // 성공사례 동적 페이지
  const { data: cases } = await supabase
    .from('cases')
    .select('slug, updated_at')
    .order('updated_at', { ascending: false })

  const casePages: MetadataRoute.Sitemap =
    cases?.map((caseItem) => ({
      url: `${siteUrl}/cases/${caseItem.slug}`,
      lastModified: new Date(caseItem.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })) || []

  // 인터뷰 동적 페이지
  const { data: interviews } = await supabase
    .from('interviews')
    .select('slug, updated_at')
    .eq('is_active', true)
    .order('updated_at', { ascending: false })

  const interviewPages: MetadataRoute.Sitemap =
    interviews?.map((interview) => ({
      url: `${siteUrl}/interviews/${interview.slug}`,
      lastModified: new Date(interview.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || []

  return [...staticPages, ...casePages, ...interviewPages]
}

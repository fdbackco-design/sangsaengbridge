import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import BannerSlider from '@/components/BannerSlider'
import MiddleBanner from '@/components/MiddleBanner'
import CaseSection from '@/components/CaseSection'
import AboutSection from '@/components/AboutSection'
import ProgressCarousel from '@/components/ProgressCarousel'
import InterviewCarousel from '@/components/InterviewCarousel'
import GuideSteps from '@/components/GuideSteps'
import PressList from '@/components/PressList'
import MapSection from '@/components/MapSection'
import AnimatedSection from '@/components/AnimatedSection'

export const metadata: Metadata = {
  title: '홈',
  description: '상생 브릿지에서 최적의 제조 파트너를 찾아보세요. OEM, ODM 서비스로 생활용품, 주방용품, 화장품용기 제조를 지원합니다.',
  openGraph: {
    title: '상생 브릿지 - 제조업체와 브랜드를 연결하는 플랫폼',
    description: '150여개 제조 공장 파트너십을 보유한 상생 브릿지에서 최적의 제조 파트너를 찾아보세요.',
    url: '/',
  },
}

export default async function HomePage() {
  const supabase = createClient()

  // 배너 조회
  const { data: banners } = await supabase
    .from('banners')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  // 중간 배너 조회
  const { data: middleBanners } = await supabase
    .from('middle_banners')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  // 성공사례 조회 (모든 항목)
  const { data: cases } = await supabase
    .from('cases')
    .select(`
      *,
      category:case_categories(*)
    `)
    .order('created_at', { ascending: false })

  // 카테고리 조회
  const { data: categories } = await supabase
    .from('case_categories')
    .select('*')
    .order('name', { ascending: true })

  // 진행상황 조회
  const { data: progressRaw } = await supabase
    .from('progress')
    .select('*')
    .limit(10)
  
  // stage_date 기준 내림차순 정렬 (null은 마지막)
  const progress = progressRaw?.sort((a, b) => {
    if (!a.stage_date && !b.stage_date) return 0
    if (!a.stage_date) return 1
    if (!b.stage_date) return -1
    return new Date(b.stage_date).getTime() - new Date(a.stage_date).getTime()
  })

  // 소개(About) 조회
  const { data: about } = await supabase
    .from('about')
    .select('*')
    .single()

  // 이용안내 조회
  const { data: guideSteps } = await supabase
    .from('guide_steps')
    .select('*')
    .order('step_number', { ascending: true })

  // 언론보도 조회
  const { data: press } = await supabase
    .from('press')
    .select('*')
    .order('published_date', { ascending: false })
    .limit(6)

  // 공장 위치 조회
  const { data: factoryLocations } = await supabase
    .from('factory_locations')
    .select('*')

  // 인터뷰 조회
  const { data: interviews } = await supabase
    .from('interviews')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  return (
    <div className="w-full bg-cream-50 min-h-screen">
      {/* 배너 슬라이더 */}
      {banners && banners.length > 0 && (
        <section className="pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-12">
          <BannerSlider banners={banners} />
        </section>
      )}

      {/* 중간 배너 */}
      {middleBanners && middleBanners.length > 0 && (
        <section className="pb-8 sm:pb-12">
          <MiddleBanner banners={middleBanners} />
        </section>
      )}

      <div className="container mx-auto px-4 space-y-12 md:space-y-16 pb-24">
        {/* 성공사례 섹션 (카테고리 필터 포함) */}
        {categories && cases && (
          <AnimatedSection>
            <CaseSection categories={categories} cases={cases} />
          </AnimatedSection>
        )}

        {/* 상생 브릿지 소개 */}
        {about && (
          <AnimatedSection>
            <AboutSection about={about} />
          </AnimatedSection>
        )}

        {/* 구글 맵 섹션 */}
        {factoryLocations && factoryLocations.length > 0 && (
          <AnimatedSection>
            <MapSection locations={factoryLocations} />
          </AnimatedSection>
        )}

        {/* 언론보도 섹션 */}
        {press && press.length > 0 && (
          <AnimatedSection>
            <PressList items={press} />
          </AnimatedSection>
        )}

        {/* 진행상황 섹션 */}
        {progress && progress.length > 0 && (
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
              진행 상황
            </h2>
            <p className="text-gray-600 mb-6 text-center text-sm md:text-base">
              진행 중인 다른 제품을 확인해 보세요.
            </p>
            <ProgressCarousel items={progress} />
          </AnimatedSection>
        )}

        {/* 인터뷰 섹션 */}
        {interviews && interviews.length > 0 && (
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
              인터뷰
            </h2>
            <InterviewCarousel items={interviews} />
          </AnimatedSection>
        )}

        {/* 이용안내 섹션 */}
        {guideSteps && guideSteps.length > 0 && (
          <AnimatedSection>
            <GuideSteps steps={guideSteps} />
          </AnimatedSection>
        )}
      </div>
    </div>
  )
}

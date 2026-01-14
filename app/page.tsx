import { createClient } from '@/lib/supabase/server'
import BannerSlider from '@/components/BannerSlider'
import MiddleBanner from '@/components/MiddleBanner'
import CaseSection from '@/components/CaseSection'
import ProgressCarousel from '@/components/ProgressCarousel'
import GuideSteps from '@/components/GuideSteps'
import PressList from '@/components/PressList'
import MapSection from '@/components/MapSection'

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
  const { data: progress } = await supabase
    .from('progress')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

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
          <CaseSection categories={categories} cases={cases} />
        )}

        {/* 상생 브릿지 소개 */}
        {about && (
          <section className="bg-cream-50 rounded-card p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {about.section_title || '상생 브릿지는?'}
            </h2>
            {about.section_description && (
              <p className="text-gray-700 mb-6 leading-relaxed">
                {about.section_description}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {about.strength_1_title && (
                <div className="bg-white rounded-card shadow-soft p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {about.strength_1_title}
                  </h3>
                  {about.strength_1_description && (
                    <p className="text-sm text-gray-600">
                      {about.strength_1_description}
                    </p>
                  )}
                </div>
              )}
              {about.strength_2_title && (
                <div className="bg-white rounded-card shadow-soft p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {about.strength_2_title}
                  </h3>
                  {about.strength_2_description && (
                    <p className="text-sm text-gray-600">
                      {about.strength_2_description}
                    </p>
                  )}
                </div>
              )}
              {about.strength_3_title && (
                <div className="bg-white rounded-card shadow-soft p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {about.strength_3_title}
                  </h3>
                  {about.strength_3_description && (
                    <p className="text-sm text-gray-600">
                      {about.strength_3_description}
                    </p>
                  )}
                </div>
              )}
              {about.strength_4_title && (
                <div className="bg-white rounded-card shadow-soft p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {about.strength_4_title}
                  </h3>
                  {about.strength_4_description && (
                    <p className="text-sm text-gray-600">
                      {about.strength_4_description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* 진행상황 섹션 */}
        {progress && progress.length > 0 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              진행 상황
            </h2>
            <ProgressCarousel items={progress} />
          </section>
        )}

        {/* 구글 맵 섹션 */}
        {factoryLocations && factoryLocations.length > 0 && (
          <section>
            <MapSection locations={factoryLocations} />
          </section>
        )}

        {/* 언론보도 섹션 */}
        {press && press.length > 0 && (
          <section>
            <PressList items={press} />
          </section>
        )}

        {/* 이용안내 섹션 */}
        {guideSteps && guideSteps.length > 0 && (
          <section>
            <GuideSteps steps={guideSteps} />
          </section>
        )}
      </div>
    </div>
  )
}

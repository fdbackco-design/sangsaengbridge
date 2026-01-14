'use client'

import Image from 'next/image'

interface About {
  section_title: string
  section_description?: string | null
  strength_1_title?: string | null
  strength_1_description?: string | null
  strength_1_image_url?: string | null
  strength_2_title?: string | null
  strength_2_description?: string | null
  strength_2_image_url?: string | null
  strength_3_title?: string | null
  strength_3_description?: string | null
  strength_3_image_url?: string | null
  strength_4_title?: string | null
  strength_4_description?: string | null
  strength_4_image_url?: string | null
}

interface AboutSectionProps {
  about: About
}

// 아이콘 컴포넌트들
const ManagerIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 첫 번째 사람 */}
    <circle cx="14" cy="12" r="5" stroke="#6B1D2A" strokeWidth="2" fill="none"/>
    <path d="M6 28 C6 22, 10 18, 14 18 C18 18, 22 22, 22 28" stroke="#6B1D2A" strokeWidth="2" fill="none"/>
    {/* 두 번째 사람 */}
    <circle cx="26" cy="12" r="5" stroke="#6B1D2A" strokeWidth="2" fill="none"/>
    <path d="M18 28 C18 22, 22 18, 26 18 C30 18, 34 22, 34 28" stroke="#6B1D2A" strokeWidth="2" fill="none"/>
  </svg>
)

const CustomIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 모니터 */}
    <rect x="8" y="6" width="24" height="18" rx="1" stroke="#6B1D2A" strokeWidth="2" fill="none"/>
    <rect x="10" y="10" width="20" height="12" fill="#6B1D2A" fillOpacity="0.1"/>
    <line x1="12" y1="14" x2="28" y2="14" stroke="#6B1D2A" strokeWidth="1.5"/>
    <line x1="12" y1="18" x2="24" y2="18" stroke="#6B1D2A" strokeWidth="1.5"/>
    {/* 받침대 */}
    <rect x="18" y="24" width="4" height="2" fill="#6B1D2A"/>
    <rect x="14" y="26" width="12" height="2" fill="#6B1D2A"/>
  </svg>
)

const ServiceIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 전화기 */}
    <path d="M12 8 L12 20 C12 24, 16 28, 20 28 C24 28, 28 24, 28 20 L28 8" stroke="#6B1D2A" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M12 8 L28 8" stroke="#6B1D2A" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 20 L28 20" stroke="#6B1D2A" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="20" cy="14" r="2" fill="#6B1D2A"/>
  </svg>
)

const FactoryIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 공장 건물 */}
    <rect x="6" y="18" width="28" height="16" stroke="#6B1D2A" strokeWidth="2" fill="none"/>
    {/* 창문들 */}
    <rect x="10" y="22" width="4" height="4" fill="#6B1D2A"/>
    <rect x="18" y="22" width="4" height="4" fill="#6B1D2A"/>
    <rect x="26" y="22" width="4" height="4" fill="#6B1D2A"/>
    {/* 굴뚝 */}
    <rect x="28" y="8" width="6" height="10" stroke="#6B1D2A" strokeWidth="2" fill="none"/>
    <rect x="30" y="6" width="2" height="2" fill="#6B1D2A"/>
  </svg>
)

const getStrengthIcon = (index: number) => {
  switch (index) {
    case 1:
      return <ManagerIcon />
    case 2:
      return <CustomIcon />
    case 3:
      return <ServiceIcon />
    case 4:
      return <FactoryIcon />
    default:
      return null
  }
}

export default function AboutSection({ about }: AboutSectionProps) {
  const strengths = [
    { title: about.strength_1_title, description: about.strength_1_description, image_url: about.strength_1_image_url },
    { title: about.strength_2_title, description: about.strength_2_description, image_url: about.strength_2_image_url },
    { title: about.strength_3_title, description: about.strength_3_description, image_url: about.strength_3_image_url },
    { title: about.strength_4_title, description: about.strength_4_description, image_url: about.strength_4_image_url },
  ].filter(s => s.title)

  return (
    <section className="bg-cream-50 rounded-card p-6 md:p-8 lg:p-12">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
        {about.section_title || '상생 브릿지는?'}
      </h2>
      {about.section_description && (
        <p className="text-gray-700 mb-8 md:mb-12 leading-relaxed text-base md:text-lg">
          {about.section_description}
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {strengths.map((strength, index) => (
          <div
            key={index}
            className="bg-white rounded-card shadow-soft overflow-hidden hover:shadow-card transition-shadow"
          >
            {/* 이미지 영역 */}
            <div className="relative w-full h-40 md:h-auto md:aspect-[16/9] md:max-h-[360px] bg-cream-200 overflow-hidden">
              {strength.image_url ? (
                <Image
                  src={strength.image_url}
                  alt={strength.title || `강점 ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs md:text-sm">
                  이미지 영역
                </div>
              )}
            </div>
            {/* 아이콘 및 텍스트 */}
            <div className="p-4 md:p-6 bg-white">
              <div className="flex items-center justify-center mb-3 md:mb-4">
                {getStrengthIcon(index + 1)}
              </div>
              {strength.title && (
                <h3 className="text-center font-semibold text-gray-900 text-sm md:text-base leading-tight">
                  {strength.title.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < strength.title!.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </h3>
              )}
              {strength.description && (
                <p className="text-center text-xs md:text-sm text-gray-600 mt-2">
                  {strength.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

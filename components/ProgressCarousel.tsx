'use client'

import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface Progress {
  id: string
  title: string
  image_url?: string | null
  moq?: string | null
  progress_percent: number
  stage: string
  stage_date?: string | null
}

interface ProgressCarouselProps {
  items: Progress[]
}

const stageColors: Record<string, string> = {
  상담: 'bg-blue-100 text-blue-700',
  샘플: 'bg-purple-100 text-purple-700',
  발주: 'bg-yellow-100 text-yellow-700',
  생산: 'bg-green-100 text-green-700',
  배송: 'bg-burgundy-100 text-burgundy-700',
}

export default function ProgressCarousel({ items }: ProgressCarouselProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        navigation
        pagination={{ clickable: true }}
        className="progress-swiper"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="bg-white rounded-card shadow-card overflow-hidden h-full">
              {item.image_url && (
                <div className="relative w-full h-40">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 text-xs rounded ${stageColors[item.stage] || 'bg-gray-100 text-gray-700'}`}>
                    {item.stage}
                  </span>
                  {item.moq && (
                    <span className="text-xs text-gray-500">MOQ: {item.moq}</span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>진행률</span>
                    <span>{item.progress_percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-burgundy-700 h-2 rounded-full transition-all"
                      style={{ width: `${item.progress_percent}%` }}
                    />
                  </div>
                </div>
                {item.stage_date && (
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(item.stage_date).toLocaleDateString('ko-KR')}
                  </p>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

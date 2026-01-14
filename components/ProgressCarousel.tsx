'use client'

import React from 'react'
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

const stages = ['상담', '샘플', '발주', '생산', '배송']

const getStageIndex = (stage: string): number => {
  return stages.indexOf(stage)
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
        {items.map((item) => {
          const currentStageIndex = getStageIndex(item.stage)
          
          return (
            <SwiperSlide key={item.id}>
              <div className="bg-white rounded-card shadow-card overflow-hidden h-full">
                {item.image_url && (
                  <div className="relative w-full h-56 bg-pink-50">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  {item.moq && (
                    <p className="text-xs text-gray-600 mb-4">MOQ {item.moq}개</p>
                  )}
                  
                  {/* 진행 단계 표시 */}
                  <div className="mb-4">
                    {/* 아이콘과 연결선 */}
                    <div className="flex items-center justify-center relative mb-2">
                      {stages.map((stage, index) => {
                        const isActive = index === currentStageIndex
                        const isPast = index < currentStageIndex
                        
                        return (
                          <React.Fragment key={stage}>
                            <div className="flex flex-col items-center relative z-10">
                              {isActive && (
                                <span className="absolute -top-5 text-xs font-medium text-burgundy-700 whitespace-nowrap animate-bounce-gentle">
                                  {item.progress_percent}%
                                </span>
                              )}
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                  isActive
                                    ? 'bg-burgundy-700 border-burgundy-700 text-white'
                                    : isPast
                                    ? 'bg-burgundy-700 border-burgundy-700 text-white'
                                    : 'bg-white border-gray-300 text-gray-400'
                                }`}
                              >
                                {isActive ? (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd" />
                                  </svg>
                                ) : isPast ? (
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <div className="w-2 h-2 rounded-full bg-gray-300" />
                                )}
                              </div>
                            </div>
                            {index < stages.length - 1 && (
                              <div
                                className={`flex-1 h-0.5 mx-1 ${
                                  isPast ? 'bg-burgundy-700' : 'bg-gray-300'
                                }`}
                              />
                            )}
                          </React.Fragment>
                        )
                      })}
                    </div>
                    {/* 단계 텍스트 */}
                    <div className="flex items-center justify-center">
                      {stages.map((stage, index) => (
                        <React.Fragment key={stage}>
                          <div className="flex flex-col items-center" style={{ minWidth: '2rem' }}>
                            <span className="text-xs text-gray-600 whitespace-nowrap">
                              {stage}
                            </span>
                          </div>
                          {index < stages.length - 1 && (
                            <div className="flex-1 mx-1" style={{ minWidth: '0.5rem' }} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  
                  {item.stage_date && (
                    <p className="text-xs text-gray-500 text-center">
                      {new Date(item.stage_date).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      }).replace(/\. /g, '.').replace(/\.$/, '')}
                    </p>
                  )}
                </div>
              </div>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

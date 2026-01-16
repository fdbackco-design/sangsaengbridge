'use client'

import React from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

interface CaseThumbnailSliderProps {
  thumbnail1: string
  thumbnail2?: string | null
  title: string
}

export default function CaseThumbnailSlider({
  thumbnail1,
  thumbnail2,
  title,
}: CaseThumbnailSliderProps) {
  const images = [thumbnail1]
  if (thumbnail2) {
    images.push(thumbnail2)
  }

  if (images.length === 0) {
    return null
  }

  return (
    <div className="w-full mb-6">
      <Swiper
        modules={[Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        loop={images.length > 1}
        className="case-thumbnail-swiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full aspect-square rounded-card overflow-hidden">
              <Image
                src={image}
                alt={`${title} - 썸네일 ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

interface Interview {
  id: string
  title: string
  image_url: string
  slug: string
}

interface InterviewCarouselProps {
  items: Interview[]
}

export default function InterviewCarousel({ items }: InterviewCarouselProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        loop={items.length > 1}
        className="interview-swiper"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <Link href={`/interviews/${item.slug}`} className="block">
              <div className="relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-card">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{item.title}</h3>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

interface Banner {
  id: string
  image_url: string
  link_url?: string | null
  is_active: boolean
  sort_order: number
}

interface BannerSliderProps {
  banners: Banner[]
}

export default function BannerSlider({ banners }: BannerSliderProps) {
  const activeBanners = banners.filter(b => b.is_active).sort((a, b) => a.sort_order - b.sort_order)

  if (activeBanners.length === 0) {
    return null
  }

  return (
    <div className="w-full px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-full md:max-w-[800px] mx-auto">
        <div className="relative w-full aspect-[365/118] rounded-card shadow-soft overflow-hidden bg-cream-50">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-burgundy-700 !opacity-50',
              bulletActiveClass: 'swiper-pagination-bullet-active !opacity-100',
        }}
        className="w-full h-full"
      >
        {activeBanners.map((banner) => (
          <SwiperSlide key={banner.id}>
            {banner.link_url ? (
              <Link href={banner.link_url} className="block w-full h-full relative">
                <Image
                  src={banner.image_url}
                  alt="배너"
                  fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
                      className="object-cover rounded-card"
                  priority
                      quality={85}
                />
              </Link>
            ) : (
              <div className="w-full h-full relative">
                <Image
                  src={banner.image_url}
                  alt="배너"
                  fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
                      className="object-cover rounded-card"
                  priority
                      quality={85}
                />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
        </div>
      </div>
    </div>
  )
}

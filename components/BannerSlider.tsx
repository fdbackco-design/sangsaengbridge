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
    <div className="w-full h-64 sm:h-80 md:h-96 relative">
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
                  className="object-cover"
                  priority
                />
              </Link>
            ) : (
              <div className="w-full h-full relative">
                <Image
                  src={banner.image_url}
                  alt="배너"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

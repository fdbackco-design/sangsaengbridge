'use client'

import Image from 'next/image'
import Link from 'next/link'

interface MiddleBanner {
  id: string
  image_url: string
  link_url?: string | null
  is_active: boolean
  sort_order: number
}

interface MiddleBannerProps {
  banners: MiddleBanner[]
}

export default function MiddleBanner({ banners }: MiddleBannerProps) {
  const activeBanners = banners.filter(b => b.is_active).sort((a, b) => a.sort_order - b.sort_order)

  if (activeBanners.length === 0) {
    return null
  }

  return (
    <div className="w-full px-0 md:px-4 lg:px-6 xl:px-8">
      <div className="w-full max-w-full md:max-w-[800px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {activeBanners.map((banner) => (
            <div key={banner.id} className="relative w-full aspect-[383/214] rounded-none md:rounded-card shadow-soft overflow-hidden bg-cream-50">
              {banner.link_url ? (
                <Link href={banner.link_url} className="block w-full h-full relative">
                  <Image
                    src={banner.image_url}
                    alt="상생 브릿지 중간 배너"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
                    className="object-cover rounded-none md:rounded-card"
                    quality={85}
                  />
                </Link>
              ) : (
                <div className="w-full h-full relative">
                  <Image
                    src={banner.image_url}
                    alt="상생 브릿지 중간 배너"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
                    className="object-cover rounded-none md:rounded-card"
                    quality={85}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

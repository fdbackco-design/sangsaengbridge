'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

interface CaseDetailImageProps {
  src: string
  alt: string
}

export default function CaseDetailImage({ src, alt }: CaseDetailImageProps) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const img = new window.Image()
    img.src = src
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setAspectRatio(img.naturalWidth / img.naturalHeight)
      }
    }
  }, [src])

  return (
    <div className="relative w-full mb-8 rounded-card overflow-hidden">
      <div
        ref={containerRef}
        className="relative w-full"
        style={aspectRatio ? { aspectRatio: `${aspectRatio}` } : { minHeight: '400px' }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 896px"
        />
      </div>
    </div>
  )
}

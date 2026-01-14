'use client'

import Image from 'next/image'

interface Category {
  id: string
  name: string
  slug: string
}

interface CategorySelectorProps {
  categories: Category[]
  selectedCategory: string | null
  onSelectCategory: (categorySlug: string | null) => void
}

const getCategoryIconPath = (slug: string) => {
  switch (slug) {
    case 'living':
      return '/icons/vacuum.png'
    case 'kitchen':
      return '/icons/kitchen.png'
    case 'cosmetic':
      return '/icons/cosmetic.png'
    default:
      return null
  }
}

export default function CategorySelector({ categories, selectedCategory, onSelectCategory }: CategorySelectorProps) {
  // 기본 3개 카테고리만 필터링 (생활용품, 주방용품, 화장품용기)
  const mainCategories = categories.filter(cat => 
    ['living', 'kitchen', 'cosmetic'].includes(cat.slug)
  )

  return (
    <div className="w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">카테고리별 성공 사례</h2>
      <div className="flex justify-center gap-4 md:gap-6 mb-8">
        {mainCategories.map((category) => {
          const isSelected = selectedCategory === category.slug
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(isSelected ? null : category.slug)}
              className={`flex flex-col items-center gap-2 p-4 min-w-[80px] md:min-w-[100px] transition-all ${
                isSelected
                  ? 'text-burgundy-700'
                  : 'text-gray-600'
              }`}
            >
              <div
                className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-white transition-all overflow-hidden relative ${
                  isSelected
                    ? 'border-2 border-burgundy-700 shadow-soft'
                    : 'border border-gray-300'
                }`}
              >
                {getCategoryIconPath(category.slug) && (
                  <Image
                    src={getCategoryIconPath(category.slug)!}
                    alt={category.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 64px, 80px"
                    unoptimized
                  />
                )}
              </div>
              <span className={`text-sm md:text-base font-medium ${
                isSelected ? 'font-semibold' : ''
              }`}>
                {category.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

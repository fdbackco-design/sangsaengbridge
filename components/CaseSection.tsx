'use client'

import { useState } from 'react'
import CategorySelector from './CategorySelector'
import FilteredCaseGrid from './FilteredCaseGrid'

interface Category {
  id: string
  name: string
  slug: string
}

interface Case {
  id: string
  title: string
  slug: string
  thumbnail_image_1: string
  category?: {
    name: string
    slug: string
  } | null
}

interface CaseSectionProps {
  categories: Category[]
  cases: Case[]
}

export default function CaseSection({ categories, cases }: CaseSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <section>
      <CategorySelector
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <FilteredCaseGrid
        cases={cases}
        selectedCategory={selectedCategory}
      />
    </section>
  )
}

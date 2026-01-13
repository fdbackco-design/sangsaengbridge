'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createCase, updateCase } from '../actions'
import { uploadImage } from '@/app/admin/upload/actions'

interface CaseItem {
  id: string
  title: string
  slug: string
  summary?: string | null
  content_markdown?: string | null
  category_id?: string | null
  thumbnail_image_1: string
  thumbnail_image_2?: string | null
  detail_image?: string | null
  hashtags?: string[] | null
  is_featured: boolean
}

interface Category {
  id: string
  name: string
  slug: string
}

interface CaseFormProps {
  caseItem: CaseItem | null
  categories: Category[]
}

export default function CaseForm({ caseItem, categories }: CaseFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState<string | null>(null)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: caseItem?.title || '',
    slug: caseItem?.slug || '',
    summary: caseItem?.summary || '',
    content_markdown: caseItem?.content_markdown || '',
    category_id: caseItem?.category_id || '',
    thumbnail_image_1: caseItem?.thumbnail_image_1 || '',
    thumbnail_image_2: caseItem?.thumbnail_image_2 || '',
    detail_image: caseItem?.detail_image || '',
    hashtags: caseItem?.hashtags?.join(', ') || '',
    is_featured: caseItem?.is_featured || false,
  })

  const handleFileUpload = async (field: string, file: File) => {
    setUploading(field)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', 'cases')

      const result = await uploadImage(formData)
      if (!result.success || !result.url) {
        setError(`파일 업로드 실패: ${result.error || '알 수 없는 오류'}`)
        return
      }

      setFormData((prev) => ({ ...prev, [field]: result.url! }))
    } catch (err) {
      setError('파일 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    startTransition(async () => {
      const form = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          form.append(key, value.toString())
        }
      })

      const result = caseItem
        ? await updateCase(caseItem.id, form)
        : await createCase(form)

      if (result.success) {
        router.push('/admin/cases')
        router.refresh()
      } else {
        setError(result.error || '저장에 실패했습니다.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-card shadow-soft p-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-card text-red-800">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          슬러그 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
          placeholder="case-slug-example"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">요약</label>
        <textarea
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
        <select
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
        >
          <option value="">선택해주세요</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          썸네일 이미지 1 <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileUpload('thumbnail_image_1', file)
          }}
          disabled={uploading === 'thumbnail_image_1'}
          className="w-full px-4 py-2 border border-gray-300 rounded-button"
        />
        {formData.thumbnail_image_1 && (
          <div className="relative w-32 h-32 mt-2">
            <Image
              src={formData.thumbnail_image_1}
              alt="썸네일 1"
              fill
              className="object-cover rounded"
            />
          </div>
        )}
        {uploading === 'thumbnail_image_1' && <p className="text-sm text-gray-500 mt-1">업로드 중...</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">썸네일 이미지 2</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileUpload('thumbnail_image_2', file)
          }}
          disabled={uploading === 'thumbnail_image_2'}
          className="w-full px-4 py-2 border border-gray-300 rounded-button"
        />
        {formData.thumbnail_image_2 && (
          <div className="relative w-32 h-32 mt-2">
            <Image
              src={formData.thumbnail_image_2}
              alt="썸네일 2"
              fill
              className="object-cover rounded"
            />
          </div>
        )}
        {uploading === 'thumbnail_image_2' && <p className="text-sm text-gray-500 mt-1">업로드 중...</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">상세 이미지</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileUpload('detail_image', file)
          }}
          disabled={uploading === 'detail_image'}
          className="w-full px-4 py-2 border border-gray-300 rounded-button"
        />
        {formData.detail_image && (
          <div className="relative w-64 h-64 mt-2">
            <Image
              src={formData.detail_image}
              alt="상세 이미지"
              fill
              className="object-cover rounded"
            />
          </div>
        )}
        {uploading === 'detail_image' && <p className="text-sm text-gray-500 mt-1">업로드 중...</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">해시태그 (쉼표로 구분)</label>
        <input
          type="text"
          value={formData.hashtags}
          onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
          placeholder="태그1, 태그2, 태그3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">본문 (Markdown)</label>
        <textarea
          value={formData.content_markdown}
          onChange={(e) => setFormData({ ...formData, content_markdown: e.target.value })}
          rows={10}
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent font-mono text-sm"
        />
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_featured}
            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
          />
          <span className="text-sm text-gray-700">추천 항목으로 표시</span>
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-burgundy-700 text-white rounded-button hover:bg-burgundy-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? '저장 중...' : '저장'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-button hover:bg-gray-300 transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  )
}

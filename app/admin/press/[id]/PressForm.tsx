'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createPress, updatePress } from '../actions'
import { uploadImage } from '@/app/admin/upload/actions'

interface Press {
  id: string
  title: string
  thumbnail_url?: string | null
  published_date?: string | null
  summary?: string | null
  external_link?: string | null
}

interface PressFormProps {
  press: Press | null
}

export default function PressForm({ press }: PressFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: press?.title || '',
    thumbnail_url: press?.thumbnail_url || '',
    published_date: press?.published_date ? press.published_date.split('T')[0] : '',
    summary: press?.summary || '',
    external_link: press?.external_link || '',
  })

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('bucket', 'press')

      const result = await uploadImage(form)
      if (!result.success || !result.url) {
        setError(`파일 업로드 실패: ${result.error || '알 수 없는 오류'}`)
        return
      }

      setFormData((prev) => ({ ...prev, thumbnail_url: result.url! }))
    } catch (err) {
      setError('파일 업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    startTransition(async () => {
      const form = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          form.append(key, value.toString())
        }
      })

      const result = press
        ? await updatePress(press.id, form)
        : await createPress(form)

      if (result.success) {
        router.push('/admin/press')
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
        <label className="block text-sm font-medium text-gray-700 mb-2">썸네일 이미지</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileUpload(file)
          }}
          disabled={uploading}
          className="w-full px-4 py-2 border border-gray-300 rounded-button"
        />
        {formData.thumbnail_url && (
          <div className="relative w-32 h-32 mt-2">
            <Image
              src={formData.thumbnail_url}
              alt="썸네일"
              fill
              className="object-cover rounded"
            />
          </div>
        )}
        {uploading && <p className="text-sm text-gray-500 mt-1">업로드 중...</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">발행일</label>
        <input
          type="date"
          value={formData.published_date}
          onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
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
        <label className="block text-sm font-medium text-gray-700 mb-2">외부 링크</label>
        <input
          type="url"
          value={formData.external_link}
          onChange={(e) => setFormData({ ...formData, external_link: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
          placeholder="https://example.com"
        />
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

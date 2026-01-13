'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createBanner, updateBanner } from '../actions'
import { uploadImage } from '@/app/admin/upload/actions'

interface Banner {
  id: string
  image_url: string
  link_url?: string | null
  is_active: boolean
  sort_order: number
}

interface BannerFormProps {
  banner: Banner | null
}

export default function BannerForm({ banner }: BannerFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    image_url: banner?.image_url || '',
    link_url: banner?.link_url || '',
    is_active: banner?.is_active ?? true,
    sort_order: banner?.sort_order || 0,
  })

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('bucket', 'banners')

      const result = await uploadImage(form)
      if (!result.success || !result.url) {
        setError(`파일 업로드 실패: ${result.error || '알 수 없는 오류'}`)
        return
      }

      setFormData((prev) => ({ ...prev, image_url: result.url! }))
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
        if (value !== null && value !== undefined) {
          form.append(key, value.toString())
        }
      })

      const result = banner
        ? await updateBanner(banner.id, form)
        : await createBanner(form)

      if (result.success) {
        router.push('/admin/banners')
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
          이미지 <span className="text-red-500">*</span>
        </label>
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
        {formData.image_url && (
          <div className="relative w-full h-48 mt-2">
            <Image
              src={formData.image_url}
              alt="배너"
              fill
              className="object-cover rounded"
            />
          </div>
        )}
        {uploading && <p className="text-sm text-gray-500 mt-1">업로드 중...</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">링크 URL</label>
        <input
          type="url"
          value={formData.link_url}
          onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">정렬 순서</label>
        <input
          type="number"
          value={formData.sort_order}
          onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          />
          <span className="text-sm text-gray-700">활성화</span>
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

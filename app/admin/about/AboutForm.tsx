'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { updateAbout } from './actions'
import { uploadImage } from '@/app/admin/upload/actions'

interface About {
  id: string
  section_title: string
  section_description?: string | null
  strength_1_title?: string | null
  strength_1_description?: string | null
  strength_1_image_url?: string | null
  strength_2_title?: string | null
  strength_2_description?: string | null
  strength_2_image_url?: string | null
  strength_3_title?: string | null
  strength_3_description?: string | null
  strength_3_image_url?: string | null
  strength_4_title?: string | null
  strength_4_description?: string | null
  strength_4_image_url?: string | null
}

interface AboutFormProps {
  about: About | null
}

export default function AboutForm({ about }: AboutFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    section_title: about?.section_title || '상생 브릿지는?',
    section_description: about?.section_description || '',
    strength_1_title: about?.strength_1_title || '',
    strength_1_description: about?.strength_1_description || '',
    strength_1_image_url: about?.strength_1_image_url || '',
    strength_2_title: about?.strength_2_title || '',
    strength_2_description: about?.strength_2_description || '',
    strength_2_image_url: about?.strength_2_image_url || '',
    strength_3_title: about?.strength_3_title || '',
    strength_3_description: about?.strength_3_description || '',
    strength_3_image_url: about?.strength_3_image_url || '',
    strength_4_title: about?.strength_4_title || '',
    strength_4_description: about?.strength_4_description || '',
    strength_4_image_url: about?.strength_4_image_url || '',
  })

  const handleFileUpload = async (field: string, file: File) => {
    setUploading(field)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('bucket', 'banners')

      const result = await uploadImage(form)
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

    if (!about) {
      setError('소개 데이터를 찾을 수 없습니다.')
      return
    }

    startTransition(async () => {
      const form = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          form.append(key, value.toString())
        }
      })

      const result = await updateAbout(about.id, form)

      if (result.success) {
        router.refresh()
        alert('저장되었습니다.')
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
        <label className="block text-sm font-medium text-gray-700 mb-2">섹션 제목</label>
        <input
          type="text"
          value={formData.section_title}
          onChange={(e) => setFormData({ ...formData, section_title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">섹션 설명</label>
        <textarea
          value={formData.section_description}
          onChange={(e) => setFormData({ ...formData, section_description: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
        />
      </div>

      {[1, 2, 3, 4].map((num) => (
        <div key={num} className="border border-gray-200 rounded-card p-4">
          <h3 className="font-medium text-gray-900 mb-4">강점 {num}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">이미지</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(`strength_${num}_image_url`, file)
                }}
                disabled={uploading === `strength_${num}_image_url`}
                className="w-full px-4 py-2 border border-gray-300 rounded-button"
              />
              {formData[`strength_${num}_image_url` as keyof typeof formData] && (
                <div className="relative w-full h-48 mt-2">
                  <Image
                    src={formData[`strength_${num}_image_url` as keyof typeof formData] as string}
                    alt={`강점 ${num} 이미지`}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              {uploading === `strength_${num}_image_url` && (
                <p className="text-sm text-gray-500 mt-1">업로드 중...</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
              <input
                type="text"
                value={formData[`strength_${num}_title` as keyof typeof formData] as string}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [`strength_${num}_title`]: e.target.value,
                  } as any)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                placeholder="줄바꿈은 \n으로 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
              <textarea
                value={formData[`strength_${num}_description` as keyof typeof formData] as string}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [`strength_${num}_description`]: e.target.value,
                  } as any)
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-burgundy-700 text-white rounded-button hover:bg-burgundy-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  )
}

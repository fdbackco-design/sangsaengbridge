'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createInterview, updateInterview } from '../actions'
import { uploadImage } from '@/app/admin/upload/actions'

interface Interview {
  id: string
  title: string
  slug: string
  image_url: string
  summary?: string | null
  content_markdown?: string | null
  closing_text?: string | null
  sort_order: number
  is_active: boolean
}

interface InterviewFormProps {
  interview: Interview | null
}

function koreanToSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default function InterviewForm({ interview }: InterviewFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: interview?.title || '',
    slug: interview?.slug || '',
    image_url: interview?.image_url || '',
    summary: interview?.summary || '',
    content_markdown: interview?.content_markdown || '',
    closing_text: interview?.closing_text || '',
    sort_order: interview?.sort_order || 0,
    is_active: interview?.is_active ?? true,
  })

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || koreanToSlug(title),
    }))
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('bucket', 'interviews')

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

    if (!formData.slug) {
      setError('슬러그를 입력해주세요.')
      return
    }

    startTransition(async () => {
      const form = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        // closing_text는 빈 문자열도 포함 (삭제를 위해)
        if (key === 'closing_text') {
          form.append(key, value !== null && value !== undefined ? value.toString() : '')
        } else if (value !== null && value !== undefined && value !== '') {
          form.append(key, value.toString())
        }
      })

      const result = interview
        ? await updateInterview(interview.id, form)
        : await createInterview(form)

      if (result.success) {
        router.push('/admin/interviews')
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
          onChange={(e) => handleTitleChange(e.target.value)}
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
          placeholder="url-friendly-slug"
        />
        <p className="mt-1 text-xs text-gray-500">
          URL에 사용될 고유한 식별자입니다. 영문, 숫자, 하이픈(-)만 사용 가능합니다.
        </p>
      </div>

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
          <div className="relative w-full h-64 md:h-96 mt-4 rounded-card overflow-hidden">
            <Image
              src={formData.image_url}
              alt="인터뷰 이미지"
              fill
              className="object-cover"
            />
          </div>
        )}
        {uploading && <p className="text-sm text-gray-500 mt-1">업로드 중...</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">요약</label>
        <textarea
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
          placeholder="인터뷰 요약을 입력해주세요"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">본문 (Markdown)</label>
        <textarea
          value={formData.content_markdown}
          onChange={(e) => setFormData({ ...formData, content_markdown: e.target.value })}
          rows={15}
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent font-mono text-sm"
          placeholder="Markdown 형식으로 본문을 작성해주세요"
        />
        <p className="mt-1 text-xs text-gray-500">
          Markdown 형식을 지원합니다. 제목, 리스트, 링크 등을 사용할 수 있습니다.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">마무리 블록 (Markdown)</label>
        <textarea
          value={formData.closing_text}
          onChange={(e) => setFormData({ ...formData, closing_text: e.target.value })}
          rows={8}
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent font-mono text-sm"
          placeholder="인터뷰 마무리 내용을 Markdown 형식으로 작성해주세요"
        />
        <p className="mt-1 text-xs text-gray-500">
          본문 다음에 표시될 마무리 블록입니다. Markdown 형식을 지원합니다.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">정렬 순서</label>
          <input
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">숫자가 작을수록 앞에 표시됩니다.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">활성화</label>
          <select
            value={formData.is_active ? 'true' : 'false'}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
          >
            <option value="true">활성</option>
            <option value="false">비활성</option>
          </select>
        </div>
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

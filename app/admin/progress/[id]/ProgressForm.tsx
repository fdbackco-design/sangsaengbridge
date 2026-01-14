'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createProgress, updateProgress } from '../actions'
import { uploadImage } from '@/app/admin/upload/actions'

interface Progress {
  id: string
  title: string
  image_url?: string | null
  moq?: string | null
  progress_percent: number
  stage: string
  stage_date?: string | null
}

interface ProgressFormProps {
  progress: Progress | null
}

export default function ProgressForm({ progress }: ProgressFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  // 단계에 따른 진행률 매핑
  const stageProgressMap: Record<string, number> = {
    상담: 20,
    샘플: 40,
    발주: 60,
    생산: 80,
    배송: 100,
  }

  const getProgressByStage = (stage: string): number => {
    return stageProgressMap[stage] || 0
  }

  const [formData, setFormData] = useState({
    title: progress?.title || '',
    image_url: progress?.image_url || '',
    moq: progress?.moq || '',
    progress_percent: progress?.progress_percent || getProgressByStage(progress?.stage || '상담'),
    stage: progress?.stage || '상담',
    stage_date: progress?.stage_date ? progress.stage_date.split('T')[0] : '',
  })

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('bucket', 'progress')

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
        if (value !== null && value !== undefined && value !== '') {
          form.append(key, value.toString())
        }
      })

      const result = progress
        ? await updateProgress(progress.id, form)
        : await createProgress(form)

      if (result.success) {
        router.push('/admin/progress')
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
        <label className="block text-sm font-medium text-gray-700 mb-2">이미지</label>
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
          <div className="relative w-32 h-32 mt-2">
            <Image
              src={formData.image_url}
              alt="진행상황"
              fill
              className="object-cover rounded"
            />
          </div>
        )}
        {uploading && <p className="text-sm text-gray-500 mt-1">업로드 중...</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">MOQ</label>
        <input
          type="text"
          value={formData.moq}
          onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
          placeholder="예: 1000개"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">단계 <span className="text-red-500">*</span></label>
        <select
          value={formData.stage}
          onChange={(e) => {
            const newStage = e.target.value
            const newProgress = getProgressByStage(newStage)
            setFormData({ ...formData, stage: newStage, progress_percent: newProgress })
          }}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
        >
          <option value="상담">상담 (20%)</option>
          <option value="샘플">샘플 (40%)</option>
          <option value="발주">발주 (60%)</option>
          <option value="생산">생산 (80%)</option>
          <option value="배송">배송 (100%)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">진행률 (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          value={formData.progress_percent}
          readOnly
          className="w-full px-4 py-2 border border-gray-300 rounded-button bg-gray-50 text-gray-600 cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">단계에 따라 자동으로 설정됩니다.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">날짜</label>
        <input
          type="date"
          value={formData.stage_date}
          onChange={(e) => setFormData({ ...formData, stage_date: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
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

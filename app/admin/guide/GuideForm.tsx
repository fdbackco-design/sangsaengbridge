'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateGuideStep } from './actions'

interface Step {
  id: string
  step_number: number
  title: string
  description?: string | null
}

interface GuideFormProps {
  steps: Step[]
}

export default function GuideForm({ steps }: GuideFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const [formData, setFormData] = useState(
    steps.reduce((acc, step) => {
      acc[step.step_number] = {
        id: step.id,
        title: step.title,
        description: step.description || '',
      }
      return acc
    }, {} as Record<number, { id: string; title: string; description: string }>)
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    startTransition(async () => {
      const updates = Object.values(formData).map((step) => {
        const form = new FormData()
        form.append('title', step.title)
        form.append('description', step.description)
        return updateGuideStep(step.id, form)
      })

      const results = await Promise.all(updates)
      const hasError = results.some((r: { success: boolean }) => !r.success)

      if (hasError) {
        setError('일부 저장에 실패했습니다.')
      } else {
        router.refresh()
        alert('저장되었습니다.')
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

      {[1, 2, 3, 4, 5, 6].map((num) => {
        const step = formData[num]
        if (!step) return null

        return (
          <div key={num} className="border border-gray-200 rounded-card p-4">
            <h3 className="font-medium text-gray-900 mb-4">단계 {num}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [num]: { ...step, title: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                <textarea
                  value={step.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [num]: { ...step, description: e.target.value },
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-button focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )
      })}

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

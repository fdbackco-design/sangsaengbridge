'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteProgress } from './actions'

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    startTransition(async () => {
      const formData = new FormData()
      formData.append('id', id)
      try {
        await deleteProgress(formData)
        router.refresh()
      } catch (error: any) {
        alert(`삭제 실패: ${error.message}`)
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isPending ? '삭제 중...' : '삭제'}
    </button>
  )
}


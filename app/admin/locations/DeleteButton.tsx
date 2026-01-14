'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteLocation } from './actions'

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) {
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append('id', id)
      try {
        await deleteLocation(formData)
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
      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-button transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? '삭제 중...' : '삭제'}
    </button>
  )
}

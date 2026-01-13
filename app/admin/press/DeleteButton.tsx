'use client'

import { deletePress } from './actions'

interface DeleteButtonProps {
  id: string
}

export default function DeleteButton({ id }: DeleteButtonProps) {
  const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (confirm('정말 삭제하시겠습니까?')) {
      const form = e.currentTarget
      deletePress(new FormData(form))
    }
  }

  return (
    <form action={deletePress} onSubmit={handleDelete}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
      >
        삭제
      </button>
    </form>
  )
}

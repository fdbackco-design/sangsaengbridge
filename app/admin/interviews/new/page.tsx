import { requireAdmin } from '@/lib/auth/guard'
import InterviewForm from '../[id]/InterviewForm'

export default async function AdminInterviewNewPage() {
  await requireAdmin()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">새 인터뷰</h1>
      <InterviewForm interview={null} />
    </div>
  )
}

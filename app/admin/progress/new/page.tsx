import { requireAdmin } from '@/lib/auth/guard'
import ProgressForm from '../[id]/ProgressForm'

export default async function AdminProgressNewPage() {
  await requireAdmin()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">새 진행상황</h1>
      <ProgressForm progress={null} />
    </div>
  )
}

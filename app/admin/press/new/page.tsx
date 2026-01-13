import { requireAdmin } from '@/lib/auth/guard'
import PressForm from '../[id]/PressForm'

export default async function AdminPressNewPage() {
  await requireAdmin()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">새 언론보도</h1>
      <PressForm press={null} />
    </div>
  )
}

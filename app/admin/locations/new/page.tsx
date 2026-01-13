import { requireAdmin } from '@/lib/auth/guard'
import LocationForm from '../LocationForm'

export default async function NewLocationPage() {
  await requireAdmin()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">새 공장 위치 추가</h1>
      <LocationForm />
    </div>
  )
}

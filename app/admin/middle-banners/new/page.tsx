import { requireAdmin } from '@/lib/auth/guard'
import MiddleBannerForm from '../[id]/MiddleBannerForm'

export default async function AdminMiddleBannerNewPage() {
  await requireAdmin()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">새 중간 배너</h1>
      <MiddleBannerForm middleBanner={null} />
    </div>
  )
}

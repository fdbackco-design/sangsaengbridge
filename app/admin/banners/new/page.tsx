import { requireAdmin } from '@/lib/auth/guard'
import BannerForm from '../[id]/BannerForm'

export default async function AdminBannerNewPage() {
  await requireAdmin()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">새 배너</h1>
      <BannerForm banner={null} />
    </div>
  )
}

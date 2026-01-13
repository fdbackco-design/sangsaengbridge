import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import { notFound } from 'next/navigation'
import BannerForm from './BannerForm'

export default async function AdminBannerEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const supabase = createServiceRoleClient()

  if (id !== 'new') {
    const { data: banner } = await supabase
      .from('banners')
      .select('*')
      .eq('id', id)
      .single()

    if (!banner) {
      notFound()
    }

    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">배너 수정</h1>
        <BannerForm banner={banner} />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">새 배너</h1>
      <BannerForm banner={null} />
    </div>
  )
}

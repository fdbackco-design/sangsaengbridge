import { createServiceRoleClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guard'
import { notFound } from 'next/navigation'
import MiddleBannerForm from './MiddleBannerForm'

export default async function AdminMiddleBannerEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const supabase = createServiceRoleClient()

  const { data: middleBanner } = await supabase
    .from('middle_banners')
    .select('*')
    .eq('id', id)
    .single()

  if (!middleBanner) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">중간 배너 수정</h1>
      <MiddleBannerForm middleBanner={middleBanner} />
    </div>
  )
}
